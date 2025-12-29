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

# === Load data from info_overall.json ===
with open("info_overall.json", "r") as f:
    data = json.load(f)

    
# === Load Players ===
players = data.get("allPlayers", [])
for player in players:
    cur.execute("""
        INSERT INTO players (name, family, colour)
        VALUES (%s, %s, %s)
    """, (
        player["name"],
        player["family"],
        player["colour"]
    ));

# === Load Games Info ===
games_info = data.get("allGamesInfo", [])
for game in games_info:
    cur.execute("""
        INSERT INTO games_info (name, tag, type, results_type, winner_criteria, header, player_min, player_max, starting, colour)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        game["game"],
        game["tag"],
        game["type"],
        game["results"],
        game["winner"],
        game["header"],
        game["player_min"],
        game["player_max"],
        game["starting"],
        game["colour"],
    ));

# === Load Points Systems ===
points = data.get("pointsSystem", {}).get("points", [])
for i, rewards in enumerate(points, start=2):
    cur.execute("INSERT INTO points_system (num_players, rewards, type) VALUES (%s, %s, %s)", (i, rewards, "points"))

cones = data.get("pointsSystem", {}).get("cones", [])
for i, rewards in enumerate(cones, start=2):
    cur.execute("INSERT INTO points_system (num_players, rewards, type) VALUES (%s, %s, %s)", (i, rewards, "cones"))

# === Load data from info_logs.json ===
with open("info_logs.json", "r") as f:
    data = json.load(f)

# === Load Logs ===
for i, session in enumerate(data, start=1):
    # --- Insert session ---
    cur.execute("""
        INSERT INTO gog_sessions (name, status, start_time, finish_time, points_system, speciality_count, intruded, abandoned, extra)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING session_id
    """, (
        session["gog_id"],
        session["status"],
        parse_time(session["start_time"]),
        parse_time(session["finish_time"]),
        session["systems"]["points"],
        session["systems"]["speciality"],
        session.get("intruded", []),
        session.get("abandoned", []),
        session.get("extra", [])
    ))
    session_id = cur.fetchone()[0]

    # --- Insert possible games ---
    for game in session["possible_games"]:
        cur.execute("SELECT game_id FROM games_info WHERE name = %s", (game,))
        game_id=cur.fetchone()
        cur.execute("INSERT INTO gog_possible_games (session_id, game_id, game_name) VALUES (%s, %s, %s)", (session_id, game_id, game))

    # --- Insert gog_players ---
    for player in session["players"]:
        cones = player["cones"]
        points = player["points"]
        cards = player["cards"]
        cur.execute("""
            INSERT INTO gog_players (
                session_id, player_id, speciality,
                pg_cone, f20g_cone, l_cone, c_cone, w_cone, v_cone,
                g_point, c_point, special_w_point, special_l_point,
                neigh, super_neigh, gooc_total, gooc_used
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            session_id, player["player"], player["speciality"],
            cones["pg_cone"], cones["f20g_cone"], cones["l_cone"], cones["c_cone"], cones["w_cone"], cones["v_cone"],
            points["g_point"], points["c_point"], points["special_w_point"], points["special_l_point"],
            cards["neigh"], cards["super_neigh"], cards["gooc_total"], cards["gooc_used"]
        ))

    # --- Insert games and results ---
    for i, game in enumerate(session["games"], start=1):
        cur.execute("SELECT game_id FROM games_info WHERE name = %s", (game["name"],))
        game_info_id=cur.fetchone()

        cur.execute("""
            INSERT INTO gog_games (session_id, game_id, game_number, name, status, selected_by, extras, after)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING game_instance_id
        """, (
            session_id,
            game_info_id,
            i,
            game["name"],
            game["status"],
            game["selected_by"],
            game.get("extras", []),
            game.get("after", [])
        ))
        game_id=cur.fetchone()[0]

        for vote in game["votes"]:
            cur.execute("""
                INSERT INTO gog_game_votes (game_instance_id, player_id, game_name)
                VALUES (%s, %s, %s)
            """, (
                game_id,
                vote["player_id"],
                vote["vote"]
            ))
        
        for result in game["results"]:
            cur.execute("""
                INSERT INTO gog_game_players (game_instance_id, player_id, speciality, place, reward, points, stars, coins)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                game_id,
                result["player"],
                result["player"] in game["speciality"],
                result.get("place"),
                result.get("reward"),
                result.get("points", None),
                result.get("stars", None),
                result.get("coins", None)
            ))

        after_list = game.get("after", [])
        for entry in after_list:
            entry_upper = entry.upper()
            if "NEIGHED" in entry_upper:
                is_super = "SUPER NEIGHED" in entry_upper
                type_value = "Super Neigh" if is_super else "Neigh"

                parts = entry.split(" NEIGHED ")
                if len(parts) == 2:
                    player_name = parts[0].replace("SUPER", "").strip()
                    game_name = parts[1].strip()

                    # Get player_id and game_id
                    cur.execute("SELECT player_id FROM accounts WHERE name = %s", (player_name,))
                    player_row = cur.fetchone()
                    cur.execute("SELECT game_id FROM games_info WHERE name = %s", (game_name,))
                    game_row = cur.fetchone()

                    if player_row and game_row:
                        player_id = player_row[0]
                        game_id_ = game_row[0]

                        cur.execute("""
                            INSERT INTO gog_games_neighed (session_id, game_id, player_id, type)
                            VALUES (%s, %s, %s, %s)
                        """, (session_id, game_id_, player_id, type_value))

    # --- Insert final_results ---
    for fr in session["final_results"]:
        cur.execute("""
            INSERT INTO gog_final_results (session_id, player_id, place, points, cones)
            VALUES (%s, %s, %s, %s, %s)
        """, (session_id, fr["player"], fr["place"], fr["points"], fr["cones"]))

"""
# --- ADD TEST SESSION ---
testId = 18
cur.execute("" "
    INSERT INTO gog_sessions (session_id, name, status, start_time, finish_time, points_system, speciality_count, intruded, abandoned, extra)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
"" ", (
    testId,
    'Game of Games No. ' + str(testId),
    'active',
    '2025-07-25 15:20:00.000',
    '2025-07-25 15:20:00.000',
    'Points & Cones',
    2,
    [],
    [],
    []
));

possible = [
    "Alphabetix",
    "Avocado Smash",
    "Backyard Cricket",
    "Basketball",
    "Betrayal",
    "Beer Pong",
    "Block Party",
    "Boomerang Fu",
    "Call of Duty",
    "Capture the Flag",
    "Cards Against Humanity",
    "Catan",
    "Codenames",
    "Chess",
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
    "Minigolf",
    "Minigolf Adventure",
    "Monopoly",
    "Monopoly Bid",
    "Monopoly Deal",
    "Muffin Time",
    "NBA",
    "Quoits",
    "Shithead",
    "Shooting",
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
    "Yahtzee Cards",
    "4:20 Game"
]

for game in possible:
    cur.execute("" "
        INSERT INTO gog_possible_games (session_id, game_name)
        VALUES (%s, %s);
    "" ", (testId, game));

players = [1, 2];#, 3, 4, 5, 6];#, 7, 8];#, 9, 10];
special = [
    ["Jenga", "Switch Bowling"],            # Dan
    ["Five Crowns", "Codenames"],           # Gid
    #["Table Tennis", "Quoits"],             # Jake
    #["Mario Kart", "Minigolf Adventure"],   # Danny
    #["Jenga", "Uno Stacko"],                # Alex
    #["Uno Stacko", "Minigolf"],             # Max T
    #["Uno Stacko", "Jenga"],                # Isabella
    #["Shithead", "Tong-its"],               # Vanessa
    #["Uno Flip", "Jenga"],                  # Aryana
    #["Super Smash Bros", "Chess"]           # Max V
]
for i, id in enumerate(players, start=0):
    cur.execute("" "
        INSERT INTO gog_players (session_id, player_id, speciality, pg_cone, f20g_cone, l_cone, c_cone, w_cone, v_cone, g_point, c_point, special_w_point, special_l_point, neigh, super_neigh, gooc_total, gooc_used)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
    "" ", (
        testId, id, special[i], 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0
    ));
"""

conn.commit()
cur.close()
conn.close()
print("Loaded players and games_info successfully.")
