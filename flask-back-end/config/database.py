from json import loads
import os
from typing import TypedDict

import boto3
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError


class DatabaseSecret(TypedDict):
    password: str
    engine: str
    port: int
    dbInstanceIdentifier: str
    host: str
    username: str
    database: str  # Add database field


def get_db_credentials() -> DatabaseSecret:
    client = boto3.client('secretsmanager', region_name='ca-central-1')
    secret_name = os.getenv("DB_SECRET_NAME", 'DbSecret685A0FA5-D79i02EFkzp3')

    response = client.get_secret_value(SecretId=secret_name)
    secret = loads(response['SecretString'])

    return DatabaseSecret(
        username=secret['username'],
        password=secret['password'],
        host=secret['host'],
        dbInstanceIdentifier=secret['dbInstanceIdentifier'],
        engine=secret['engine'],
        port=int(secret['port']),
        database=secret.get('database', 'default')
    )


database_secret: DatabaseSecret = get_db_credentials()


class Config:
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+mysqlconnector://{database_secret['username']}:"
        f"{database_secret['password']}@{database_secret['host']}/"
        f"{database_secret['database']}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False


def create_database_if_not_exists():
    uri_without_db = (
        f"mysql+mysqlconnector://{database_secret['username']}:"
        f"{database_secret['password']}@{database_secret['host']}/"
    )
    engine = create_engine(uri_without_db)
    try:
        # Check if the database exists
        with engine.connect() as conn:
            conn.execute(
                text(f"CREATE DATABASE IF NOT EXISTS `{database_secret['database']}`"))
            print(f"Database '{database_secret['database']}' is ready.")
    except OperationalError as e:
        print("Failed to create or connect to the database:", e)
    finally:
        engine.dispose()


if __name__ == "__main__":
    create_database_if_not_exists()
