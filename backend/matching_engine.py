from sentence_transformers import SentenceTransformer, util
import torch  # Required for topk functionality
import numpy as np

# Load a pre-trained sentence transformer model for semantic similarity
model = SentenceTransformer("all-MiniLM-L6-v2")

# Define the mapping of side hustles
SIDE_HUSTLES = {
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

# Create a corpus of side hustle descriptions for AI matching
CORPUS = {key: value for key, values in SIDE_HUSTLES.items() for value in values}

# Embed the side hustle descriptions for comparison
CORPUS_EMBEDDINGS = model.encode(list(CORPUS.values()), convert_to_tensor=True)


def get_side_hustles(skills):
    """
    Matches skills to potential side hustles using semantic similarity.

    Args:
        skills (list): A list of skills provided by the user.

    Returns:
        list: A list of recommended side hustles based on input skills.
    """
    if not skills:
        return ["Please provide at least one skill."]

    recommendations = []

    try:
        # Embed user-provided skills for comparison
        skill_embeddings = model.encode(skills, convert_to_tensor=True)

        for skill, embedding in zip(skills, skill_embeddings):
            # Calculate similarity scores with CORPUS_EMBEDDINGS
            similarity_scores = util.pytorch_cos_sim(embedding, CORPUS_EMBEDDINGS)[0]

            # Get top 3 matches
            top_matches = torch.topk(similarity_scores, k=3)

            # Append the matching side hustles
            for idx in top_matches.indices:
                recommendations.append(list(CORPUS.values())[idx.item()])

        # Return unique recommendations
        return list(set(recommendations))
    except Exception as e:
        # Handle unexpected errors gracefully
        return [f"Error processing skills: {e}"]

