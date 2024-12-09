def recommend_skills(interests):
    # Example skill recommendations
    skills_map = {
        "creative": ["Graphic design", "Content creation"],
        "technical": ["Coding", "Data analysis"],
        "consulting": ["Project management", "Strategy consulting"]
    }
    recommended = []
    for interest in interests:
        recommended.extend(skills_map.get(interest, []))
    return recommended
