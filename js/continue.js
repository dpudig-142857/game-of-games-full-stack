//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Global Variables
//


// #region

import {
    logoBox,
    updateTimeDisplays,
    header,
    hexToRgba,
    hexToTextColour,
    centerOrStart
} from './utils.js';

let gog_version = 'private' // public vs private

const BASE_URL = 'https://game-of-games-backend.onrender.com/api/sessions';
let sessions = [];
let logs = [];
let curr_colour = { hex: '', rgba: '', text: '' };

let logsDiv = document.getElementById('logs');
let modal = document.getElementById('gameModal');
let gameModal = document.getElementById('gameModal-box');
let modalTitle = document.getElementById('gameModal-title');
let info = document.getElementById('gameModal-info');

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Helper Functions
//


// #region

function statusColour(s) {
    switch (s.status) {
        case 'incomplete': return '#dc3545cc';
        case 'active': return '#ffc107cc';
        default: return '#33eaffcc';
    }
}

function theURL(id, other) {
    if (id && other) return `${BASE_URL}/${id}/continue/${other}`;
    if (id) return `${BASE_URL}/${id}/continue`;
    return `${BASE_URL}/continue`;
}

async function activateSession(id) {
    try {
        const response = await fetch(theURL(id, 'active'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to activ GoG');
    } catch (err) {
        console.error('Error continuing GoG:', err);
    }
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Logs
//


// #region

function createLog(log) {
    const colour = statusColour(log);
    const box = document.createElement('div');
    box.className = 'box';
    box.id = `log-box-${log.session_id}`;
    box.style.background = statusColour(log);

    const content = document.createElement('div');
    content.id = `log-content-${log.session_id}`;
    content.className = 'log-content';
    content.appendChild(header('h3', log.name));
    box.appendChild(content);

    const statusWinner = document.createElement('div');
    statusWinner.className = 'status-winner-row';

    const statusBadge = document.createElement('span');
    statusBadge.textContent = log.status.charAt(0).toUpperCase() + log.status.slice(1);
    statusBadge.className = 'status-badge ' + log.status;
    statusWinner.appendChild(statusBadge);

    content.appendChild(statusWinner);

    const players = document.createElement('h4');
    players.innerHTML = log.players.split(' vs ').join(`<span class='small-text'> vs </span>`);
    players.className = 'players-info';
    content.appendChild(players);

    if (log.total_games != undefined) {
        const numGames = document.createElement('p');
        numGames.innerHTML = `<strong>Games Played:</strong> ${log.total_games}`;
        numGames.className = 'games-info';
        content.appendChild(numGames);
    }

    const start = new Date(log.start_time);
    const from = document.createElement('p');
    from.className = 'dates-info';
    from.innerHTML = `<strong>Started:</strong> ${start.toLocaleString()}`;
    content.appendChild(from);

    box.addEventListener('click', () => {
        curr_colour.hex = colour;
        curr_colour.rgba = hexToRgba(colour, 1);
        curr_colour.text = hexToTextColour(colour);
        growFromBoxToModal(box, content, () => createModalInfo(log));
    });

    logsDiv.appendChild(box);
}

function initialiseButtons(log) {
    const closeBtn = document.getElementById('game-close');
    closeBtn.addEventListener('click', () => closeModal(log.session_id));
    
    const btns = document.querySelectorAll('.button');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'edit') editGame(log);
            if (btn.id == 'continue') continueGame(log);
            if (btn.id == 'complete') completeGame(log);
            if (btn.id == 'delete') deleteGame(log.session_id);
        });
    });
}

function createModalInfo(log) {
    const session = sessions.find(s => s.id == log.session_id);
    initialiseButtons(log);

    //console.log(log);
    //console.log(session);
    if (!session) {
        console.error('No session found');
        return;
    }

    modalTitle.innerHTML = '';
    modalTitle.appendChild(header('h1', log.name, curr_colour.text));

    // Players
    //session.players.forEach(p => {
    //    console.log(p);
    //});

    // Games


}

async function editGame(log) {
    const id = log.session_id;
    if (log.status == 'incomplete') activateSession(id);
    window.location.href = `create.html?sessionId=${id}`;
}

async function continueGame(log) {
    const id = log.session_id;
    if (log.status == 'incomplete') activateSession(id);
    window.location.href = `game.html?sessionId=${id}`;
}

async function completeGame(log) {
    const id = log.session_id;
    const session = sessions.find(s => s.id == id);
    console.log(log);
    console.log(session);
    theGame.status = 'complete';
    theGame.finish_time = new Date();
    let results = [];

    session.players.forEach(p => {
        results.push({
            player_id: p.player_id,
            name: p.name,
            points: p.g_point + p.c_point + p.special_w_point + p.special_l_point,
            cones: p.pg_cone + p.f20g_cone + p.l_cone + p.c_cone + p.w_cone + p.v_cone
        });
    });
    
    results.sort((a, b) => {
        const points = b.points - a.points;
        const cones = a.cones - b.cones;
        const names = a.name.localeCompare(b.name);
        return points != 0 ? points : cones != 0 ? cones : names;
    });

    let place = 1;
    let extras = 0;
    results.forEach((r, i) => {
        if (i != 0) {
            const prev = results[i - 1];
            if (r.points == prev.points && r.cones == prev.cones) {
                extras++;
            } else {
                place += extras + 1;
                extras = 0;
            }
        }
        r.place = place;
    });

    try {
        const response = await fetch(`${BASE_URL}/${id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session, results })
        });
        if (!response.ok) throw new Error('Failed to complete GoG');
        window.location.href = `results.html?sessionId=${id}`;
    } catch (err) {
        console.error('Error finishing GoG:', err);
    }
}

async function deleteGame(id) {
    closeModal(id);

    const box = document.getElementById(`log-box-${id}`);
    box.remove();
    centerOrStart(logsDiv, 'justify');

    try {
        const response = await fetch(theURL(id, 'delete'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to delete GoG');
    } catch (err) {
        console.error('Error finishing GoG:', err);
    }
}

// #endregion

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Open and Close Modal
//


// #region

function openModal(from, colour = null) {
    //hideAllGameModes(true);
    modal.classList.add('active');
    modal.style.display = 'flex';
    console.log(colour);

    if (colour) {
        gameModal.style.backgroundColor = colour.rgba;
        gameModal.style.borderColor = colour.rgba;
        gameModal.style.color = colour.text;

        gameModal.querySelectorAll('.button').forEach(btn => {
            btn.style.backgroundColor = colour.hex;
            btn.style.borderColor = colour.hex;
            btn.style.color = colour.text;
            btn.style.textShadow = 'none';
        });
    }

    gameModal.style.opacity = 0;
    gameModal.style.transform = 
        from == 'wheel' ? 'translateY(100vh) scale(0.1)' : '';
    gameModal.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    gameModal.style.display = 'flex';

    requestAnimationFrame(() => {
        gameModal.style.opacity = 1;
        gameModal.style.transform = 'scale(1)';
    });
}

function closeModal(id) {
    const content = document.getElementById(`log-content-${id}`);
    content.style.visibility = 'visible';

    modal.style.opacity = 0;
    modal.style.transition = 'opacity 0.4s ease';
    gameModal.style.transform = 'translateY(100vh) scale(0.01)';
    gameModal.style.transition = 'transform 0.4s ease';

    setTimeout(() => {
        modal.style.display = 'none';

        modal.style.opacity = '';
        modal.style.transition = '';
        gameModal.style.transform = '';
        gameModal.style.transition = '';

        modal.classList.remove('active');
        document.body.classList.remove('modal-active');

        if (typeof callback === 'function') {
            callback();
        }
    }, 400);
}

function growFromBoxToModal(box, content, after = null) {
    /*const text = box.querySelector('h3');
    if (text) text.style.visibility = 'hidden';*/
    content.style.visibility = 'hidden';

    const rect = box.getBoundingClientRect();
    const clone = box.cloneNode(true);
    clone.classList.add('grow-modal-clone');
    document.body.appendChild(clone);

    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;

    void clone.offsetWidth; // force reflow

    // Animate to modal target size
    clone.style.top = '12vh';
    clone.style.left = '14vw';
    clone.style.width = '71vw';
    clone.style.height = '75vh';
    
    document.body.classList.add('modal-active');
    
    setTimeout(() => {
        openModal('down', curr_colour);
        
        // Clean up clone
        setTimeout(() => {
            clone.remove();
            if (typeof after === 'function') after();
        }, 100);
    }, 300); // matches grow time
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Initialise
//


// #region

async function initialise() {
    try {
        logoBox();
        setInterval(updateTimeDisplays, 1000);
        updateTimeDisplays();
    
        const res = await fetch(theURL(null, ' '));
        sessions = await res.json();
        logs = sessions.sort((a, b) => a.id - b.id).map(s => s.log);
        logs.forEach(l => createLog(l));
        centerOrStart(logsDiv, 'justify');
        console.log(sessions);

    } catch (err) {
        console.error('Failed to initialise: ', err);
    }
}

// #endregion

initialise();