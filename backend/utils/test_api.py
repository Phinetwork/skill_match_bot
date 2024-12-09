import requests

BASE_URL = "http://127.0.0.1:5001"  # Change this to your server's base URL
HEADERS = {"Content-Type": "application/json"}

# Test endpoints
def test_register():
    print("Testing /api/register...")
    payload = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = requests.post(f"{BASE_URL}/api/register", json=payload, headers=HEADERS)
    print(f"Response: {response.status_code} - {response.json()}\n")

def test_login():
    print("Testing /api/login...")
    payload = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = requests.post(f"{BASE_URL}/api/login", json=payload, headers=HEADERS)
    print(f"Response: {response.status_code} - {response.json()}\n")
    if response.status_code == 200:
        return response.json().get("token")
    return None

def test_dashboard(token):
    print("Testing /api/dashboard...")
    headers = {**HEADERS, "Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/dashboard", headers=headers)
    print(f"Response: {response.status_code} - {response.json()}\n")

def test_matches():
    print("Testing /api/matches...")
    payload = {
        "skills": ["python", "machine learning", "flask"]
    }
    response = requests.post(f"{BASE_URL}/api/matches", json=payload, headers=HEADERS)
    print(f"Response: {response.status_code} - {response.json()}\n")

def test_skills():
    print("Testing /api/skills...")
    payload = {
        "interests": ["technology", "data science"]
    }
    response = requests.post(f"{BASE_URL}/api/skills", json=payload, headers=HEADERS)
    print(f"Response: {response.status_code} - {response.json()}\n")

def test_habits():
    print("Testing /api/habits...")
    payload = {
        "side_hustle": "freelance development"
    }
    response = requests.post(f"{BASE_URL}/api/habits", json=payload, headers=HEADERS)
    print(f"Response: {response.status_code} - {response.json()}\n")

def test_root():
    print("Testing / (root)...")
    response = requests.get(f"{BASE_URL}/")
    print(f"Response: {response.status_code} - {response.json()}\n")

# Run all tests
def run_tests():
    test_root()
    test_register()
    token = test_login()
    if token:
        test_dashboard(token)
    test_matches()
    test_skills()
    test_habits()

if __name__ == "__main__":
    run_tests()
