from dotenv import load_dotenv
load_dotenv()  # Load environment variables first

from flask import Flask, request, jsonify, g
from flask_cors import CORS
from database import SessionLocal, Base, User  # Import after loading .env
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
import logging
import redis
import json

# Initialize Flask app
app = Flask(__name__)

# JWT Secret Key
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("SECRET_KEY environment variable is not set")
app.config['JWT_SECRET_KEY'] = SECRET_KEY

# Initialize JWT Manager
jwt = JWTManager(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
app.logger.setLevel(logging.INFO)
app.logger.info("Initializing the Skill Match Bot Backend")

# Configure allowed origins for CORS
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "https://skill-match-bot-frontend.onrender.com").split(",")
ALLOWED_ORIGINS = [origin.strip() for origin in ALLOWED_ORIGINS]
CORS(app, resources={r"/*": {"origins": ALLOWED_ORIGINS}})
app.logger.info(f"CORS enabled for frontend URLs: {ALLOWED_ORIGINS}")

# Initialize Redis client
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")  # Default to local Redis
try:
    redis_client = redis.Redis.from_url(REDIS_URL)
    redis_client.ping()
    app.logger.info("Connected to Redis successfully.")
except Exception as e:
    app.logger.error(f"Failed to connect to Redis: {e}. Proceeding without caching.")
    redis_client = None  # Proceed without caching if Redis is unavailable

# Helper Functions for Caching
def get_cached_matches(skills):
    """
    Retrieve cached matches from Redis based on the provided skills.
    """
    if not redis_client:
        return None
    try:
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
    """
    if not redis_client:
        return
    try:
        key = f"matches:{','.join(sorted(skills))}"
        redis_client.set(key, json.dumps(matches), ex=3600)  # Cache for 1 hour
        app.logger.info(f"Cached matches for key: {key}")
    except Exception as e:
        app.logger.error(f"Error setting cache for key '{key}': {e}")

# Database Session Management
@app.before_request
def create_session():
    g.db = SessionLocal()

@app.teardown_appcontext
def shutdown_session(exception=None):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

# Existing Routes

from matching_engine import get_side_hustles
from skill_engine import recommend_skills
from habit_engine import get_habit_recommendations

@app.route("/api/matches", methods=["POST"])
def side_hustle_matches():
    app.logger.info("Request received at /api/matches")
    try:
        data = request.get_json()
        if not data or "skills" not in data:
            app.logger.warning("Invalid JSON payload received or 'skills' missing.")
            return jsonify({"error": "Invalid JSON payload or 'skills' missing"}), 400

        # Check for unexpected fields
        allowed_keys = {"skills"}
        extra_keys = set(data.keys()) - allowed_keys
        if extra_keys:
            app.logger.warning(f"Unexpected fields in request: {extra_keys}")
            return jsonify({"error": f"Unexpected fields: {', '.join(extra_keys)}"}), 400

        skills = data.get("skills", [])
        if not skills:
            app.logger.warning("'skills' list is empty.")
            return jsonify({"error": "'skills' list cannot be empty"}), 400

        app.logger.info(f"Processing skills: {skills}")

        # Check cache first
        cached = get_cached_matches(skills)
        if cached:
            app.logger.info("Returning cached matches.")
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
        if not data or "interests" not in data:
            app.logger.warning("Invalid JSON payload received or 'interests' missing.")
            return jsonify({"error": "Invalid JSON payload or 'interests' missing"}), 400

        # Check for unexpected fields
        allowed_keys = {"interests"}
        extra_keys = set(data.keys()) - allowed_keys
        if extra_keys:
            app.logger.warning(f"Unexpected fields in request: {extra_keys}")
            return jsonify({"error": f"Unexpected fields: {', '.join(extra_keys)}"}), 400

        interests = data.get("interests", [])
        if not interests:
            app.logger.warning("'interests' list is empty.")
            return jsonify({"error": "'interests' list cannot be empty"}), 400

        app.logger.info(f"Processing interests: {interests}")

        # Proceed with recommending skills
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
        if not data or "side_hustle" not in data:
            app.logger.warning("Invalid JSON payload received or 'side_hustle' missing.")
            return jsonify({"error": "Invalid JSON payload or 'side_hustle' missing"}), 400

        # Check for unexpected fields
        allowed_keys = {"side_hustle"}
        extra_keys = set(data.keys()) - allowed_keys
        if extra_keys:
            app.logger.warning(f"Unexpected fields in request: {extra_keys}")
            return jsonify({"error": f"Unexpected fields: {', '.join(extra_keys)}"}), 400

        side_hustle = data.get("side_hustle", "")
        if not side_hustle:
            app.logger.warning("'side_hustle' is empty.")
            return jsonify({"error": "'side_hustle' cannot be empty"}), 400

        app.logger.info(f"Processing side hustle: {side_hustle}")

        # Proceed with habit recommendations
        habits = get_habit_recommendations(side_hustle)
        app.logger.info(f"Recommended habits: {habits}")
        return jsonify(habits)
    except Exception as e:
        app.logger.error(f"Error in /api/habits: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/", methods=["GET"])
def home():
    app.logger.info("Root endpoint accessed")
    return jsonify({"message": "Skill Match Bot Backend is running!"})

# New Authentication Routes

@app.route("/api/register", methods=["POST"])
def register():
    app.logger.info("Request received at /api/register")
    try:
        data = request.get_json()
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not all([username, email, password]):
            return jsonify({"error": "All fields (username, email, password) are required!"}), 400

        hashed_password = generate_password_hash(password)
        user = User(username=username, email=email, hashed_password=hashed_password)
        g.db.add(user)
        g.db.commit()

        return jsonify({"message": "User registered successfully!"}), 201
    except IntegrityError:
        g.db.rollback()
        return jsonify({"error": "Username or email already exists!"}), 409
    except Exception as e:
        app.logger.error(f"Error in /api/register: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    app.logger.info("Request received at /api/login")
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not all([email, password]):
            return jsonify({"error": "Email and password are required!"}), 400

        user = g.db.query(User).filter_by(email=email).first()
        if not user or not check_password_hash(user.hashed_password, password):
            return jsonify({"error": "Invalid email or password!"}), 401

        access_token = create_access_token(identity=user.id)
        return jsonify({"token": access_token}), 200
    except Exception as e:
        app.logger.error(f"Error in /api/login: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/api/dashboard", methods=["GET"])
@jwt_required()
def dashboard():
    app.logger.info("Request received at /api/dashboard")
    try:
        user_id = get_jwt_identity()
        user = g.db.query(User).filter_by(id=user_id).first()
        if not user:
            return jsonify({"error": "User not found!"}), 404

        # Example user-specific data; adjust as needed
        data = {
            "username": user.username,
            "email": user.email,
            "created_at": user.created_at.isoformat()
        }
        return jsonify(data), 200
    except Exception as e:
        app.logger.error(f"Error in /api/dashboard: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

# Main entry point
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5001))
    app.logger.info(f"Starting the app on port {port}")
    app.run(debug=False, host="0.0.0.0", port=port)
