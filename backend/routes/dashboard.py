from flask import Blueprint, request, jsonify
from utils.token import verify_token
from models import User
import logging

dashboard = Blueprint('dashboard', __name__)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("dashboard")

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
            user_id = verify_token(token)  # Assumes verify_token returns user_id or raises an exception
            if not user_id:
                logger.warning("Invalid or expired token")
                return jsonify({"message": "Invalid or expired token"}), 401
            logger.info(f"Token verified successfully for user_id: {user_id}")
        except Exception as e:
            logger.error(f"Token verification failed: {e}")
            return jsonify({"message": "Invalid or expired token"}), 401

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
