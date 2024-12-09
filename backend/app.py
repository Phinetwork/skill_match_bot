from flask import Flask, request, jsonify
from flask_cors import CORS
from database import SessionLocal
from matching_engine import get_side_hustles
from skill_engine import recommend_skills
from habit_engine import get_habit_recommendations
from sentence_transformers import SentenceTransformer
import os
import logging

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
app.logger.info("Initializing the Skill Match Bot Backend")

# Load the SentenceTransformer model globally to prevent reloading on every request
model = SentenceTransformer("all-MiniLM-L6-v2")
app.logger.info("SentenceTransformer model loaded successfully.")

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

# Routes
@app.route("/api/matches", methods=["POST"])
def side_hustle_matches():
    app.logger.info("Request received at /api/matches")
    app.logger.info(f"Request headers: {request.headers}")
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        app.logger.info(f"Request data: {data}")
        skills = data.get("skills", [])
        if not skills:
            return jsonify({"error": "Skills data is missing"}), 400

        # Pass the preloaded model to the matching engine
        matches = get_side_hustles(skills, model)
        app.logger.info(f"Matches found: {matches}")
        return jsonify(matches)
    except Exception as e:
        app.logger.error(f"Error in /api/matches: {e}", exc_info=True)
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/api/skills", methods=["POST"])
def skill_creation():
    app.logger.info("Request received at /api/skills")
    app.logger.info(f"Request headers: {request.headers}")
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        app.logger.info(f"Request data: {data}")
        interests = data.get("interests", [])
        if not interests:
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
    app.logger.info(f"Request headers: {request.headers}")
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        app.logger.info(f"Request data: {data}")
        side_hustle = data.get("side_hustle", "")
        if not side_hustle:
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
    app.run(debug=True, host="0.0.0.0", port=port)
