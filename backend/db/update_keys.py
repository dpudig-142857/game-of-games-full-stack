import psycopg2

# DB connection settings
conn = psycopg2.connect(
    dbname="gog",
    user="postgres",
    password="Chloe2123",
    host="localhost",
    port=5432
)
conn.autocommit = True
cur = conn.cursor()

# List of (table, column, ref_table, ref_column, new_constraint_name)
constraints = [
    # Direct to gog_sessions
    ("gog_games", "session_id", "gog_sessions", "session_id", "fk_gog_games_session"),
    ("gog_players", "session_id", "gog_sessions", "session_id", "fk_gog_players_session"),
    ("gog_possible_games", "session_id", "gog_sessions", "session_id", "fk_gog_possible_games_session"),
    ("gog_games_neighed", "session_id", "gog_sessions", "session_id", "fk_gog_games_neighed_session"),
    ("gog_final_results", "session_id", "gog_sessions", "session_id", "fk_gog_final_results_session"),
    # Indirect through gog_games
    ("gog_game_players", "game_instance_id", "gog_games", "game_instance_id", "fk_gog_game_players_game"),
    ("gog_game_votes", "game_instance_id", "gog_games", "game_instance_id", "fk_gog_game_votes_game"),
]

for table, column, ref_table, ref_column, new_name in constraints:
    # 1. Find existing constraint
    cur.execute("""
        SELECT conname
        FROM pg_constraint
        WHERE conrelid = %s::regclass
        AND contype = 'f'
        AND conkey = ARRAY[
            (SELECT attnum FROM pg_attribute WHERE attrelid = %s::regclass AND attname = %s)
        ];
    """, (table, table, column))
    row = cur.fetchone()

    if row:
        old_name = row[0]
        print(f"Dropping {old_name} on {table}...")
        cur.execute(f'ALTER TABLE {table} DROP CONSTRAINT {old_name}')

    # 2. Add the new constraint with ON DELETE CASCADE
    print(f"Adding {new_name} on {table}...")
    cur.execute(f"""
        ALTER TABLE {table}
        ADD CONSTRAINT {new_name}
        FOREIGN KEY ({column})
        REFERENCES {ref_table} ({ref_column})
        ON DELETE CASCADE
    """)

cur.close()
conn.close()
print("✅ All constraints updated to ON DELETE CASCADE.")