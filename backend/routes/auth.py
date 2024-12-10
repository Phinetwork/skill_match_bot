from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from datetime import timedelta
import sqlite3

# Initialize Flask extensions
bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__)

# Set up database connection
def get_db_connection():
    conn = sqlite3.connect('database.db')  # Replace with your database path
    conn.row_factory = sqlite3.Row
    return conn

# Register route
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not username or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if email or username already exists
    cursor.execute("SELECT * FROM users WHERE email = ? OR username = ?", (email, username))
    existing_user = cursor.fetchone()

    if existing_user:
        return jsonify({"error": "Email or username already exists"}), 400

    # Insert new user
    cursor.execute(
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
        (username, email, hashed_password)
    )
    conn.commit()
    conn.close()

    return jsonify({"message": "User registered successfully"}), 201


# Login route
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch user
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Check password
    if not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate JWT token
    access_token = create_access_token(identity={"username": user['username'], "email": user['email']}, expires_delta=timedelta(hours=1))

    return jsonify({"token": access_token, "message": "Login successful"}), 200
