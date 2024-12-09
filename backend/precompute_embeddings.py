# precompute_embeddings.py

from sentence_transformers import SentenceTransformer
import torch
import logging
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

def main():
    try:
        model_name = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")
        logger.info(f"Loading the sentence transformer model: {model_name}...")
        model = SentenceTransformer(model_name)
        logger.info("Model loaded successfully.")
    except Exception as e:
        logger.error(f"Failed to load sentence transformer model: {e}")
        return

    try:
        logger.info("Embedding side hustle descriptions...")
        corpus_embeddings = model.encode(CORPUS, convert_to_tensor=True)
        logger.info("Corpus embeddings created successfully.")
    except Exception as e:
        logger.error(f"Failed to embed side hustle descriptions: {e}")
        return

    try:
        torch.save(corpus_embeddings, 'corpus_embeddings.pt')
        logger.info("Corpus embeddings saved to 'corpus_embeddings.pt'")
    except Exception as e:
        logger.error(f"Failed to save corpus embeddings: {e}")

if __name__ == "__main__":
    main()
