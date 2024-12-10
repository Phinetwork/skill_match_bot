import jwt
from datetime import datetime, timedelta

SECRET_KEY = "your_secret_key"

def generate_token(user_id):
    expiration = datetime.utcnow() + timedelta(days=7)
    return jwt.encode({"sub": str(user_id), "exp": expiration}, SECRET_KEY, algorithm="HS256")
