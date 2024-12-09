from sentence_transformers import SentenceTransformer, util
import torch
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the pre-trained sentence transformer model
try:
    model_name = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
    logger.info(f"Loading the sentence transformer model: {model_name}...")
    model = SentenceTransformer(model_name, device="cpu")  # Force CPU for Render
    logger.info("Model loaded successfully.")
except Exception as e:
    logger.error(f"Failed to load sentence transformer model: {e}")
    raise

# Define a list of skills
SKILLS = [
    "Python programming", "Data analysis", "Graphic design",
    "Digital marketing", "Project management", "Content writing",
    "Web development", "SEO optimization", "UI/UX design",
    "Social media management"
]

# Precompute skill embeddings
SKILL_EMBEDDINGS_FILE = 'skill_embeddings.pt'

try:
    logger.info("Loading skill embeddings...")
    SKILL_EMBEDDINGS = torch.load(SKILL_EMBEDDINGS_FILE, map_location=torch.device("cpu"))
    logger.info("Skill embeddings loaded successfully.")
except FileNotFoundError:
    logger.info(f"Skill embeddings file '{SKILL_EMBEDDINGS_FILE}' not found. Creating embeddings...")
    try:
        SKILL_EMBEDDINGS = model.encode(SKILLS, convert_to_tensor=True)
        torch.save(SKILL_EMBEDDINGS, SKILL_EMBEDDINGS_FILE)
        logger.info("Skill embeddings created and saved successfully.")
    except Exception as e:
        logger.error(f"Error creating skill embeddings: {e}")
        raise
except Exception as e:
    logger.error(f"Failed to load skill embeddings: {e}")
    raise


def recommend_skills(interests):
    """
    Recommends skills based on user interests using semantic similarity.

    Args:
        interests (list of str): A list of user interests.

    Returns:
        list of str: A list of recommended skills.
    """
    if not interests or not isinstance(interests, list):
        logger.warning("Invalid input: interests must be a non-empty list of strings.")
        return ["Please provide a valid list of interests."]

    try:
        logger.info(f"Embedding user-provided interests: {interests}")
        interest_embeddings = model.encode(interests, convert_to_tensor=True)

        recommendations = set()

        for interest, embedding in zip(interests, interest_embeddings):
            logger.info(f"Calculating similarity for interest: '{interest}'")
            similarity_scores = util.pytorch_cos_sim(embedding, SKILL_EMBEDDINGS)[0]

            # Get the top 3 most similar skills
            top_matches = torch.topk(similarity_scores, k=3)

            # Log detailed similarity scores and matched indices
            logger.debug(f"Similarity scores for '{interest}': {similarity_scores.tolist()}")
            logger.debug(f"Top matches indices for '{interest}': {top_matches.indices.tolist()}")

            # Add the top matches to recommendations
            for idx in top_matches.indices:
                recommendations.add(SKILLS[idx.item()])

        # Return sorted recommendations
        sorted_recommendations = sorted(recommendations)
        logger.info(f"Generated skill recommendations: {sorted_recommendations}")
        return sorted_recommendations
    except Exception as e:
        logger.error(f"Error while recommending skills: {e}")
        return [f"Error processing interests: {e}"]
