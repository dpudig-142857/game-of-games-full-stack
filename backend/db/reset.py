import subprocess
import os
import psycopg2

# Configuration
DB_NAME = "gog"
DB_USER = "postgres"
DB_PASSWORD = "Chloe2123"
DB_HOST = "localhost"
DB_PORT = "5432"
SQL_FILE = "gog.sql"#"./old_refresh/schema.sql"

# Set password for subprocess commands
os.environ["PGPASSWORD"] = DB_PASSWORD

# Drop and recreate the database
print(f"Dropping database '{DB_NAME}' (if exists)...")
subprocess.run([
    "dropdb",
    "-U", DB_USER,
    "--host", DB_HOST,
    "--port", DB_PORT,
    "--if-exists",
    DB_NAME
], check=True)

print(f"Creating database '{DB_NAME}'...")
subprocess.run([
    "createdb",
    "-U", DB_USER,
    "--host", DB_HOST,
    "--port", DB_PORT,
    DB_NAME
], check=True)

print(f"Restoring schema from {SQL_FILE}...")
subprocess.run([
    "psql",
    "-U", DB_USER,
    "--host", DB_HOST,
    "--port", DB_PORT,
    "-d", DB_NAME,
    "-f", SQL_FILE
], check=True)

print("Database reset successfully.")