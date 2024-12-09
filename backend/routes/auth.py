from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User
from utils.token import generate_token

auth = Blueprint('auth', __name__)

# Register endpoint
@auth.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not username or not email or not password:
        return jsonify({"message": "All fields are required"}), 400

    # Check if the user already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email is already registered"}), 400

    # Create a new user
    hashed_password = generate_password_hash(password)
    new_user = User(username=username, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

# Login endpoint
@auth.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validate input
    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    # Authenticate user
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid email or password"}), 401

    # Generate a token for the user
    token = generate_token(user.id)

    return jsonify({"message": "Login successful", "token": token}), 200
