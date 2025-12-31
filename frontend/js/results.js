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
    logoBox,
    updateTimeDisplays,
    hexToRgba,
    hexToTextColour,
    styleBox ,
    getDisplayNames,
    header,
    place,
    placeColour,
    typeText,
    format,
    toSOrNotToS
} from '../js/utils.js';

import { BASE_ROUTE } from './config.js';

let user_data = null;
let gog_version = 'private' // public vs private

const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');

if (!sessionId) {
    alert('Missing session ID! 3');
    window.location.href = '/';
}

let gamesInfo = [];
let status = '';
let gameStart = null;
let gameFinish = null;
let pointsSystem = '';
let numSpeciality = 0;
let intruded = [];
let abandoned = [];
let extra = [];
let allPlayers = [];
let displayNames = [];
let possibleGames = [];
let playedGames = [];
let finalResults = [];

let playerModal = document.getElementById('player-modal');
let playerModalBox = document.getElementById('player-modal-box');
let playerModalSection = document.getElementById('player-section');
let gameModal = document.getElementById('game-modal');
let gameModalBox = document.getElementById('game-modal-box');
let gameModalSection = document.getElementById('game-section');

let gold = 'linear-gradient(to right, rgb(191, 149, 63), rgb(252, 246, 186), rgb(179, 135, 40), rgb(251, 245, 183), rgb(170, 119, 28))';
let silver = 'linear-gradient(45deg, rgb(153, 153, 153) 5%, rgb(255, 255, 255) 10%, rgb(204, 204, 204) 30%, rgb(221, 221, 221) 50%, rgb(204, 204, 204) 70%, rgb(255, 255, 255) 80%, rgb(153, 153, 153) 95%)';
let bronze = 'linear-gradient(to right, rgb(205, 127, 50), rgb(229, 180, 126), rgb(168, 109, 40), rgb(217, 160, 103), rgb(139, 78, 19))';
let blue = 'linear-gradient(45deg, rgb(180, 216, 255) 5%, rgb(224, 244, 255) 15%, rgb(160, 198, 230) 35%, rgb(204, 232, 255) 50%, rgb(160, 198, 230) 70%, rgb(224, 244, 255) 85%, rgb(180, 216, 255) 95%)';

let curr_colour = {
    hex: '#33eaff',
    rgba: hexToRgba('#33eaff', 0.85),
    text: '#000000'
}

const userModal = document.getElementById('user-profile-modal');
const userBox = document.getElementById('user-profile-box');

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Helper Functions
//


// #region

function span(val) {
    return `<span class='lighter'>${val}</span>`;
}

function makeBox(div, label, value) {
    const box = document.createElement('div');
    box.className = 'modal-box';
    box.appendChild(header('h2', label));
    box.appendChild(header('h3', value));
    div.appendChild(box);
}

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Sessions
//


// #region

const noDiv = document.getElementById('no-session-box');

function noSession() {
    playersDiv.style.display = 'none';
    gamesDiv.style.display = 'none';
    noDiv.style.display = 'flex';
    noDiv.innerHTML = '';
    noDiv.appendChild(header('h1', `Session ${sessionId} doesn't exist yet...`));
}

function activeSession(session, players, games, games_played) {
    status = 'active';
    gameStart = new Date(session.start_time);
    pointsSystem = session.points_system;
    numSpeciality = session.speciality_count;
    intruded = session.intruded;
    abandoned = session.abandoned;
    extra = session.extra;
    allPlayers = players;
    displayNames = getDisplayNames(players);
    possibleGames = games;
    playedGames = games_played;
    finalResults = generateResults();//[];
    showResults();
}

function incompleteSession(session, players, games, games_played) {
    status = 'incomplete';
    gameStart = new Date(session.start_time);
    pointsSystem = session.points_system;
    numSpeciality = session.speciality_count;
    intruded = session.intruded;
    abandoned = session.abandoned;
    extra = session.extra;
    allPlayers = players;
    displayNames = getDisplayNames(players);
    possibleGames = games;
    playedGames = games_played;
    finalResults = generateResults();//[];
    showResults();
}

function completedSession(session, players, games, games_played, results) {
    status = 'complete';
    gameStart = new Date(session.start_time);
    gameFinish = new Date(session.finish_time);
    pointsSystem = session.points_system;
    numSpeciality = session.speciality_count;
    intruded = session.intruded;
    abandoned = session.abandoned;
    extra = session.extra;
    allPlayers = players;
    displayNames = getDisplayNames(players);
    possibleGames = games;
    playedGames = games_played;
    finalResults = results;
    showResults();
}

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              General Results
//


// #region

let tabTitle = document.getElementById('tab-title');
let headerTitle = document.getElementById('title');
let extraDiv = document.getElementById('extra');
let dateTimeDiv = document.getElementById('date-time');
let playersDiv = document.getElementById('players-box');
let gamesDiv = document.getElementById('games-box');

function clearResults() {
    headerTitle.innerHTML = '';
    extraDiv.innerHTML = '';
    dateTimeDiv.innerHTML = '';
    playersDiv.innerHTML = '';
    gamesDiv.innerHTML = '';
}

function showResults() {
    console.log('allPlayers:', allPlayers);
    //console.log('finalResults:', finalResults);
    //console.log('intruded:', intruded);
    //console.log('abandoned:', abandoned);
    //console.log('possibleGames:', possibleGames);
    console.log('playedGames:', playedGames);
    //console.log('allGames:', gamesInfo);
    
    clearResults();
    showTitles();
    showGames();
    showPlayers();
}

function generateResults() {
    let results = [];

    allPlayers.forEach(p => {
        const stat = Object.entries(p);
        const player_id = p.player_id;
        const name = p.name;
        const points = stat.reduce((s, [o, k]) => o.includes('_point') ? s + k : s, 0);
        let cones = 
            gog_version == 'private' ?
            stat.reduce((s, [o, k]) => o.includes('_cone') ? s + k : s, 0) :
            gog_version == 'public' ?
            stat.reduce((s, [o, k]) => {
                o.includes('_cone') && !o.includes('f20g_cone') ? s + k : s, 0
            }) : 0;


        if (gog_version == 'private') {
            cones = stat.reduce((s, [o, k]) => {
                o.includes('_cone') ? s + k : s, 0
            });
        } else if (gog_version == 'public') {
            cones = stat.reduce((s, [o, k]) => {
                o.includes('_cone') && !o.includes('f20g_cone') ? s + k : s, 0
            });
        }

        if (pointsSystem == 'Points & Cones') {
            results.push({ player_id, name, points, cones });
        } else {
            results.push({ player_id, name, points });
        }
    });

    results.sort((a, b) => {
        const points = b.points - a.points;
        const cones = a.cones - b.cones;
        return points != 0 ? points : cones != 0 ? cones : a.name.localeCompare(b.name);
    });

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.points == results[index - 1].points) {
                if (result.cones == results[index - 1].cones) {
                    extraPlaces++;
                } else {
                    currentPlace += extraPlaces + 1;
                    extraPlaces = 0;
                }
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        //result.reward = pointsSystem[currentPlace - 1];
        //result.base = pointsSystem[currentPlace - 1];
    });
    
    return results;
}

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Titles
//


// #region


function showTitles() {
    tabTitle.innerHTML = `Results - GoG ${sessionId}`;
    headerTitle.appendChild(header('h1', `Game of Games No. ${sessionId}`));

    extra.forEach(e => extraDiv.appendChild(header('h2', e)));

    const space = `<span class='space'>   </span>`;
    const formatDateTime = (curr) => {
        const date = curr.toDateString();
        const time = curr.toLocaleTimeString([], {
            hour: 'numeric', minute: '2-digit', hour12: true
        });
        return { date, time };
    };
    
    const start = formatDateTime(gameStart);
    let text = `${start.date}${space}${start.time} - `;

    if (gameFinish) {
        const finish = formatDateTime(gameFinish);
        text += start.date == finish.date
            ? finish.time
            : `${finish.date}${space}${finish.time}`;
    }
    dateTimeDiv.appendChild(header('h2', text));
}

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Log
//


// #region

const gameNameDiv = document.getElementById('modal-game-name');
const gameSpecialityDiv = document.getElementById('modal-game-speciality');
const gameExtrasDiv = document.getElementById('modal-game-extras');
const gameSelectedDiv = document.getElementById('modal-game-selected');
const gameResultsDiv = document.getElementById('modal-game-results');
const gamePhotoDiv = document.getElementById('modal-game-photo');

function resetGame() {
    gameNameDiv.innerHTML = '';
    gameSpecialityDiv.innerHTML = '';
    gameExtrasDiv.innerHTML = '';
    gameSelectedDiv.innerHTML = '';
    gameResultsDiv.innerHTML = '';
    gamePhotoDiv.innerHTML = '';
}

function showGames() {
    const section = document.createElement('div');
    section.className = 'section';
    gamesDiv.appendChild(header('h1', 'Log'));
    gamesDiv.appendChild(section);

    if (pointsSystem == 'Points & Cones' && allPlayers[0].pg_cone != 0) {
        const preGame = document.createElement('div');
        preGame.className = 'row';
        preGame.style.color = '#33EAFF';
        preGame.style.background = 'rgba(0, 0, 0, 0.75)';
        preGame.style.boxShadow = `
            0 0 0.5rem ${hexToRgba('#000000', 0.7)},
            0 0 1rem ${hexToRgba('#000000', 0.55)}
        `;
        preGame.style.textShadow = '#0ff 0.1rem 0.1rem 0.5rem';

        const preGameText = document.createElement('div');
        preGameText.className = 'cell small';
        if (gog_version == 'private') {
            preGameText.appendChild(header('h3', `Everyone had a PRE-GAME cone`));
        } else if (gog_version == 'public') {
            preGameText.appendChild(header('h3', `Everyone had a PRE-GAME shot`));
        }
        preGame.appendChild(preGameText);

        section.appendChild(preGame);
    } else if (pointsSystem == 'Points & Cones' && allPlayers[0].pg_cone == 0) {
        section.appendChild(header('h1', 'Not started yet'));
    }
    
    playedGames
    .sort((a, b) => a.number - b.number)
    .forEach(g => {
        const info = gamesInfo.find(gI => gI.game_id == g.id);

        const div = document.createElement('div');
        div.className = 'row hover';
        styleBox(div, '#33EAFF');

        const num = document.createElement('div');
        num.className = 'cell number';
        num.appendChild(header('h3', `Game ${g.number}`));
        div.appendChild(num);

        const name = document.createElement('div');
        name.className = 'cell number';
        name.appendChild(header('h3', g.name));
        div.appendChild(name);

        div.addEventListener('click', () => {
            const colour = {
                hex: '#33EAFF',
                rgba: hexToRgba('#33EAFF', 0.95),
                text: hexToTextColour('#33EAFF')
            };
            growFromBoxToModal(
                div, gameModal, gameModalBox,
                colour, () => fillGameInfo(g, info)
            );
        });

        section.appendChild(div);

        g.after.forEach(a => {
            const afterDiv = document.createElement('div');
            afterDiv.className = 'row';
            styleBox(afterDiv, '#FFFFFF');
            afterDiv.style.color = '#33EAFF';
            afterDiv.style.background = 'rgba(0, 0, 0, 0.75)';
            afterDiv.style.boxShadow = `
                0 0 0.5rem ${hexToRgba('#000000', 0.7)},
                0 0 1rem ${hexToRgba('#000000', 0.55)}
            `;
            afterDiv.style.textShadow = '#0ff 0.1rem 0.1rem 0.5rem';

            const after = document.createElement('div');
            after.className = a == 'DINNER BREAK' || a == 'LUNCH BREAK'
                ? 'cell large' : 'cell small';
            after.appendChild(header('h3', a));
            afterDiv.appendChild(after);

            section.appendChild(afterDiv);
        });
    });

    if (status == 'complete') {
        const end = document.createElement('div');
        end.className = 'row';
        end.style.color = '#33EAFF';
        end.style.background = 'rgba(0, 0, 0, 0.75)';
        end.style.boxShadow = `
            0 0 0.5rem ${hexToRgba('#000000', 0.7)},
            0 0 1rem ${hexToRgba('#000000', 0.55)}
        `;
        end.style.textShadow = '#0ff 0.1rem 0.1rem 0.5rem';
    
        const text = document.createElement('div');
        text.className = 'cell large';
        text.appendChild(header('h3', `GAME OVER`));
        end.appendChild(text);
    
        section.appendChild(end);
    }

    /*const gap = document.createElement('div');
    gap.className = 'gap';
    section.appendChild(gap);

    possibleGames
    .sort()
    .filter(game => !playedGames.find(g => g.name == game))
    .forEach(game => {
        const div = document.createElement('div');
        div.className = 'row';
        div.style.color = '#33EAFF';
        div.style.background = 'rgba(0, 0, 0, 0.75)';
        div.style.boxShadow = `
            0 0 0.5rem ${hexToRgba('#000000', 0.7)},
            0 0 1rem ${hexToRgba('#000000', 0.55)}
        `;
        div.style.textShadow = '#0ff 0.1rem 0.1rem 0.5rem';
        
        const name = document.createElement('div');
        name.className = 'cell number small';
        name.appendChild(header('h3', game));
        div.appendChild(name);

        const num = document.createElement('div');
        num.className = 'cell number small';
        num.appendChild(header('h3', `Not played`));
        div.appendChild(num);

        document.getElementById('not-played-box').appendChild(div);
    });*/
}

function fillGameInfo(game, info) {
    console.log(info);
    resetGame();
    gameNameDiv.appendChild(header('h1', `${game.name}'s Results`));
    
    let special = [];
    game.results.filter(r => r.speciality).forEach(s => {
        const player = allPlayers.find(p => p.player_id == s.player_id);
        if (player) special.push(player.name);
    });

    if (special.length != 0) {
        const text = `${format(special)}'s Speciality Game`;
        gameSpecialityDiv.appendChild(header('h2', text));
    }

    if (game.name != '4:20 Game') {
        let extra = game.extras.join(' - ');
        gameExtrasDiv.appendChild(header('h2', extra));
    }

    let selected = '';
    if (game.selected_by == 'Vote') {
        let counts = {};
        game.votes.map(v => v.vote).sort()
        .forEach(v => counts[v] = (counts[v] || 0) + 1);
        
        const votes = Object.entries(counts);
        selected = `Selected by the voting system`;
        if (votes[0] && votes[0][0] != '') {
            if (votes[0][1] == game.results.length) {
                selected += ` but everyone voted for ${votes[0][0]}`;
            } else {
                const vote = votes
                .sort(([aN, aC], [bN, bC]) => {
                    const count = bC - aC;
                    return count != 0 ? count : aN.localeCompare(bN);
                })
                .map(([name, count]) => {
                    return count > 1 ? `${name} (${count} votes)` : name;
                });
                selected += ` between ${format(vote)}`;
            }
        }
    } else if (game.selected_by == 'Choose') {
        selected = `Selected unanimously`;
    } else if (game.selected_by == 'Wheel') {
        selected = `Selected by a spinner wheel`
    }
    gameSelectedDiv.appendChild(header('h3', selected));

    game.results.forEach(r => {
        const player = allPlayers.find(p => p.player_id == r.player_id);
        
        const box = document.createElement('div');
        box.className = 'game-results';
        if (r.place == 1) box.style.background = gold;
        if (r.place == 2) box.style.background = silver;
        if (r.place == 3) box.style.background = bronze;
        if (r.place >= 4) box.style.background = blue;

        const nameDiv = document.createElement('div');
        nameDiv.className = 'cell name';
        nameDiv.appendChild(header('h2', `${place(r.place)} - ${player.name}:`));
        box.appendChild(nameDiv);

        const rewardDiv = document.createElement('div');
        rewardDiv.className = 'cell reward';
        rewardDiv.appendChild(header('h3', `Reward: ${span(r.reward)}`));
        box.appendChild(rewardDiv);

        let text = '';
        if (r.points) {
            text = toSOrNotToS(r.points, 'point');
        } else if (r.stars && r.coins) {
            const stars = toSOrNotToS(r.stars, 'star');
            const coins = toSOrNotToS(r.coins, 'coin');
            text = `${stars}, ${coins}`;
        }

        if (text != '') {
            const div = document.createElement('div');
            div.className = `cell game`;
            div.appendChild(header('h3', `Game: ${span(text)}`));
            box.appendChild(div);
        }

        if (game.selected_by == 'Vote') {
            const vote = game.votes.find(v => v.player_id == r.player_id);
            if (vote.vote != '') {
                const div = document.createElement('div');
                div.className = `cell vote`;
                div.appendChild(header('h3', `Voted for: ${span(vote.vote)}`));
                box.appendChild(div);
            }
        }
        
        gameResultsDiv.appendChild(box);
    });

    if (game.name == '4:20 Game') {
        let filename = game.extras[0];

        const img = document.createElement('img');
        img.src = `${BASE_ROUTE}/photos/${filename}`;
        img.alt = '4:20 Game Photo';
        img.style.maxWidth = '100%';
        img.style.borderRadius = '1rem';

        gamePhotoDiv.innerHTML = '';
        gamePhotoDiv.appendChild(img);
        gamePhotoDiv.style.display = 'flex';
    }
}

function closeGame() {
    closeModal(gameModal, gameModalBox, 'down', () => {
        resetGame();
    });
}

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Results
//


// #region

const playerNameDiv = document.getElementById('modal-player-name');
const playerPointsTotal = document.getElementById('modal-player-points-total');
const playerPointsDiv = document.getElementById('modal-player-points-div');
const playerConesTotal = document.getElementById('modal-player-cones-total');
const playerConesDiv = document.getElementById('modal-player-cones-div');
const playerCardsDiv = document.getElementById('modal-player-cards-div');
const playerGamesDiv = document.getElementById('modal-player-games-div');

function resetPlayer() {
    playerNameDiv.innerHTML = '';
    playerPointsTotal.innerHTML = '';
    playerPointsDiv.innerHTML = '';
    playerConesTotal.innerHTML = '';
    playerConesDiv.innerHTML = '';
    playerCardsDiv.innerHTML = '';
    playerGamesDiv.innerHTML = '';
}

function showPlayers() {
    const section = document.createElement('div');
    section.className = 'section';
    playersDiv.appendChild(header('h1', 'Results'));
    playersDiv.appendChild(section);

    finalResults
    .sort((a, b) => {
        const place = a.place - b.place;
        const nameA = `${a.name} ${a.family}`;
        const nameB = `${b.name} ${b.family}`;
        return place != 0 ? place : nameA.localeCompare(nameB);
    })
    .forEach(r => {
        const player = displayNames.find(n => n.player_id == r.player_id);
        const info = allPlayers.find(p => p.player_id == r.player_id);

        const div = document.createElement('div');
        div.className = 'row hover';
        styleBox(div, placeColour(r.place));

        const placeDiv = document.createElement('div');
        placeDiv.className = 'cell place';
        placeDiv.appendChild(header('h3', place(r.place)));
        div.appendChild(placeDiv);

        const nameDiv = document.createElement('div');
        nameDiv.className = 'cell name';
        nameDiv.appendChild(header('h3', player.name));
        div.appendChild(nameDiv);

        const pointsDiv = document.createElement('div');
        pointsDiv.className = 'cell points';
        pointsDiv.textContent = toSOrNotToS(r.points, 'point');
        div.appendChild(pointsDiv);
        
        if (pointsSystem == 'Points & Cones') {
            const conesDiv = document.createElement('div');
            conesDiv.className = 'cell cones';
            if (gog_version == 'private') {
                conesDiv.textContent = toSOrNotToS(r.cones, 'cone');
            } else if (gog_version == 'public') {
                conesDiv.textContent = toSOrNotToS(r.cones, 'shot');
            }
            div.appendChild(conesDiv);
        }

        div.addEventListener('click', () => {
            const colour = {
                hex: info.colour,
                rgba: hexToRgba(info.colour, 0.95),
                text: hexToTextColour(info.colour)
            };
            growFromBoxToModal(
                div, playerModal, playerModalBox,
                colour, () => fillPlayerInfo(player.name, info)
            );
        });

        section.appendChild(div);
    });
}

function fillPlayerInfo(name, info) {
    resetPlayer();
    playerNameDiv.appendChild(header('h1', `${name}'s Results`));

    const points = Object.entries(info).filter(([type, _]) => {
        return type.includes('_point');
    });
    const pointsTotal = points.reduce((sum, [, val]) => sum + val, 0);
    makeBox(playerPointsTotal, 'Total Points:', pointsTotal);
    points.filter(([type, _]) => {
        return numSpeciality == 0 ? !type.includes('special_') : true;
    }).forEach(([type, value]) => {
        makeBox(playerPointsDiv, typeText(gog_version, type), value);
    });
    
    if (pointsSystem == 'Points & Cones') {
        const cones = Object.entries(info).filter(([t, _]) => t.includes('_cone'));
        const conesTotal = cones.reduce((sum, [, val]) => sum + val, 0);
        if (gog_version == 'private') {
            makeBox(playerConesTotal, 'Total Cones:', conesTotal);
        } else if (gog_version == 'public') {
            makeBox(playerConesTotal, 'Total Shots:', conesTotal);
        }
        cones
            .filter(([t, _]) => allPlayers.length < 4 ? t != 'c_cone' : true)
            .forEach(([t, v]) => makeBox(playerConesDiv, typeText(gog_version, t), v));
    }
    
    const neighs = Object.entries(info).filter(([type, _]) => {
        return type.includes('neigh');
    });
    neighs.forEach(([type, value]) => {
        makeBox(playerCardsDiv, typeText(gog_version, type), 2 - value);
    });

    const goocs = Object.entries(info).filter(([type, _]) => {
        return type.includes('gooc');
    });
    goocs.forEach(([type, value]) => {
        makeBox(playerCardsDiv, typeText(gog_version, type), value);
    });

    info.speciality
    .filter(g => !info.games.find(gI => gI.game == g))
    .forEach(g => {
        const box = document.createElement('div');
        box.className = 'modal-box';
        box.appendChild(header('h2', `${g} (Speciality)`));
        
        const section = document.createElement('div');
        section.className = 'modal-player-game-section';
        section.appendChild(header('h3', 'Not Played'));
        box.appendChild(section);

        playerGamesDiv.appendChild(box);
    });

    info.games
    .sort((a, b) => a.num - b.num)
    .forEach(g => {
        const box = document.createElement('div');
        box.className = 'modal-box';
        
        const text = g.speciality ? ' (Speciality)' : '';
        box.appendChild(header('h2', `Game ${g.num}: ${g.game}${text}`));
        
        const section = document.createElement('div');
        section.className = 'modal-player-game-section';
        section.appendChild(header('h3', place(g.place)));
        section.appendChild(header('h3', '-'));
        section.appendChild(header('h3', g.reward));
        box.appendChild(section);

        playerGamesDiv.appendChild(box);
    });

    const boxes = playerModalBox.querySelectorAll('.modal-box');
    boxes.forEach(box => {
        box.style.backgroundColor = hexToRgba(info.colour, 0.6);
        box.style.boxShadow = `
            0 2px 6px rgba(0,0,0,0.2),     /* Subtle base shadow */
            0 4px 12px ${hexToRgba(info.colour, 0.4)}  /* Colored outer glow */
        `;
        box.style.color = hexToTextColour(info.colour);
    });
}

function closePlayer() {
    closeModal(playerModal, playerModalBox, 'down', () => {
        resetPlayer();
    });
}

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Modal
//


// #region

function openModal(modal, modalBox, colour = null, fromColour = null) {
    modal.classList.add('active');
    modal.style.display = 'flex';

    if (fromColour) {
        modalBox.style.backgroundColor = fromColour.rgba;
        modalBox.style.borderColor = fromColour.rgba;
        modalBox.style.color = fromColour.text;
    }

    modalBox.style.opacity = 0;
    modalBox.style.transition = 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease, opacity 0.2s ease, transform 0.2s ease';
    modalBox.style.display = 'flex';

    requestAnimationFrame(() => {
        modalBox.style.opacity = 1;
        modalBox.style.transform = 'scale(1.05)';
    });

    if (colour) {
        setTimeout(() => {
            modalBox.style.backgroundColor = colour.rgba;
            modalBox.style.borderColor = colour.rgba;
            modalBox.style.color = colour.text;
        }, 10);
    }
}

function growFromBoxToModal(box, modal, modalBox, colour = null, after = null) {
    const cells = box.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.visibility = 'hidden');

    const rect = box.getBoundingClientRect();
    const clone = box.cloneNode(true);
    clone.classList.add('grow-modal-clone');
    document.body.appendChild(clone);

    clone.style.top = `${rect.top}px`;
    clone.style.left = `${rect.left}px`;
    clone.style.width = `${rect.width}px`;
    clone.style.height = `${rect.height}px`;

    void clone.offsetWidth;

    clone.style.top = '10vh';
    clone.style.left = '10vw';
    clone.style.width = '80vw';
    clone.style.height = '80vh';

    document.body.classList.add('modal-active');

    const fromColour = window.getComputedStyle(box);
    const tempColour = {
        rgba: fromColour.backgroundColor,
        text: fromColour.color
    };

    setTimeout(() => {
        openModal(modal, modalBox, colour, tempColour);

        setTimeout(() => {
            clone.remove();
            if (typeof after === 'function') after();
        }, 100);
    }, 300);
}

function closeModal(modal, modalBox, direction, callback = null) {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.visibility = 'visible');

    modal.style.transition = 'opacity 0.4s ease';
    modalBox.style.transition = 'transform 0.4s ease';

    modal.style.opacity = 0;

    modalBox.style.transform =
        direction == 'up' ? 'translateY(-100vh) scale(0.01)' :
        direction == 'down' ? 'translateY(100vh) scale(0.01)' : '';

    setTimeout(() => {
        modal.style.display = 'none';

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


//
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
    
    const gamesRes = await fetch (`${BASE_ROUTE}/api/games`);
    gamesInfo = await gamesRes.json();

    const resultsRes = await fetch (`${BASE_ROUTE}/api/sessions/${sessionId}/results`);
    const results = await resultsRes.json();

    headerTitle.innerHTML = '';
    headerTitle.appendChild(header('h1', `Game of Games Results`));
    
    const session = results.session;
    if (!session) noSession();
    if (session) {
        const status = session.status;
        const players = results.players;
        const games = results.possible_games;
        const played = results.games_played;
        if (status == 'active') activeSession(session, players, games, played);
        if (status == 'incomplete') incompleteSession(session, players, games, played);
        if (status == 'complete') {
            const final = results.final_results;
            completedSession(session, players, games, played, final);
        }
    }

    const homeBtn = document.getElementById('home-button');
    homeBtn.addEventListener('click', () => window.location.href = '/');

    const closeBtns = document.querySelectorAll('.middle-close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'player-close') closePlayer();
            if (btn.id == 'game-close') closeGame();
        });
    });
}

// #endregion


initialise();
