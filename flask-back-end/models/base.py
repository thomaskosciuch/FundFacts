from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config.database import Config

Base = declarative_base()
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

if __name__ == "__main__":
    from models.users import User  # Import User model at the top
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        User.__table__.create(engine)
        print("Tables created and session started.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        session.commit()
        session.close()  # Close the session
