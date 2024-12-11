import requests
import random
import string

BASE_URL = "http://127.0.0.1:5001"  # Ensure this matches your backend server
HEADERS = {"Content-Type": "application/json"}

def log_error(response):
    """Log detailed error information for debugging."""
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response JSON: {response.json()}")
    except Exception as e:
        print(f"Error decoding JSON: {e}")
        print(f"Response Text: {response.text}")


def generate_random_user():
    """Generate a unique username and email."""
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    username = f"user_{random_str}"
    email = f"{username}@example.com"
    return username, email, "testpassword"


def test_register():
    """Test the user registration endpoint."""
    print("Testing /api/register...")
    username, email, password = generate_random_user()
    payload = {
        "username": username,
        "email": email,
        "password": password
    }
    response = requests.post(f"{BASE_URL}/api/register", json=payload, headers=HEADERS)
    print(f"Response: {response.status_code}")
    if response.status_code == 201:
        print(f"User registered successfully: {username}, {email}")
    else:
        log_error(response)
    return email, password


def test_login(email, password):
    """Test the user login endpoint."""
    print("Testing /api/login...")
    payload = {
        "email": email,
        "password": password
    }
    response = requests.post(f"{BASE_URL}/api/login", json=payload, headers=HEADERS)
    print(f"Response: {response.status_code}")
    if response.status_code == 200:
        token = response.json().get("token")
        print(f"Login successful, token: {token}")
        return token
    else:
        log_error(response)
        return None


def test_dashboard(token):
    """Test the dashboard endpoint."""
    print("Testing /api/dashboard...")
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/dashboard", headers=headers)
    print(f"Response: {response.status_code}")
    if response.status_code == 200:
        print("Dashboard data fetched successfully!")
        print(response.json())
    else:
        log_error(response)


def test_ai_coach(token):
    """Test the AI coach endpoint."""
    print("Testing /api/ai-coach...")
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}

    # Test with a valid message
    payload = {"message": "How can I improve my productivity?"}
    response = requests.post(f"{BASE_URL}/api/ai-coach", json=payload, headers=headers)
    print(f"Response: {response.status_code}")
    if response.status_code == 200:
        print("AI Coach Response:", response.json())
    else:
        log_error(response)

    # Test with an invalid payload (no message)
    payload = {}
    response = requests.post(f"{BASE_URL}/api/ai-coach", json=payload, headers=headers)
    print(f"Response: {response.status_code}")
    if response.status_code == 400:
        print("AI Coach correctly handled missing message:", response.json())
    else:
        log_error(response)


def run_tests():
    """Run all API tests."""
    print("Starting API tests...\n")

    # Test user registration and login
    email, password = test_register()
    token = test_login(email, password)

    # Test dashboard and AI Coach if login is successful
    if token:
        test_dashboard(token)
        test_ai_coach(token)
    else:
        print("Login failed. Skipping dashboard and AI Coach tests.")


if __name__ == "__main__":
    run_tests()
