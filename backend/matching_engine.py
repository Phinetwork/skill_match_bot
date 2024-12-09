def get_side_hustles(skills):
    """
    Matches skills to potential side hustles based on predefined mappings.

    Args:
        skills (list): A list of skills provided by the user.

    Returns:
        list: A list of recommended side hustles based on the input skills.
    """

    # Comprehensive mapping of skills to side hustles
    side_hustles = {
        "coding": ["Freelance developer", "Tech consultant", "Web developer"],
        "writing": ["Content writer", "Copywriter", "Blog creator", "Technical writer"],
        "design": ["Graphic designer", "UI/UX specialist", "Logo designer", "Product designer"],
        "marketing": ["Social media manager", "SEO specialist", "Email marketer"],
        "photography": ["Event photographer", "Stock photo contributor", "Portrait photographer"],
        "videography": ["Video editor", "YouTube content creator", "Event videographer"],
        "teaching": ["Online tutor", "Course creator", "Workshop facilitator"],
        "data analysis": ["Data analyst", "Business intelligence consultant", "Freelance statistician"],
        "sales": ["Sales consultant", "Affiliate marketer", "Cold outreach specialist"],
        "fitness": ["Personal trainer", "Fitness blogger", "Online fitness coach"],
    }

    # Default recommendations for unrecognized skills
    default_recommendations = [
        "Consider exploring general freelance opportunities",
        "Look into popular gig economy platforms like Upwork or Fiverr",
    ]

    # Initialize an empty list for matches
    matches = []

    # Match each input skill to corresponding side hustles
    for skill in skills:
        skill_lower = skill.lower()  # Normalize skill names to lowercase
        if skill_lower in side_hustles:
            matches.extend(side_hustles[skill_lower])
        else:
            matches.append(f"No direct matches found for '{skill}'. Try these: {', '.join(default_recommendations)}")

    return matches
