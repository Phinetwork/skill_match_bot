from flask import Blueprint, request, jsonify
from utils.token import verify_token
from models import User

dashboard = Blueprint('dashboard', __name__)

@dashboard.route('/api/dashboard', methods=['GET'])
def get_dashboard():
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    user_id = verify_token(token)
    if not user_id:
        return jsonify({"message": "Invalid or expired token"}), 401

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Example dashboard data
    dashboard_data = {
        "username": user.username,
        "email": user.email,
        "last_login": user.last_login,  # Assuming a last_login field
        "activity": [],  # Fetch user-specific activity
    }

    return jsonify({"message": "Dashboard data fetched successfully", "data": dashboard_data}), 200
