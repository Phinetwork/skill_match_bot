import unittest
import json
from app import app

class TestAPI(unittest.TestCase):
    def setUp(self):
        # Set up the test client
        self.client = app.test_client()

    def test_side_hustle_matches(self):
        # Sample data
        data = {
            "skills": ["coding"],
            "interests": ["design"]
        }
        # Send a POST request
        response = self.client.post('/api/matches', 
                                    data=json.dumps(data),
                                    content_type='application/json')
        
        # Assert the status code
        self.assertEqual(response.status_code, 200)
        # Optionally, check the response data
        response_data = json.loads(response.data)
        self.assertIn("Copywriter", response_data)  # Check for a match
        self.assertIn("Technical writer", response_data)  # Check for a match
        self.assertIn("Web developer", response_data)  # Check for a match

if __name__ == '__main__':
    unittest.main()
