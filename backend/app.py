from flask import Flask, request, jsonify
from flask_cors import CORS
from database import SessionLocal
from matching_engine import get_side_hustles
from skill_engine import recommend_skills
from habit_engine import get_habit_recommendations
import os
import logging  # For logging
from dotenv import load_dotenv
import redis
import json

# Load environment variables from the .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
app.logger.info("Initializing the Skill Match Bot Backend")

# Allow cross-origin requests (CORS configuration)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://skill-match-bot-frontend.onrender.com")
CORS(app, resources={r"/*": {"origins": FRONTEND_URL}})
app.logger.info(f"CORS enabled for frontend URL: {FRONTEND_URL}")

# Initialize database session (if connected)
try:
    session = SessionLocal()
    app.logger.info("Database connected successfully.")
except Exception as e:
    app.logger.error(f"Database connection failed: {e}. Proceeding without it.")

# Initialize Redis client
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")  # Default to local Redis
try:
    redis_client = redis.Redis.from_url(REDIS_URL)
    redis_client.ping()
    app.logger.info("Connected to Redis successfully.")
except Exception as e:
    app.logger.error(f"Failed to connect to Redis: {e}. Proceeding without caching.")
    redis_client = None  # Proceed without caching if Redis is unavailable

def get_cached_matches(skills):
    """
    Retrieve cached matches from Redis based on the provided skills.

    Args:
        skills (list of str): A list of skills provided by the user.

    Returns:
        list of str or None: Cached list of side hustles if available, else None.
    """
    if not redis_client:
        return None
    try:
        # Create a unique key based on sorted skills to ensure consistency
        key = f"matches:{','.join(sorted(skills))}"
        cached = redis_client.get(key)
        if cached:
            app.logger.info(f"Cache hit for key: {key}")
            return json.loads(cached)
        else:
            app.logger.info(f"Cache miss for key: {key}")
            return None
    except Exception as e:
        app.logger.error(f"Error retrieving cache for key '{key}': {e}")
        return None

def set_cached_matches(skills, matches):
    """
    Cache the matches in Redis for future requests.

    Args:
        skills (list of str): A list of skills provided by the user.
        matches (list of str): A list of recommended side hustles.
    """
    if not redis_client:
        return
    try:
        # Create a unique key based on sorted skills to ensure consistency
        key = f"matches:{','.join(sorted(skills))}"
        # Set the cache with an expiration time (e.g., 1 hour)
        redis_client.set(key, json.dumps(matches), ex=3600)
        app.logger.info(f"Cached matches for key: {key}")
    except Exception as e:
        app.logger.error(f"Error setting cache for key '{key}': {e}")

# Implement LRU Cache for get_side_hustles (optional additional caching layer)
# from functools import lru_cache
# @lru_cache(maxsize=128)
# def cached_get_side_hustles(skills_tuple):
#     skills = list(skills_tuple)
#     return get_side_hustles(skills)

# Routes
@app.route("/api/matches", methods=["POST"])
def side_hustle_matches():
    app.logger.info("Request received at /api/matches")
    try:
        data = request.get_json()
        if not data:
            app.logger.warning("Invalid JSON payload received.")
            return jsonify({"error": "Invalid JSON payload"}), 400

        app.logger.info(f"Request data: {data}")
        skills = data.get("skills", [])
        if not skills:
            app.logger.warning("Skills data is missing in the request.")
            return jsonify({"error": "Skills data is missing"}), 400

        # Check cache first
        cached = get_cached_matches(skills)
        if cached:
            return jsonify(cached)

        # If not cached, compute the matches
        matches = get_side_hustles(skills)

        # Cache the result for future requests
        set_cached_matches(skills, matches)

        app.logger.info(f"Matches found: {matches}")
        return jsonify(matches)
    except Exception as e:
        app.logger.error(f"Error in /api/matches: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/api/skills", methods=["POST"])
def skill_creation():
    app.logger.info("Request received at /api/skills")
    try:
        data = request.get_json()
        if not data:
            app.logger.warning("Invalid JSON payload received.")
            return jsonify({"error": "Invalid JSON payload"}), 400

        app.logger.info(f"Request data: {data}")
        interests = data.get("interests", [])
        if not interests:
            app.logger.warning("Interests data is missing in the request.")
            return jsonify({"error": "Interests data is missing"}), 400

        recommended_skills = recommend_skills(interests)
        app.logger.info(f"Recommended skills: {recommended_skills}")
        return jsonify(recommended_skills)
    except Exception as e:
        app.logger.error(f"Error in /api/skills: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/api/habits", methods=["POST"])
def habit_tracker():
    app.logger.info("Request received at /api/habits")
    try:
        data = request.get_json()
        if not data:
            app.logger.warning("Invalid JSON payload received.")
            return jsonify({"error": "Invalid JSON payload"}), 400

        app.logger.info(f"Request data: {data}")
        side_hustle = data.get("side_hustle", "")
        if not side_hustle:
            app.logger.warning("Side hustle data is missing in the request.")
            return jsonify({"error": "Side hustle data is missing"}), 400

        habits = get_habit_recommendations(side_hustle)
        app.logger.info(f"Recommended habits: {habits}")
        return jsonify(habits)
    except Exception as e:
        app.logger.error(f"Error in /api/habits: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

# Root endpoint to verify deployment
@app.route("/", methods=["GET"])
def home():
    app.logger.info("Root endpoint accessed")
    return jsonify({"message": "Skill Match Bot Backend is running!"})

# Main entry point
if __name__ == "__main__":
    # Use Render-provided PORT environment variable, default to 5001 if not set
    port = int(os.getenv("PORT", 5001))
    app.logger.info(f"Starting the app on port {port}")
    # Bind to 0.0.0.0 for external access
    app.run(debug=False, host="0.0.0.0", port=port)
