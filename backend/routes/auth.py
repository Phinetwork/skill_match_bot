from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from datetime import timedelta
import sqlite3

# Initialize Flask extensions and Blueprint
bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__)

# Database connection utility
def get_db_connection():
    conn = sqlite3.connect('database.db')  # Update with actual database path
    conn.row_factory = sqlite3.Row
    return conn

# Register route
@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Extract and validate input
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Check if user exists
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ? OR username = ?", (email, username))
        if cursor.fetchone():
            return jsonify({"error": "Email or username already exists"}), 400

        # Insert new user
        cursor.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            (username, email, hashed_password)
        )
        conn.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        # Extract and validate input
        email = data.get('email')
        password = data.get('password')
        if not email or not password:
            return jsonify({"error": "Missing required fields"}), 400

        # Fetch user
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        if not user or not bcrypt.check_password_hash(user['password'], password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT token
        access_token = create_access_token(
            identity={"username": user['username'], "email": user['email']},
            expires_delta=timedelta(hours=1)
        )
        return jsonify({"token": access_token, "message": "Login successful"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()
