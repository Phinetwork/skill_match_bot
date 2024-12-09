import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

# Read the DATABASE_URL from the environment variable
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://skill_match_db_user:LaE1a5nDRxJJOSihq2kwy8z8kZblqkEw@dpg-ctb33l9opnds73ek8aa0-a.oregon-postgres.render.com/skill_match_db"
)

# Validate the connection string
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# User model
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    skills = relationship("Skill", backref="user")
    habits = relationship("Habit", backref="user")

# Skill model
class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

# Habit model
class Habit(Base):
    __tablename__ = "habits"
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

# Function to initialize the database (create tables)
def init_db():
    Base.metadata.create_all(bind=engine)
