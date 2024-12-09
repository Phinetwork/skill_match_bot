from sentence_transformers import SentenceTransformer, util
import torch
import logging
import os

# Configure logging for debugging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the pre-trained sentence transformer model
try:
    model_name = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
    logger.info(f"Loading the sentence transformer model: {model_name}...")
    model = SentenceTransformer(model_name)
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load sentence transformer model: {e}")
    raise

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

# Prepare a flat list of side hustle descriptions
CORPUS = [description for sublist in SIDE_HUSTLES.values() for description in sublist]

# Embed the side hustle descriptions for semantic similarity comparisons
try:
    logger.info("Embedding side hustle descriptions...")
    CORPUS_EMBEDDINGS = model.encode(CORPUS, convert_to_tensor=True)
    logger.info("Corpus embeddings created successfully.")
except Exception as e:
    logger.error(f"Failed to embed side hustle descriptions: {e}")
    raise


def get_side_hustles(skills):
    """
    Matches user-provided skills to potential side hustles using semantic similarity.

    Args:
        skills (list of str): A list of skills provided by the user.

    Returns:
        list of str: A list of recommended side hustles based on input skills.
    """
    if not skills or not isinstance(skills, list):
        logger.warning("Invalid input: skills must be a non-empty list of strings.")
        return ["Please provide a valid list of skills."]

    try:
        # Embed the user's skills for semantic comparison
        logger.info(f"Embedding user-provided skills: {skills}")
        skill_embeddings = model.encode(skills, convert_to_tensor=True)

        recommendations = set()  # Use a set to automatically remove duplicates

        for skill, embedding in zip(skills, skill_embeddings):
            # Calculate similarity scores between the skill and the corpus
            similarity_scores = util.pytorch_cos_sim(embedding, CORPUS_EMBEDDINGS)[0]

            # Get the top 3 most similar side hustles
            top_matches = torch.topk(similarity_scores, k=3)

            # Log similarity scores and matched indices
            logger.debug(f"Top matches for '{skill}': {top_matches.indices.tolist()}")

            # Add the top matches to recommendations
            for idx in top_matches.indices:
                recommendations.add(CORPUS[idx.item()])

        # Return sorted recommendations
        sorted_recommendations = sorted(recommendations)
        logger.info(f"Generated recommendations: {sorted_recommendations}")
        return sorted_recommendations
    except Exception as e:
        logger.error(f"Error while matching skills to side hustles: {e}")
        return [f"Error processing skills: {e}"]

