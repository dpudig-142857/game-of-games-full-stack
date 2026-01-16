import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { pool } from './pool.js';

import crypto from 'crypto';
import e from 'express';

dotenv.config();

function getDisplayNames(players) {
    return players.map((p, _, all) => {
        const id = p.player_id;
        const same = all.filter(other => other.name === p.name);
        if (same.length == 1) {
            return { name: p.name, player_id: id };
        }

        let i = 1;
        let suffix = p.family.slice(0, i);
        while (same.some(o => {
            return o !== p &&
                (`${p.name} ${suffix}`) === (`${o.name} ${o.family.slice(0, i)}`);
        })) {
            i++;
            suffix = p.family.slice(0, i);
        }

        return { name: `${p.name} ${suffix}`, player_id: id };
    });
}

// --- Games ---
export async function getAllGames() {
    const res = await pool.query('SELECT * FROM games_info ORDER BY name;');
    return res.rows;
}

export async function getGameById(id) {
    const res = await pool.query('SELECT * FROM games_info WHERE game_id = $1;', [id]);
    return res.rows[0];
}

// --- Players ---
export async function getAllPlayers() {
    const res = await pool.query('SELECT * FROM accounts ORDER BY name;');
    return res.rows;
}

export async function getPlayerById(id) {
    const res = await pool.query('SELECT * FROM accounts WHERE player_id = $1;', [id]);
    return res.rows[0];
}

export async function createPlayer(data) {
    
}

// --- Points ---
export async function getAllPointsSystem() {
    const res = await pool.query('SELECT num_players, rewards, type FROM points_system ORDER BY type, num_players;');
    let result = {};
    for (const row of res.rows) {
        if (!result[row.type]) result[row.type] = [];
        // -2 because num_players starts at 2, arrays start at 0
        result[row.type][row.num_players - 2] = row.rewards;
    }
    return res.rows;
}

// --- Sessions ---
export async function getAllSessions() {
    const res = await pool.query('SELECT * FROM gog_sessions ORDER BY start_time DESC;');
    return res.rows;
}

export async function getNextSession() {
    const res = await pool.query('SELECT COUNT(*) AS num FROM gog_sessions;');
    return Number(res.rows[0].num) + 1;
}

export async function getIncompleteSessions() {
    const res = await pool.query(`
        SELECT * FROM gog_sessions WHERE status <> 'complete';
    `);
    return res.rows;
}

export async function makeActive(id) {
    await pool.query(`
        UPDATE gog_sessions
        SET status = 'active'
        WHERE session_id = $1
    `, [id]);
}

export async function getCreatingInfo(id) {
    const numRes = await pool.query('SELECT COUNT(*) FROM gog_sessions');
    const num = parseInt(numRes.rows[0].count) + 1;

    const players = await getAllPlayers();

    let games = []; 
    const types = ['board', 'card', 'outdoor', 'party', 'video'];
    for (const type of types) {
        const res = await pool.query(`
            SELECT * FROM games_info WHERE type = $1;
        `, [type]);
        games.push({ type, games: res.rows });
    }

    const pointSystemsRes = await pool.query(`
        SELECT type, num_players AS num, rewards
        FROM points_system
        ORDER BY type, num_players;
    `);
    const pointSystems = pointSystemsRes.rows;

    let type = 'create';
    let thePoints = '';
    let theNumSpeciality = -1;
    let thePlayers = [];
    let theGames = [];
    let theSpecialities = [];
    if (id != num) {
        const sessionRes = await pool.query(`
            SELECT * FROM gog_sessions WHERE session_id = $1;
        `, [id]);
        const session = sessionRes.rows[0];

        const playerRes = await pool.query(`
            SELECT * FROM gog_players WHERE session_id = $1;
        `, [id]);
        const newPlayers = playerRes.rows;

        const gamesRes = await pool.query(`
            SELECT * FROM gog_possible_games WHERE session_id = $1;
        `, [id]);
        
        type = 'continue';
        thePoints = session.points_system;
        theNumSpeciality = Number(session.speciality_count);
        newPlayers.forEach(p => {
            thePlayers.push({
                name: players.find(pI => pI.player_id == p.player_id).name,
                player_id: p.player_id,
                specialities: p.speciality,
                is_playing: true
            });
        });
        theGames = gamesRes.rows;
    }

    return {
        num,
        players,
        games,
        pointSystems,
        type,
        thePoints,
        theNumSpeciality,
        thePlayers,
        theGames,
        theSpecialities
    };
}

export async function getContinueLogs() {
    let sessions = [];
    const logs = await getLogs();
    const complete = logs.filter(l => l.status != 'complete');
    for (const log of complete) {
        const info = await getSessionById(log.session_id);
        sessions.push({
            id: log.session_id,
            log,
            session: info.session,
            possible_games: info.possible_games,
            players: info.players,
            games_played: info.games_played
        });
    }
    return sessions;
}

export async function getLogs() {
    let logs = [];

    // Get sessions
    const sessionsRes = await pool.query(`
        SELECT
            session_id, name, status, start_time,
            finish_time, points_system, refresh_count
        FROM gog_sessions 
        ORDER BY session_id DESC;
    `);
    const sessions = sessionsRes.rows;

    // Get players (names and IDs)
    const playersRes = await pool.query(`
        SELECT session_id, accounts.player_id, accounts.name, accounts.family
        FROM gog_players 
        JOIN accounts USING (player_id)
        ORDER BY session_id DESC, accounts.name;
    `);
    const rawPlayers = playersRes.rows;

    // Organize players per session
    const playersMap = {};
    for (const row of rawPlayers) {
        if (!playersMap[row.session_id]) playersMap[row.session_id] = [];
        playersMap[row.session_id].push({
            id: row.player_id,
            name: row.name,
            family: row.family
        });
    }

    // Get total games played per session
    const gamesRes = await pool.query(`
        SELECT session_id, COUNT(*) AS total_games
        FROM gog_games
        GROUP BY session_id;
    `);
    const gamesMap = {};
    gamesRes.rows.forEach(row => {
        gamesMap[row.session_id] = parseInt(row.total_games);
    });

    // Get winners (position = 1)
    const winnersRes = await pool.query(`
        SELECT session_id, accounts.name AS winner
        FROM gog_final_results 
        JOIN accounts USING (player_id)
        WHERE place = 1;
    `);
    const winnersMap = {};
    winnersRes.rows.forEach(row => {
        winnersMap[row.session_id] = row.winner;
    });

    // Combine everything
    for (const session of sessions) {
        const sessionPlayers = playersMap[session.session_id] || [];

        // Use your display name resolver here
        //const playerDisplayNames = getDisplayNames(sessionPlayers); // e.g. 'Dan vs Max T vs Max B'
        const playerDisplayNames = getDisplayNames(sessionPlayers)
            .map(p => p.name)
            .sort(p => p.sort)
            .join(' vs ');

        logs.push({
            session_id: session.session_id,
            name: session.name,
            status: session.status,
            start_time: session.start_time,
            finish_time: session.finish_time,
            points_system: session.points_system,
            refresh_count: session.refresh_count,
            players: playerDisplayNames,
            total_games: gamesMap[session.session_id] || 0,
            winner: winnersMap[session.session_id] || null,
        });
    }

    return logs;
}

export async function getSessionById(id) {
    const sessionRes = await pool.query('SELECT * FROM gog_sessions WHERE session_id = $1;', [id]);
    const possibleRes = await pool.query('SELECT game_name FROM gog_possible_games WHERE session_id = $1;', [id]);
    const playersRes = await pool.query(`
        SELECT
            player_id, name, family, colour, is_playing, speciality, pg_cone, f20g_cone, l_cone,
            c_cone, w_cone, v_cone, g_point, c_point, special_w_point,
            special_l_point, neigh, super_neigh, gooc_total, gooc_used
        FROM gog_players JOIN accounts USING (player_id)
        WHERE session_id = $1;
    `, [id]);
    const players = playersRes.rows;
    const displayNames = getDisplayNames(players);
    const gamesRes = await pool.query(`
        SELECT
            game_instance_id, game_id, game_number,
            name, status, selected_by, extras, after
        FROM gog_games WHERE session_id = $1;
    `, [id]);
    const gameResultsRes = await pool.query(`
        SELECT
            game_instance_id, game_id, game_number, gog_games.name, player_id,
            accounts.name, speciality, place, reward, points, stars, coins, rounds
        FROM gog_games JOIN gog_game_players USING (game_instance_id) JOIN accounts USING (player_id)
        WHERE session_id = $1;
    `, [id]);
    const gameResults = gameResultsRes.rows;

    let playerResults = [];
    let games_played = [];
    //gamesRes.rows.forEach(row => {
    for (const row of gamesRes.rows) {
        let results = []
        gameResults
        .filter(r => r.game_instance_id == row.game_instance_id)
        .forEach(p => {
            playerResults.push({
                num: row.game_number,
                game: row.name,
                player_id: p.player_id,
                speciality: p.speciality,
                place: p.place,
                reward: p.reward
            });
            results.push({
                player_id: p.player_id,
                speciality: p.speciality,
                place: p.place,
                reward: p.reward,
                points: p.points,
                stars: p.stars,
                coins: p.coins,
                rounds: p.rounds
            });
        });
        let votes = [];
        if (row.selected_by == 'Vote') {
            const votesRes = await pool.query(`
                SELECT player_id, game_name AS vote
                FROM gog_game_votes
                WHERE game_instance_id = $1;
            `, [row.game_instance_id]);
            votes = votesRes.rows;
        }
        games_played.push({
            id: row.game_id,
            number: row.game_number,
            name: row.name,
            status: row.status,
            selected_by: row.selected_by,
            votes: votes,
            extras: row.extras,
            after: row.after,
            results: results
        });
    }
    //});

    let sessionPlayers = [];
    players.forEach(p => {
        sessionPlayers.push({
            player_id: p.player_id,
            name: displayNames.find(n => n.player_id == p.player_id).name,
            colour: p.colour,
            is_playing: p.is_playing,
            speciality: p.speciality,
            pg_cone: p.pg_cone,
            f20g_cone: p.f20g_cone,
            l_cone: p.l_cone,
            c_cone: p.c_cone,
            w_cone: p.w_cone,
            v_cone: p.v_cone,
            g_point: p.g_point,
            c_point: p.c_point,
            special_w_point: p.special_w_point,
            special_l_point: p.special_l_point,
            neigh: p.neigh,
            super_neigh: p.super_neigh,
            gooc_total: p.gooc_total,
            gooc_used: p.gooc_used,
            games: playerResults.filter(r => r.player_id == p.player_id)
        });
    });
    
    return {
        session: sessionRes.rows[0],
        possible_games: possibleRes.rows.map(r => r.game_name),
        players: sessionPlayers,
        games_played: games_played
    }
}

export async function getSessionResults(id) {
    const session = await getSessionById(id);
    const res = await pool.query(`
        SELECT player_id, place, points, cones
        FROM gog_final_results JOIN accounts USING (player_id)
        WHERE session_id = $1
        ORDER BY place
    `, [id]);
    return {
        session: session.session,
        possible_games: session.possible_games,
        players: session.players,
        games_played: session.games_played,
        final_results: res.rows
    };
}

/*export async function createSession(data) {
  const { players, games, specialty, start_time } = data;
  const res = await pool.query(
    'INSERT INTO gog_sessions (specialty, start_time, status) VALUES ($1, $2, $3) RETURNING id;',
    [specialty, start_time, 'ongoing']
  );
  const sessionId = res.rows[0].id;
  // You should also insert players/games into join tables here
  return sessionId;
}*/

export async function createSession(data) {
    const {
        id, gog_id, start_time, point_system,
        num_speciality, refresh_count, players, games
    } = data;

    console.log(id);
    console.log(gog_id);

    try {
        await pool.query(`
            INSERT INTO gog_sessions (
                session_id, name, status, start_time, finish_time, points_system,
                speciality_count, refresh_count, intruded, abandoned, extra
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
            RETURNING session_id;
        `, [
            id,
            gog_id,
            'active',
            start_time,
            null,
            point_system,
            num_speciality,
            refresh_count,
            [],
            [],
            []
        ]);

        for (const player of players) {
            await pool.query(`
                INSERT INTO gog_players (
                    session_id, player_id, is_playing, speciality, pg_cone, f20g_cone, l_cone,
                    c_cone, w_cone, v_cone, g_point, c_point, special_w_point,
                    special_l_point, neigh, super_neigh, gooc_total, gooc_used
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);
            `, [
                id,
                player.player_id,
                true,
                player.specialities.map(s => s.name),
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 0,
                2, 2, 0, 0
            ]);
        }

        for (const game of games) {
            await pool.query(`
                INSERT INTO gog_possible_games (
                    session_id, game_id, game_name
                )
                VALUES ($1, $2, $3);
            `, [id, game.game_id, game.name]);
        }

        return id;
    } catch (err) {
        console.error('Error creating session:', err);
        throw err;
    }
}

export async function deleteSession(sessionId) {
    try {
        await pool.query(`
            DELETE FROM gog_sessions
            WHERE session_id = $1
        `, [sessionId]);
    } catch (err) {
        console.error('Error deleting session:', err);
        throw err;
    }
}

export async function get420Photo(sessionId) {

}

export async function upload420Photo(sessionId, sessionData) {
    const { image } = sessionData;
    
    if (!image || !image.startsWith('data:image/png;base64,')) {
        throw new Error('Invalid image format');
    }

    const base64Data = image.replace(/^data:image\/png;base64,/, '');
    const filename = `session_${sessionId}.png`;
    const saveDir = path.join(process.cwd(), 'photos');

    if (!fs.existsSync(saveDir)) {
        fs.mkdirSync(saveDir, { recursive: true });
    }

    const filepath = path.join(saveDir, filename);

    try {
        // Save file to disk
        await fs.promises.writeFile(filepath, base64Data, 'base64');

        // Find the 4:20 Game row for this session
        const result = await pool.query(`
            SELECT game_id FROM gog_games
            WHERE session_id = $1 AND name = '4:20 Game'
            ORDER BY game_id DESC LIMIT 1;
        `, [sessionId]);

        if (result.rows.length === 0) {
            throw new Error(`No 4:20 Game found for session ${sessionId}`);
        }

        const gameId = result.rows[0].game_id;

        // Append filename to the 'extras' array
        await pool.query(`
            UPDATE gog_games
            SET extras = 
                CASE 
                    WHEN extras IS NULL THEN ARRAY[$1]::TEXT[]
                    ELSE array_append(extras, $1)
                END
            WHERE session_id = $2 AND game_id = $3;
        `, [filename, sessionId, gameId]);

        return { filename, gameId };
    } catch (err) {
        console.error('Error uploading photo:', err);
        throw err;
    }
}

export async function saveSession(sessionId, sessionData) {
    const { theGame, currentGame, currGameInfo, incomplete } = sessionData;
    //console.log(theGame);
    //console.log(currentGame);
    //console.log(currGameInfo);
    //console.log(incomplete);
    try {
        if (incomplete) {
            await pool.query(`
                UPDATE gog_sessions
                SET status = 'incomplete'
                WHERE session_id = $1
            `, [sessionId]);
        }
        await pool.query(`
            UPDATE gog_sessions
            SET refresh_count = $1
            WHERE session_id = $2
        `, [
            theGame.refresh_count,
            sessionId
        ])
        
        for (const p of theGame.players) {
            await pool.query(`
                UPDATE gog_players
                SET is_playing = $3, pg_cone = $4, f20g_cone = $5, l_cone = $6, c_cone = $7, w_cone = $8, v_cone = $9,
                g_point = $10, c_point = $11, special_w_point = $12, special_l_point = $13,
                neigh = $14, super_neigh = $15, gooc_total = $16, gooc_used = $17
                WHERE session_id = $1 AND player_id = $2
            `, [
                sessionId,
                p.player_id,
                p.is_playing,
                p.pg_cone,
                p.f20g_cone,
                p.l_cone,
                p.c_cone,
                p.w_cone,
                p.v_cone,
                p.g_point,
                p.c_point,
                p.special_w_point,
                p.special_l_point,
                p.neigh,
                p.super_neigh,
                p.gooc_total,
                p.gooc_used
            ]);
        }

        if (currentGame) {
            const gameRes = await pool.query(`
                INSERT INTO gog_games (session_id, game_id, game_number, name, status, selected_by, extras, after)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING game_instance_id
            `, [
                sessionId, 
                currGameInfo.game_id,
                currentGame.game_id.split('_')[1],
                currentGame.name,
                'complete',
                currentGame.selected_by,
                currentGame.extras,
                currentGame.after
            ]);
            const gameId = gameRes.rows[0].game_instance_id;

            for (const v of currentGame.votes) {
                await pool.query(`
                    INSERT INTO gog_game_votes (
                        game_instance_id, player_id, game_name
                    )
                    VALUES ($1, $2, $3)
                `, [
                    gameId,
                    v.player_id,
                    v.vote
                ]);
            }

            for (const p of currentGame.results) {
                const player = theGame.players.find(pI => pI.player_id == p.player_id);
                await pool.query(`
                    INSERT INTO gog_game_players (
                        game_instance_id, player_id, place, reward,
                        points, stars, coins, rounds, speciality
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                `, [
                    gameId,
                    player.player_id,
                    p.place,
                    p.reward,
                    p.points ?? null,
                    p.stars ?? null,
                    p.coins ?? null,
                    p.rounds ?? null,
                    player.speciality.includes(currentGame.name)
                ]);
            }
        }

        return { success: true };
    } catch (err) {
        console.error('Error in saveSession:', err);
        throw err;
    }
}

export async function completeSession(id, data) {
    const { theGame, finalResults } = data;
    
    await pool.query(`
        UPDATE gog_sessions
        SET status = 'complete', finish_time = $2
        WHERE session_id = $1;
    `, [id, theGame.finish_time]);
    
    for (let i = 0; i < finalResults.length; i++) {
        const curr = finalResults[i];
        await pool.query(`
            INSERT INTO gog_final_results
                (session_id, player_id, place, points, cones)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            id,
            curr.player_id,
            curr.place,
            curr.points,
            curr.cones
        ]);
    }
    return true;
}

export async function intrudeSession(sessionId, data) {
    const { currSystem, intruding, add, del, gameNumber } = data;

    if (!currSystem || !intruding || !add || !del || !gameNumber) return false;

    for (const p of intruding) {
        await pool.query(`
            INSERT INTO gog_players(
                session_id, player_id, is_playing, speciality, pg_cone, f20g_cone, l_cone,
                c_cone, w_cone, v_cone, g_point, c_point, special_w_point,
                special_l_point, neigh, super_neigh, gooc_total, gooc_used
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18);
        `, [
            sessionId, p.player_id, true, p.games.map(g => g.name) || [],
            currSystem == 'Points & Cones' ? 1 : 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 2, 2, 0, 0
        ]);
    
        await pool.query(`
            UPDATE gog_games
            SET after = array_append(after, $3)
            WHERE session_id = $1 AND game_number = $2;
        `, [
            sessionId, gameNumber - 1,
            `${p.name} INTRUDED the Game`
        ]);
    
        await pool.query(`
            UPDATE gog_sessions
            SET intruded = array_append(intruded, $2)
            WHERE session_id = $1;
        `, [
            sessionId, p.player_id
        ]);

    }

    for (const g of add) {
        await pool.query(`
            INSERT INTO gog_possible_games(
                session_id, game_id, game_name
            )
            VALUES ($1, $2, $3);
        `, [
            sessionId, g.game_id, g.name
        ]);
    }

    for (const g of del) {
        await pool.query(`
            DELETE FROM gog_possible_games
            WHERE session_id = $1 AND game_id = $2;
        `, [
            sessionId, g.game_id
        ]);
    }
    
    return true;
}

export async function abandonSession(sessionId, data) {
    const { currSystem, abandoning, add, del, gameNumber } = data;

    if (!currSystem || !abandoning || !add || !del || !gameNumber) return false;

    for (const p of abandoning) {
        await pool.query(`
            UPDATE gog_players
            SET is_playing = $3
            WHERE session_id = $1 AND player_id = $2;
        `, [
            sessionId, p.player_id, false
        ]);
        
        await pool.query(`
            UPDATE gog_games
            SET after = array_append(after, $3)
            WHERE session_id = $1 AND game_number = $2;
        `, [
            sessionId, gameNumber - 1,
            `${p.name} ABANDONED the Game`
        ]);
    
        await pool.query(`
            UPDATE gog_sessions
            SET abandoned = array_append(abandoned, $2)
            WHERE session_id = $1;
        `, [
            sessionId, p.player_id
        ]);
    }

    for (const g of add) {
        await pool.query(`
            INSERT INTO gog_possible_games(
                session_id, game_id, game_name
            )
            VALUES ($1, $2, $3);
        `, [
            sessionId, g.game_id, g.name
        ]);
    }

    for (const g of del) {
        await pool.query(`
            DELETE FROM gog_possible_games
            WHERE session_id = $1 AND game_id = $2;
        `, [
            sessionId, g.game_id
        ]);
    }
    
    return true;
}

export async function breakCone(sessionId, data) {
    const { game, players } = data;

    if (!game || !players) return false;

    for (const p of players) {
        await pool.query(`
            UPDATE gog_players
            SET pg_cone = $3
            WHERE session_id = $1 AND player_id = $2;
        `, [
            sessionId, p.player_id, p.pg_cone
        ]);

        await pool.query(`
            UPDATE gog_games
            SET after = array_append(after, $3)
            WHERE session_id = $1 AND game_number = $2;
        `, [
            sessionId, game.number,
            `${p.name} had a BREAK cone`
        ]);
    }

    return true;
}

export async function victoryCone(sessionId, data) {
    const { game, players } = data;

    if (!game || !players) return false;

    for (const p of players) {
        await pool.query(`
            UPDATE gog_players
            SET v_cone = $3
            WHERE session_id = $1 AND player_id = $2;
        `, [
            sessionId, p.player_id, p.v_cone
        ]);

        await pool.query(`
            UPDATE gog_games
            SET after = array_append(after, $3)
            WHERE session_id = $1 AND game_number = $2;
        `, [
            sessionId, game.number,
            `${p.name} had a VICTORY cone`
        ]);
    }

    return true;
}


// --- Stats ---
export async function getPlayerStats() {
    let playerStats = [];
    const playersRes = await pool.query('SELECT * FROM accounts ORDER BY name, family');
    const players = playersRes.rows;
    const displayNames = getDisplayNames(players);
    for (const p of players) {
        const played = await pool.query(`
            SELECT COUNT(*) AS num
            FROM gog_players WHERE player_id = $1;
        `, [p.player_id]);
        const win_perc = await pool.query(`
            SELECT    
                ROUND(100.0 * COUNT(*) FILTER (WHERE gfr.place = 1) / NULLIF(COUNT(*), 0), 2) AS win_perc
            FROM gog_final_results gfr WHERE player_id = $1;
        `, [p.player_id]);
        const places = await pool.query(`
            SELECT place AS num, COUNT(*) AS total
            FROM gog_final_results WHERE player_id = $1
            GROUP BY place ORDER BY place;
        `, [p.player_id]);
        const cones = await pool.query(`
            WITH pg_cone_max AS (
                SELECT MAX(pg_cone) AS highest
                FROM gog_players WHERE player_id = $1
            ), pg_cone_sessions AS (
                SELECT session_id FROM gog_players, pg_cone_max
                WHERE player_id = $1 AND pg_cone = pg_cone_max.highest
            ), f20g_cone_max AS (
                SELECT MAX(f20g_cone) AS highest
                FROM gog_players WHERE player_id = $1
            ), f20g_cone_sessions AS (
                SELECT session_id FROM gog_players, f20g_cone_max
                WHERE player_id = $1 AND f20g_cone = f20g_cone_max.highest
            ), l_cone_max AS (
                SELECT MAX(l_cone) AS highest
                FROM gog_players WHERE player_id = $1
            ), l_cone_sessions AS (
                SELECT session_id FROM gog_players, l_cone_max
                WHERE player_id = $1 AND l_cone = l_cone_max.highest
            ), c_cone_max AS (
                SELECT MAX(c_cone) AS highest
                FROM gog_players WHERE player_id = $1
            ), c_cone_sessions AS (
                SELECT session_id FROM gog_players, c_cone_max
                WHERE player_id = $1 AND c_cone = c_cone_max.highest
            ), w_cone_max AS (
                SELECT MAX(w_cone) AS highest
                FROM gog_players WHERE player_id = $1
            ), w_cone_sessions AS (
                SELECT session_id FROM gog_players, w_cone_max
                WHERE player_id = $1 AND w_cone = w_cone_max.highest
            ), v_cone_max AS (
                SELECT MAX(v_cone) AS highest
                FROM gog_players WHERE player_id = $1
            ), v_cone_sessions AS (
                SELECT session_id FROM gog_players, v_cone_max
                WHERE player_id = $1 AND v_cone = v_cone_max.highest
            )
            
            SELECT
                'overall_cone' AS type,
                SUM(pg_cone + f20g_cone + l_cone + c_cone + w_cone + v_cone) AS total,
                ROUND(AVG(pg_cone + f20g_cone + l_cone + c_cone + w_cone + v_cone), 2) AS avg,
                MAX(pg_cone + f20g_cone + l_cone + c_cone + w_cone + v_cone) AS highest,
                STRING_AGG(session_id::text, ', ')
                    FILTER (
                        WHERE (pg_cone + f20g_cone + l_cone + c_cone + w_cone + v_cone) =
                            (SELECT MAX(pg_cone + f20g_cone + l_cone + c_cone + w_cone + v_cone)
                            FROM gog_players WHERE player_id = $1)
                    ) AS highest_session
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'pg_cone',
                SUM(pg_cone),
                ROUND(AVG(pg_cone), 2),
                (SELECT highest FROM pg_cone_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM pg_cone_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'f20g_cone',
                SUM(f20g_cone),
                ROUND(AVG(f20g_cone), 2),
                (SELECT highest FROM f20g_cone_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM f20g_cone_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'l_cone',
                SUM(l_cone),
                ROUND(AVG(l_cone), 2),
                (SELECT highest FROM l_cone_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM l_cone_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'c_cone',
                SUM(c_cone),
                ROUND(AVG(c_cone), 2),
                (SELECT highest FROM c_cone_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM c_cone_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'w_cone',
                SUM(w_cone),
                ROUND(AVG(w_cone), 2),
                (SELECT highest FROM w_cone_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM w_cone_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'v_cone',
                SUM(v_cone),
                ROUND(AVG(v_cone), 2),
                (SELECT highest FROM v_cone_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM v_cone_sessions)
            FROM gog_players WHERE player_id = $1;

        `, [p.player_id]);
        const points = await pool.query(`
            WITH g_point_max AS (
                SELECT MAX(g_point) AS highest
                FROM gog_players WHERE player_id = $1
            ), g_point_sessions AS (
                SELECT session_id FROM gog_players, g_point_max
                WHERE player_id = $1 AND g_point = g_point_max.highest
            ), c_point_max AS (
                SELECT MAX(c_point) AS highest
                FROM gog_players WHERE player_id = $1
            ), c_point_sessions AS (
                SELECT session_id FROM gog_players, c_point_max
                WHERE player_id = $1 AND c_point = c_point_max.highest
            ), special_w_point_max AS (
                SELECT MAX(special_w_point) AS highest
                FROM gog_players WHERE player_id = $1
            ), special_w_point_sessions AS (
                SELECT session_id FROM gog_players, special_w_point_max
                WHERE player_id = $1 AND special_w_point = special_w_point_max.highest
            ), special_l_point_max AS (
                SELECT MAX(-special_l_point) AS highest
                FROM gog_players WHERE player_id = $1
            ), special_l_point_sessions AS (
                SELECT session_id FROM gog_players, special_l_point_max
                WHERE player_id = $1 AND -special_l_point = special_l_point_max.highest
            )

            SELECT
                'overall_point' AS type,
                SUM(g_point + c_point + special_w_point + special_l_point) AS total,
                ROUND(AVG(g_point + c_point + special_w_point + special_l_point), 2) AS avg,
                MAX(g_point + c_point + special_w_point + special_l_point) AS highest,
                STRING_AGG(session_id::text, ', ')
                    FILTER (
                        WHERE (g_point + c_point + special_w_point + special_l_point) =
                            (SELECT MAX(g_point + c_point + special_w_point + special_l_point)
                            FROM gog_players WHERE player_id = $1)
                    ) AS highest_session
            FROM gog_players
            WHERE player_id = $1

            UNION ALL
            
            SELECT
                'g_point',
                SUM(g_point),
                ROUND(AVG(g_point), 2),
                (SELECT highest FROM g_point_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM g_point_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'c_point',
                SUM(c_point),
                ROUND(AVG(c_point), 2),
                (SELECT highest FROM c_point_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM c_point_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'special_w_point',
                SUM(special_w_point),
                ROUND(AVG(special_w_point), 2),
                (SELECT highest FROM special_w_point_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM special_w_point_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'special_l_point',
                SUM(special_l_point),
                ROUND(AVG(special_l_point), 2),
                (SELECT -highest FROM special_l_point_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM special_l_point_sessions)
            FROM gog_players WHERE player_id = $1;

        `, [p.player_id]);
        const cards = await pool.query(`
            WITH neigh_max AS (
                SELECT MAX(2 - neigh) AS highest
                FROM gog_players WHERE player_id = $1
            ), neigh_sessions AS (
                SELECT session_id FROM gog_players, neigh_max
                WHERE player_id = $1 AND (2 - neigh) = neigh_max.highest
            ), super_neigh_max AS (
                SELECT MAX(2 - super_neigh) AS highest
                FROM gog_players WHERE player_id = $1
            ), super_neigh_sessions AS (
                SELECT session_id FROM gog_players, super_neigh_max
                WHERE player_id = $1 AND (2 - super_neigh) = super_neigh_max.highest
            ), gooc_total_max AS (
                SELECT MAX(gooc_total) AS highest
                FROM gog_players WHERE player_id = $1
            ), gooc_total_sessions AS (
                SELECT session_id FROM gog_players, gooc_total_max
                WHERE player_id = $1 AND gooc_total = gooc_total_max.highest
            ), gooc_used_max AS (
                SELECT MAX(gooc_used) AS highest
                FROM gog_players WHERE player_id = $1
            ), gooc_used_sessions AS (
                SELECT session_id FROM gog_players, gooc_used_max
                WHERE player_id = $1 AND gooc_used = gooc_used_max.highest
            )

            SELECT
                'neigh' AS type,
                SUM(2 - neigh) AS total,
                ROUND(AVG(2 - neigh), 2) AS avg,
                (SELECT highest FROM neigh_max) AS highest,
                (SELECT STRING_AGG(session_id::text, ', ') FROM neigh_sessions) AS highest_session
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'super_neigh' AS type,
                SUM(2 - super_neigh) AS total,
                ROUND(AVG(2 - super_neigh), 2) AS avg,
                (SELECT highest FROM super_neigh_max) AS highest,
                (SELECT STRING_AGG(session_id::text, ', ') FROM super_neigh_sessions) AS highest_session
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'gooc_total',
                SUM(gooc_total),
                ROUND(AVG(gooc_total), 2),
                (SELECT highest FROM gooc_total_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM gooc_total_sessions)
            FROM gog_players WHERE player_id = $1

            UNION ALL

            SELECT
                'gooc_used',
                SUM(gooc_used),
                ROUND(AVG(gooc_used), 2),
                (SELECT highest FROM gooc_used_max),
                (SELECT STRING_AGG(session_id::text, ', ') FROM gooc_used_sessions)
            FROM gog_players WHERE player_id = $1;

        `, [p.player_id]);
        const intruded = await pool.query(`
            SELECT COUNT(*) AS intruded FROM gog_sessions WHERE $1 = ANY(intruded);
        `, [p.player_id]);
        const abandoned = await pool.query(`
            SELECT COUNT(*) AS abandoned FROM gog_sessions WHERE $1 = ANY(abandoned);
        `, [p.player_id]);
        const game_places = await pool.query(`
            SELECT place AS num, COUNT(*) AS total
            FROM gog_game_players WHERE player_id = $1
            GROUP BY place ORDER BY place;
        `, [p.player_id]);
        const games = await pool.query(`
            WITH player_specialities AS (
                SELECT UNNEST(speciality) AS game_name
                FROM gog_players WHERE player_id = $1
                ORDER BY game_name
            ), speciality_count AS (
                SELECT
                    gi.name AS game_name,
                    COUNT(*) AS count
                FROM games_info gi
                JOIN player_specialities ps ON gi.name = ps.game_name
                GROUP BY gi.name
            ), game_stats AS (
                SELECT
                    gi.name AS game_name,
                    COUNT(*) AS played,
                    COUNT(*) FILTER (WHERE ggp.place = 1) AS won,
                    COUNT(*) FILTER (WHERE ggp.place <> 1) AS lost,
                    ROUND(100.0 * COUNT(*) FILTER (WHERE ggp.place = 1) / NULLIF(COUNT(*), 0), 2) AS win_perc,
                    COUNT(*) FILTER (WHERE ggp.speciality IS TRUE AND ggp.place = 1) AS speciality_won,
                    COUNT(*) FILTER (WHERE ggp.speciality IS TRUE AND ggp.place <> 1) AS speciality_lost
                FROM gog_game_players ggp
                JOIN gog_games gg USING (game_instance_id)
                JOIN games_info gi USING (game_id)
                WHERE ggp.player_id = $1
                GROUP BY gi.name
            ), neigh_stats AS (
                SELECT
                    gi.name AS game_name,
                    COUNT(*) FILTER (WHERE ggn.type = 'Neigh') AS neighed,
                    COUNT(*) FILTER (WHERE ggn.type = 'Super Neigh') AS super_neighed
                FROM gog_games_neighed ggn
                JOIN games_info gi USING (game_id)
                WHERE ggn.player_id = $1
                GROUP BY gi.name
            ), vote_stats AS (
                SELECT
                    ggv.game_name,
                    COUNT(*) AS vote_chosen,
                    COUNT(*) FILTER (
                        WHERE ggv.game_name IS NOT NULL AND ggv.game_name <> '' AND gi.name = ggv.game_name
                    ) AS vote_won,
                    COUNT(*) FILTER (
                        WHERE ggv.game_name IS NOT NULL AND ggv.game_name <> '' AND gi.name <> ggv.game_name
                    ) AS vote_lost
                FROM gog_game_votes ggv
                JOIN gog_games gg USING (game_instance_id)
                JOIN games_info gi USING (game_id)
                WHERE ggv.player_id = $1
                GROUP BY ggv.game_name
            ), combined_stats AS (
                SELECT
                    COALESCE(gs.game_name, sc.game_name, ns.game_name, vs.game_name) AS game_name,
                    COALESCE(gs.played, 0) AS played,
                    COALESCE(gs.won, 0) AS won,
                    COALESCE(gs.lost, 0) AS lost,
                    COALESCE(gs.win_perc, 0) AS win_perc,
                    COALESCE(ns.neighed, 0) AS neighed,
                    COALESCE(ns.super_neighed, 0) AS super_neighed,
                    COALESCE(sc.count, 0) AS speciality_chosen,
                    COALESCE(gs.speciality_won, 0) AS speciality_won,
                    COALESCE(gs.speciality_lost, 0) AS speciality_lost,
                    COALESCE(vs.vote_chosen, 0) AS vote_chosen,
                    COALESCE(vs.vote_won, 0) AS vote_won,
                    COALESCE(vs.vote_lost, 0) AS vote_lost
                FROM game_stats gs
                FULL OUTER JOIN speciality_count sc USING (game_name)
                FULL OUTER JOIN neigh_stats ns USING (game_name)
                FULL OUTER JOIN vote_stats vs USING (game_name)
            ), total_stats AS (
                SELECT
                    '__total__' AS game_name,
                    SUM(played) AS played,
                    SUM(won) AS won,
                    SUM(lost) AS lost,
                    ROUND(100.0 * SUM(won) / NULLIF(SUM(played), 0), 2) AS win_perc,
                    SUM(neighed) AS neighed,
                    SUM(super_neighed) AS super_neighed,
                    SUM(speciality_chosen) AS speciality_chosen,
                    SUM(speciality_won) AS speciality_won,
                    SUM(speciality_lost) AS speciality_lost,
                    SUM(vote_chosen) AS vote_chosen,
                    SUM(vote_won) AS vote_won,
                    SUM(vote_lost) AS vote_lost
                FROM combined_stats
            )

            SELECT
                gi.name AS game_name,
                COALESCE(cs.played, 0) AS played,
                COALESCE(cs.won, 0) AS won,
                COALESCE(cs.lost, 0) AS lost,
                COALESCE(cs.win_perc, 0) AS win_perc,
                COALESCE(cs.neighed, 0) AS neighed,
                COALESCE(cs.super_neighed, 0) AS super_neighed,
                COALESCE(cs.speciality_chosen, 0) AS speciality_chosen,
                COALESCE(cs.speciality_won, 0) AS speciality_won,
                COALESCE(cs.speciality_lost, 0) AS speciality_lost,
                COALESCE(cs.vote_chosen, 0) AS vote_chosen,
                COALESCE(cs.vote_won, 0) AS vote_won,
                COALESCE(cs.vote_lost, 0) AS vote_lost
            FROM games_info gi
            LEFT JOIN combined_stats cs ON gi.name = cs.game_name

            UNION ALL

            SELECT
                game_name,
                played,
                won,
                lost,
                win_perc,
                neighed,
                super_neighed,
                speciality_chosen,
                speciality_won,
                speciality_lost,
                vote_chosen,
                vote_won,
                vote_lost
            FROM total_stats

            ORDER BY game_name;
        `, [p.player_id]);

        playerStats.push({
            id: p.player_id,
            name: displayNames.find(d => d.player_id == p.player_id).name,
            colour: p.colour,
            played: played.rows[0].num,
            win_perc: win_perc.rows[0].win_perc,
            places: places.rows,
            intruded: parseInt(intruded.rows[0].intruded),
            abandoned: parseInt(abandoned.rows[0].abandoned),
            points: points.rows,
            cones: cones.rows,
            cards: cards.rows,
            game_places: game_places.rows,
            games: games.rows
        });
    }
    return playerStats;
}

export async function getGameStats() {
    let gameStats = [];
    const games = await pool.query('SELECT * FROM games_info ORDER BY name;');
    for (const g of games.rows) {
        const overall = await pool.query(`
            SELECT
                COALESCE((SELECT COUNT(*) FROM gog_games WHERE game_id = $1), 0) AS played,
                COALESCE(ROUND(
                    (SELECT COUNT(DISTINCT session_id)::numeric FROM gog_games WHERE game_id = $1)
                    /
                    NULLIF((SELECT COUNT(*) FROM gog_sessions)::numeric, 0),
                    4
                ), 0) AS chance,
                COALESCE((SELECT COUNT(*) FROM gog_games_neighed WHERE game_id = $1 AND type = 'Neigh'), 0) AS neighed,
                COALESCE((SELECT COUNT(*) FROM gog_games_neighed WHERE game_id = $1 AND type = 'Super Neigh'), 0) AS super_neighed,
                COALESCE((SELECT COUNT(*) FROM gog_games WHERE game_id = $1 AND selected_by = 'Vote'), 0) AS selected_vote,
                COALESCE((SELECT COUNT(*) FROM gog_games WHERE game_id = $1 AND selected_by = 'Choose'), 0) AS selected_choose,
                COALESCE((SELECT COUNT(*) FROM gog_games WHERE game_id = $1 AND selected_by = 'Wheel'), 0) AS selected_wheel;
        `, [g.game_id]);
        const players = await pool.query(`
            WITH game_stats AS (
                SELECT
                    ggp.player_id,
                    COUNT(*) AS played,
                    COUNT(*) FILTER (WHERE ggp.place = 1) AS won,
                    COUNT(*) FILTER (WHERE ggp.place <> 1) AS lost,
                    ROUND(100.0 * COUNT(*) FILTER (WHERE ggp.place = 1) / NULLIF(COUNT(*), 0), 2) AS win_perc,
                    COUNT(*) FILTER (WHERE ggp.speciality IS TRUE AND ggp.place = 1) AS speciality_won,
                    COUNT(*) FILTER (WHERE ggp.speciality IS TRUE AND ggp.place <> 1) AS speciality_lost
                FROM gog_game_players ggp
                JOIN gog_games gg USING (game_instance_id)
                WHERE gg.game_id = $1
                GROUP BY ggp.player_id
            ), neigh_stats AS (
                SELECT
                    ggn.player_id,
                    COUNT(*) FILTER (WHERE ggn.type = 'Neigh') AS neighed,
                    COUNT(*) FILTER (WHERE ggn.type = 'Super Neigh') AS super_neighed
                FROM gog_games_neighed ggn
                WHERE ggn.game_id = $1
                GROUP BY ggn.player_id
            ), vote_stats AS (
                SELECT
                    ggv.player_id,
                    COUNT(*) AS vote_chosen,
                    COUNT(*) FILTER (
                        WHERE gi.game_id = $1
                        AND ggv.game_name IS NOT NULL
                        AND ggv.game_name <> ''
                    ) AS vote_won,
                    COUNT(*) FILTER (
                        WHERE gi.game_id <> $1
                        AND ggv.game_name IS NOT NULL
                        AND ggv.game_name <> ''
                    ) AS vote_lost
                FROM gog_game_votes ggv
                JOIN gog_games gg USING (game_instance_id)
                JOIN games_info gi USING (game_id)
                WHERE ggv.game_name = (
                    SELECT name FROM games_info WHERE game_id = $1
                )
                GROUP BY ggv.player_id
            ), speciality_count AS (
                SELECT
                    gp.player_id,
                    COUNT(*) AS speciality_chosen
                FROM gog_players gp
                JOIN games_info gi ON gi.name = ANY(gp.speciality)
                WHERE gi.game_id = $1
                GROUP BY gp.player_id
            )

            SELECT
                p.player_id,
                p.name,
                p.family,
                COALESCE(gs.played, 0) AS played,
                COALESCE(gs.won, 0) AS won,
                COALESCE(gs.lost, 0) AS lost,
                COALESCE(gs.win_perc, 0) AS win_perc,
                COALESCE(ns.neighed, 0) AS neighed,
                COALESCE(ns.super_neighed, 0) AS super_neighed,
                COALESCE(sc.speciality_chosen, 0) AS speciality_chosen,
                COALESCE(gs.speciality_won, 0) AS speciality_won,
                COALESCE(gs.speciality_lost, 0) AS speciality_lost,
                COALESCE(vs.vote_chosen, 0) AS vote_chosen,
                COALESCE(vs.vote_won, 0) AS vote_won,
                COALESCE(vs.vote_lost, 0) AS vote_lost
            FROM accounts p
            LEFT JOIN game_stats gs ON p.player_id = gs.player_id
            LEFT JOIN neigh_stats ns ON p.player_id = ns.player_id
            LEFT JOIN speciality_count sc ON p.player_id = sc.player_id
            LEFT JOIN vote_stats vs ON p.player_id = vs.player_id
            ORDER BY p.name;
        `, [g.game_id]);

        gameStats.push({
            id: g.game_id,
            name: g.name,
            played: parseInt(overall.rows[0].played),
            chance: parseFloat(overall.rows[0].chance),
            neighed: parseInt(overall.rows[0].neighed),
            super_neighed: parseInt(overall.rows[0].super_neighed),
            selected_vote: parseInt(overall.rows[0].selected_vote),
            selected_choose: parseInt(overall.rows[0].selected_choose),
            selected_wheel: parseInt(overall.rows[0].selected_wheel),
            players: players.rows
        });
    }
    return gameStats;
}

export async function getTotalStats() {
    const total = await pool.query('SELECT COUNT(*) AS total FROM gog_sessions;');
    const total_players = await pool.query(`
        WITH player_counts AS (
            SELECT session_id, COUNT(*) AS num_players
            FROM gog_players
            GROUP BY session_id
        ),
        max_players AS (
            SELECT MAX(num_players) AS max_num_players
            FROM player_counts
        ),
        sessions_with_max_players AS (
            SELECT pc.session_id
            FROM player_counts pc
            JOIN max_players mp ON pc.num_players = mp.max_num_players
        )

        SELECT
            (SELECT SUM(num_players) FROM player_counts) AS total_players,
            (SELECT ROUND(AVG(num_players), 2) FROM player_counts) AS avg_players,
            (SELECT max_num_players FROM max_players) AS max_players,
            ARRAY(
                SELECT session_id FROM sessions_with_max_players ORDER BY session_id
            ) AS max_players_sessions;
    `);
    const total_games = await pool.query(`
        WITH game_counts AS (
            SELECT session_id, COUNT(*) AS num_games
            FROM gog_games
            GROUP BY session_id
        ), max_games AS (
            SELECT MAX(num_games) AS max_num_games
            FROM game_counts
        ), sessions_with_max_games AS (
            SELECT gc.session_id
            FROM game_counts gc
            JOIN max_games mg ON gc.num_games = mg.max_num_games
        ), game_selected_by AS (
            SELECT
                selected_by,
                COUNT(*) AS num
            FROM gog_games
            GROUP BY selected_by
        )

        SELECT
            (SELECT SUM(num_games) FROM game_counts) AS total_games,
            (SELECT ROUND(AVG(num_games), 2) FROM game_counts) AS avg_games,
            (SELECT max_num_games FROM max_games) AS max_games,
            ARRAY(
                SELECT session_id FROM sessions_with_max_games ORDER BY session_id
            ) AS max_games_sessions,
            (SELECT num FROM game_selected_by WHERE selected_by = 'Vote') AS total_vote,
            (SELECT num FROM game_selected_by WHERE selected_by = 'Choose') AS total_choose,
            (SELECT num FROM game_selected_by WHERE selected_by = 'Wheel') AS total_wheel;
    `);
    const players = await pool.query(`
        SELECT
            p.player_id AS player_id,
            p.name AS name,
            p.family AS family,
            COUNT(*) FILTER (WHERE gfr.place = 1) AS wins
        FROM accounts p
        LEFT JOIN gog_final_results gfr USING (player_id)
        GROUP BY p.player_id, p.name, p.family
        ORDER BY wins DESC, p.name;
    `);
    const points = await pool.query(`
        WITH session_totals AS (
            SELECT
                session_id,
                SUM(g_point) AS g_point,
                SUM(c_point) AS c_point,
                SUM(special_w_point) AS special_w_point,
                SUM(special_l_point) AS special_l_point,
                SUM(g_point + c_point + special_w_point + special_l_point) AS overall_point
            FROM gog_players
            GROUP BY session_id
        ),
        overall_point_max AS (
            SELECT MAX(overall_point) AS highest FROM session_totals
        ),
        g_point_max AS (
            SELECT MAX(g_point) AS highest FROM session_totals
        ),
        c_point_max AS (
            SELECT MAX(c_point) AS highest FROM session_totals
        ),
        special_w_point_max AS (
            SELECT MAX(special_w_point) AS highest FROM session_totals
        ),
        special_l_point_max AS (
            SELECT MAX(-special_l_point) AS highest FROM session_totals
        )

        SELECT
            'overall_point' AS type,
            SUM(overall_point) AS total,
            ROUND(AVG(overall_point), 2) AS avg,
            (SELECT highest FROM overall_point_max) AS highest,
            STRING_AGG(session_id::text, ', ')
                FILTER (WHERE overall_point = (SELECT highest FROM overall_point_max)) AS highest_session
        FROM session_totals

        UNION ALL

        SELECT
            'g_point',
            SUM(g_point),
            ROUND(AVG(g_point), 2),
            (SELECT highest FROM g_point_max),
            (SELECT STRING_AGG(session_id::text, ', ') FROM session_totals WHERE g_point = (SELECT highest FROM g_point_max))
        FROM session_totals

        UNION ALL

        SELECT
            'c_point',
            SUM(c_point),
            ROUND(AVG(c_point), 2),
            (SELECT highest FROM c_point_max),
            (SELECT STRING_AGG(session_id::text, ', ') FROM session_totals WHERE c_point = (SELECT highest FROM c_point_max))
        FROM session_totals

        UNION ALL

        SELECT
            'special_w_point',
            SUM(special_w_point),
            ROUND(AVG(special_w_point), 2),
            (SELECT highest FROM special_w_point_max),
            (SELECT STRING_AGG(session_id::text, ', ') FROM session_totals WHERE special_w_point = (SELECT highest FROM special_w_point_max))
        FROM session_totals

        UNION ALL

        SELECT
            'special_l_point',
            SUM(special_l_point),
            ROUND(AVG(special_l_point), 2),
            (SELECT -highest FROM special_l_point_max),
            (SELECT STRING_AGG(session_id::text, ', ') FROM session_totals WHERE -special_l_point = (SELECT highest FROM special_l_point_max))
        FROM session_totals;
    `);
    const cones = await pool.query(`
        WITH session_totals AS (
            SELECT
                session_id,
                SUM(pg_cone) AS pg_cone,
                SUM(f20g_cone) AS f20g_cone,
                SUM(l_cone) AS l_cone,
                SUM(c_cone) AS c_cone,
                SUM(w_cone) AS w_cone,
                SUM(v_cone) AS v_cone,
                SUM(pg_cone + f20g_cone + l_cone + c_cone + w_cone + v_cone) AS overall_cone
            FROM gog_players
            GROUP BY session_id
        ),
        overall_cone_max AS (
            SELECT MAX(overall_cone) AS highest FROM session_totals
        ),
        pg_cone_max AS (
            SELECT MAX(pg_cone) AS highest FROM session_totals
        ),
        f20g_cone_max AS (
            SELECT MAX(f20g_cone) AS highest FROM session_totals
        ),
        l_cone_max AS (
            SELECT MAX(l_cone) AS highest FROM session_totals
        ),
        c_cone_max AS (
            SELECT MAX(c_cone) AS highest FROM session_totals
        ),
        w_cone_max AS (
            SELECT MAX(w_cone) AS highest FROM session_totals
        ),
        v_cone_max AS (
            SELECT MAX(v_cone) AS highest FROM session_totals
        )

        SELECT
            'overall_cone' AS type,
            SUM(overall_cone) AS total,
            ROUND(AVG(overall_cone), 2) AS avg,
            (SELECT highest FROM overall_cone_max) AS highest,
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE overall_cone = (SELECT highest FROM overall_cone_max)
                    ORDER BY session_id
                ) sub
            ) AS highest_session
        FROM session_totals

        UNION ALL

        SELECT
            'pg_cone',
            SUM(pg_cone),
            ROUND(AVG(pg_cone), 2),
            (SELECT highest FROM pg_cone_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE pg_cone = (SELECT highest FROM pg_cone_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals

        UNION ALL

        SELECT
            'f20g_cone',
            SUM(f20g_cone),
            ROUND(AVG(f20g_cone), 2),
            (SELECT highest FROM f20g_cone_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE f20g_cone = (SELECT highest FROM f20g_cone_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals

        UNION ALL

        SELECT
            'l_cone',
            SUM(l_cone),
            ROUND(AVG(l_cone), 2),
            (SELECT highest FROM l_cone_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE l_cone = (SELECT highest FROM l_cone_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals

        UNION ALL

        SELECT
            'c_cone',
            SUM(c_cone),
            ROUND(AVG(c_cone), 2),
            (SELECT highest FROM c_cone_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE c_cone = (SELECT highest FROM c_cone_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals

        UNION ALL

        SELECT
            'w_cone',
            SUM(w_cone),
            ROUND(AVG(w_cone), 2),
            (SELECT highest FROM w_cone_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE w_cone = (SELECT highest FROM w_cone_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals

        UNION ALL

        SELECT
            'v_cone',
            SUM(v_cone),
            ROUND(AVG(v_cone), 2),
            (SELECT highest FROM v_cone_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE v_cone = (SELECT highest FROM v_cone_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals;
    `);
    const cards = await pool.query(`
        WITH session_totals AS (
            SELECT
                session_id,
                SUM(2 - neigh) AS neigh,
                SUM(2 - super_neigh) AS super_neigh,
                SUM(gooc_total) AS gooc_total,
                SUM(gooc_used) AS gooc_used
            FROM gog_players
            GROUP BY session_id
        ),
        neigh_max AS (
            SELECT MAX(neigh) AS highest FROM session_totals
        ),
        super_neigh_max AS (
            SELECT MAX(super_neigh) AS highest FROM session_totals
        ),
        gooc_total_max AS (
            SELECT MAX(gooc_total) AS highest FROM session_totals
        ),
        gooc_used_max AS (
            SELECT MAX(gooc_used) AS highest FROM session_totals
        )

        SELECT
            'neigh' AS type,
            SUM(neigh) AS total,
            ROUND(AVG(neigh), 2) AS avg,
            (SELECT highest FROM neigh_max) AS highest,
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE neigh = (SELECT highest FROM neigh_max)
                    ORDER BY session_id
                ) sub
            ) AS highest_session
        FROM session_totals

        UNION ALL

        SELECT
            'super_neigh',
            SUM(super_neigh),
            ROUND(AVG(super_neigh), 2),
            (SELECT highest FROM super_neigh_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE super_neigh = (SELECT highest FROM super_neigh_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals

        UNION ALL

        SELECT
            'gooc_total',
            SUM(gooc_total),
            ROUND(AVG(gooc_total), 2),
            (SELECT highest FROM gooc_total_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE gooc_total = (SELECT highest FROM gooc_total_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals

        UNION ALL

        SELECT
            'gooc_used',
            SUM(gooc_used),
            ROUND(AVG(gooc_used), 2),
            (SELECT highest FROM gooc_used_max),
            (
                SELECT STRING_AGG(session_id::text, ', ')
                FROM (
                    SELECT session_id
                    FROM session_totals
                    WHERE gooc_used = (SELECT highest FROM gooc_used_max)
                    ORDER BY session_id
                ) sub
            )
        FROM session_totals;
    `);
    const logs = await pool.query(`
        WITH accounts_per_session AS (
            SELECT session_id, COUNT(*) AS num_players
            FROM gog_players
            GROUP BY session_id
        ), games_per_session AS (
            SELECT session_id, COUNT(*) AS played_games
            FROM gog_games
            GROUP BY session_id
        ), points_per_session AS (
            SELECT
                session_id,
                SUM(g_point + c_point + special_w_point + special_l_point) AS overall_point,
                SUM(g_point) AS g_point,
                SUM(c_point) AS c_point,
                SUM(special_w_point) AS special_w_point,
                SUM(special_l_point) AS special_l_point
            FROM gog_players
            GROUP BY session_id
        ), cones_per_session AS (
            SELECT
                session_id,
                SUM(pg_cone + f20g_cone + l_cone + c_cone + w_cone + v_cone) AS overall_cone,
                SUM(pg_cone) AS pg_cone,
                SUM(f20g_cone) AS f20g_cone,
                SUM(l_cone) AS l_cone,
                SUM(c_cone) AS c_cone,
                SUM(w_cone) AS w_cone,
                SUM(v_cone) AS v_cone
            FROM gog_players
            GROUP BY session_id
        ), cards_per_session AS (
            SELECT
                session_id,
                SUM(2 - neigh) AS neigh,
                SUM(2 - super_neigh) AS super_neigh,
                SUM(gooc_total) AS gooc_total,
                SUM(gooc_used) AS gooc_used
            FROM gog_players
            GROUP BY session_id
        ), winner_per_session AS (
            SELECT
                gp.session_id,
                p.name,
                (gp.g_point + gp.c_point + gp.special_w_point + gp.special_l_point) AS points,
                (gp.pg_cone + gp.f20g_cone + gp.l_cone + gp.c_cone + gp.w_cone + gp.v_cone) AS cones,
                RANK() OVER (PARTITION BY gp.session_id ORDER BY
                    (gp.g_point + gp.c_point + gp.special_w_point + gp.special_l_point) DESC,
                    (gp.pg_cone + gp.f20g_cone + gp.l_cone + gp.c_cone + gp.w_cone + gp.v_cone) ASC
                ) AS rnk
            FROM gog_players gp
            JOIN accounts p ON gp.player_id = p.player_id
        ), top_winners AS (
            SELECT session_id, name, points, cones
            FROM winner_per_session
            WHERE rnk = 1
        ), selection_method_counts AS (
            SELECT
                session_id,
                COUNT(*) FILTER (WHERE selected_by = 'Vote') AS vote_count,
                COUNT(*) FILTER (WHERE selected_by = 'Choose') AS choose_count,
                COUNT(*) FILTER (WHERE selected_by = 'Wheel') AS wheel_count
            FROM gog_games
            GROUP BY session_id
        )

        SELECT
            s.status AS status,
            s.session_id AS gog_id,
            s.name AS gog_name,
            s.points_system AS points_system,
            s.speciality_count AS speciality_count,
            COALESCE(plps.num_players, 0) AS num_players,
            COALESCE(gps.played_games, 0) AS played_games,
            COALESCE(pps.overall_point, 0) AS overall_point,
            COALESCE(pps.g_point, 0) AS g_point,
            COALESCE(pps.c_point, 0) AS c_point,
            COALESCE(pps.special_w_point, 0) AS special_w_point,
            COALESCE(pps.special_l_point, 0) AS special_l_point,
            COALESCE(cps.overall_cone, 0) AS overall_cone,
            COALESCE(cps.pg_cone, 0) AS pg_cone,
            COALESCE(cps.f20g_cone, 0) AS f20g_cone,
            COALESCE(cps.l_cone, 0) AS l_cone,
            COALESCE(cps.c_cone, 0) AS c_cone,
            COALESCE(cps.w_cone, 0) AS w_cone,
            COALESCE(cps.v_cone, 0) AS v_cone,
            COALESCE(cards.neigh, 0) AS neigh,
            COALESCE(cards.super_neigh, 0) AS super_neigh,
            COALESCE(cards.gooc_total, 0) AS gooc_total,
            COALESCE(cards.gooc_used, 0) AS gooc_used,
            COALESCE(smc.vote_count, 0) AS selected_vote,
            COALESCE(smc.choose_count, 0) AS selected_choose,
            COALESCE(smc.wheel_count, 0) AS selected_wheel,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'name', tw.name,
                    'points', tw.points,
                    'cones', tw.cones
                )
            ) FILTER (WHERE tw.name IS NOT NULL) AS winner
        FROM gog_sessions s
        LEFT JOIN accounts_per_session plps USING (session_id)
        LEFT JOIN games_per_session gps USING (session_id)
        LEFT JOIN points_per_session pps USING (session_id)
        LEFT JOIN cones_per_session cps USING (session_id)
        LEFT JOIN cards_per_session cards USING (session_id)
        LEFT JOIN top_winners tw ON tw.session_id = s.session_id
        LEFT JOIN selection_method_counts smc ON smc.session_id = s.session_id
        GROUP BY s.session_id, plps.num_players, gps.played_games,
                pps.overall_point, pps.g_point, pps.c_point, pps.special_w_point,
                pps.special_l_point, cps.overall_cone, cps.pg_cone, cps.f20g_cone,
                cps.l_cone, cps.c_cone, cps.w_cone, cps.v_cone, cards.neigh,
                cards.super_neigh, cards.gooc_total, cards.gooc_used,
                smc.vote_count, smc.choose_count, smc.wheel_count
        ORDER BY s.session_id;
    `);
    
    return {
        total_gog: total.rows[0].total,
        total_players: total_players.rows[0],
        total_games: total_games.rows[0],
        players: players.rows,
        points: points.rows,
        cones: cones.rows,
        cards: cards.rows,
        logs: logs.rows
    };
}

export async function getStats() {
    let players = await getPlayerStats();
    let games = await getGameStats();
    let total = await getTotalStats();
    return { players, games, total }
}

// --- Auth ---
/*export async function authenticate(req) {
    if (!req.session || !req.session.userId) {
        return { authenticated: false };
    }

    const result = await pool.query(`
        SELECT
            id,
            username,
            role,
            avatar_seed,
            created_at,
            last_login,
            birthday,
            version
        FROM accounts
        WHERE id = $1
    `, [
        req.session.userId
    ]);

    if (result.rows.length === 0) {
        req.session.destroy(() => {});
        return { authenticated: false };
    }

    return {
        authenticated: true,
        user: result.rows[0]
    };
}

export async function login(req, res, username, password) {
    if (!username) {
        return {
            authenticated: false,
            text: 'No Username given'
        };
    }
    
    const result = await pool.query(`
        SELECT * FROM accounts WHERE username = $1
    `, [username]);

    if (result.rows.length === 0) {
        return {
            authenticated: false,
            text: 'Username not found'
        };
    }

    const user = result.rows[0];

    if (!password) {
        return {
            authenticated: false,
            text: 'No Password given'
        };
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return {
        authenticated: false,
        text: 'Password Incorrect'
    };

    req.session.userId = user.id;

    res.cookie('session', user.sessionToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: '.thegameofgames.win',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return {
        authenticated: true,
        text: 'success',
        user
    };
}

export async function logout(req, res) {
    
}

export function requireAuth(req, res, next) {
    const token = req.cookies.session;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = verifySession(token);
    if (!user) {
        return res.status(401).json({ error: 'Invalid session' });
    }

    req.user = user;
    next();
}*/

export async function createCookieSession(playerId) {
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query(`
        INSERT INTO sessions (session_id, player_id, expires_at)
        VALUES ($1, $2, $3)
    `, [
        sessionId, playerId, expiresAt
    ]);

    return { sessionId, expiresAt };
}

export async function verifySession(sessionId) {
    if (!sessionId) return null;

    const result = await pool.query(`
        SELECT
            a.player_id,
            a.name,
            a.family,
            a.colour,
            a.username,
            a.role,
            a.avatar_seed,
            a.birthday,
            a.version
        FROM sessions s
        JOIN accounts a USING (player_id)
        WHERE s.session_id = $1
        AND s.expires_at > NOW()
    `, [sessionId]);

    if (result.rowCount === 0) return null;

    return result.rows[0];
}

export async function login(username, password, res) {
    if (!username) {
        return {
            authenticated: false,
            text: 'No Username given'
        };
    }
    
    const result = await pool.query(`
        SELECT * FROM accounts WHERE username = $1
    `, [username]);

    if (result.rowCount === 0) {
        return {
            authenticated: false,
            text: 'Username not found'
        };
    }

    const user = result.rows[0];

    if (!password) {
        return {
            authenticated: false,
            text: 'No Password given'
        };
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
        return {
            authenticated: false,
            text: 'Incorrect password'
        };
    }

    const { sessionId, expiresAt } = await createCookieSession(user.player_id);

    res.cookie('gog_session', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        domain: '.thegameofgames.win',
        path: '/',
        expires: expiresAt
    });

    return {
        authenticated: true,
        user,
        text: 'success'
    }
}

export function requireAuth() {
  return async (req, res, next) => {
    const sessionId = req.cookies?.gog_session ?? null;
    const user = await verifySession(sessionId);

    if (!user) {
        return res.status(200).json({
            authenticated: false,
            user: null
        });
    }

    req.user = user;
    next();
  };
}

export async function logout(sessionId, res) {
    if (sessionId) {
        await pool.query(`
            DELETE FROM sessions WHERE session_id = $1
        `, [sessionId]);
    }

    res.clearCookie('gog_session', {
        domain: '.thegameofgames.win',
        path: '/'
    });

    return { ok: true };
}

export async function saveAvatar(player_id, avatar) {
    const oldRes = await pool.query(`
        SELECT avatar_seed, previous_avatar_seeds
        FROM accounts WHERE player_id = $1
    `, [player_id]);
    const oldRow = oldRes.rows[0];
    const old = oldRow.avatar_seed;
    const others = oldRow.previous_avatar_seeds;

    return { old, avatar, others };
}
