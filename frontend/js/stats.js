//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Global Variables
//


// #region

import {
    loadMenuBurger,
    openUserModal,
    closeUserModal,
    setupUserModal,
    loadUserOption
} from './user.js';

import {
    updateTimeDisplays,
    hexToRgba,
    hexToTextColour,
    header,
    place,
    centerOrStart,
    logoBox,
    typeText,
    toSOrNotToS
} from '../js/utils.js';

import { BASE_ROUTE } from './config.js';

let user_data = null;

let gog_version = 'private' // public vs private

let playersDiv = document.getElementById('players-div');
let players = document.getElementById('players');
let gamesDiv = document.getElementById('games-div');
let games = document.getElementById('games');
let totalDiv = document.getElementById('total-div');
let total = document.getElementById('total');

let playerModal = document.getElementById('player-modal');
let playerModalBox = document.getElementById('player-modal-box');
let playerModalSection = document.getElementById('player-section');
let gameModal = document.getElementById('game-modal');
let gameModalBox = document.getElementById('game-modal-box');
let gameModalSection = document.getElementById('game-section');
let totalModal = document.getElementById('total-modal');
let totalModalBox = document.getElementById('total-modal-box');
let totalModalSection = document.getElementById('total-section');

let allPlayers = [];
let allGames = [];
let logs = [];

let playerStats = [];
let gameStats = [];
let totalStats = {};

let curr_colour = {
    hex: '#33eaff',
    rgba: hexToRgba('#33eaff', 0.85),
    text: '#000000'
}

let headerTitle = document.getElementById('title');
const userModal = document.getElementById('user-profile-modal');
const userBox = document.getElementById('user-profile-box');

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Helper Functions
//


// #region

function span(val) {
    return `<span class='lighter'>${val}</span>`;
}

function divide(a, b) {
    return parseFloat((a / b).toFixed(2));
}

function percentage(a, b) {
    return parseInt((a / b).toFixed(2) * 100) || 0;
}

function times(num) {
    if (num == 0) return `<span class='never'>Never</span>`;
    if (num == 1) return 'Once';
    if (num == 2) return 'Twice';
    return `${num} times`;
}

function add(div, label, value, br = false, colon = ':') {
    if (br) div.appendChild(document.createElement('br'));
    div.appendChild(header('h4', `${label}${colon} ${span(value)}`));
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Modal
//


// #region

let curr_type = '';

function resetDivs(type = '') {
    if (curr_type == type) {
        curr_type = '';
        playersDiv.style.display = 'none';
        gamesDiv.style.display = 'none';
        totalDiv.style.display = 'none';
    } else {
        curr_type = type;
        playersDiv.style.display = type == 'player' ? 'flex' : 'none';
        gamesDiv.style.display = type == 'game' ? 'flex' : 'none';
        totalDiv.style.display = type == 'total' ? 'flex' : 'none';
    }
}

function openModal(modal, modalBox, colour = null) {
    modal.classList.add('active');
    modal.style.display = 'flex';

    if (colour) {
        modalBox.style.backgroundColor = colour.rgba;
        modalBox.style.borderColor = colour.rgba;
        modalBox.style.color = colour.text;

        /*modalBox.querySelectorAll('.button').forEach(btn => {
            btn.style.backgroundColor = colour.hex;
            btn.style.borderColor = colour.hex;
            btn.style.color = colour.text;
            btn.style.textShadow = 'none';
        });*/
    }

    modalBox.style.opacity = 0;
    modalBox.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    modalBox.style.display = 'flex';

    requestAnimationFrame(() => {
        modalBox.style.opacity = 1;
        modalBox.style.transform = 'scale(1)';
    });
}

function growFromBoxToModal(box, modal, modalBox, colour = null, after = null) {
    const text = box.querySelector('h3');
    if (text) text.style.visibility = 'hidden';
    
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
        openModal(modal, modalBox, colour);
        
        // Clean up clone
        setTimeout(() => {
            clone.remove();
            if (typeof after === 'function') after();
        }, 100);
    }, 300); // matches grow time
}

function openModalWithFakeGrow(btn, modal, modalBox, colour, setupCallback) {
    const fakeBox = document.createElement('div');
    fakeBox.className = 'fake-grow-box';

    const rect = btn.getBoundingClientRect();
    Object.assign(fakeBox.style, {
        backgroundColor: colour.rgba,
        borderRadius: '1rem',
        boxShadow: '0 0.5rem 1rem rgba(0,0,0,0.3)',
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        position: 'fixed',
        top: `${rect.top}px`,
        left: `${rect.left}px`,
        zIndex: 0,
        pointerEvents: 'none'
    });

    document.body.appendChild(fakeBox);

    growFromBoxToModal(fakeBox, modal, modalBox, colour, () => {
        if (typeof setupCallback === 'function') setupCallback();
        fakeBox.remove();
    });
}

function closeModal(modal, modalBox, direction, callback = null) {
    modal.style.transition = 'opacity 0.4s ease';
    modalBox.style.transition = 'transform 0.4s ease';

    modal.style.opacity = 0;

    modalBox.style.transform =
        direction == 'up' ? 'translateY(-100vh) scale(0.01)' :
        direction == 'down' ? 'translateY(100vh) scale(0.01)' : '';

    setTimeout(() => {
        modal.style.display = 'none';

        // Reset styles
        modal.style.opacity = '';
        modal.style.transition = '';
        modalBox.style.transform = '';
        modalBox.style.transition = '';
        
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');

        if (typeof callback === 'function') {
            callback();
        }
    }, 400);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Player Stats
//


// #region

const playerNameDiv = document.getElementById('modal-player-name');
const playerPlayedDiv = document.getElementById('modal-player-played');
const playerChanceDiv = document.getElementById('modal-player-chance');
const playerIntrudedDiv = document.getElementById('modal-player-intruded');
const playerAbandonedDiv = document.getElementById('modal-player-abandoned');
const playerPlacesDiv = document.getElementById('modal-player-places-div');
const playerPointsDiv = document.getElementById('modal-player-points-div');
const playerConesDiv = document.getElementById('modal-player-cones-div');
const playerCardsDiv = document.getElementById('modal-player-cards-div');
const playerGamesDiv = document.getElementById('modal-player-games-div');

function resetPlayer() {
    playerNameDiv.innerHTML = '';
    playerPlayedDiv.innerHTML = '';
    playerChanceDiv.innerHTML = '';
    playerIntrudedDiv.innerHTML = '';
    playerAbandonedDiv.innerHTML = '';
    playerPlacesDiv.innerHTML = '';
    playerPointsDiv.innerHTML = '';
    playerConesDiv.innerHTML = '';
    playerCardsDiv.innerHTML = '';
    playerGamesDiv.innerHTML = '';
}

function showPlayers() {
    players.innerHTML = '';
    playerStats.forEach(p => {
        const div = document.createElement('div');
        div.className = 'middle-box';
        div.style.background = `linear-gradient(
            135deg,
            ${hexToRgba(p.colour, 0.9)} 0%,
            ${hexToRgba(p.colour, 0.75)} 50%,
            ${hexToRgba(p.colour, 0.9)} 100%
            )`;
        div.style.boxShadow = `
            0 0 0.5rem ${hexToRgba(p.colour, 0.7)},
            0 0 1rem ${hexToRgba(p.colour, 0.55)}
        `;

        const name = header('h2', p.name, hexToTextColour(p.colour));
        name.style.textShadow = 'none';
        div.appendChild(name);

        div.addEventListener('click', () => {
            //console.log(p);
            curr_colour.hex = p.colour;
            curr_colour.rgba = hexToRgba(p.colour, 0.95);
            curr_colour.text = hexToTextColour(p.colour);
            growFromBoxToModal(div, playerModal, playerModalBox, curr_colour, () => {
                fillPlayerInfo(p);
            });
        });
        
        players.appendChild(div);
    });
    resetDivs('player');
    centerOrStart(playersDiv, 'justify', 'height');
}

function fillPlayerInfo(p) {
    resetPlayer();
    playerNameDiv.appendChild(header('h1', `${p.name}'s Stats`));

    playerPlayedDiv.appendChild(header('h2', `Played:`));
    add(playerPlayedDiv, '', times(p.played), true, '');

    playerChanceDiv.appendChild(header('h2', `Win Percentage:`));
    add(playerChanceDiv, '', `${p.win_perc}%`, true, '');

    playerIntrudedDiv.appendChild(header('h2', `Intruded:`));
    add(playerIntrudedDiv, '', times(p.intruded), true, '');

    playerAbandonedDiv.appendChild(header('h2', `Abandoned:`));
    add(playerAbandonedDiv, '', times(p.abandoned), true, '');

    playerPlacesDiv.style.justifyContent = p.places.length < 3 ? 'center' : 'flex-start';
    p.places.forEach(pl => {
        const div = document.createElement('div');
        div.className = 'modal-box';
        div.appendChild(header('h2', `Earned ${place(pl.num)}:`));
        add(div, '', times(pl.total), true, '');
        playerPlacesDiv.appendChild(div);
    });

    const statSection = (div, statsArr) => {
        statsArr.forEach(s => {
            const stat = document.createElement('div');
            stat.className = 'modal-box';
            stat.appendChild(header('h2', typeText(gog_version, s.type)));
            add(stat, 'Total', s.total, true);
            if (s.total != 0) {
                add(stat, 'Average', s.avg);
                if (s.highest != 0) {
                    const g = s.highest_session.split(', ');
                    if (g.length == 1) {
                        add(stat, 'Highest', `${s.highest} in GoG ${s.highest_session}`);
                    } else {
                        add(stat, 'Highest', `${s.highest} in GoGs ${s.highest_session}`);
                    }
                }
            }
            div.appendChild(stat);
        });
    };

    statSection(playerPointsDiv, p.points);
    if (gog_version == 'private') {
        statSection(playerConesDiv, p.cones);
    } else if (gog_version == 'public') {
        statSection(playerConesDiv, p.cones.filter(s => s.type != 'f20g_cone'));
    }
    statSection(playerCardsDiv, p.cards);

    p.games.forEach((g, i) => {
        const game = document.createElement('div');
        game.className = 'modal-box';
        const title = i == 0 ? 'Overall Games' : g.game_name;
        
        game.appendChild(header('h2', `${title}:`));
        game.appendChild(document.createElement('br'));

        const infoDiv = document.createElement('div');
        infoDiv.id = 'game-player-info';
        infoDiv.className = 'modal-info';
        add(infoDiv, 'Played', times(g.played));
        add(infoDiv, 'Won', times(g.won));
        add(infoDiv, 'Lost', times(g.lost));
        add(infoDiv, 'Win Percentage', `${g.win_perc}%`);

        add(infoDiv, 'Voted', times(g.vote_chosen), true);
        add(infoDiv, 'Won Vote', times(g.vote_won));
        add(infoDiv, 'Lost Vote', times(g.vote_lost));
        
        if (g.game_name != '4:20 Game') {
            add(infoDiv, 'Neighed', times(g.neighed), true);
            add(infoDiv, 'Super Neighed', times(g.super_neighed));
            add(infoDiv, `Chosen a${i == 0 ? '' : 's'} Speciality`, times(g.speciality_chosen), true);
            add(infoDiv, 'Won Speciality', times(g.speciality_won));
            add(infoDiv, 'Lost Speciality', times(g.speciality_lost));
        }

        game.appendChild(infoDiv);
        playerGamesDiv.appendChild(game);
    });

    const boxes = playerModalBox.querySelectorAll('.modal-box');
    boxes.forEach(box => {
        box.style.backgroundColor = hexToRgba(p.colour, 0.6);
        box.style.boxShadow = `
            0 2px 6px rgba(0,0,0,0.2),     /* Subtle base shadow */
            0 4px 12px ${hexToRgba(p.colour, 0.4)}  /* Colored outer glow */
        `;
        box.style.color = hexToTextColour(p.colour);
    });
}

function closePlayer() {
    closeModal(playerModal, playerModalBox, 'down', () => {
        resetPlayer();
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Game Stats
//


// #region

const gameNameDiv = document.getElementById('modal-game-name');
/*const gamePlayedDiv = document.getElementById('modal-game-played');
const gameChanceDiv = document.getElementById('modal-game-chance');
const gameNeighDiv = document.getElementById('modal-game-neigh');
const gameSuperDiv = document.getElementById('modal-game-super');
const gameSelectedDiv = document.getElementById('modal-game-selected');
const gameSelectedVote = document.getElementById('modal-game-selected-vote');
const gameSelectedChoose = document.getElementById('modal-game-selected-choose');
const gameSelectedWheel = document.getElementById('modal-game-selected-wheel');*/
const gamePlayersDiv = document.getElementById('modal-game-players-div');

function resetGame() {
    gameNameDiv.innerHTML = '';
    //gamePlayedDiv.innerHTML = '';
    //gameChanceDiv.innerHTML = '';
    //gameNeighDiv.innerHTML = '';
    //gameSuperDiv.innerHTML = '';
    //gameSelectedDiv.innerHTML = '';
    //gameSelectedVote.innerHTML = '';
    //gameSelectedChoose.innerHTML = '';
    //gameSelectedWheel.innerHTML = '';
    gamePlayersDiv.innerHTML = '';
}

function showGames() {
    const colourOptions = [
        '#66BB6A', '#43A047', '#FFC65F', '#F9F871', '#007BFF',
        '#6F42C1', '#D36BE7', '#FF6BB3', '#FF917E', '#EF5350'
    ];
    let coloursUsed = [];
    
    const nextColour = () => {
        if (colourOptions.length == coloursUsed.length) {
            coloursUsed = [];
        }
        const newColours = colourOptions.filter(c => !coloursUsed.includes(c));
        let colour = newColours[0];
        coloursUsed.push(colour);
        return colour;
    };
    
    games.innerHTML = '';
    gameStats.forEach(g => {
        const colour = nextColour();
        const div = document.createElement('div');
        div.className = 'middle-box';
        div.style.background = `linear-gradient(
            135deg,
            ${hexToRgba(colour, 0.9)} 0%,
            ${hexToRgba(colour, 0.75)} 50%,
            ${hexToRgba(colour, 0.9)} 100%
        )`;
        div.style.boxShadow = `
            0 0 0.5rem ${hexToRgba(colour, 0.7)},
            0 0 1rem ${hexToRgba(colour, 0.55)}
        `;
        
        const name = header('h2', g.name, hexToTextColour(colour));
        name.style.textShadow = 'none';
        div.appendChild(name);

        div.addEventListener('click', () => {
            curr_colour.hex = colour;
            curr_colour.rgba = hexToRgba(colour, 0.95);
            curr_colour.text = hexToTextColour(colour);
            growFromBoxToModal(
                div, gameModal, gameModalBox, curr_colour,
                () => { fillGameInfo(g, colour); }
            );
        });

        games.appendChild(div);
    });
    resetDivs('game');
    centerOrStart(gamesDiv, 'justify', 'height');
}

function fillGameInfo(g, colour) {
    resetGame();
    gameNameDiv.appendChild(header('h1', `${g.name}'s Stats`));

    /*gamePlayedDiv.appendChild(header('h2', 'Played:'));
    add(gamePlayedDiv, '', times(g.played), true, '');

    gameChanceDiv.appendChild(header('h2', 'Chance:'));
    add(gameChanceDiv, '', `${g.chance}%`, true, '');

    gameNeighDiv.appendChild(header('h2', 'Neighed:'));
    add(gameNeighDiv, '', times(g.neighed), true, '');

    gameSuperDiv.appendChild(header('h2', 'Super Neighed:'));
    add(gameSuperDiv, '', times(g.super_neighed), true, '');

    gameSelectedDiv.appendChild(header('h2', 'Selected by:'));
    gameSelectedDiv.appendChild(document.createElement('br'));
    const div = document.createElement('div');
    div.id = 'modal-game-selected-section';
    add(div, 'Voting system', times(g.selected_vote));
    add(div, 'Unanimously', times(g.selected_choose));
    add(div, 'Spinner wheel', times(g.selected_wheel));
    gameSelectedDiv.appendChild(div);*/

    const overall = document.createElement('div');
    overall.className = 'modal-box';
    overall.appendChild(header('h2', 'Overall:'));
    overall.appendChild(document.createElement('br'));
    gamePlayersDiv.appendChild(overall);
    
    const div = document.createElement('div');
    div.id = 'player-games-info';
    div.className = 'modal-info';
    add(div, 'Played', times(g.played), true);
    add(div, 'Chance', `${g.chance}%`);
    add(div, 'Neighed', times(g.neighed), true);
    add(div, 'Super Neighed', times(g.super_neighed));
    overall.appendChild(div);

    const selected = document.createElement('div');
    selected.id = 'player-games-info-selected';
    selected.appendChild(document.createElement('br'));
    selected.appendChild(header('h3', 'Selected by:'));
    selected.appendChild(document.createElement('br'));
    div.appendChild(selected);

    const info = document.createElement('div');
    info.className = 'modal-info';
    add(info, 'Voting system', times(g.selected_vote), true);
    add(info, 'Unanimously', times(g.selected_choose));
    add(info, 'Spinner wheel', times(g.selected_wheel));
    selected.appendChild(info);
    

    g.players.forEach(p => {
        const player = document.createElement('div');
        player.className = 'modal-box';

        const name = playerStats.find(pS => pS.id == p.player_id);
        player.appendChild(header('h2', `${name.name}:`));
        player.appendChild(document.createElement('br'));

        const infoDiv = document.createElement('div');
        infoDiv.id = 'player-games-info';
        infoDiv.className = 'modal-info';
        add(infoDiv, 'Played', times(p.played), true);
        add(infoDiv, 'Won', times(p.won));
        add(infoDiv, 'Lost', times(p.lost));
        add(infoDiv, 'Win Percentage', `${p.win_perc}%`);
        
        if (g.game_name != '4:20 Game') {
            add(infoDiv, 'Neighed', times(p.neighed), true);
            add(infoDiv, 'Super Neighed', times(p.super_neighed));
            add(infoDiv, 'Chosen as Speciality', times(p.speciality_chosen), true);
            add(infoDiv, 'Won Speciality', times(p.speciality_won));
            add(infoDiv, 'Lost Speciality', times(p.speciality_lost));
        }

        add(infoDiv, 'Voted', times(p.vote_chosen), true);
        add(infoDiv, 'Won Vote', times(p.vote_won));
        add(infoDiv, 'Lost Vote', times(p.vote_lost));

        player.appendChild(infoDiv);
        gamePlayersDiv.appendChild(player); 
    });

    const boxes = gameModalBox.querySelectorAll('.modal-box');
    boxes.forEach(box => {
        box.style.backgroundColor = hexToRgba(colour, 0.6);
        box.style.boxShadow = `
            0 2px 6px rgba(0,0,0,0.2),
            0 4px 12px ${hexToRgba(colour, 0.4)}
        `;
        box.style.color = hexToTextColour(colour);
    });
}

function closeGame() {
    closeModal(gameModal, gameModalBox, 'down', () => {
        resetGame();
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Total Stats
//


// #region

const totalBtn = document.getElementById('totalBtn');
const totalTitleDiv = document.getElementById('modal-total-title');
const totalGoGDiv = document.getElementById('modal-total-gog');
const totalGamesDiv = document.getElementById('modal-total-games');
const totalPlayerDiv = document.getElementById('modal-total-player');
const totalPlayersDiv = document.getElementById('modal-total-players-div');
const totalPointsDiv = document.getElementById('modal-total-points-div');
const totalConesDiv = document.getElementById('modal-total-cones-div');
const totalCardsDiv = document.getElementById('modal-total-cards-div');
const totalLogsDiv = document.getElementById('modal-total-logs-div');

function resetTotal() {
    totalTitleDiv.innerHTML = '';
    totalGoGDiv.innerHTML = '';
    totalGamesDiv.innerHTML = '';
    totalPlayerDiv.innerHTML = '';
    totalPlayersDiv.innerHTML = '';
    totalPointsDiv.innerHTML = '';
    totalConesDiv.innerHTML = '';
    totalCardsDiv.innerHTML = '';
    totalLogsDiv.innerHTML = '';
}

function showTotal() {
    resetTotal();
    const colour = '#33EAFF';
    curr_colour.hex = colour;
    curr_colour.rgba = hexToRgba(colour, 0.85);
    curr_colour.text = hexToTextColour(colour);

    openModalWithFakeGrow(
        totalBtn,
        totalModal,
        totalModalBox,
        curr_colour,
        setupTotal()
    );
    
    resetDivs('total');
}

function setupTotal() {
    // Title
    totalTitleDiv.appendChild(header('h1', 'Game of Games Stats'));

    // Total GoGs
    totalGoGDiv.appendChild(header('h2', `Total Played:`));
    totalGoGDiv.appendChild(document.createElement('br'));
    totalGoGDiv.appendChild(header('h4', `${span(times(totalStats.total_gog))}`));

    // Total Games Played
    const tg = totalStats.total_games;
    create(
        totalGamesDiv, 'overall_game', tg.total_games,
        tg.avg_games, tg.max_games, tg.max_games_sessions
    )

    // Total Players
    const tp = totalStats.total_players;
    create(
        totalPlayerDiv, 'overall_player', tp.total_players,
        tp.avg_players, tp.max_players, tp.max_players_sessions
    );

    // Player victories
    totalStats.players.sort((a, b) => {
        const name = a.name.localeCompare(b.name);
        return name != 0 ? name : a.family.localeCompare(b.family);
    }).forEach(p => {
        const name = playerStats.find(pS => pS.id == p.player_id).name;
        const box = document.createElement('div');
        box.className = 'modal-box';
        box.appendChild(header('h2', `${name} won:`));
        box.appendChild(document.createElement('br'));
        box.appendChild(header('h4', `${span(times(p.wins))}`));
        totalPlayersDiv.appendChild(box);
    });

    // Total Points
    totalStats.points.forEach(i => {
        const box = document.createElement('div');
        box.id = i.type;
        box.className = 'modal-box';
        create(
            box, i.type, i.total, i.avg,
            i.highest, i.highest_session.split(', ')
        );
        totalPointsDiv.appendChild(box);
    });

    // Total Cones
    let cones = [];
    if (gog_version == 'private') {
        cones = totalStats.cones;
    } else if (gog_version == 'public') {
        cones = totalStats.cones.filter(c => c.type == 'f20g_cone');
    }
    cones.forEach(i => {
        let total = i.total;
        let avg = i.avg;
        if (i.type == 'overall_cone' && gog_version == 'public') {
            //tg.total_games
            let f20 = cones.find(c => c.type == 'f20g_cone');
            total = total - f20.total;
            avg = total / tg.total_games;
        }
        const box = document.createElement('div');
        box.id = i.type;
        box.className = 'modal-box';
        create(
            box, i.type, total, avg,
            i.highest, i.highest_session.split(', ')
        );
        totalConesDiv.appendChild(box);
    });

    // Total Cards
    totalStats.cards.forEach(i => {
        const box = document.createElement('div');
        box.id = i.type;
        box.className = 'modal-box';
        create(
            box, i.type, i.total, i.avg,
            i.highest, i.highest_session.split(', ')
        );
        totalCardsDiv.appendChild(box);
    });

    // GoG Log Summaries
    totalStats.logs.forEach(log => {
        const coin = log.num_players > 3;
        const cones = gog_version == 'private' && log.points_system == 'Points & Cones';
        const shots = gog_version == 'public' && log.points_system == 'Points & Cones';

        const div = document.createElement('div');
        div.className = 'modal-box';
        div.appendChild(header('h2', log.gog_name));

        if (log.status == 'complete') {
            const winners = log.winner.map(w => w.name);
            const w = log.winner[0];
            if (winners.length == 1) {
                add(div, 'Winner', `${winners[0]}`, true);
            } else {
                const start = winners.slice(0, -1).join(', ');
                const last = winners[winners.length - 1]
                add(div, 'Winners', `${start} and ${last}`, true);
            }
    
            add(div, 'Winning Points', toSOrNotToS(w.points, 'point'));
            if (cones) {
                add(div, 'Winning Cones', toSOrNotToS(w.cones, 'cone'));
            } else if (shots) {
                add(div, 'Winning Shots', toSOrNotToS(w.cones, 'shot'));
            }
        } else if (log.status == 'active') {
            add(div, '', 'ACTIVE GAME', true, '');
        } else if (log.status == 'incomplete') {
            add(div, '', 'INCOMPLETE GAME', true, '');
        }
    
        add(div, 'Total Players', log.num_players, true);
        add(div, 'Total Games', log.played_games);
        add(div, 'Total Points', log.overall_point);
        if (cones) add(div, 'Total Cones', log.overall_cone);
        if (shots) add(div, 'Total Shots', log.overall_cone);
        add(div, 'Game Points', log.g_point, true);
        if (coin) add(div, 'Coin Flip Points', log.c_point);
        if (log.speciality_count > 0) {
            add(div, 'Speciality Points Won', log.special_w_point);
            add(div, 'Speciality Points Lost', -log.special_l_point);
        }
    
        if (cones) {
            add(div, 'Pre-Game/Break Cones', log.pg_cone, true);
            add(div, '4:20 Game Cones', log.f20g_cone);
            add(div, 'Losing Cones', log.l_cone);
            if (coin) add(div, 'Coin Flip Cones', log.c_cone);
            add(div, 'Wheel Cones', log.w_cone);
            add(div, 'Victory Cones', log.v_cone);
        } else if (shots) {
            add(div, 'Pre-Game/Break Shots', log.pg_cone, true);
            add(div, 'Losing Shots', log.l_cone);
            if (coin) add(div, 'Coin Flip Shots', log.c_cone);
            add(div, 'Wheel Shots', log.w_cone);
            add(div, 'Victory Shots', log.v_cone);
        }
    
        add(div, 'Neighs', log.neigh, true);
        add(div, 'Super Neighs', log.super_neigh);
        add(div, 'GooC Acquired', log.gooc_total);
        add(div, 'GooC Used', log.gooc_used);

        const vote = toSOrNotToS(log.selected_vote, 'game');
        const choose = toSOrNotToS(log.selected_choose, 'game');
        const wheel = toSOrNotToS(log.selected_wheel, 'game');
        
        const decided = [];
        if (vote != '0 games') decided.push(`${vote} selected by voting`);
        if (choose != '0 games') decided.push(`${choose} selected unanimously`);
        if (wheel != '0 games') decided.push(`${wheel} selected by spinner wheel`);

        if (decided.length > 0) div.appendChild(document.createElement('br'));
        decided.forEach(d => add(div, '', d, false, ''));

        totalLogsDiv.appendChild(div);
    });

    const boxes = totalModalBox.querySelectorAll('.modal-box');
    boxes.forEach(box => {
        box.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        box.style.boxShadow = `
            0 2px 6px rgba(0,0,0,0.2),     /* Subtle base shadow */
            0 4px 12px ${hexToRgba(curr_colour.hex, 0.4)}  /* Colored outer glow */
        `;
        box.style.color = hexToTextColour(curr_colour.hex);
    });
}

function create(div, type, total, avg, max, max_sessions) {
    div.appendChild(header('h2', typeText(gog_version, type)));
    div.appendChild(document.createElement('br'));
    div.appendChild(header('h4', `Total: ${span(total)}`));
    if (total != 0) div.appendChild(header('h4', `Average: ${span(avg)}`));
    if (total != 0 && max != 0) {
        let text = `${max} in `;
        if (max_sessions.length == 1) text += `GoG ${max_sessions[0]}`;
        if (max_sessions.length >= 2) text += `GoGs ${max_sessions.join(', ')}`;
        div.appendChild(header('h4', `Highest: ${span(text)}`));
    }
}

function closeTotal() {
    closeModal(totalModal, totalModalBox, 'down', () => {
        resetTotal();
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Initialise
//


// #region

async function initialise() {
    logoBox();
    setInterval(updateTimeDisplays, 1000);
    updateTimeDisplays();
    loadMenuBurger();
    
    user_data = await loadUserOption();
    const pfp = document.getElementById('profile-pic');
    pfp.addEventListener('click', () => openUserModal(
        userModal, userBox, curr_colour, setupUserModal
    ));

    const close = document.getElementById('user-profile-close');
    close.addEventListener('click', () => closeUserModal(userModal, userBox));

    console.log(user_data);
    headerTitle.innerHTML = '';
    if (!user_data.authenticated) {
        headerTitle.appendChild(header('h1', `Access Denied`));
        return;
    }
    headerTitle.appendChild(header('h1', `Access Granted`));
    
    const res = await fetch(`${BASE_ROUTE}/api/stats`);
    const stats = await res.json();

    headerTitle.innerHTML = '';
    headerTitle.appendChild(header('h1', `Game of Games Stats`));

    playerStats = stats.players;
    gameStats = stats.games;
    totalStats = stats.total;

    console.log('Player Stats: ', playerStats);
    console.log('Game Stats: ', gameStats);
    console.log('Total Stats: ', totalStats);

    resetDivs();
    //showPlayers();
    //showGames();

    const btns = document.querySelectorAll('.bottom-button');
    btns.forEach(btn => {
        btn.style.display = 'flex';
        btn.addEventListener('click', () => {
            if (btn.id == 'playersBtn') showPlayers();
            if (btn.id == 'gamesBtn') showGames();
            if (btn.id == 'totalBtn') showTotal();
        });
    });
    const closes = document.querySelectorAll('.middle-close');
    closes.forEach(close => {
        close.addEventListener('click', () => {
            if (close.id == 'player-close') closePlayer();
            if (close.id == 'game-close') closeGame();
            if (close.id == 'total-close') closeTotal();
        });
    });
}

// #endregion

initialise();
