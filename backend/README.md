# Skyriz - Backend

This is the backend service for the **Skyriz**, a platform that helps users discover side hustles, develop skills, and track habits to achieve their goals. The backend is built with **Flask**, integrates with a **PostgreSQL database**, and uses **Redis caching** for optimized performance.

## Features

- **User Authentication**: Secure registration and login endpoints.
- **Side Hustle Recommendations**: Provides personalized side hustle suggestions based on user skills.
- **Skill Development Suggestions**: Recommends skills based on user interests.
- **Habit Tracking**: Generates habit recommendations tailored to side hustle goals.
- **Caching**: Uses Redis for caching side hustle matches to enhance response times.
- **API Integration**: Provides APIs to power the frontend React.js app.

## Installation

### Prerequisites

- Python 3.9 or higher
- PostgreSQL database
- Redis server
- Pipenv or another Python package manager

### Clone the Repository

```bash
git clone https://github.com/Phinetwork/skill_match_bot.git
cd skill_match_bot/backend
