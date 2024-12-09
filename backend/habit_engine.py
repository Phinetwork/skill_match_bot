def get_habit_recommendations(side_hustle):
    habits = {
        "Freelance writer": ["Write 500 words daily", "Read industry blogs weekly"],
        "Graphic designer": ["Create 1 design daily", "Update portfolio weekly"]
    }
    return habits.get(side_hustle, ["Research your craft daily", "Set a work schedule"])
