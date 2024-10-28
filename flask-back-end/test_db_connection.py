import mysql.connector
from mysql.connector import Error


def test_connection():
    try:
        connection = mysql.connector.connect(
            host='fundfactsbackend-flaskapidatabasee9d37632-ls170bcdyp9u.criwycoituxs.ca-central-1.rds.amazonaws.com',
            user='admin',
            password='9zVc2oEf8xP1gFux74ORsY4ojV4pUnL3',
            database=''
        )
        if connection.is_connected():
            print("Successfully connected to the database")
    except Error as e:
        print(f"Error: {e}")
    finally:
        if connection.is_connected():
            connection.close()


test_connection()
