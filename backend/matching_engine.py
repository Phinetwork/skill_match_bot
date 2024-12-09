def get_side_hustles(skills):
    # Sample matching logic
    side_hustles = {
        "coding": ["Freelance developer", "Tech consultant"],
        "writing": ["Freelance writer", "Blog creator"],
        "design": ["Logo designer", "UI/UX specialist"]
    }
    matches = []
    for skill in skills:
        matches.extend(side_hustles.get(skill, []))
    return matches
