from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from models.users import User
from config.database import Config

engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)


def is_user_active(email: str) -> bool:
    session = Session()
    try:
        user = session.query(User).filter(email == email).first()
        if user:
            return user.is_active
        else:
            return False
    except Exception as e:
        print("An error occurred while querying the user:", e)
        return False
    finally:
        session.close()


if __name__ == "__main__":
    # Input email to check
    email_to_check = input("Enter the email to check if user is active: ")
    is_active = is_user_active(email_to_check)
    print(
        f"User with email '{email_to_check}' is {'active' if is_active else 'not active'}.")
