import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DateTime, Index
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Read the DATABASE_URL from the environment variable
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    logger.error("DATABASE_URL environment variable is not set")
    raise ValueError("DATABASE_URL environment variable is not set")

# Debugging: Avoid logging sensitive info in production
logger.info("DATABASE_URL Loaded successfully.")

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL, echo=False)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Models

# User model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(150), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    habits = relationship("Habit", back_populates="user", cascade="all, delete-orphan")
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    badges = relationship("Badge", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"

# Profile model
class Profile(Base):
    __tablename__ = "profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    bio = Column(String(500), nullable=True)  # Max length of 500 characters for bio
    avatar_url = Column(String(2083), nullable=True)  # Max length for URLs
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="profile")

    def __repr__(self):
        return f"<Profile(id={self.id}, user_id={self.user_id}, bio='{self.bio}')>"

    # Add an index for user_id
Index("ix_profiles_user_id", Profile.user_id)

# Badge model
class Badge(Base):
    __tablename__ = "badges"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # Max length for badge name
    description = Column(String(255), nullable=True)  # Max length for description
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="badges")

    def __repr__(self):
        return f"<Badge(id={self.id}, name='{self.name}', user_id={self.user_id}')>"

    # Add an index for user_id
Index("ix_badges_user_id", Badge.user_id)

# Skill model
class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)  # Max length for skill name
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="skills")

    def __repr__(self):
        return f"<Skill(id={self.id}, name='{self.name}', user_id={self.user_id}')>"

# Habit model
class Habit(Base):
    __tablename__ = "habits"
    
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), nullable=False)  # Max length for description
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="habits")

    def __repr__(self):
        return f"<Habit(id={self.id}, description='{self.description}', user_id={self.user_id}')>"

# Initialize Database
def initialize_database():
    """
    Create all database tables.
    """
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(engine)
        logger.info("Database tables created successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

# Main execution
if __name__ == "__main__":
    initialize_database()
