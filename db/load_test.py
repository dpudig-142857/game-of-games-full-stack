import json
import psycopg2
from datetime import datetime

def parse_time(dt_str):
    return datetime.strptime(dt_str, "%d/%m/%Y, %H:%M:%S")

# === Database connection ===
conn = psycopg2.connect(
    dbname="gog",
    user="postgres",
    password="Chloe2123",
    host="localhost",
    port=5432
)
cur = conn.cursor()

ids = [22]#, 23]

for id in ids:
    # --- ADD TEST SESSION ---
    testId = id
    cur.execute("""
        INSERT INTO gog_sessions (session_id, name, status, start_time, finish_time, points_system, speciality_count, refresh_count, intruded, abandoned, extra)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    """, (
        testId,
        'Game of Games No. ' + str(testId),
        'active',
        '2025-11-30 12:34:00.000+10',
        '2025-11-30 12:34:00.000+10',
        'Points & Cones',
        2,
        0,
        [],
        [],
        []
    ));

    possible = [
        "4:20 Game",
        "Alphabetix",
        "Avocado Smash",
        "Backyard Cricket",
        "Basketball",
        "Beer Pong",
        "Betrayal",
        "Block Party",
        "Boomerang Fu",
        "Call of Duty",
        "Capture the Flag",
        "Cards Against Humanity",
        "Catan",
        "Chess",
        "Codenames",
        "Codenames Duet",
        "Codenames Pictures",
        "Cornhole",
        "Costumed Cats",
        "Coup",
        "FIFA",
        "Five Crowns",
        "Flip 7",
        "FUCK the Game",
        "Game of Life",
        "Gang Beasts",
        "Golf",
        "Handball",
        "Here to Slay",
        "Injustice",
        "Jenga",
        "Karma",
        "Llamas Unleashed",
        "Mario Kart",
        "Mario Party",
        "Minigolf Adventure",
        "Minigolf Bowling",
        "Monopoly",
        "Monopoly Bid",
        "Monopoly Deal",
        "Moose Master",
        "Muffin Time",
        "NBA",
        "Putt Putt",
        "Quoits",
        "Rhythm Kitchen",
        "Shithead",
        "Shooting",
        "Skip Bo",
        "Soccer",
        "Sounds Fishy",
        "Street Fighter",
        "Struggle for Catan",
        "Super Smash Bros",
        "Skip Bo",
        "Soccer",
        "Sounds Fishy",
        "Street Fighter",
        "Struggle for Catan",
        "Skip Bo",
        "Soccer",
        "Sounds Fishy",
        "Skip Bo",
        "Soccer",
        "Skip Bo",
        "Skip Bo",
        "Soccer",
        "Sounds Fishy",
        "Street Fighter",
        "Struggle for Catan",
        "Super Smash Bros",
        "Switch Basketball",
        "Switch Bowling",
        "Switch Golf",
        "Switch Tennis",
        "Table Tennis",
        "Tong-its",
        "Trouble (Pop-n-hop)",
        "Uno",
        "Uno Flip",
        "Uno No Mercy",
        "Uno Stacko",
        "Unstable Unicorns",
        "Yahtzee Cards"
    ]

    for game in possible:
        cur.execute("SELECT game_id FROM games_info WHERE name = %s", (game,))
        game_id=cur.fetchone()
        cur.execute("""
            INSERT INTO gog_possible_games (session_id, game_id, game_name)
            VALUES (%s, %s, %s);
        """, (testId, game_id, game,));

    players = [1, 2, 3, 4]#, 5, 6];
    special = [
        ["Five Crowns", "Switch Bowling"],                             # Dan - 1
        ["Jenga", "Monopoly Deal"],                             # Gid - 2
        ["Quoits", "Uno Stacko"],                             # Jake - 3
        ["Uno Stacko", "Boomerang Fu"],                            # Danny - 4
        #["Muffin Time", "Jenga"],                             # Alex - 5
        #["Quoits", "Flip 7"],                             # Max T - 6
        #[],                            # Isabella - 7
        #[],                            # Vanessa - 8
        #[],                            # Aryana - 9
        #[]                             # Max V - 10
        #[]                             # Abbey - 11
    ]
    for i, id in enumerate(players, start=0):
        cur.execute("""
            INSERT INTO gog_players (session_id, player_id, is_playing, speciality, pg_cone, f20g_cone, l_cone, c_cone, w_cone, v_cone, g_point, c_point, special_w_point, special_l_point, neigh, super_neigh, gooc_total, gooc_used)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            testId, id, True, special[i], 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0
        ));

conn.commit()
cur.close()
conn.close()
print("Loaded players and games_info successfully.")
