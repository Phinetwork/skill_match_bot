from flask import Flask, request, jsonify
from flask_cors import CORS
from database import SessionLocal
from matching_engine import get_side_hustles
from skill_engine import recommend_skills
from habit_engine import get_habit_recommendations
import os  # For reading environment variables

# Initialize Flask app
app = Flask(__name__)

# Allow cross-origin requests (CORS configuration)
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://skill-match-bot-frontend.onrender.com")  # Replace with your frontend URL
CORS(app, resources={r"/*": {"origins": FRONTEND_URL}})

# Initialize database session (if connected)
try:
    session = SessionLocal()
    print("Database connected successfully.")
except Exception as e:
    print(f"Database connection failed: {e}. Proceeding without it.")

# Routes
@app.route("/api/matches", methods=["POST"])
def side_hustle_matches():
    try:
        data = request.json
        skills = data.get("skills", [])
        if not skills:
            return jsonify({"error": "Skills data is missing"}), 400
        matches = get_side_hustles(skills)
        return jsonify(matches)
    except Exception as e:
        print(f"Error in /api/matches: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/api/skills", methods=["POST"])
def skill_creation():
    try:
        data = request.json
        interests = data.get("interests", [])
        if not interests:
            return jsonify({"error": "Interests data is missing"}), 400
        recommended_skills = recommend_skills(interests)
        return jsonify(recommended_skills)
    except Exception as e:
        print(f"Error in /api/skills: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

@app.route("/api/habits", methods=["POST"])
def habit_tracker():
    try:
        data = request.json
        side_hustle = data.get("side_hustle", "")
        if not side_hustle:
            return jsonify({"error": "Side hustle data is missing"}), 400
        habits = get_habit_recommendations(side_hustle)
        return jsonify(habits)
    except Exception as e:
        print(f"Error in /api/habits: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500

# Root endpoint to verify deployment
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Skill Match Bot Backend is running!"})

# Main entry point
if __name__ == "__main__":
    # Get the PORT from the environment (default to 5000 for local testing)
    port = int(os.getenv("PORT", 5000))
    # Bind to 0.0.0.0 for external access
    app.run(debug=True, host="0.0.0.0", port=port)
