from dotenv import load_dotenv
load_dotenv()  # Load environment variables first

from flask import Blueprint, request, jsonify
from flask_jwt_extended import decode_token
from models import User
import logging
import openai
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dashboard")

# Load OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")  # Ensure the environment variable is correctly named and set

dashboard = Blueprint('dashboard', __name__)

# Helper function to verify and decode the token
def verify_token(token):
    try:
        decoded_token = decode_token(token)
        user_id = decoded_token.get("sub")  # Extract the "sub" claim as user_id
        if not user_id:
            raise ValueError("Invalid token: 'sub' claim is missing")
        return user_id
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise ValueError("Invalid or expired token")

@dashboard.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    try:
        # Step 1: Get token from Authorization header
        token = request.headers.get('Authorization')
        if not token:
            logger.warning("Authorization token is missing")
            return jsonify({"message": "Authorization token is missing"}), 401

        # Extract the Bearer token
        if token.startswith("Bearer "):
            token = token.split(" ")[1]
        else:
            logger.warning("Invalid Authorization format")
            return jsonify({"message": "Invalid Authorization format"}), 401

        # Step 2: Verify the token and extract user_id
        try:
            logger.info(f"Raw token: {token}")
            user_id = verify_token(token)
            logger.info(f"Token verified successfully. Extracted user_id: {user_id}")
        except ValueError as e:
            return jsonify({"message": str(e)}), 401

        # Step 3: Fetch the user from the database
        user = User.query.get(user_id)
        if not user:
            logger.warning(f"User not found for user_id: {user_id}")
            return jsonify({"message": "User not found"}), 404

        # Step 4: Construct the dashboard data
        dashboard_data = {
            "username": user.username or "Unknown",
            "email": user.email or "Not provided",
            "last_login": getattr(user, "last_login", "Not tracked"),  # Placeholder if last_login is not implemented
            "activity": []  # Placeholder for user-specific activity
        }

        logger.info(f"Dashboard data prepared successfully for user_id: {user_id}")
        return jsonify({"message": "Dashboard data fetched successfully", "data": dashboard_data}), 200

    except Exception as e:
        logger.error(f"Unexpected error in /api/dashboard: {e}", exc_info=True)
        return jsonify({"message": "An unexpected error occurred"}), 500

@dashboard.route('/api/ai-coach', methods=['POST'])
def ai_coach():
    try:
        data = request.get_json()
        if not data or "message" not in data:
            logger.warning("Invalid payload: 'message' is required")
            return jsonify({"error": "Message is required"}), 400

        user_message = data.get("message")

        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": (
                    "You are an empathetic, motivational, and highly knowledgeable AI coach. "
                    "Your primary goal is to inspire and guide users toward achieving their personal and professional goals while helping them increase their income and financial stability through skill development. "
                    "You are friendly, supportive, and positive, while also being honest and direct when needed. "
                    "You adapt to each user's communication style and respond in a way that makes them feel understood and empowered. "
                    "You are deeply knowledgeable in areas such as personal development, time management, productivity, skill-building, financial growth, and creating and maintaining habits. "
                    "You help users identify the skills they need to achieve their career and financial goals and provide actionable steps to develop those skills. "
                    "Suggest practical ways users can monetize their skills, such as freelancing, starting a side hustle, or advancing their career. "
                    "Hold users accountable by tracking their progress, reminding them of their commitments, and encouraging consistency in building new habits. "
                    "Provide strategies for overcoming procrastination and setbacks, helping users stay focused and motivated. "
                    "Celebrate their progress and achievements, reinforcing positive behavior and a growth mindset. "
                    "You also assist users in setting realistic goals and breaking them down into manageable steps. "
                    "Maintain a balance between being motivational and providing practical, evidence-based recommendations to ensure users make measurable progress."
                )},
                {"role": "user", "content": user_message}
            ]
        )

        ai_message = response['choices'][0]['message']['content']
        return jsonify({"response": ai_message}), 200

    except Exception as e:
        logger.error(f"Unexpected error in /api/ai-coach: {e}", exc_info=True)
        return jsonify({"error": str(e)}), 500
