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
    hexToRgb,
    hexToRgba,
    hexToTextColour,
    styleBox,
    getDisplayNames,
    header,
    place,
    centerOrStart,
    format,
    split,
    toSOrNotToS
} from '../js/utils.js';

import {
    loadMenuBurger,
    openUserModal,
    closeUserModal,
    setupUserModal,
    loadUserOption,
    initialiseUserButtons
} from './user.js';

import { BASE_ROUTE } from './config.js';

let user_data = null;

const userModal = document.getElementById('user-profile-modal');
const userBox = document.getElementById('user-profile-box');

let route = `${BASE_ROUTE}/api`;

let gog_version = 'public'
//gog_version = 'private'

const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');

if (!sessionId) {
  alert('Missing session ID! 2');
  window.location.href = '/';
}

let sessionOverview = {};
let session = {};
let gamesInfo = [];
let allPlayers = [];
let allSystems = {};

let theGame = {};

let displayNames = [];
let players = [];
let currPlayers = [];
let overallPlayers = [];
let games = [];
let gamesLeft = [];
let gameNumber = 0;
let numSpeciality = 0;
let refreshCount = 0;
let currSystem = '';
let pointsSystem = [];
let gameSelection = '';

let capturedImage = null;

let headerTitle = document.getElementById('header');
let centerDiv = document.getElementById('center-section')
let welcome = document.getElementById('welcome');
let otherWelcome = document.getElementById('top-title');
let gameTitle = document.getElementById('title');
let four20game = document.getElementById('four20game');
let wheelCone = document.getElementById('wheelCone');
let askNeigh = document.getElementById('askNeigh');
let askNeighSection = document.getElementById('askNeigh-section');
let gameWheelDiv = document.getElementById('game_wheel');
let playerWheelDiv = document.getElementById('player_wheel');
let choose = document.getElementById('choosing_game');
let voteDiv = document.getElementById('voting_game');
let modalContent = document.getElementById('gameModal');
let buttonBox = document.getElementById('buttonBox');

let headerLeftBtn = document.getElementById('left-mode-button');
let headerRightBtn = document.getElementById('right-mode-button');

let currGame = {};
let vote = false;
let cone = false;
let player_team = false;
let wheel_first = false;

let wheel_order = false;
let wheelOrderPlayers = [];
let wheelOrder = [];

let gold = 'linear-gradient(to right, rgb(191, 149, 63), rgb(252, 246, 186), rgb(179, 135, 40), rgb(251, 245, 183), rgb(170, 119, 28))';
let silver = 'linear-gradient(45deg, rgb(153, 153, 153) 5%, rgb(255, 255, 255) 10%, rgb(204, 204, 204) 30%, rgb(221, 221, 221) 50%, rgb(204, 204, 204) 70%, rgb(255, 255, 255) 80%, rgb(153, 153, 153) 95%)';
let bronze = 'linear-gradient(to right, rgb(205, 127, 50), rgb(229, 180, 126), rgb(168, 109, 40), rgb(217, 160, 103), rgb(139, 78, 19))';
let blue = 'linear-gradient(45deg, rgb(180, 216, 255) 5%, rgb(224, 244, 255) 15%, rgb(160, 198, 230) 35%, rgb(204, 232, 255) 50%, rgb(160, 198, 230) 70%, rgb(224, 244, 255) 85%, rgb(180, 216, 255) 95%)';

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Helper Functions
//


// #region

function getAllGamesSinceLastReset() {
    if (refreshCount != 0) {
        const lastIndex = theGame.games.findLastIndex(g => {
            return g.after?.includes('Refreshed games');
        });
        if (lastIndex >= 0) return theGame.games.slice(lastIndex + 1);
    }
    return [...theGame.games];
}

function gameInfo(name) {
    return gamesInfo.find(g => g.name == name);
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function addSpecialityTitle() {
    const players = currPlayers.filter(p => {
        return p.speciality.size != 0 && p.speciality.includes(currGame.name);
    }).map(p => p.name).sort((a, b) => !a.localeCompare(b));

    if (players.length != 0) {
        const title = document.getElementById('specialityTitle');
        title.innerHTML = `${format(players)}'s Speciality Game`;
        title.style.display = 'flex';
        title.style.color = curr_colour.text;
        //document.getElementById(`${currGame.tag}`).style.height = '65%';
    } else {
        //document.getElementById(`${currGame.tag}`).style.height = '70%';
    }
}

function reward(result) {
    console.log(result);
    let coin = result.base == 'pn' || result.base == 'pc' || result.base == 'nc';
    let text = result.reward;
    let num = 0;
    let type = '';

    if (text.includes('cone') && gog_version == 'private') {
        type = 'cone';
    } else if (text.includes('cone') && gog_version == 'public') {
        type = 'shot';
    } else if (text.includes('point')) {
        num = parseInt(text.split(' ')[0]);
        type = 'point';
    } else if (text == 'Nothing') {
        type = 'nothing';
    }

    let player = currPlayers.find(p => p.name == result.name);
    let isSpeciality = player.speciality.includes(currGame.name);
    if (isSpeciality && result.place == 1) {
        text = `${num + 1} points`;
    } else if (isSpeciality && result.place != 1 && !coin) {
        if (type == 'point' && num >= 3) text = `${num - 1} points`;
        if (type == 'point' && num == 2) text = '1 point';
        if (type == 'point' && num == 1) text = 'Nothing';
        if (type == 'nothing') text = '-1 point';
        if (type == 'cone') text = '1 cone & -1 point';
        if (type == 'shot') text = '1 shot & -1 point';
    } else if (isSpeciality && result.place != 1 && coin) {
        if (type == 'point' && num == 1) text = '1 coin flip point & -1 point';
        if (type == 'nothing') text = 'Nothing from coin flip & -1 point';
        if (type == 'cone') text = '1 coin flip cone & -1 point';
        if (type == 'shot') text = '1 coin flip shot & -1 point';
    } else if (!isSpeciality && coin) {
        if (type == 'point') text = '1 coin flip point';
        if (type == 'nothing') text = 'Nothing from coin flip';
        if (type == 'cone') text = '1 coin flip cone';
        if (type == 'shot') text = '1 coin flip shot';
    }

    result.reward = text;
    return text;
}

function isTeams(g) {
    if (g.results_type == 'team') return true;
    if (g.results_type == 'team_points') return true;
    if (g.results_type == 'multiple') {
        const type = document.getElementById(`${g.tag}_type`);
        if (type?.value == 'Teams') return true;
    }
    if (g.name == 'Mario Party') return currPlayers.length > 4;
    return false;
}

function display(players) {
    console.log(players);
    const playing = theGame.players.filter(p => p.is_playing);
    console.log(playing);
    displayNames = getDisplayNames(playing);
    console.log(displayNames);
    currPlayers.forEach(p => {
        console.log(p);
        p.name = displayNames.find(d => d.player_id == p.player_id).name;
    });
    return currPlayers;
}

function pad(time) {
    return time < 10 ? `0${time}` : `${time}`;
}

function getPointsSystem(num) {
    if (num < 2) return [];
    if (currSystem == 'Points & Cones') {
        return allSystems.find(s => {
            return s.type == 'cones' && s.num_players == num;
        })?.rewards;
    } else if (currSystem == 'Just Points') {
        return allSystems.find(s => {
            return s.type == 'points' && s.num_players == num;
        })?.rewards;
    } else {
        console.error(`Error with points system ${currSystem}`);
        return [];
    }
}

function roundResults(row, invalid) {
    const name = row.querySelector('th').textContent.trim();
    const player = currPlayers.find(p => p.name == name);
    const cols = row.querySelectorAll('td');
    let final = 0;
    let rounds = [];
    cols.forEach(col => {
        if (col.className == 'total-cell') {
            final = parseInt(col.textContent.trim(), 10);
        } else {
            const curr = col.querySelector('.editable');
            console.log(col.innerHTML);
            console.log(curr);
            console.log(' ');
            const value = curr.textContent.trim() ?? 0;
            rounds.push(value);
        }
    });

    return {
        player_id: player.player_id,
        name: name,
        points: !isNaN(final) ? final : invalid,
        rounds: rounds
    };
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Game Modal
//


// #region

const modal = document.getElementById('gameModal');
const gameModal = document.getElementById('gameModal-box');

function openGameBox(from) {
    if (from !== 'wheel') {
        curr_colour.hex = currGame.colour;
        curr_colour.rgba = hexToRgba(curr_colour.hex, 0.95);
        curr_colour.text = hexToTextColour(curr_colour.hex);
    }
    openModal(modal, gameModal, from, curr_colour);
}

function closeGameBox(to) {
    closeModal(modal, gameModal, 'down', to, () => {
        if (to == 'end') return;
        if (to == 'wheel') {
            updateHeaderButtons('hide');
            intrudeBtn.style.display = 'none';
            abandonBtn.style.display = 'none';
            breakConeBtn.style.display = 'none';
            victoryConeBtn.style.display = 'none';

            if (gameSelection == 'Choose') {
                choose.parentElement.style.display = 'none';
            } else if (gameSelection == 'Vote') {
                voteDiv.style.display = 'none';
            } else if (gameSelection == 'Wheel') {
                gameWheelDiv.style.display = 'none';
            }
        } else if (to == 'selection') {
            
        } else {
            console.log(`Other type: ${to}`);
        }
    });
}

// #endregion


//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Time
//


// #region

let startTime = null;

function timeDisplay() {
    const now = updateTimeDisplays();
    if (startTime) {
        let elapsedTime = '';
        const elapsedMs = now - startTime;
        const mins = Math.floor(elapsedMs / 60000);

        if (mins < 60) {
            const secs = Math.floor((elapsedMs % 60000) / 1000);
            elapsedTime = `⏱️ ${mins}m ${pad(secs)}s`;
        } else {
            const hours = Math.floor(mins / 60);
            elapsedTime = `⏱️ ${hours}h ${pad(mins % 60)}m`;
        }

        const div = document.getElementById('elapsed-time');
        div.innerHTML = '';
        div.appendChild(header('h3', elapsedTime));
    }
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              HTML objects
//


// #region

function createOption(value, placeholder, disabled = false) {
    let option = document.createElement('option');
    if (value == '') {
        option.value = '';
        option.disabled = true;
        option.selected = true;
        option.innerHTML = `${placeholder}`;
    } else {
        option.value = `${value}`;
        option.disabled = disabled;
        option.innerHTML = `${value}`;
    }
    return option;
}

function createNumInput(tag, max, placeholder) {
    let questionDiv = document.createElement('div');
    questionDiv.id = `${currGame.tag}_${tag.toLowerCase()}`;
    let input = document.createElement('input');
    input.type = 'number';
    input.className = 'num_box';
    input.id = `${currGame.tag}_${tag.toLowerCase()}Num`;
    input.max = max;
    input.placeholder = placeholder;
    questionDiv.appendChild(input);
    questionDiv.style.display = 'none';
    return questionDiv;
}

function createCheckbox(text, game) {
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';

    const cbx = document.createElement('div');
    cbx.className = 'cbx';
    checkbox.appendChild(cbx);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `cbx-${game}`;
    input.className = `${game}-checkbox`;
    cbx.appendChild(input);

    input.addEventListener('click', () => {
        if (game == '420') {
            if (four20Players.includes(text)) {
                four20Players = four20Players.filter(p => p != text);
            } else {
                four20Players.push(text);
            }
        } else if (game == 'win') {
            currWin = currWin == text ? '' : text;
        } else {
            console.error(`Error creating checkbox with ${game}`);
        }
    });

    const label = document.createElement('label');
    label.htmlFor = `cbx-${game}`;
    cbx.appendChild(label);

    // Create the SVG using createElementNS
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('viewBox', '0 0 15 14');
    svg.setAttribute('height', '14');
    svg.setAttribute('width', '15');
    cbx.appendChild(svg);

    // Create the path using createElementNS
    const tick = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tick.setAttribute('d', 'M2 8.36364L6.23077 12L13 3');
    svg.appendChild(tick);

    checkbox.appendChild(header('h2', text));

    return checkbox;
}

function createButton(id, className, text) {
    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.id = id;
    btn.className = className;
    btn.innerHTML = text;
    return btn;
}

function styleButton(btn, text, bg = null, shadow = null, display = null) {
    btn.style.color = text;
    if (bg) btn.style.backgroundColor = bg;
    if (shadow) btn.style.textShadow = shadow;
    if (display) btn.style.display = display;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Colours
//


// #region

let curr_colour = {
    hex: '#33eaff',
    rgba: hexToRgba('#33eaff', 0.85),
    text: '#000000'
}

function gameBoxColour() {
    curr_colour.hex = currGame.colour;
    curr_colour.rgba = hexToRgba(currGame.colour, 0.85);
    curr_colour.text = hexToTextColour(currGame.colour);
    return curr_colour;
}

function placeColour(place) {
    if (place == 1) return gold;
    if (place == 2) return silver;
    if (place == 3) return bronze;
    if (place > 3) return blue;
}

/*function wheelColour(index) {
    let colours = [
        '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
        '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
        '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
        '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
    ];
    return colours[index % colours.length];
}*/
function wheelColour(index) {
    let colours = [
        '#e6194B', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
        '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe',
        '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000',
        '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080'
    ];
    return hexToRgba(colours[index % colours.length], 0.8);
}

let colourOptions = [
    /*'#007BFF', // Primary Blue (anchor color)
    '#00C853', // Emerald Green
    '#FFD600', // Vivid Amber/Yellow
    '#FF3D00', // Fiery Red-Orange
    '#D500F9', // Vivid Purple
    '#00B8D4', // Bright Cyan
    '#FF4081', // Hot Pink (strong but readable)
    '#FF6D00', // Deep Orange
    '#6200EA', // Indigo Purple
    '#00E676'  // Neon Mint*/
    
    /*'#1E88E5', // Soft Blue
    '#43A047', // Forest Green
    '#FDD835', // Rich Yellow
    '#FB8C00', // Pumpkin Orange
    '#8E24AA', // Plum
    '#00ACC1', // Deep Teal
    '#EC407A', // Rose
    '#F4511E', // Red Clay
    '#5E35B1', // Grape Purple
    '#26A69A'  // Jade Green*/

    /*'#6A1B9A', // Royal Purple
    '#AD1457', // Deep Raspberry
    '#C62828', // Rich Red
    '#EF6C00', // Burnt Orange
    '#F9A825', // Goldenrod
    '#2E7D32'  // Forest Green*/

    /*'#37474F', // Charcoal
    '#4E342E', // Brown
    '#546E7A', // Blue-Grey
    '#263238', // Gunmetal
    '#6D4C41', // Chocolate
    '#78909C', // Ash
    '#90A4AE', // Cloudy Slate
    '#B71C1C', // Blood Red
    '#F57F17', // Old Gold
    '#33691E'  // Dark Olive*/

    /*'#007bff',
    '#d36be7',
    '#ff6bb3',
    '#ff917e',
    '#ffc65f',
    '#f9f871'*/

    /*'#007BFF', // Vivid Blue (primary)
  '#6F42C1', // Indigo Purple
  '#FF6BB3', // Candy Pink
  '#FF5252', // Vibrant Red
  '#43A047', // Leafy Green
  '#FF917E', // Soft Coral
  '#FFC65F', // Warm Yellow
  '#F9F871'  // Pale Yellow*/

  '#66BB6A', // Leafy Green (fields, nature)
  '#43A047', // Forest Green (darker sports tone)
  '#FFC65F', // Warm Yellow (optimistic, balanced)
  '#F9F871', // Pale Yellow (light end, clean & soft)
  '#007BFF', // Anchor Blue (primary theme)
  '#6F42C1', // Deep Indigo (cool contrast)
  '#D36BE7', // Soft Lilac (bridges to warm tones)
  '#FF6BB3', // Vibrant Pink (energetic highlight)
  '#FF917E', // Coral (soft red-orange)
  '#EF5350', // True Red (for action/sport vibes)
];
let coloursUsed = [];
//let forward = true;

function nextColour() {
    if (colourOptions.length == coloursUsed.length) {
        coloursUsed = [];
        //colourOptions = shuffle(colourOptions);
        //forward = !forward;
    }
    const newColours = colourOptions.filter(c => !coloursUsed.includes(c));
    let colour = newColours[0];//forward ? 0 : newColours.length - 1];
    coloursUsed.push(colour);
    return colour;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Game Mode
//


// #region

const modes = ['Choose', 'Vote', 'Wheel'];
let leftMode = '';
let rightMode = '';

function hideAllGameModes(hide) {
    gameWheelDiv.style.display = hide ? 'none' : 'flex';
    playerWheelDiv.style.display = hide ? 'none' : 'flex';
    voteDiv.style.display = hide ? 'none' : 'flex';
    voteBtn.style.display = hide ? 'none' : 'flex';
    choose.parentElement.style.display = hide ? 'none' : 'flex';
}

function updateGameModeUI(type) {
    hideAllGameModes(true);

    if (type == 'Wheel') {
        replaceSectors('games', shuffle(gamesLeft.map(p => p.name)));
    }
    if (type == 'Choose') openChoosing();
    if (type == 'Vote') openVote();

    gameSelection = type;
    updateHeaderButtons('text');
}

function updateHeaderButtons(type) {
    if (type == 'start') {
        const others = modes.filter(m => m != gameSelection);
        leftMode = others[0];
        rightMode = others[1];
        updateHeaderButtons('text');
    } else if (type == 'text') {
        headerLeftBtn.innerHTML = `Change to<br>${leftMode}`;
        headerRightBtn.innerHTML = `Change to<br>${rightMode}`;
        headerLeftBtn.onclick = () => switchMode('left');
        headerRightBtn.onclick = () => switchMode('right');
    } else if (type == 'hide') {
        headerLeftBtn.style.display = 'none';
        headerRightBtn.style.display = 'none';
    } else if (type == 'show') {
        headerLeftBtn.style.display = 'flex';
        headerRightBtn.style.display = 'flex';
    }
}

function switchMode(side) {
    const newMode = side == 'left' ? leftMode : rightMode;
    if (side == 'left') leftMode = gameSelection;
    if (side == 'right') rightMode = gameSelection;
    gameSelection = newMode;
    updateGameModeUI(gameSelection);
    updateHeaderButtons('text');
}


// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              The Wheel
//


// #region

let sectors = [];
let old_sectors = [];
let theGameWheel = null;
let thePlayerWheel = null;

// Spin function
function spinWheel(type) {
    console.log(type);
    if (type == 'games' && theGameWheel) theGameWheel.startAnimation();
    if (type == 'cone' && thePlayerWheel) thePlayerWheel.startAnimation();
}

// Handle spin result
function onSpinEnd(indicatedSegment, type) {
    console.log('Result:', indicatedSegment.text);
    console.log('Type: ', type);

    welcome.style.display = 'none';
    const result = indicatedSegment.text;
    if (type == 'games') {
        if (result == 'CONE') {
            cone = true;
            old_sectors = [...sectors];
            otherWelcome.innerHTML = 'Cone Wheel';
            replaceSectors('cone', shuffle(currPlayers.map(p => p.name)));
            playerWheelDiv.style.display = 'flex';
        } else if (result == 'SHOT') {
            shot = true;
            old_sectors = [...sectors];
            otherWelcome.innerHTML = 'Shot Wheel';
            replaceSectors('shot', shuffle(currPlayers.map(p => p.name)));
            playerWheelDiv.style.display = 'flex';
        } else {
            //growFromBoxToModal(box, modal, gameModal, curr_colour, () => {
                currGame = gameInfo(result);
                gamesLeft = gamesLeft.filter(g => g.name != result);
                if (result == '4:20 Game') {
                    const gameDiv = document.getElementById(`${currGame.tag}`);
                    if (gameDiv) gameDiv.style.display = 'none';
                    create420Game();
                } else {
                    gameTitle.innerHTML = `Game ${gameNumber} - ${result}`;
                    gameTitle.style.display = 'block';
                    if (vote) {
                        toPlayOrNotToPlay(1);
                        addSpecialityTitle();
                    } else {
                        startNeigh(result);
                    }
                }
            //});
        }
        gameWheelDiv.style.display = 'none';
    } else if (type == 'cone' || type == 'shot') {
        console.log(old_sectors);
        console.log(sectors);
        playerWheelDiv.style.display = 'none';
        wheelCone.style.display = 'flex';
        centerDiv.style.justifyContent = 'flex-start';
        centerDiv.style.gap = '5rem';

        const ratatouille = document.getElementById('ratatouille');
        if (gog_version == 'private') {
            ratatouille.innerHTML =
                result == 'EVERYONE' ? 'Ratatouille Everyone!' :
                result == 'NO ONE' ? 'No one is having a cone lol' :
                `Ratatouille ${result}!`;
        } else if (gog_version == 'public') {
            ratatouille.innerHTML =
                result == 'EVERYONE' ? 'Ratatouille Everyone!' :
                result == 'NO ONE' ? 'No one is having a shot lol' :
                `Ratatouille ${result}!`;
        }

        
        const completeBtn = document.getElementById('wheelComplete');
        if (gog_version == 'private') {
            completeBtn.innerHTML = 'Cone<br>Complete';
        } else if (gog_version == 'public') {
            completeBtn.innerHTML = 'Shot<br>Complete';
        }
        completeBtn.style.display = 'flex';
        completeBtn.style.textShadow = 'none';
        completeBtn.addEventListener('click', () => {
            const lastGame = theGame.games.at(-1);
            if (result == 'EVERYONE') {
                currPlayers.forEach(p => logCone(p.player_id, 'wheel'));
                if (lastGame) lastGame.after.push('Everyone had a WHEEL cone');
            } else if (result != 'NO ONE') {
                let player = currPlayers.find(p => p.name == result);
                if (player) logCone(player.player_id, 'wheel');
                if (lastGame) lastGame.after.push(`${p.name} had a WHEEL cone`);
            } else if (lastGame) {
                lastGame.after.push('The cone wheel was spun but no one had a cone');
            }
            
            cone = false;
            wheelCone.style.display = 'none';
            playerWheelDiv.style.display = 'none';

            otherWelcome.innerHTML = `Game ${gameNumber}`;
            otherWelcome.style.display = 'flex';
            const games = old_sectors.filter(s => s.text != 'CONE');
            replaceSectors('games', shuffle(games.map(s => s.text)));
        });
    } else if (player_team) {
        //growFromBoxToModal(box, modal, gameModal, curr_colour, () => {
            player_team = false;
            const go = result.includes('and') ? 'go' : 'goes';
            const first = `${result} ${go} first!`;
            const starting = header('h2', first, '', 'starting-player');
            document.getElementById(`${currGame.tag}`).prepend(starting);
            playerWheelDiv.style.display = 'none';
            openGameBox('wheel');
            startGame();
        //});
    } else if (wheel_first) {
        //growFromBoxToModal(box, modal, gameModal, curr_colour, () => {
            wheel_first = false;
            const first = `${result} goes first`;
            const starting = header('h2', first, '', 'starting-player');
            document.getElementById(`${currGame.tag}`).prepend(starting);
            playerWheelDiv.style.display = 'none';
            openGameBox('wheel');
            startGame();
        //});
    } else if (wheel_order) {
        wheelOrderPlayers.push(result);
        wheelOrder = wheelOrder.filter(p => p != result);
        if (wheelOrder.length == 0) {
            //growFromBoxToModal(box, modal, gameModal, curr_colour, () => {
                wheel_order = false;
                const order = `The order is ${wheelOrderPlayers.join(', ')}`;
                const starting = header('h2', order, '', 'starting-player');
                document.getElementById(`${currGame.tag}`).prepend(starting);
                playerWheelDiv.style.display = 'none';
                openGameBox('wheel');
                startGame();
                wheelOrderPlayers = [];
            //});
        } else {
            replaceSectors('players', shuffle(wheelOrder));
        }
        console.log(wheelOrderPlayers);
        console.log(wheelOrder);
    } else if (fiveCrowns) {
        //growFromBoxToModal(box, modal, gameModal, curr_colour, () => {
            fiveCrownsOrder.push(result);
            fiveCrownsRounds = fiveCrownsRounds.filter(r => r != result);
            const earlyEnd = fiveCrownsOrder.length == fiveCrownsNum;
            if (earlyEnd) fiveCrowns = false;
            playerWheelDiv.style.display = 'none';
    
            const tableDiv = document.getElementById(`five_crowns_header_${fiveCrownsOrder.length}`);
            if (tableDiv) tableDiv.textContent = `${result} cards`;
    
            openGameBox('wheel');
            if (fiveCrownsRounds.length == 0 || earlyEnd) fiveCrownsOrder = [];
        //});
    }
}

function replaceSectors(type, options) {
    console.log(type);
    console.log(options);
    let typeId =
        type == 'games' || type == 'five_crowns' ? 'wheelCanvas' :
        type == 'cone' || type == 'shot' || type == 'players' ? 'wheelCanvas2' :
        null;
    
    if (!typeId) {
        console.log(`CANVAS ERROR: ${type} - ${typeId}`);
        return;
    }

    let canvas = document.getElementById(typeId);
    let ctx = canvas.getContext('2d');

    let canvasCenter = canvas.height / 2;

    let radGradientRed = ctx.createRadialGradient(canvasCenter, canvasCenter, 50, canvasCenter, canvasCenter, 250);
    let radGradientBlue = ctx.createRadialGradient(canvasCenter, canvasCenter, 50, canvasCenter, canvasCenter, 250);

    radGradientRed.addColorStop(0, hexToRgba('#e4483f', 0.8));
    radGradientRed.addColorStop(0.8, hexToRgba('#ffffff', 0.4));
    radGradientRed.addColorStop(1, hexToRgba('#e4483f', 0.6));
    
    radGradientBlue.addColorStop(0, hexToRgba('#33eaff', 0.8));
    radGradientBlue.addColorStop(0.8, hexToRgba('#ffffff', 0.4));
    radGradientBlue.addColorStop(1, hexToRgba('#33eaff', 0.6));
    
    const gradient = (i) => i % 2 == 0 ? radGradientRed : radGradientBlue;
    const wheel = (sectors) => {
        return new Winwheel({
            canvasId: typeId,
            outerRadius: 250,
            textFontSize: 16,
            pointerAngle: 90,
            numSegments: sectors.length,
            segments: sectors,
            animation: {
                type: 'spinToStop',
                duration: 3,
                spins: 6,
                callbackFinished: (s) => onSpinEnd(s, type)
            }
        });
    };

    if (type == 'games') {
        const size = 360 / (options.length + 0.5);
        const small = size / 2;

        sectors = options.map(text => ({ text, size }));
        if (gog_version == 'private') {
            sectors.push({ text: 'CONE', size: small });
        } else if (gog_version == 'public') {
            sectors.push({ text: 'SHOT', size: small });
        }
        sectors = shuffle(sectors);
        sectors.forEach((s,i) => s.fillStyle = gradient(i));

        theGameWheel = wheel(sectors);
        gameWheelDiv.style.display = 'flex';

    } else if (type == 'cone' || type == 'shot') {
        old_sectors = [...sectors];
        
        const size = 360 / (options.length + 1);
        const otherSize = size / 2;
    
        sectors = options.map(text => ({ text, size }));
        sectors.push({ text: 'EVERYONE', size: otherSize });
        sectors.push({ text: 'NO ONE', size: otherSize });
        sectors = shuffle(sectors);
        sectors.forEach((s,i) => s.fillStyle = gradient(i));

        thePlayerWheel = wheel(sectors);
        playerWheelDiv.style.display = 'flex';

    } else if (type == 'players') {
        const size = 360 / options.length;
    
        sectors = options.map(text => ({ text, size }));
        sectors = shuffle(sectors);
        sectors.forEach((s,i) => s.fillStyle = gradient(i));
        
        thePlayerWheel = wheel(sectors);
        playerWheelDiv.style.display = 'flex';

    } else if (type == 'five_crowns') {
        const size = 360 / options.length;
        
        sectors = options.map(text => ({ text, size }));
        sectors = shuffle(sectors);
        sectors.forEach((s,i) => s.fillStyle = gradient(i));
        
        fiveCrowns = true;
        theGameWheel = wheel(sectors);
        gameWheelDiv.style.display = 'flex';
    }
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Choosing
//


// #region

const orderedTypes = ['card', 'board', 'video', 'party', 'outdoor'];
const typeLabels = {
    card: '🎴 Card Games 🃏',
    board: '🎲 Board Games ♟',
    video: '🎮 Video Games 🕹️',
    party: '🎉 Party Games 🍃',
    outdoor: '🏕️ Outdoor Games 🏓'
};

function openChoosing() {
    const choosingDiv = document.createElement('div');
    choosingDiv.id = 'choosing';
    
    let groupedGames = {};
    gamesLeft.forEach(game => {
        if (!groupedGames[game.type]) groupedGames[game.type] = [];
        groupedGames[game.type].push(game);
    });

    orderedTypes.forEach(type => {
        if (!groupedGames[type]) return;
        coloursUsed = [];

        const section = document.createElement('section');
        section.className = 'gameSection';
        
        const heading = document.createElement('h2');
        heading.className = 'gameHeading';
        heading.textContent = typeLabels[type];
        section.appendChild(heading);
        
        const wrapper = document.createElement('div');
        wrapper.className = 'gameGrid';
        wrapper.id = `choosing-${type}`;

        groupedGames[type]
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(game => createChoosingBox(wrapper, game));

        section.appendChild(wrapper);
        choosingDiv.appendChild(section);
    });

    choose.innerHTML = '';
    choose.appendChild(choosingDiv);
    choose.style.display = 'flex';
    choose.parentElement.style.display = 'flex';
}

function createChoosingBox(div, game) {
    const box = document.createElement('div');
    box.className = 'gameBox';
    box.id = game ? `${game.tag}_box` : 'four20_game_box';
    const colour = nextColour(game);
    game.colour = colour;
    styleBox(box, colour);

    box.appendChild(header('h3', game.name));
    box.addEventListener('click', () => {
        const modal = document.getElementById('gameModal');
        const gameModal = document.getElementById('gameModal-box');
        curr_colour.hex = colour;
        curr_colour.rgba = hexToRgba(colour, 1);
        curr_colour.text = hexToTextColour(colour);
        growFromBoxToModal(box, modal, gameModal, curr_colour, () => {
            welcome.style.display = 'none';
            currGame = game;
    
            if (game.name === '4:20 Game') {
                create420Game();
            } else {
                gameTitle.innerHTML = `Game ${gameNumber} - ${game.name}`;
                gamesLeft = gamesLeft.filter(g => g.name !== game.name);
                toPlayOrNotToPlay(1);
                addSpecialityTitle();
                gameTitle.style.display = 'block';
            }
    
            openGameBox('click');
        });
    });
    div.appendChild(box);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Voting
//


// #region

let currVotes = [];
const voteBtn = document.getElementById('vote');

function openVote() {
    vote = true;
    const div = document.getElementById('voting');
    div.innerHTML = '';

    currPlayers
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(player => div.appendChild(createVote(player)));

    voteDiv.style.display = 'flex';
}

function createVote(player) {
    const info = allPlayers.find(p => p.player_id == player.player_id);
    const box = document.createElement('div');
    box.className = 'playerBox';
    box.id = `${player.name}_vote`;
    styleBox(box, info.colour);

    const votingPlayer = header('h1', player.name);
    votingPlayer.style.textDecoration = 'underline';
    votingPlayer.style.fontSize = '1.8rem';
    box.appendChild(votingPlayer);

    box.appendChild(createCustomDropdown(
        gamesLeft, info.colour, true, 'vote', player
    ));
    
    return box;
}

function createCustomDropdown(options, colour, random, type = '', player = null) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.style.position = 'relative';

    const btn = createButton('dropbtn', 'dropbtn', 'Vote');
    styleButton(btn, hexToTextColour(colour), colour);
    dropdown.appendChild(btn);

    const content = document.createElement('div');
    content.className = 'dropdown-content';

    const create = (value) => {
        const option = document.createElement('a');
        option.href = '#';
        option.textContent = value;
        option.dataset.value = value;
        option.style.textAlign = 'center';
        option.style.background = colour;
        option.style.color = hexToTextColour(colour);
        option.addEventListener('click', (e) => {
            e.preventDefault();
            btn.textContent = value;
            btn.dataset.value = value;
            content.style.display = 'none';

            let game = value;
            if (value == 'RANDOM') {
                const index = Math.floor(Math.random() * options.length);
                game = options[index].name;
                btn.textContent = game;
            }

            if (type == 'vote') {
                let voteSize = currPlayers.length;
                let curr = currVotes.find(v => v.name == player.name);
                if (curr) curr.vote = game;
                if (!curr) currVotes.push({
                    player_id: player.player_id,
                    name: player.name,
                    vote: game 
                });
                if (currVotes.length == voteSize) voteBtn.style.display = 'flex';
            } else if (type == 'neigh') {

            }
        });
        return option;
    }

    if (random) content.appendChild(create('RANDOM'));
    options.sort((a, b) => a.name.localeCompare(b.name))
    .forEach(g => content.appendChild(create(g.name)));
             
    dropdown.addEventListener('mouseenter', () => content.style.display = 'block');
    dropdown.addEventListener('mouseleave', () => content.style.display = 'none');
    dropdown.appendChild(content);

    return dropdown;
}

function submitVotes() {
    welcome.style.display = 'none';
    otherWelcome.innerHTML = `Game ${gameNumber}`;
    otherWelcome.style.display = 'flex';
    voteDiv.style.display = 'none';
    voteBtn.style.display = 'none';
    const voting = document.getElementById('voting').children
    Array.from(voting).forEach(v => v.lastChild.value = '');
    let newGames = [];
    currVotes.forEach(v => newGames.push(v.vote));
    replaceSectors('games', shuffle(newGames));
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Neighs
//


// #region

function startNeigh(game) {
    let gameHeader = document.getElementById('neigh_game_header');
    if (gameHeader) gameHeader.innerHTML = `Game: ${game}`;
    if (!gameHeader) {
        askNeigh.prepend(header(
            'h1', `Game: ${game}`, '', 'neigh_game_header'
        ));
    }
    askNeigh.style.display = `flex`;
}

function resetNeigh() {
    askNeigh.style.display = 'none';
    showNeigh(1);
    hideNeigh(2);
    hideNeigh(3);
}

function hideNeigh(num) {
    document.getElementById(`neighButtons${num}`).style.display = 'none';
    document.getElementById(`ask${num}`).style.display = 'none';
    document.getElementById(`yesNeigh${num}`).style.display = 'none';
    document.getElementById(`noNeigh${num}`).style.display = 'none';
}

function showNeigh(num) {
    document.getElementById(`neighButtons${num}`).style.display = 'flex';
    document.getElementById(`ask${num}`).style.display = 'block';
    document.getElementById(`yesNeigh${num}`).style.display = 'flex';
    document.getElementById(`noNeigh${num}`).style.display = 'flex';
}

function toPlayOrNotToPlay(num) {
    if (num == 1 || num == 3) {
        createGame();
        document.getElementById(`${currGame.tag}`).style.display = 'flex';
        document.getElementById(`${currGame.tag}_setup`).style.display = 'flex';
    } else if (num == 2) {
        otherWelcome.innerHTML = `Game ${gameNumber}`;
        otherWelcome.style.display = 'flex';
        updateHeaderButtons('show');
        console.log(sectors);
        if (gameSelection == 'Wheel'){
            replaceSectors('games', sectors.map(s => s.text));
        } else if (gameSelection == 'Choose') {
            openChoosing();
        } else if (gameSelection == 'Vote') {
            openVote();
        }
    } else {
        console.error(`Error with num: ${num}`);
    }
}

function neigh(option, num) {
    resetNeigh();
    if (option) {
        let goBack = document.getElementById('goBack');
        if (!goBack) {
            goBack = createButton('goBack', 'pre-game-button', 'Go Back');
        }
        goBack.style.display = 'flex';
        askNeigh.style.display = 'flex';
        for (let i = 0; i < 3; i++) hideNeigh(i + 1);

        const possiblePlayers = currPlayers.filter(p => p.neigh > 0 || p.super_neigh > 0);

        if (possiblePlayers.length === 0) {
            const noPlayers = header('h3', 'Too bad, no one can', '', 'noPlayers');
            noPlayers.style.marginBottom = '30px';
            askNeighSection.appendChild(noPlayers);
            toPlayOrNotToPlay(num);
        } else {
            let neighOptions = document.getElementById('neighOptions');
            if (neighOptions) {
                askNeighSection.removeChild(neighOptions);
            } else {
                neighOptions = document.createElement('div');
                neighOptions.id = 'neighOptions';
            }
            askNeighSection.appendChild(neighOptions);

            const select = document.getElementById('selectNeighPlayer');
            select.innerHTML = '';
            select.style.display = 'flex';
            select.appendChild(createOption('', 'Who?...'));
            possiblePlayers.forEach(p => select.appendChild(createOption(`${p.name}`, '')));
            neighOptions.appendChild(select);

            const selectHandler = () => {
                const selectType = document.getElementById('selectNeighType');
                selectType.innerHTML = '';
                selectType.style.display = 'flex';
                selectType.appendChild(createOption('', 'What type?...'));

                const player = currPlayers.find(p => p.name == select.value);
                if (player.neigh > 0) selectType.appendChild(createOption('Neigh', ''));
                if (player.super_neigh > 0) selectType.appendChild(createOption('Super Neigh', ''));
                neighOptions.appendChild(selectType);

                const typeHandler = () => {
                    let neighButton = document.getElementById('submitNeigh');
                    if (neighButton) {
                        askNeighSection.removeChild(neighButton);
                        askNeighSection.appendChild(neighButton);
                    } else {
                        neighButton = createButton('submitNeigh', 'pre-game-button', 'Submit Neigh');
                        askNeighSection.appendChild(neighButton);
                    }

                    neighButton.onclick = () => {
                        const player = allPlayers.find(p => p.name == select.value);
                        logNeigh(player.id, selectType.value);
                        goBack.style.display = 'none';
                        select.style.display = 'none';
                        selectType.style.display = 'none';
                        neighButton.style.display = 'none';
                        for (let i = 0; i < 3; i++) hideNeigh(i + 1);
                        showNeigh(num == 3 ? 2 : num + 1);
                    };
                    neighButton.style.display = 'block';
                };

                selectType.removeEventListener('change', typeHandler);
                selectType.addEventListener('change', typeHandler);
            };

            select.removeEventListener('change', selectHandler);
            select.addEventListener('change', selectHandler);

            askNeighSection.appendChild(goBack);

            const backHandler = () => {
                select.style.display = 'none';
                document.getElementById('selectNeighType').style.display = 'none';
                goBack.style.display = 'none';
                const submit = document.getElementById('submitNeigh')
                if (submit) submit.style.display = 'none';
                for (let i = 0; i < 3; i++) hideNeigh(i + 1);
                showNeigh(num);
            }

            goBack.removeEventListener('click', backHandler);
            goBack.addEventListener('click', backHandler);
        }
    } else {
        toPlayOrNotToPlay(num);
    }
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Coin Flip
//


// #region

let coinsClicked = [];

function createCoin(size, results, coins, box, result) {
    let guess = '';

    let player = document.createElement('div');
    player.id = 'player_coin';
    player.appendChild(header('h2', result.name, '', 'player_coin_header'));

    const buttons = document.createElement('div');
    buttons.id = 'player_coin_options';
    player.appendChild(buttons);

    const headsBtn = createButton('', 'button', 'Heads');
    styleButton(headsBtn, curr_colour.text, curr_colour.hex, 'none', 'flex');
    buttons.appendChild(headsBtn);
    
    const tailsBtn = createButton('', 'button', 'Tails');
    styleButton(tailsBtn, curr_colour.text, curr_colour.hex, 'none', 'flex');
    buttons.appendChild(tailsBtn);
    
    let coin = document.createElement('div');
    coin.id = 'coin';
    coin.style.display = 'none';
    player.appendChild(coin);

    let sideA = document.createElement('div');
    sideA.id = 'side_a';
    sideA.appendChild(header('h3', 'Heads', 'black', 'side_a_text'));
    coin.appendChild(sideA);

    let sideB = document.createElement('div');
    sideB.id = 'side_b';
    sideB.appendChild(header('h3', 'Tails', 'black', 'side_b_text'));
    coin.appendChild(sideB);

    let rewardHeader = header('h3', '');
    player.appendChild(rewardHeader);

    headsBtn.addEventListener('click', () => {
        styleButton(headsBtn, curr_colour.hex, curr_colour.text, 'none', 'flex');
        styleButton(tailsBtn, curr_colour.text, curr_colour.hex, 'none', 'flex');
        coin.style.display = 'flex';
        sideA.style.background = gold;
        sideB.style.background = blue;
        guess = 'heads';
    });

    tailsBtn.addEventListener('click', () => {
        styleButton(headsBtn, curr_colour.text, curr_colour.hex, 'none', 'flex');
        styleButton(tailsBtn, curr_colour.hex, curr_colour.text, 'none', 'flex');
        coin.style.display = 'flex';
        sideA.style.background = blue;
        sideB.style.background = gold;
        guess = 'tails';
    });

    let type = result.base;
    coinsClicked = [];
    coin.addEventListener('click', () => {
        let currCoin = coins.find(c => c.name == result.name);
        if (currCoin.result == 'heads' || currCoin.result == 'tails') return;
        
        let newResult = Math.random() < 0.5 ? 'heads' : 'tails';
        coin.classList.remove('heads', 'tails');
        void coin.offsetWidth;
        coin.classList.add(newResult);

        currCoin.result = newResult;
        if (newResult == guess) {
            if (type == 'pn' || type == 'pc') {
                result.reward = '1 point';
            } else if (type == 'nc') {
                result.reward = 'Nothing';
            }
        } else {
            if (type == 'pc' || type == 'nc') {
                result.reward = '1 cone';
            } else if (type == 'pn') {
                result.reward = 'Nothing';
            }
        }
        currCoin.reward = result.reward;

        coin.addEventListener('animationend', function handleAnimationEnd() {
            coin.removeEventListener('animationend', handleAnimationEnd);
    
            rewardHeader.innerHTML = `Reward: ${result.reward}`;
    
            coinsClicked.push(currCoin);
            if (coinsClicked.length == size) {
                setTimeout(() => {
                    const coinBox = document.getElementById('coin_box');
                    coinBox.innerHTML = '';
                    submitResults(results);
                }, 2000);
            }
        });
    });

    box.style.display = 'flex';
    box.appendChild(player);

    return { name: result.name, result: '' , reward: '' };
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Timer
//


// #region

function createTimer(mins = 0, secs = 0) {
    const timer = document.createElement('div');
    timer.id = `${currGame.tag}_timer`;
    timer.className = 'game_timer';

    const circleSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    circleSVG.setAttribute('class', 'timer-circle');
    circleSVG.setAttribute('width', '160');
    circleSVG.setAttribute('height', '160');
    timer.appendChild(circleSVG);

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    bg.setAttribute('class', 'circle-background');
    bg.setAttribute('cx', '50%');
    bg.setAttribute('cy', '50%');
    bg.setAttribute('r', '70');
    circleSVG.appendChild(bg);

    const progress = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    progress.setAttribute('class', 'circle-progress');
    progress.setAttribute('cx', '50%');
    progress.setAttribute('cy', '50%');
    progress.setAttribute('r', '70');
    progress.style.strokeDasharray = 440;
    progress.style.strokeDashoffset = 0;
    progress.style.stroke = 'black';
    circleSVG.appendChild(progress);

    const timeText = document.createElement('div');
    timeText.id = 'timer-text';
    timeText.innerHTML = `${mins}:${pad(secs)}`;
    timer.appendChild(timeText);

    return timer;
}

function startTimer(mins = 0, secs = 0) {
    const timerText = document.getElementById('timer-text');
    const progressCircle = document.querySelector('.circle-progress');
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    let totalTime = mins * 60 + secs;
    const totalDuration = totalTime;

    progressCircle.style.strokeDasharray = `${circumference}`;
    progressCircle.style.strokeDashoffset = `0`;

    const interval = setInterval(() => {
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;

        timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        const progress = totalTime / totalDuration;
        const dashOffset = circumference * (1 - progress);
        progressCircle.style.strokeDashoffset = dashOffset;

        if (progress > 0.6) {
            progressCircle.style.stroke = 'black';
        } else if (progress > 0.3) {
            progressCircle.style.stroke = '#ffeb3b';
        } else {
            progressCircle.style.stroke = '#f44336';
        }

        if (totalTime <= 0) {
            clearInterval(interval);
            if (currGame.name == '4:20 Game' && four20Results.innerHTML == '') {
                timerText.textContent = '0:00';
                complete420Game(false);
            } else if (currGame.name == 'Alphabetix') {
                timerText.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
                progressCircle.style.stroke = 'black';
                document.getElementById('alphabetix-timer-start').style.display = 'block';
                document.getElementById('alphabetix-current-letter').style.display = 'none';
            }
        } else {
            totalTime--;
        }
    }, 1000);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Intrude Game
//


// #region

const intrudeBtn = document.getElementById('intrude');
const intrudeModal = document.getElementById('intrudeModal');
const intrudeBox = document.getElementById('intrude-game-box');
const intrudeGameGamesDiv = document.getElementById('intrude-game-games');
const intruderSpecialitiesDiv = document.getElementById('intrude-game-specialities');
const intrudeGameBtn = document.getElementById('intrude-game-button');
let intrudeOptions = [];
let intruderSpecialities = [];
let intrudeGameAdd = [];
let intrudeGameDel = [];

function openIntrude() {
    curr_colour.hex = '#33eaff';
    curr_colour.rgba = hexToRgba('#33eaff', 0.85);
    curr_colour.text = '#000000';

    openModalWithFakeGrow(
        intrudeBtn,
        intrudeModal,
        intrudeBox,
        curr_colour,
        setupIntrude()
    );
}

function setupIntrude() {
    const intrudeDiv = document.getElementById('intrude-game-players');
    intrudeDiv.innerHTML = '';
    intrudeOptions = [];

    const playerNames = getDisplayNames(allPlayers);
    const players = allPlayers.filter(p => !currPlayers.find(cP => cP.player_id == p.player_id));
    players.forEach(p => intruderSpecialities.push({
        player_id: p.player_id,
        selected: false,
        games: []
    }));
    players.forEach(p => {
        let player_id = p.player_id;
        let name = playerNames.find(pN => pN.player_id == player_id).name;
        intrudeOptions.push({ player_id, name, selected: false });
        
        const btn = createButton('', 'middle-game-button intrude-game-player', '');
        styleButton(btn, 'black', 'white', null, 'flex');
        btn.addEventListener('click', () => {
            const isSelected = btn.classList.toggle('intrude-game-selected');
            btn.style.backgroundColor = isSelected ? p.colour : 'white';
            btn.style.color = isSelected ? hexToTextColour(p.colour) : 'black';

            let option = intrudeOptions.find(o => o.player_id == player_id);
            if (option) option.selected = !option.selected;

            refreshAllIntruderDropdowns();

            const div = document.getElementById(`intrude-game-${p.player_id}`);
            div.style.display = div.style.display == 'none' ? 'flex' : 'none';
            intruderSpecialitiesDiv.style.display = 'flex';
            centerOrStart(intruderSpecialitiesDiv, 'justify');

            intrudeGames(intrudeOptions.filter(pO => pO.selected));
        });

        btn.appendChild(header('h2', name));
        intrudeDiv.appendChild(btn);

        const playerDiv = document.createElement('div');
        playerDiv.id = `intrude-game-${p.player_id}`;
        playerDiv.className = 'intrude-game-player-div';
        const game = toSOrNotToS(numSpeciality, 'Game');
        playerDiv.appendChild(header('h3', `Select ${name}'s Speciality ${game}:`));

        const specialityDiv = document.createElement('div');
        specialityDiv.id = `intrude-game-${p.player_id}-specialities`;
        specialityDiv.className = 'intrude-game-player-specialities';
        playerDiv.appendChild(specialityDiv);
        
        const text = currSystem == 'Points & Cones' ? 'Ratatouille' : 'Welcome';
        const welcome = header('h3', `${text} ${p.name}!`);
        welcome.style.display = 'none';
        welcome.id = `intruder-welcome-${p.player_id}`;
        playerDiv.appendChild(welcome);

        playerDiv.style.display = 'none';
        intruderSpecialitiesDiv.appendChild(playerDiv);
    });
    intrudeGameBtn.removeEventListener('click', intrude);
    intrudeGameBtn.addEventListener('click', intrude);
}

function intrudeGames(players) {
    const colour = '#33eaff';
    let num = currPlayers.length + players.length;
    const possibleGames = gamesInfo.filter(g => {
        return num >= g.player_min && num <= g.player_max;
    }).map(g => g.name);
    const deleted = theGame.possible_games.filter(g => {
        return !possibleGames.includes(g);
    });
    const added = possibleGames.filter(g => !theGame.possible_games.includes(g));

    intrudeGameGamesDiv.innerHTML = '';
    const noDel = deleted.length == 0;
    const noAdd = added.length == 0;
    intrudeGameGamesDiv.style.display = noDel && noAdd ? 'none' : 'flex';

    if (noDel || noAdd) centerOrStart(intrudeGameGamesDiv, 'justify');
    if (deleted.length > 0) {
        const deletedCol = document.createElement('div');
        deletedCol.className = 'intrude-game-col';
        if (noAdd) {
            deletedCol.style.width = '100%';
            centerOrStart(deletedCol, 'justify');
        }
        
        const deletedRow = document.createElement('div');
        deletedRow.className = 'intrude-game-row';
        deletedRow.id = 'intrude-game-delete';

        deleted.forEach(game => {
            const btn = createButton('', 'middle-game-button intrude-game-selected', '');
            styleButton(btn, 'black', colour, 'none', 'flex');
            btn.style.pointerEvents = 'none';
            btn.appendChild(header('h2', game));
            intrudeGameDel.push(game);
            deletedRow.appendChild(btn);
        });
        
        deletedCol.appendChild(header('h3', 'Deleted:'));
        deletedCol.appendChild(deletedRow);
        
        intrudeGameGamesDiv.appendChild(deletedCol);
        centerOrStart(deletedRow, 'justify');
    }
    if (added.length > 0) {
        const addedCol = document.createElement('div');
        addedCol.className = 'intrude-game-col';
        if (noDel) {
            addedCol.style.width = '100%';
            centerOrStart(addedCol, 'justify');
        }
        
        const addedRow = document.createElement('div');
        addedRow.className = 'intrude-game-row';
        addedRow.id = 'intrude-game-add';

        added.forEach(game => {
            const btn = createButton('', 'middle-game-button', '');
            styleButton(btn, 'black', 'white', 'none', 'flex');
            btn.appendChild(header('h2', game));
            btn.addEventListener('click', () => {
                const isSelected = btn.classList.toggle('intrude-game-selected');
                btn.style.backgroundColor = isSelected ? colour : 'white';
                btn.style.color = isSelected ? hexToTextColour(colour) : 'black';

                if (isSelected) {
                    intrudeGameAdd.push(game);
                } else {
                    intrudeGameAdd = intrudeGameAdd.filter(g => g != game);
                }

                const info = gameInfo(game);
                const options = document.querySelectorAll(`#intrude-game-${info.tag}`);
                options.forEach(o => o.disabled = !o.disabled);

                refreshAllIntruderDropdowns();
            });
            addedRow.appendChild(btn);
        });

        addedCol.appendChild(header('h3', `Select games to add below:`));
        addedCol.appendChild(addedRow);

        intrudeGameGamesDiv.appendChild(addedCol);
        centerOrStart(addedRow, 'justify');
    }
}


function addIntruderSpecialities(div, num, player, allowedGames) {
    let curr = intruderSpecialities.find(p => p.player_id == player.player_id);
    const currGames = curr?.games;
    let currNum = 0;
    const size = parseInt(num);
    for (let i = 0; i < size; i++) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        dropdown.style.position = 'relative';

        const btn = createButton('dropbtn', 'dropbtn', 'Vote');
        styleButton(btn, '#000000', '#33EAFF');
        dropdown.appendChild(btn);
        if (currGames.length != 0 && currGames.length > currNum) {
            btn.textContent = currGames[currNum].name;
            btn.dataset.value = currGames[currNum].tag;
            currNum++;
        }
        if (curr.games.length == numSpeciality) {
            const welcome = document.getElementById(`intruder-welcome-${player.player_id}`);
            welcome.style.display = 'block';
        }
        const showBtn = intruderSpecialities.filter(p => p.selected)
        .every(p => p.games.length == numSpeciality);
        intrudeGameBtn.style.display = showBtn ? 'flex' : 'none';

        const content = document.createElement('div');
        content.className = 'dropdown-content';

        allowedGames
            .filter(g => g.name !== '4:20 Game')
            .sort((a, b) => a.name.localeCompare(b.name))
            .forEach(game => {
                const option = document.createElement('a');
                option.href = '#';
                option.textContent = game.name;
                option.dataset.value = game.tag;
                option.style.textAlign = 'center';
                option.style.background = '#33eaff';
                option.style.color = 'black';
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (curr && !curr.games.find(g => g.game_id == game.game_id)) {
                        if (btn.dataset.value) {
                            curr.games = curr.games.filter(v => v.tag != btn.dataset.value);
                        }
                        curr.games.push(game);
                        btn.textContent = game.name;
                        btn.dataset.value = game.tag;
                        content.style.display = 'none';
                    }
                    if (curr.games.length == numSpeciality) {
                        const welcome = document.getElementById(`intruder-welcome-${player.player_id}`);
                        welcome.style.display = 'block';
                    }
                    const showBtn = intruderSpecialities.filter(p => p.selected)
                    .every(p => p.games.length == numSpeciality);
                    intrudeGameBtn.style.display = showBtn ? 'flex' : 'none';
                });
                option.addEventListener('mouseenter', () => {
                    if (curr && !curr.games.find(g => g.game_id == game.game_id)) {
                        option.style.filter = 'brightness(90%)';
                        option.style.cursor = 'pointer';
                    } else {
                        option.style.cursor = 'not-allowed';
                    }
                });
                option.addEventListener('mouseleave', () => {
                    if (curr && !curr.games.find(g => g.game_id == game.game_id)) {
                        option.style.filter = 'brightness(100%)';
                    }
                });
                content.appendChild(option);
            });

        dropdown.addEventListener('mouseenter', () => content.style.display = 'block');
        dropdown.addEventListener('mouseleave', () => content.style.display = 'none');
        dropdown.appendChild(content);

        div.appendChild(dropdown);
    }
    intruderSpecialitiesDiv.style.display = 'flex';
}

function refreshAllIntruderDropdowns() {
    let selected = intrudeOptions.filter(p => p.selected);
    intrudeGameBtn.textContent = toSOrNotToS(selected.length, 'Intrude Player');
    intrudeOptions.filter(p => !p.selected).forEach(p => {
        let player = intruderSpecialities.find(p2 => p2.player_id == p.player_id);
        player.selected = false;
    });
    selected.forEach(p => {
        let player = intruderSpecialities.find(p2 => p2.player_id == p.player_id);
        player.selected = true;
        
        const containerId = `intrude-game-${p.player_id}-specialities`;
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        const possibleGames = gamesInfo.filter(g =>
            currPlayers.length + intrudeOptions.filter(p => p.selected).length >= g.player_min &&
            currPlayers.length + intrudeOptions.filter(p => p.selected).length <= g.player_max
        );

        const baseGames = theGame.possible_games;
        const allowedGames = gamesInfo.filter(g =>
            baseGames.includes(g.name) || intrudeGameAdd.includes(g.name)
        );

        const filteredAllowedGames = allowedGames.filter(g =>
            possibleGames.find(pg => pg.name === g.name)
        );

        addIntruderSpecialities(container, numSpeciality, p, filteredAllowedGames);
    });
}

async function intrude() {
    let intruding = [];
    intruderSpecialities.filter(p => p.selected).forEach(p => {
        p.selected = false;
        const info = allPlayers.find(pI => pI.player_id == p.player_id);
        let player = {
            player_id: p.player_id,
            name: info.name,
            colour: info.colour,
            is_playing: true,
            speciality: p.games,
            pg_cone: 1,
            f20g_cone: 0,
            l_cone: 0,
            c_cone: 0,
            w_cone: 0,
            v_cone: 0,
            g_point: 0,
            c_point: 0,
            special_w_point: 0,
            special_l_point: 0,
            neigh: 2,
            super_neigh: 2,
            gooc_total: 0,
            gooc_used: 0
        }
        theGame.intruded.push(p.player_id);
        theGame.players.push(player);
        overallPlayers.push(player);
        currPlayers.push(player);
        intruding.push({
            player_id: p.player_id,
            name: '',
            games: p.games
        });
    });
    currPlayers = display(currPlayers);
    intruding.forEach(p => {
        const player = currPlayers.find(cP => cP.player_id == p.player_id);
        p.name = player.name;
        let lastGame = theGame.games.length != 0 ? theGame.games.at(-1) : null;
        if (lastGame) lastGame.after.push(`${player.name} INTRUDED the Game`);
    });

    pointsSystem = getPointsSystem(currPlayers.length);
    gamesLeft = gamesInfo.filter(g => {
        if (intrudeGameAdd.includes(g.name)) return true;
        if (gamesLeft.find(game => game.name == g.name)) {
            return !intrudeGameDel.includes(g.name);
        }
        return false;
    });
    intrudeGameAdd.forEach(g => theGame.possible_games.push(g));
    theGame.possible_games = theGame.possible_games.filter(g => {
        return !intrudeGameDel.includes(g);
    });
    
    updateHeaderButtons('show');  
    if (gameSelection == 'Wheel') {
        replaceSectors('games', shuffle(gamesLeft.map(p => p.name)));
    } else if (gameSelection == 'Choose') {
        openChoosing();
    } else if (gameSelection == 'Vote') {
        openVote();
    }

    await fetch(`${route}/sessions/${sessionId}/intrude`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currSystem,
            intruding,
            add: intrudeGameAdd.map(g => gameInfo(g)),
            del: intrudeGameDel.map(g => gameInfo(g)),
            gameNumber
        })
    });

    closeIntrude();
}

function closeIntrude() {
    closeModal(intrudeModal, intrudeBox, 'down', '', () => {
        intrudeGameGamesDiv.style.display = 'none';
        intruderSpecialitiesDiv.style.display = 'none';
        intrudeGameBtn.style.display = 'none';
        allPlayers.forEach(p => {
            const div = document.getElementById(`intrude-game-${p.player_id}`);
            if (div) div.style.display = 'none';
        });
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Abandon Game
//


// #region

const abandonBtn = document.getElementById('abandon');
const abandonModal = document.getElementById('abandonModal');
const abandonBox = document.getElementById('abandon-game-box');
const abandonGameGamesDiv = document.getElementById('abandon-game-games');
const abandonResultDiv = document.getElementById('abandon-game-result');
const abandonGameBtn = document.getElementById('abandon-game-button');
let abandonOptions = [];
let abandonGameAdd = [];
let abandonGameDel = [];

function openAbandon() {
    curr_colour.hex = '#33eaff';
    curr_colour.rgba = hexToRgba('#33eaff', 0.85);
    curr_colour.text = '#000000';

    openModalWithFakeGrow(
        abandonBtn,
        abandonModal,
        abandonBox,
        curr_colour,
        setupAbandon()
    );
}

function setupAbandon() {
    const abandonDiv = document.getElementById('abandon-game-players');
    abandonDiv.innerHTML = '';
    abandonOptions = [];

    const players = allPlayers.filter(p => currPlayers.find(cP => cP.player_id == p.player_id));
    const playerNames = getDisplayNames(players);
    players.forEach(p => {
        const name = playerNames.find(n => n.player_id == p.player_id).name;
        abandonOptions.push({
            player_id: p.player_id,
            name,
            selected: false
        });
        
        const btn = createButton('', 'middle-game-button abandon-game-player', '');
        styleButton(btn, 'black', 'white', null, 'flex');
        btn.addEventListener('click', () => {
            const isSelected = btn.classList.toggle('abandon-game-selected');
            btn.style.backgroundColor = isSelected ? p.colour : 'white';
            btn.style.color = isSelected ? hexToTextColour(p.colour) : 'black';

            let option = abandonOptions.find(o => o.player_id == p.player_id);
            if (option) option.selected = !option.selected;

            let names = abandonOptions.filter(p => p.selected).map(p => p.name);
            const toShowOrNotToShow = () => names.length != 0 ? 'flex' : 'none';
            abandonGameGamesDiv.style.display = toShowOrNotToShow();
            abandonResultDiv.style.display = toShowOrNotToShow();
            abandonGameBtn.style.display = toShowOrNotToShow();
            if (names.length != 0) {
                abandonGames(abandonOptions.filter(p => p.selected));
                abandonResultDiv.textContent = `See you later ${format(names)}`;
            } else {
                abandonGameAdd = [];
                abandonGameDel = [];
            }
        });

        btn.appendChild(header('h2', name));
        abandonDiv.appendChild(btn);
    });
    abandonGameBtn.removeEventListener('click', abandon);
    abandonGameBtn.addEventListener('click', abandon);
}

function abandonGames(players) {
    abandonGameBtn.textContent = toSOrNotToS(players.length, 'Abandon Player');
    
    const colour = '#33eaff';
    let num = currPlayers.length - players.length;
    const possible = gamesInfo.filter(g => {
        return num >= g.player_min && num <= g.player_max;
    }).map(g => g.name);
    const currPossible = theGame.possible_games;
    const curr = currPossible.filter(g => possible.includes(g));
    const deleted = currPossible.filter(g => !possible.includes(g));
    const added = possible.filter(g => !currPossible.includes(g));

    console.log(`Going from ${currPlayers.length} to ${num}`);
    console.log('Possible:', currPossible);
    console.log('Current :', curr);
    console.log(' Delete :', deleted);
    console.log('  New   :', added);
    console.log('Players :', players);

    abandonGameGamesDiv.innerHTML = '';
    const noCurr = curr.length == 0;
    const noDel = deleted.length == 0;
    const noAdd = added.length == 0;
    abandonGameGamesDiv.style.display = noCurr && noDel && noAdd ? 'none' : 'flex';

    if (noCurr || noDel || noAdd) centerOrStart(abandonGameGamesDiv, 'justify');
    if (curr.length > 0) {
        const currCol = document.createElement('div');
        currCol.className = 'abandon-game-col';
        if (noCurr && noDel) {
            currCol.style.width = '100%';
            centerOrStart(currCol, 'justify');
        } else if (noDel) {
            currCol.style.width = '49%';
            centerOrStart(currCol, 'justify');
        }
        
        const currRow = document.createElement('div');
        currRow.className = 'abandon-game-row';
        currRow.id = 'abandon-game-add';

        curr.forEach(game => {
            const btn = createButton('', 'middle-game-button', '');
            styleButton(btn, 'black', 'white', 'none', 'flex');
            btn.appendChild(header('h2', game));
            btn.addEventListener('click', () => {
                const isSelected = btn.classList.toggle('abandon-game-selected');
                btn.style.backgroundColor = isSelected ? colour : 'white';
                btn.style.color = isSelected ? hexToTextColour(colour) : 'black';

                if (isSelected) {
                    abandonGameDel.push(game);
                } else {
                    abandonGameDel = abandonGameDel.filter(g => g != game);
                }

                const info = gameInfo(game);
                const options = document.querySelectorAll(`#abandon-game-${info.tag}`);
                options.forEach(o => o.disabled = !o.disabled);
            });
            currRow.appendChild(btn);
        });

        currCol.appendChild(header('h3', `Select games to delete below:`));
        currCol.appendChild(currRow);

        abandonGameGamesDiv.appendChild(currCol);
        centerOrStart(currRow, 'justify');
    }
    if (deleted.length > 0) {
        const deletedCol = document.createElement('div');
        deletedCol.className = 'abandon-game-col';
        if (noCurr && noAdd) {
            deletedCol.style.width = '100%';
            centerOrStart(deletedCol, 'justify');
        } else if (noAdd) {
            addedCol.style.width = '49%';
            centerOrStart(addedCol, 'justify');
        }
        
        const deletedRow = document.createElement('div');
        deletedRow.className = 'abandon-game-row';
        deletedRow.id = 'abandon-game-delete';

        deleted.forEach(game => {
            const btn = createButton('', 'middle-game-button abandon-game-selected', '');
            styleButton(btn, 'black', colour, 'none', 'flex');
            btn.style.pointerEvents = 'none';
            btn.appendChild(header('h2', game));
            abandonGameDel.push(game);
            deletedRow.appendChild(btn);
        });
        
        deletedCol.appendChild(header('h3', 'Deleted:'));
        deletedCol.appendChild(deletedRow);
        
        abandonGameGamesDiv.appendChild(deletedCol);
        centerOrStart(deletedRow, 'justify');
    }
    if (added.length > 0) {
        const addedCol = document.createElement('div');
        addedCol.className = 'abandon-game-col';
        if (noCurr && noDel) {
            addedCol.style.width = '100%';
            centerOrStart(addedCol, 'justify');
        } else if (noDel) {
            addedCol.style.width = '49%';
            centerOrStart(addedCol, 'justify');
        }
        
        const addedRow = document.createElement('div');
        addedRow.className = 'abandon-game-row';
        addedRow.id = 'abandon-game-add';

        added.forEach(game => {
            const btn = createButton('', 'middle-game-button', '');
            styleButton(btn, 'black', 'white', 'none', 'flex');
            btn.appendChild(header('h2', game));
            btn.addEventListener('click', () => {
                const isSelected = btn.classList.toggle('abandon-game-selected');
                btn.style.backgroundColor = isSelected ? colour : 'white';
                btn.style.color = isSelected ? hexToTextColour(colour) : 'black';

                if (isSelected) {
                    abandonGameAdd.push(game);
                } else {
                    abandonGameAdd = abandonGameAdd.filter(g => g != game);
                }

                const info = gameInfo(game);
                const options = document.querySelectorAll(`#abandon-game-${info.tag}`);
                options.forEach(o => o.disabled = !o.disabled);
            });
            addedRow.appendChild(btn);
        });

        addedCol.appendChild(header('h3', `Select games to add below:`));
        addedCol.appendChild(addedRow);

        abandonGameGamesDiv.appendChild(addedCol);
        centerOrStart(addedRow, 'justify');
    }
}

async function abandon() {
    const abandoning = abandonOptions.filter(p => p.selected);
    abandoning.forEach(p => {
        p.selected = false;
        theGame.abandoned.push(p.player_id);
        currPlayers = currPlayers.filter(c => c.player_id != p.player_id);
        let player = theGame.players.find(pI => pI.player_id == p.player_id);
        player.is_playing = false;

        let lastGame = theGame.games.length != 0 ? theGame.games.at(-1) : null;
        if (lastGame) lastGame.after.push(`${p.name} ABANDONED the Game`);
    });
    currPlayers = display(currPlayers);

    pointsSystem = getPointsSystem(currPlayers.length);
    gamesLeft = gamesInfo.filter(g => {
        if (abandonGameAdd.includes(g.name)) return true;
        if (gamesLeft.find(game => game.name == g.name)) {
            return !abandonGameDel.includes(g.name);
        }
        return false;
    });
    abandonGameAdd.forEach(g => theGame.possible_games.push(g));
    theGame.possible_games = theGame.possible_games.filter(g => {
        return !abandonGameDel.includes(g);
    });
    
    updateHeaderButtons('show');  
    if (gameSelection == 'Wheel') {
        replaceSectors('games', shuffle(gamesLeft.map(p => p.name)));
    } else if (gameSelection == 'Choose') {
        openChoosing();
    } else if (gameSelection == 'Vote') {
        openVote();
    }

    await fetch(`${route}/sessions/${sessionId}/abandon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            currSystem,
            abandoning,
            add: abandonGameAdd.map(g => gameInfo(g)),
            del: abandonGameDel.map(g => gameInfo(g)),
            gameNumber
        })
    });

    closeAbandon();
}

function closeAbandon() {
    closeModal(abandonModal, abandonBox, 'down', '', () => {
        abandonGameGamesDiv.style.display = 'none';
        abandonResultDiv.style.display = 'none';
        abandonGameBtn.style.display = 'none';
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Break Cone
//


// #region

const breakConeBtn = document.getElementById('break-cone');
const breakConeModal = document.getElementById('breakConeModal');
const breakConeBox = document.getElementById('break-cone-box');
const breakConeResultDiv = document.getElementById('break-cone-result');
const breakConeGameBtn = document.getElementById('break-cone-button');
let breakConeOptions = [];

function openBreakCone() {
    let breakTitle = document.getElementById('break-cone-title');
    let breakBtn = document.getElementById('break-cone-button');
    breakTitle.innerHTML = 
        gog_version == 'private' ? `Who's having a break cone?`:
        gog_version == 'public' ? `Who's having a break shot?` : '';

    breakBtn.innerHTML = 
        gog_version == 'private' ? 'Cone Time!' :
        gog_version == 'public' ? 'Shot Time!' : '';
    
    curr_colour.hex = '#33eaff';
    curr_colour.rgba = hexToRgba('#33eaff', 0.85);
    curr_colour.text = '#000000';

    openModalWithFakeGrow(
        breakConeBtn,
        breakConeModal,
        breakConeBox,
        curr_colour,
        setupBreakCone()
    );
}

function setupBreakCone() {
    breakConeResultDiv.style.display = 'none';
    breakConeGameBtn.style.display = 'none';

    const breakDiv = document.getElementById('break-cone-players');
    breakDiv.innerHTML = '';
    breakConeOptions = [];

    currPlayers.sort((a, b) => a.name.localeCompare(b.name))
    .forEach(p => {
        breakConeOptions.push({
            player_id: p.player_id,
            name: p.name,
            selected: false
        });

        const btn = createButton('', 'middle-game-button break-cone-player', '');
        styleButton(btn, 'black', 'white', null, 'flex');
        btn.addEventListener('click', () => {
            btn.classList.toggle('break-cone-selected');
            const not = btn.style.backgroundColor == 'white';
            btn.style.backgroundColor = not ? p.colour : 'white';
            btn.style.color = not ? hexToTextColour(p.colour) : 'black';

            let option = breakConeOptions.find(o => o.player_id == p.player_id);
            if (option) option.selected = !option.selected;

            let names = breakConeOptions.filter(p => p.selected).map(p => p.name);
            if (names.length != 0) {
                breakConeResultDiv.textContent = `Ratatouille ${format(names)}`;
                breakConeResultDiv.style.display = 'flex';
                breakConeGameBtn.style.display = 'flex';
            } else {
                breakConeResultDiv.style.display = 'none';
                breakConeGameBtn.style.display = 'none';
            }
        });
        btn.appendChild(header('h2', p.name));
        breakDiv.appendChild(btn);
    });

    breakConeGameBtn.removeEventListener('click', breakCone);
    breakConeGameBtn.addEventListener('click', breakCone);
}

async function breakCone() {
    let game = theGame.games.at(-1);
    breakConeOptions.filter(p => p.selected).forEach(p => {
        if (game) game.after.push(`${p.name} had a BREAK cone`);
        logCone(p.player_id, 'break');
    });
    
    const players = currPlayers.filter(p => {
        const id = p.player_id;
        return breakConeOptions.find(b => b.player_id == id)?.selected;
    });
    await fetch(`${route}/sessions/${sessionId}/break_cone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, players })
    });

    closeBreakCone();
}

function closeBreakCone() {
    closeModal(breakConeModal, breakConeBox, 'down', '', () => {
        breakConeResultDiv.style.display = 'none';
        breakConeGameBtn.style.display = 'none';
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Victory Cone
//


// #region

const victoryConeBtn = document.getElementById('victory-cone');
const victoryConeModal = document.getElementById('victoryConeModal');
const victoryConeBox = document.getElementById('victory-cone-box');
const victoryConeResultDiv = document.getElementById('victory-cone-result');
const victoryConeGameBtn = document.getElementById('victory-cone-button');
let victoryConeOptions = [];

function openVictoryCone() {
    let victoryTitle = document.getElementById('victory-cone-title');
    let victoryBtn = document.getElementById('victory-cone-button');
    victoryTitle.innerHTML = 
        gog_version == 'private' ? `Who's having a victory cone?`:
        gog_version == 'public' ? `Who's having a victory shot?` : '';

    victoryBtn.innerHTML = 
        gog_version == 'private' ? 'Cone Time!' :
        gog_version == 'public' ? 'Shot Time!' : '';
    
    curr_colour.hex = '#33eaff';
    curr_colour.rgba = hexToRgba('#33eaff', 0.85);
    curr_colour.text = '#000000';

    openModalWithFakeGrow(
        victoryConeBtn,
        victoryConeModal,
        victoryConeBox,
        curr_colour,
        setupVictoryCone()
    );
}

function setupVictoryCone() {
    victoryConeResultDiv.style.display = 'none';
    victoryConeGameBtn.style.display = 'none';

    const victoryDiv = document.getElementById('victory-cone-players');
    victoryDiv.innerHTML = '';
    victoryConeOptions = [];

    if (theGame.games.length == 0) {
        victoryDiv.appendChild(header(
            'h2',
            `No one yet! Play a game, then we'll talk.`
        ));
        return;
    }
    
    let lastGame = theGame.games.at(-1);
    console.log(lastGame.results);
    const winners = lastGame.results.filter(r => r.place == 1);
    winners.forEach(w => {
        const player = allPlayers.find(p => p.player_id == w.player_id);
        
        victoryConeOptions.push({
            player_id: w.player_id,
            name: player.name,
            selected: false
        });

        const btn = createButton('', 'middle-game-button victory-cone-player', '');
        styleButton(btn, 'black', 'white', 'none', 'flex');
        btn.addEventListener('click', () => {
            btn.classList.toggle('victory-cone-selected');
            const not = btn.style.backgroundColor == 'white';
            btn.style.backgroundColor = not ? player.colour : 'white';
            btn.style.color = not ? hexToTextColour(player.colour) : 'black';

            let option = victoryConeOptions.find(o => o.player_id == w.player_id);
            if (option) option.selected = !option.selected;

            let names = victoryConeOptions.filter(p => p.selected).map(p => p.name);
            if (names.length != 0) {
                victoryConeResultDiv.innerHTML = '';
                victoryConeResultDiv.textContent = `Ratatouille ${format(names)}`;
                victoryConeResultDiv.style.display = 'flex';
                victoryConeGameBtn.style.display = 'flex';
            } else {
                victoryConeResultDiv.style.display = 'none';
                victoryConeGameBtn.style.display = 'none';
            }
        });
        btn.appendChild(header('h2', player.name));
        victoryDiv.appendChild(btn);
    });
    if (winners.length == 0) {
        victoryDiv.appendChild(header(
            'h2', `No one lol! You're all a bunch of losers somehow!`
        ));
    }

    victoryConeGameBtn.removeEventListener('click', victoryCone);
    victoryConeGameBtn.addEventListener('click', victoryCone);
}

async function victoryCone() {
    let game = theGame.games.at(-1);
    victoryConeOptions.filter(p => p.selected).forEach(p => {
        if (game) game.after.push(`${p.name} had a VICTORY cone`);
        logCone(p.player_id, 'victory');
    });
    
    const players = currPlayers.filter(p => {
        const id = p.player_id;
        return victoryConeOptions.find(b => b.player_id == id)?.selected;
    });
    await fetch(`${route}/sessions/${sessionId}/victory_cone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game, players })
    });

    closeVictoryCone();
}

function closeVictoryCone() {
    closeModal(victoryConeModal, victoryConeBox, 'down', '', () => {
        victoryConeResultDiv.style.display = 'none';
        victoryConeGameBtn.style.display = 'none';
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Open and Close Modal
//


// #region

function openModal(modal, modalBox, from, colour = null) {
    hideAllGameModes(true);
    modal.classList.add('active');
    modal.style.display = 'flex';

    if (colour) {
        modalBox.style.backgroundColor = colour.rgba;
        modalBox.style.borderColor = colour.rgba;
        modalBox.style.color = colour.text;

        modalBox.querySelectorAll('.button').forEach(btn => {
            btn.style.backgroundColor = colour.hex;
            btn.style.borderColor = colour.hex;
            btn.style.color = colour.text;
            btn.style.textShadow = 'none';
        });
    }

    modalBox.style.opacity = 0;
    modalBox.style.transform = 
        from == 'wheel' ? 'translateY(100vh) scale(0.1)' : '';
    modalBox.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    modalBox.style.display = 'flex';

    requestAnimationFrame(() => {
        modalBox.style.opacity = 1;
        modalBox.style.transform = 'scale(1)';
    });
}

/*function closeModal(modal, modalBox, callback = null) {
    modal.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    modal.style.opacity = 0;
    //modal.style.transform = 'scale(0.95)';

    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.opacity = '';
        modal.style.transform = '';
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');

        if (typeof callback === 'function') {
            callback();
        }
    }, 100); // Match the transition duration
}*/
/*function closeModal(modal, modalBox, callback = null) {
    // Add transition for opacity and transform (for the fly-away effect)
    modal.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    // Animate: fade out and move upward (fly-away)
    modal.style.opacity = 0;
    modal.style.transform = 'translateY(-50px) scale(0.95)';

    setTimeout(() => {
        // Reset styles after animation completes
        modal.style.display = 'none';
        modal.style.opacity = '';
        modal.style.transform = '';
        modal.style.transition = '';
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');

        if (typeof callback === 'function') {
            callback();
        }
    }, 400); // Match transition duration (400ms)
}*/
function closeModal(modal, modalBox, direction, to, callback = null) {
    if (to != 'wheel') updateGameModeUI(gameSelection);
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
        openModal(modal, modalBox, 'down', colour);
        
        // Clean up clone
        setTimeout(() => {
            clone.remove();
            if (typeof after === 'function') after();
        }, 100);
    }, 300); // matches grow time
}

function openModalWithFakeGrow(btn, modal, modalBox, colour, setupCallback) {
    const rect = btn.getBoundingClientRect();
    const fakeBox = document.createElement('div');
    fakeBox.className = 'fake-grow-box';
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

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              4:20 Game
//


// #region

let four20Players = [];
const playersDiv = document.getElementById('four20game_players');
const camera = document.getElementById('four20game_camera');
const rowDiv = document.getElementById('four20game_row');
const four20Section = document.getElementById('four20game_section');
const four20Results = document.getElementById('four20game_results');
const photoDivDiv = document.getElementById('four20game_photoDiv');
const photoDiv = document.getElementById('four20game_photo');
const uploadDiv = document.getElementById('four20game_upload');
const takePhoto = document.getElementById('option_photo');
const uploadPhoto = document.getElementById('option_upload');
const capture = document.getElementById('capture');
const retake = document.getElementById('retake');
const complete = document.getElementById('complete');

function create420Game() {
    openGameBox('420');
    currPlayers.forEach(p => {
        playersDiv.appendChild(createCheckbox(p.name, '420'));
    });
    
    gameTitle.style.display = 'none';
    otherWelcome.style.display = 'none';
    four20game.style.display = 'flex';
    rowDiv.prepend(createTimer(4, 20));
}

function start420Game() {
    document.getElementById('four20game_who').style.display = 'none';
    document.getElementById('four20game_optional').style.display = 'none';
    playersDiv.style.display = 'none';
    document.getElementById('four20').style.display = 'none';
    document.getElementById('four20game_ratatouille').style.display = 'flex';
    document.getElementById('four20game_timer').style.display = 'flex';
    document.getElementById('four20game_options').style.display = 'flex';

    startTimer(4, 20);
}

function createCamera() {
    photoDivDiv.style.display = 'none';
    camera.style.display = 'flex';
    
    const video = document.createElement('video');
    video.id = 'camera';
    camera.appendChild(video);
    
    const canvas = document.createElement('canvas');
    canvas.id = 'photo-canvas';
    camera.appendChild(canvas);

    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false,
            });
            video.srcObject = stream;
            video.play();
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Camera access is required for this feature.');
        }
    }

    takePhoto.style.display = 'none';
    capture.style.display = 'flex';

    startCamera();
}

function stopCamera() {
    const video = document.getElementById('camera');
    const stream = video.srcObject;
    stream.getTracks().forEach(track => track.stop());
}

function capturePhoto(win) {
    const video = document.getElementById('camera');
    const canvas = document.getElementById('photo-canvas');
    const context = canvas.getContext('2d');
    canvas.width = 550;
    canvas.height = 400;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    stopCamera();
    video.style.display = 'none';
    canvas.style.display = 'block';

    capturedImage = canvas.toDataURL('image/png');

    const imageElement = document.createElement('img');
    imageElement.src = capturedImage;
    imageElement.alt = 'Captured Photo';
    imageElement.style.width = '100%';
    photoDiv.innerHTML = '';
    photoDiv.appendChild(imageElement);

    if (win) {
        capture.style.display = 'none';
        retake.style.display = 'flex';
        complete.style.display = 'flex';
    }
}

function retakePhoto() {
    retake.style.display = 'none';
    complete.style.display = 'none';

    stopCamera();
    camera.innerHTML = '';
    photoDiv.innerHTML = '';
    createCamera();
}

function upload() {
    if (camera.innerHTML != '') {
        stopCamera();
        takePhoto.style.display = 'flex';
        capture.style.display = 'none';
        retake.style.display = 'none';
        camera.innerHTML = '';
        camera.style.display = 'none';
    }
    
    document.getElementById('fileInput').addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                capturedImage = e.target.result;

                const imgPreview = document.createElement('img');
                imgPreview.src = capturedImage;
                imgPreview.alt = 'Uploaded Photo';
                imgPreview.style.maxWidth = '100%';
                imgPreview.style.maxHeight = '100%';

                photoDiv.innerHTML = '';
                photoDiv.appendChild(imgPreview);
                photoDivDiv.style.display = 'flex';
            };

            reader.readAsDataURL(file);
        }
        complete.style.display = 'flex';
        complete.addEventListener('click', () => complete420Game(true));
    });
}

function complete420Game(win) {
    complete.style.display = 'none';
    four20Section.style.display = 'none';

    if (!win && photoDiv.innerHTML == '') {
        if (camera.innerHTML != '') {
            capturePhoto(false);
            stopCamera();
            camera.innerHTML = '';
            camera.style.display = 'none';
        } else {
            createCamera();
            document.getElementById('camera').addEventListener('playing', () => {
                setTimeout(() => {
                    capturePhoto(false);
                    camera.innerHTML = '';
                }, 50);
            });
        }
    }
    camera.style.display = 'none';
    photoDivDiv.style.display = 'flex';

    const results = generate420Results(win);
    submit420Results(results);
    if (gamesLeft.length != 0) document.getElementById('end').style.display = 'flex';
    if (gamesLeft.length == 0) document.getElementById('refresh').style.display = 'flex';
}

async function save420GamePhoto() {
    if (capturedImage) {
        await fetch(`${route}/sessions/${sessionId}/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: capturedImage }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Final photo saved:', data.filename);
        })
        .catch(err => {
            console.error('Photo upload failed:', err);
        });
    }
}

function generate420Results(win) {
    let results = [];
    currPlayers.forEach(player => {
        results.push({
            player_id: player.player_id,
            name: player.name,
            place: win ? 1 : currPlayers.length,
            reward: win ? '1 point' : '1 cone',
            base: win ? '1 point' : '1 cone',
            played: four20Players.includes(player.name)
        });
    });

    results.sort((a, b) => {
        const diff = a.played != b.played;
        const played = a.played ? -1 : 1;
        return diff ? played : a.name.localeCompare(b.name);
    });

    return results;
}

function submit420Results(results) {
    four20Results.innerHTML = '';
    four20Results.appendChild(header('h1', '4:20 Game Results'));

    const resultsDiv = document.createElement('div');
    resultsDiv.id = 'four20game_results_players';
    results.forEach(r => {
        let playerBox = document.createElement('div');
        playerBox.id = `four20game_resultBox`;
        playerBox.className = 'four20game_resultBox';
        playerBox.style.color = 'black';
        playerBox.style.background = r.place == 1 && r.played ? gold : blue;
        playerBox.appendChild(header('h2', `${r.name}`));
        const text = r.played ? `Reward: ${reward(r)}` : 'Not Played';
        playerBox.appendChild(header('h3', `${text}`));
        resultsDiv.appendChild(playerBox);
    });

    four20Results.appendChild(resultsDiv);
    resultsDiv.style.display = 'flex';
    four20Results.style.display = 'flex';
    log420Game(results);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Alphabetix
//


// #region

let letters = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I J K', 'L', 'N', 'O', 'P', 'R', 'S', 'T', 'Q U V', 'W', 'X Y Z'
];

let topics = [
    { topic: 'Countries', colour: 'yellow' },
    { topic: 'Parts of the body', colour: 'yellow' },
    { topic: 'Actors', colour: 'yellow' },
    { topic: 'TV Shows', colour: 'yellow' },
    { topic: 'Sports', colour: 'yellow' },
    { topic: 'Clothing', colour: 'yellow' },
    { topic: 'Occupations', colour: 'yellow' },
    { topic: 'Animals', colour: 'yellow' },
    { topic: 'Given names - Female', colour: 'yellow' },
    { topic: 'Fruit & Vegetables', colour: 'yellow' },
    { topic: `'Up' words`, colour: 'yellow' },
    { topic: 'Politicians', colour: 'yellow' },
    { topic: 'Sportspersons', colour: 'yellow' },
    { topic: 'Adjectives', colour: 'yellow' },
    { topic: 'Illnesses & Diseases', colour: 'yellow' },
    { topic: 'Book titles', colour: 'yellow' },
    { topic: 'Car parts & Accessories', colour: 'yellow' },
    { topic: 'House & Garden', colour: 'yellow' },
    { topic: 'Australian Towns & Cities', colour: 'yellow' },
    { topic: 'Plants & Flowers', colour: 'yellow' },
    { topic: 'Famous Men', colour: 'yellow' },
    { topic: 'Movie Characters', colour: 'yellow' },
    { topic: 'Given names - Male', colour: 'orange' },
    { topic: 'Food', colour: 'orange' },
    { topic: 'Maths & Measurement', colour: 'orange' },
    { topic: 'Cartoon/Comic/TV Characters', colour: 'orange' },
    { topic: 'Singers', colour: 'orange' },
    { topic: 'Song titles', colour: 'orange' },
    { topic: 'Transport', colour: 'orange' },
    { topic: 'Musical Instruments', colour: 'orange' },
    { topic: 'Cities', colour: 'orange' },
    { topic: 'Travel terms', colour: 'orange' },
    { topic: 'Famous Women', colour: 'orange' },
    { topic: 'School terms', colour: 'orange' },
    { topic: 'Weather & Climate', colour: 'orange' },
    { topic: 'Shopping terms', colour: 'orange' },
    { topic: 'Car types', colour: 'orange' },
    { topic: 'Nautical terms', colour: 'orange' },
    { topic: 'Crimes', colour: 'orange' },
    { topic: 'Well-known Australians', colour: 'orange' },
    { topic: 'Rivers, Oceans, Lakes & Seas', colour: 'orange' },
    { topic: 'Cooking terms', colour: 'orange' },
    { topic: 'Leisure Activities', colour: 'red' },
    { topic: 'Musical terms', colour: 'red' },
    { topic: 'Languages', colour: 'red' },
    { topic: 'Drinks', colour: 'red' },
    { topic: 'US States & Cities', colour: 'red' },
    { topic: 'Novelists, Playwrights & Poets', colour: 'red' },
    { topic: 'Musicians & Composers', colour: 'red' },
    { topic: 'Religious terms', colour: 'red' },
    { topic: 'Trees', colour: 'red' },
    { topic: 'Mountains & Ranges', colour: 'red' },
    { topic: 'Buildings', colour: 'red' },
    { topic: 'Minerals, Rocks & Metals', colour: 'red' },
    { topic: 'Biblical persons', colour: 'red' },
    { topic: 'Courtroom terms', colour: 'red' },
    { topic: 'World Sights', colour: 'red' },
    { topic: 'Rock/Pop/Folk groups', colour: 'red' },
    { topic: 'Dog breeds', colour: 'red' },
    { topic: 'Hospital terms', colour: 'red' },
    { topic: 'Birds', colour: 'red' }
]
let numTopics = 1;
let currTopics = [];
let currLetters = [];
let currTime = { mins: 3, secs: 0 };

function setupAlphabetix(setup) {
    const btn = createButton('alphabetix_start', 'button', 'Start');
    styleButton(btn, curr_colour.text, curr_colour.hex, 'none', 'none');
    btn.addEventListener('click', () => {
        setup.style.display = 'none';
        startGame();
    });

    const time = document.createElement('select');
    time.id = 'alphabetix_time';
    time.className = 'game_select';
    time.appendChild(createOption('', 'Time per round...'));
    time.appendChild(createOption('TEST', ''));
    time.appendChild(createOption('2 mins', ''));
    time.appendChild(createOption('2 mins 30 secs', ''));
    time.appendChild(createOption('3 mins', ''));
    setup.appendChild(time);

    time.addEventListener('change', () => {
        if (time.value == 'TEST') {
            currTime = { mins: 0, secs: 3 };
        } else if (time.value == '2 mins') {
            currTime = { mins: 2, secs: 0 };
        } else if (time.value == '2 mins 30 secs') {
            currTime = { mins: 2, secs: 30 };
        } else if (time.value == '3 mins') {
            currTime = { mins: 3, secs: 0 };
        } else {
            console.error(`Error with time options somehow, ${time.value}`);
        }
    });

    const topicHeaderDiv = document.createElement('div');
    topicHeaderDiv.id = 'alphabetix_topic_header_div';

    const topicHeader = header('h3', 'Selected Topics:', '', 'alphabetix_topic_header');
    topicHeader.style.display = 'none';
    setup.appendChild(topicHeader);

    const topicList = document.createElement('ul');
    topicList.id = 'alphabetix_topic_list';
    topicHeaderDiv.appendChild(topicList);
    setup.appendChild(topicHeaderDiv);

    function updateTopicList() {
        topicList.innerHTML = '';
        currTopics.sort().forEach(topic => {
            const span = document.createElement('span');
            span.textContent = topic;
            span.className = 'alphabetix-topic-chosen';
            span.style.backgroundColor = curr_colour.hex;
            topicList.appendChild(span);
        });
        topicHeader.style.display = currTopics.length == 0 ? 'none' : 'flex';
        centerOrStart(topicList, 'justify');
    }
    
    const topicContainer = document.createElement('div');
    topicContainer.id = 'alphabetix-topic-selection';
    setup.appendChild(topicContainer);

    const selected = new Set();

    topics.forEach(({ topic, colour }) => {
        const topicBtn = createButton('', 'alphabetix-topic', topic);
        styleButton(topicBtn, 'black', colour, null, 'flex');
        topicBtn.addEventListener('click', () => {
            if (selected.has(topic)) {
                selected.delete(topic);
                topicBtn.style.borderColor = 'transparent';
                currTopics = currTopics.filter(t => t != topic);
            } else if (selected.size < numTopics) {
                selected.add(topic);
                topicBtn.style.borderColor = 'black';
                currTopics.push(topic);
            }
            updateTopicList();

            document.querySelectorAll('#alphabetix-topic-selection button').forEach(b => {
                const isDisabled = selected.size == numTopics && !selected.has(b.textContent);
                b.disabled = isDisabled;
                b.style.opacity = isDisabled ? '0.5' : '1';
                b.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
                b.style.filter = isDisabled ? 'grayscale(30%)' : 'none';
                b.style.transform = isDisabled ? 'scale(0.97)' : 'scale(1)';
            });

            btn.style.display = selected.size != numTopics ? 'none' : 'flex';
        });
        topicContainer.appendChild(topicBtn);
    });

    setup.appendChild(btn);
}

function addAlphabetixExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    let info = gameInfo(currGame.name);
    let topicList = format(currTopics.sort());
    
    header.innerHTML = `${info.header}<br>Topics: ${topicList}`;
    game.extras.push(`Topics: ${topicList}`);
}

function getNextLetter() {
    const nextLetters = letters.filter(l => !currLetters.includes(l));
    const index = Math.floor(Math.random() * nextLetters.length);
    currLetters.push(nextLetters[index]);
    return nextLetters[index];
}

function createAlphabetix() {
    let time = { mins: currTime.mins, secs: currTime.secs };

    const gameDiv = document.createElement('div');
    gameDiv.id = 'alphabetix-row';
    document.getElementById(`alphabetix_game`).appendChild(gameDiv);

    const timerSection = document.createElement('div');
    timerSection.id = 'alphabetix-timer-col';
    gameDiv.appendChild(timerSection);

    const timer = createTimer(time.mins, time.secs);
    timer.style.display = 'flex';
    timerSection.appendChild(timer);
    
    const startBtn = document.createElement('div');
    startBtn.id = 'alphabetix-timer-start';
    startBtn.className = 'button';
    startBtn.textContent = 'Start';
    startBtn.style.backgroundColor = curr_colour.hex;
    startBtn.style.color = curr_colour.text;
    timerSection.appendChild(startBtn);

    timerSection.appendChild(header('h2', `Letter(s):`, '', 'alphabetix-current-letter'));

    const table = document.createElement('table');
    table.id = `alphabetix_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.textContent = '';
    blankHeader.className = 'name-column';
    blankHeader.style.backgroundColor = curr_colour.hex;
    blankHeader.style.color = curr_colour.text;
    headerRow.appendChild(blankHeader);

    /*const roundHeader = document.createElement('th');
    roundHeader.textContent = '';
    roundHeader.className = 'round-header';
    roundHeader.style.backgroundColor = curr_colour.hex;
    roundHeader.style.color = curr_colour.text;
    headerRow.appendChild(roundHeader);*/

    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total';
    totalHeader.id = 'total-header';
    totalHeader.style.backgroundColor = curr_colour.hex;
    totalHeader.style.color = curr_colour.text;
    headerRow.appendChild(totalHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);

    const rows = currPlayers.map(p => p.name).sort();

    rows.forEach(player => {
        const row = document.createElement('tr');
        row.dataset.player = player;

        const nameCell = document.createElement('th');
        nameCell.textContent = player;
        nameCell.className = 'name-column';
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        /*const scoreCell = createEditableScoreCell();
        row.appendChild(scoreCell);*/

        const totalCell = document.createElement('td');
        totalCell.className = 'total-cell';
        totalCell.textContent = '0';
        totalCell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        totalCell.style.color = curr_colour.text;
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });

    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'alphabetix-table-scroll';
    scrollWrapper.appendChild(table);
    gameDiv.appendChild(scrollWrapper);

    startBtn.addEventListener('click', () => {
        nextRound();

        const letter = getNextLetter();
        
        const letterHeader = document.getElementById('alphabetix-current-letter');
        const letterText = `${toSOrNotToS(letter.length, 'Letter')}:`;
        letterHeader.textContent = `${letterText} ${letter}`;
        letterHeader.style.display = 'flex';
        
        const headerRow = document.querySelector('#alphabetix_table thead tr');
        const headerCells = headerRow.querySelectorAll('th');
        const latestRoundHeader = headerCells[headerCells.length - 2];
        latestRoundHeader.textContent = `${letter}`;
        
        document.getElementById('alphabetix-timer-start').style.display = 'none';
        startTimer(time.mins, time.secs);
    });

}

function generateAlphabetixResults() {
    roundBtn.style.display = 'none';
    const table = document.getElementById(`${currGame.tag}_table`);
    const rows = table.querySelectorAll('tbody tr');
    const results = [];
    
    rows.forEach(row => results.push(roundResults(row, -1)));

    results.sort((a, b) => {
        const diff = b.points - a.points;
        return diff != 0 ? diff : a.name.localeCompare(b.name);
    });
    while (results[0].points == -1) results.push(results.shift());

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.points == results[index - 1].points) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        result.reward = pointsSystem[currentPlace - 1];
        result.base = pointsSystem[currentPlace - 1];
    });

    return results;
}

function submitAlphabetix(results) {
    roundCount = 1;
    let resultsBox = document.getElementById(`alphabetix_results`);
    
    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `alphabetix_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header('h2', `${place(result.place)} - ${result.name}`));
        const points = toSOrNotToS(result.points, 'point');
        playerBox.appendChild(header('h3', `Result: ${points}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });

    document.getElementById('submit').style.display = 'none';
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Mario Party
//


// #region

let marioPartyPlayers = [];
let marioPartyCharacters = [];
const marioPartyData = {
    'Super Mario Party': {
        maps: [
            `Whomp's Domino Ruins`, `King Bob-omb's Powderkeg Mine`,
            'Megafruit Paradise', `Kamek's Tantalizing Tower`
        ],
        characters: [
            'Mario', 'Luigi', 'Peach', 'Daisy', 'Wario', 'Waluigi', 'Yoshi', 'Rosalina',
            'Donkey Kong', 'Diddy Kong', 'Bowser', 'Goomba', 'Shy Guy', 'Koopa Troopa',
            'Monty Mole', 'Bowser Jr.', 'Boo', 'Hammer Bro', 'Dry Bones', 'Pom Pom'
        ],
        turns: [
            '10', '15', '20'
        ]
    }, 'Mario Party Superstars': {
        maps: [
            `Yoshi's Tropical Island`, 'Space Land',
            `Peach's Birthday Cake`, 'Woody Woods', 'Horror Land'
        ],
        characters: [
            'Mario', 'Luigi', 'Peach', 'Daisy', 'Wario',
            'Waluigi', 'Yoshi', 'Rosalina', 'Donkey Kong', 'Birdo'
        ],
        turns: [
            '10', '15', '20', '25', '30'
        ]
    }, 'Super Mario Party Jamboree': {
        maps: [
            `Mega Wiggler's Tree Party`, `Roll 'em Raceway`,
            'Goomba Lagoon', 'Rainbow Galleria', 'Western Land',
            `Mario's Rainbow Castle`, `King Bowser's Keep`
        ],
        characters: [
            'Mario', 'Luigi', 'Peach', 'Daisy', 'Wario', 'Waluigi', 'Yoshi', 'Toadette',
            'Toad', 'Rosalina', 'Pauline', 'Donkey Kong', 'Birdo', 'Bowser', 'Goomba',
            'Shy Guy', 'Koopa Troopa', 'Monty Mole', 'Bowser Jr.', 'Boo', 'Spike', 'Ninji'
        ],
        turns: [
            '10', '15', '20', '25', '30'
        ]
    }
};

function setupMarioParty(setup) {
    let teamGame = currPlayers.length > 4;

    const version = document.createElement('select');
    version.id = 'mario_party_version';
    version.className = 'game_select';
    //setupVersion();

    const map = document.createElement('select');
    map.id = 'mario_party_map';
    map.className = 'game_select';
    map.style.display = 'none';
    
    const turns = document.createElement('select');
    turns.id = 'mario_party_turns';
    turns.className = 'game_select';
    turns.style.display = 'none';
    
    const character = document.createElement('div');
    character.id = 'mario_party_character';

    const btn = createButton(`mario_party_start`, 'button', 'Start');
    styleButton(btn, curr_colour.text, curr_colour.hex, 'none');
    btn.style.display = 'none';

    const setupVersion = () => {
        version.appendChild(createOption('', 'Pick a version...'))
        Object.keys(marioPartyData).forEach(v => {
            version.appendChild(createOption(`${v}`, ''));
        });
    }

    const moreSetupMarioParty = (players) => {
        setup.innerHTML = '';
        setupVersion();
        setup.appendChild(version);
        setup.appendChild(map);
        setup.appendChild(turns);
        setup.appendChild(character);
        setup.appendChild(btn);
    
        version.addEventListener('change', () => {
            const option = version.value;
            const maps = marioPartyData[option]?.maps || [];
    
            map.innerHTML = '';
            turns.innerHTML = '';
            character.innerHTML = '';
            turns.style.display = 'none';
            character.style.display = 'none';
            map.style.display = 'flex';
    
            map.appendChild(createOption('', 'Pick a map...'));
            maps.forEach(m => map.appendChild(createOption(m, '')));
        });
    
        map.addEventListener('change', () => {
            const option = version.value;
            const possibleTurns = marioPartyData[option]?.turns || [];
    
            turns.innerHTML = '';
            character.innerHTML = '';
            character.style.display = 'none';
            turns.style.display = 'flex';
        
            turns.appendChild(createOption('', 'Number of turns...'));
            possibleTurns.forEach(t => turns.appendChild(createOption(t, '')));
        });
    
        turns.addEventListener('change', () => {
            const selectedVersion = version.value;
            const characters = marioPartyData[selectedVersion]?.characters || [];
            //let options = teamGame ? currTeams : currPlayers.map(p => p.name);
    
            character.innerHTML = '';
            character.style.display = 'flex';
    
            players.forEach(p => {
                const charSelect = document.createElement('select');
                charSelect.name = `char_select_${p}`;
                charSelect.className = 'game_select';
    
                charSelect.appendChild(createOption('', `Pick a character for ${p}...`));
                characters.forEach(c => charSelect.appendChild(createOption(c, '')));
                charSelect.addEventListener('change', () => {
                    const charSelects = Array.from(character.children);
                    const selected = charSelects.map(c => {
                        return {
                            character: c.value,
                            player: c.name.split('_select_')[1]
                        }
                    }).filter(c => c.character != '');
    
                    charSelects.forEach(s => {
                        const currPlayer = s.name.split('_select_')[1];
    
                        for (let i = 1; i < s.options.length; i++) {
                            const option = s.options[i];
                            option.disabled = selected.some(s =>
                                s.character == option.value && s.player != currPlayer
                            );
                        }
                    });
    
                    const exists = marioPartyCharacters.find(mp => mp.name == p)
                    if (exists) exists.character = charSelect.value;

                    const showBtn = marioPartyCharacters.every(p => p.character != '');
                    if (showBtn) btn.style.display = 'flex';
                });
                character.appendChild(charSelect);
            });
        });

        btn.addEventListener('click', () => {
            setup.style.display = 'none';
            startGame();
        });
    }

    if (teamGame) {
        const teams = document.createElement('div');
        teams.id = 'mario_party_teams';
        setup.appendChild(teams);
        addTeams(teams, 0, 4, 'Player');

        const buttons = document.createElement('div');
        buttons.id = 'mario_party_teamButtons';
        setup.appendChild(buttons);

        if (currPlayers.length !== 2) {
            const randomise = createButton('', 'button', 'Randomise');
            styleButton(randomise, curr_colour.text, curr_colour.hex, 'none', 'flex');
            randomise.addEventListener('click', () => {
                addTeams(teams, 0, 4, 'Player');
                version.innerHTML = '';
                setupVersion();

                map.innerHTML = '';
                turns.innerHTML = '';
                character.innerHTML = '';
                map.style.display = 'none';
                turns.style.display = 'none';
                character.style.display = 'none';
            });
            buttons.appendChild(randomise);
        }

        const submit = createButton('', 'button', 'Submit');
        styleButton(submit, curr_colour.text, curr_colour.hex, 'none', 'flex');
        submit.addEventListener('click', () => {
            marioPartyPlayers = [];
            const teamDivs = teams.querySelectorAll('.team-container');
            teamDivs.forEach(div => {
                const playerBoxes = div.querySelectorAll('.player-box-3');
                const players = Array.from(playerBoxes).map(p => p.textContent);
                marioPartyPlayers.push(players);
            });
            
            let play = true;
            const size = Math.floor(currPlayers.length / 4);
            if (currPlayers.length % 4 == 0) {
                play = marioPartyPlayers.every(t => t.length == size);
            } else {
                play = marioPartyPlayers.every(t => t.length == size || t.length == size + 1);
            }
            const formatted = marioPartyPlayers.map(format);
            marioPartyCharacters = formatted.map(p => ({ name: p, character: '' }));

            if (play) {
                teams.style.display = 'none';
                buttons.style.display = 'none';
                moreSetupMarioParty(formatted);
            }
        });
        buttons.appendChild(submit);
    } else {
        moreSetupMarioParty(currPlayers.map(p => p.name));
    }
}

function addMarioPartyExtras(header) {
    let game = theGame.games.find(g => g.name == 'Mario Party' && g.num == gameNumber);
    
    const versionDiv = document.getElementById('mario_party_version');
    const mapDiv = document.getElementById('mario_party_map');
    const turnsDiv = document.getElementById('mario_party_turns');
    if (!versionDiv || !mapDiv || !turnsDiv) return;

    const version = versionDiv.value || 'Mario Party';
    const map = mapDiv.value || 'some map';
    const turns = turnsDiv.value ? `${turnsDiv.value} turns` : 'for some time';
    
    gameTitle.innerHTML = `Game ${gameNumber} - ${version}`;
    header.innerHTML = `Playing ${turns} on ${map}. Good Luck!`;
    game.extras.push(`Version: ${version}`);
    game.extras.push(`Map: ${map}`);
    game.extras.push(`Turns: ${turns}`);
    marioPartyCharacters.forEach(p => {
        game.extras.push(`${p.name}'s Character: ${p.character}`);
    });
}

function createMarioParty() {
    if (currPlayers.length > 4) {
        if (marioPartyCharacters.length != currTeams.length) {
            marioPartyCharacters.length = 0;
            currTeams.forEach(team => {
                marioPartyCharacters.push({ name: team, character: '' });
            });
        }
    } else if (marioPartyCharacters.length != currPlayers.length) {
        marioPartyCharacters.length = 0;
        currPlayers.forEach(p => {
            marioPartyCharacters.push({ name: p.name, character: '' });
        });
    }

    const gameDiv = document.getElementById(`mario_party_game`);
    gameDiv.appendChild(document.createElement('br'));

    const table = document.createElement('table');
    table.id = `mario_party_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.textContent = '';
    blankHeader.style.backgroundColor = curr_colour.hex;
    blankHeader.style.color = curr_colour.text;
    headerRow.appendChild(blankHeader);

    const starHeader = document.createElement('th');
    starHeader.textContent = 'Stars';
    starHeader.style.backgroundColor = curr_colour.hex;
    starHeader.style.color = curr_colour.text;
    headerRow.appendChild(starHeader);

    const coinHeader = document.createElement('th');
    coinHeader.textContent = 'Coins';
    coinHeader.style.backgroundColor = curr_colour.hex;
    coinHeader.style.color = curr_colour.text;
    headerRow.appendChild(coinHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    gameDiv.appendChild(table);

    marioPartyCharacters.forEach(player => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('th');
        nameCell.textContent = `${player.name} (${player.character})`;
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        const createEditableCell = (suffixText) => {
            const td = document.createElement('td');

            const cellDiv = document.createElement('div');
            cellDiv.className = 'score-cell';

            const editable = document.createElement('span');
            editable.className = 'editable';
            editable.contentEditable = 'true';
            editable.textContent = '0';
            editable.dataset.hasEdited = 'false';
            editable.addEventListener('beforeinput', (e) => {
                const allowed = /^[0-9]$/;
                if (e.inputType === 'insertText' && !allowed.test(e.data)) e.preventDefault();
                if (e.inputType === 'insertText' && editable.dataset.hasEdited === 'false') {
                    editable.textContent = '';
                    editable.dataset.hasEdited = 'true';
                }
            });

            const suffix = document.createElement('span');
            suffix.className = 'suffix';
            suffix.textContent = ` ${suffixText}`;

            cellDiv.appendChild(editable);
            cellDiv.appendChild(suffix);
            td.appendChild(cellDiv);
            return td;
        };

        row.appendChild(createEditableCell('stars'));
        row.appendChild(createEditableCell('coins'));

        tbody.appendChild(row);
    });
}

function generateMarioPartyResults() {
    const table = document.getElementById(`mario_party_table`);
    const rows = table.querySelectorAll('tbody tr');
    const rawResults = [];

    rows.forEach((row, i) => {
        const nameCell = row.querySelector('th');
        const starCell = row.querySelectorAll('td .score-cell .editable')[0];
        const coinCell = row.querySelectorAll('td .score-cell .editable')[1];

        if (!nameCell || !starCell || !coinCell) return;

        const nameText = nameCell.textContent.trim();
        const [name, characterRaw] = nameText.split(' (');
        const character = characterRaw ? characterRaw.replace(')', '') : '';

        const stars = parseInt(starCell.textContent.trim(), 10);
        const coins = parseInt(coinCell.textContent.trim(), 10);

        const safeStars = isNaN(stars) ? -1 : stars;
        const safeCoins = isNaN(coins) ? -1 : coins;

        if (currPlayers.length > 4 && name.includes(' and ')) {
            split(name).forEach(n => {
                rawResults.push({
                    team: i,
                    name: n.trim(),
                    character,
                    stars: safeStars,
                    coins: safeCoins
                });
            });
        } else {
            rawResults.push({
                team: i,
                name: name.trim(),
                character,
                stars: safeStars,
                coins: safeCoins
            });
        }
    });

    const teamMap = new Map();
    for (const result of rawResults) {
        if (!teamMap.has(result.team)) {
            teamMap.set(result.team, {
                team: result.team,
                stars: result.stars,
                coins: result.coins
            });
        }
    }

    const sortedTeams = Array.from(teamMap.values()).sort((a, b) => {
        const byStars = b.stars - a.stars;
        const byCoins = b.coins - a.coins;
        return byStars != 0 ? byStars : byCoins != 0 ? byCoins : a.team - b.team;
    });

    let currentPlace = 1;
    let extraPlaces = 0;
    const teamPlacements = new Map();

    const system = currPlayers.length > 4
        ? getPointsSystem(4) : pointsSystem;

    for (let i = 0; i < sortedTeams.length; i++) {
        const team = sortedTeams[i];

        if (i > 0) {
            const prev = sortedTeams[i - 1];
            if (team.stars == prev.stars && team.coins == prev.coins) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }

        teamPlacements.set(team.team, {
            place: currentPlace,
            reward: system[currentPlace - 1] ?? '',
        });
    }

    const finalResults = rawResults.map(p => {
        const placement = teamPlacements.get(p.team);
        const player = currPlayers.find(p2 => p2.name == p.name);
        return {
            player_id: player.player_id,
            name: p.name,
            character: p.character,
            stars: p.stars,
            coins: p.coins,
            place: placement.place,
            reward: placement.reward,
            base: placement.reward
        };
    }).sort((a, b) => {
        const diff = a.place - b.place;
        return diff != 0 ? diff : a.name.localeCompare(b.name);
    });

    return finalResults;
}

function submitMarioParty(results) {
    let resultsBox = document.getElementById(`mario_party_results`);
    
    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `mario_party_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header('h2', `${place(result.place)} - ${result.name}`));
        playerBox.appendChild(header('h3', `Character: ${result.character}`));
        const stars = toSOrNotToS(result.stars, 'star');
        const coins = toSOrNotToS(result.coins, 'coin');
        playerBox.appendChild(header('h3', `Result: ${stars} ${coins}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });

    document.getElementById('submit').style.display = 'none';
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Betrayal
//


// #region

function setupBetrayal(setup) {
    const first = document.createElement('select');
    first.id = 'betrayal_first';
    first.className = 'game_select';
    first.appendChild(createOption('', `Who's character's birthday is closest?...`));
    currPlayers.forEach(p => first.appendChild(createOption(`${p.name}`, '')));
    setup.appendChild(first);
}

function createBetrayal() {
    const gameDiv = document.getElementById('betrayal_game');

    let firstPlayer = '';
    const firstType = document.getElementById('betrayal_first');
    if (firstType && firstType.value.trim() != '') {
        firstPlayer = `${firstType.value}`;
    } else {
        firstPlayer = `Whoever's character has the closest birthday`;
    }
    gameDiv.appendChild(header(
        'h2', `${firstPlayer} goes first!`, '', 'starting-player'
    ));

    const betrayalPlayers = document.createElement('div');
    betrayalPlayers.id = 'betrayalPlayers';
    gameDiv.appendChild(betrayalPlayers);

    let traitor = {};
    let playerDivs = [];
    currPlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-box';
        playerDiv.textContent = player.name;
        playerDiv.style.color = 'black';

        playerDiv.addEventListener('click', () => {
            playerDivs.forEach(div => div.style.background = '#FFFFFF');
            playerDiv.style.background = blue;
            playerDiv.style.colour = 'black';
            traitor = player;
            updateButtonState();
        });

        playerDivs.push(playerDiv);
        betrayalPlayers.appendChild(playerDiv);
    });

    const btn = createButton('', 'button', 'Submit Traitor');
    styleButton(btn, curr_colour.text, curr_colour.hex, 'none', 'none');
    btn.disabled = true;
    btn.addEventListener('click', () => {
        const header = document.getElementById('betrayal_header');
        header.innerHTML = `Don't die (or maybe do if you need to)<br><br>Who wins?`;
        const starting = document.getElementById('starting-player');
        if (starting) starting.style.display = 'none';
        
        while (betrayalPlayers.firstChild) {
            betrayalPlayers.removeChild(betrayalPlayers.lastChild);
        }
        btn.style.display = 'none';

        const player1Div = document.createElement('div');
        player1Div.className = 'player-box-2';
        player1Div.style.color = 'black';
        player1Div.id = 'betrayal_traitor';
        player1Div.style.background = 'white';
        player1Div.textContent = traitor.name;

        const vsDiv = document.createElement('div');
        vsDiv.className = 'versus';
        vsDiv.textContent = 'vs';

        const player2Div = document.createElement('div');
        player2Div.id = 'betrayal_non_traitors';
        currPlayers.filter(p => p.name != traitor.name).forEach(p => {
            const div = document.createElement('div');
            div.className = 'player-box-2';
            div.style.color = 'black';
            div.id = 'betrayal_team';
            div.textContent = p.name;
            div.style.background = 'white';
            div.addEventListener('click', () => selectWinner(true));
            player2Div.appendChild(div);
        });

        player1Div.addEventListener('click', () => selectWinner(false));
        betrayalPlayers.appendChild(player1Div);
        betrayalPlayers.appendChild(vsDiv);
        betrayalPlayers.appendChild(player2Div);
    });

    gameDiv.appendChild(btn);

    const updateButtonState = () => {
        btn.style.display = 'flex';
        btn.disabled = false;
    }

    const update = (d, win) => d.style.background = win ? gold : blue;
    const selectWinner = (bool) => {
        const team = document.getElementById('betrayal_non_traitors');
        Array.from(team.children).forEach(c => update(c, bool));
        update(document.getElementById('betrayal_traitor'), !bool);
        document.getElementById('submit').style.display = 'flex';
    };
}

function generateBetrayalResults() {
    const traitor = document.getElementById('betrayal_traitor');
    const traitorPlayer = currPlayers.find(p => p.name == traitor.textContent);
    const team = currPlayers.filter(p => p.name != traitorPlayer.name);
    let results = [];

    let loss = currSystem == 'Points & Cones' ? '1 cone' : 'Nothing';
    if (traitor.style.background == gold) {
        results.push({
            player_id: traitorPlayer.player_id,
            name: traitorPlayer.name,
            place: 1,
            reward: '1 point',
            base: '1 point'
        });
        team.forEach(p => {
            results.push({
                player_id: p.player_id,
                name: p.name,
                place: currPlayers.length,
                reward: loss,
                base: loss
            });
        });
    } else if (traitor.style.background == blue) {
        team.forEach(p => {
            results.push({
                player_id: p.player_id,
                name: p.name,
                place: 1,
                reward: '1 point',
                base: '1 point'
            });
        });
        results.push({
            player_id: traitorPlayer.player_id,
            name: traitorPlayer.name,
            place: currPlayers.length,
            reward: loss,
            base: loss
        });
    } else {
        console.error(`Error with background: ${traitor.style.background}`);
    }

    results.sort((a, b) => {
        const compare = a.place - b.place;
        return compare != 0 ? compare : a.name.localeCompare(b.name);
    });

    return results;
}

function submitBetrayal(results) {
    let resultsBox = document.getElementById('betrayal_results');
    
    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = 'betrayal_box';
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = result.place == 1 ? gold : blue;
        const place = result.place == 1 ? 'Winner' : 'Loser';
        playerBox.appendChild(header('h2', `${place} - ${result.name}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });

    document.getElementById('submit').style.display = 'none';
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Five Crowns
//


// #region

let fiveCrowns = false;
let fiveCrownsNum = 0;
let fiveCrownsRounds = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
let fiveCrownsOrder = [];
const roundBtn = document.getElementById('round');

function setupFiveCrowns(setup) {
    const type = document.createElement('select');
    type.id = 'five_crowns_type';
    type.className = 'game_select';
    type.appendChild(createOption('', 'Full Game or Spinner Wheel...'));
    type.appendChild(createOption('Full Game', ''));
    type.appendChild(createOption('Spinner Wheel', ''));
    setup.appendChild(type);

    const rounds = createNumInput('Rounds', 11, 'How many rounds...');
    rounds.style.display = 'none';
    setup.appendChild(rounds);

    type.addEventListener('change', () => {
        rounds.style.display = type.value == 'Spinner Wheel' ? 'flex' : 'none';
    });
}

function addFiveCrownsExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    
    const type = document.getElementById('five_crowns_type');
    const rounds = document.getElementById('five_crowns_roundsNum');
    if (!type) return;
    if (type.value == 'Spinner Wheel') {
        fiveCrownsNum = rounds.value ? rounds.value : 11;
        const suffix = fiveCrownsNum != 1 ? ' rounds!' : ' round! Quick game lol';
        header.innerHTML = `The Game will be over after ${fiveCrownsNum}${suffix}`;
        game.extras.push('Type: Spinner Wheel');
        game.extras.push(`Rounds: ${fiveCrownsNum}`);
    } else {
        header.innerHTML = `The Game isn't over 'til the Kings go WILD!`;
        game.extras.push('Type: Full Game');
    }
}

function createFiveCrowns() {
    const type = document.getElementById('five_crowns_type');
    if (!type) return;
    const gameDiv = document.getElementById(`five_crowns_game`);
    const rounds = document.getElementById('five_crowns_roundsNum');
    fiveCrownsNum = rounds.value ? rounds.value : 11;

    const scrollWrapper = document.createElement('div');
    scrollWrapper.className = 'scroll-wrapper';

    const table = document.createElement('table');
    table.id = `${currGame.tag}_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const nameHeader = document.createElement('th');
    nameHeader.textContent = '';
    nameHeader.className = 'name-column';
    nameHeader.style.backgroundColor = curr_colour.hex;
    nameHeader.style.color = curr_colour.text;
    headerRow.appendChild(nameHeader);

    if (type.value == 'Spinner Wheel') {
        for (let i = 1; i <= fiveCrownsNum; i++) {
            const roundHeader = document.createElement('th');
            roundHeader.textContent = '';
            roundHeader.id = `five_crowns_header_${i}`;
            roundHeader.style.backgroundColor = curr_colour.hex;
            roundHeader.style.color = curr_colour.text;
            headerRow.appendChild(roundHeader);
        }
    } else {
        for (let i = 3; i <= 13; i++) {
            const roundHeader = document.createElement('th');
            roundHeader.textContent = `${i} cards`;
            roundHeader.style.backgroundColor = curr_colour.hex;
            roundHeader.style.color = curr_colour.text;
            headerRow.appendChild(roundHeader);
        }
    }
    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total';
    totalHeader.className = 'total-column';
    totalHeader.style.backgroundColor = curr_colour.hex;
    totalHeader.style.color = curr_colour.text;
    headerRow.appendChild(totalHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    currPlayers.forEach(player => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('th');
        nameCell.textContent = player.name;
        nameCell.className = 'name-column';
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        let spans = [];

        for (let i = 0; i < fiveCrownsNum; i++) {
            const cell = document.createElement('td');
            cell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
            cell.style.color = curr_colour.text;
            const cellDiv = document.createElement('div');
            cellDiv.className = 'score-cell';

            const editable = document.createElement('span');
            editable.className = 'editable';
            editable.contentEditable = 'true';
            editable.textContent = '0';

            editable.dataset.hasEdited = 'false';
            editable.addEventListener('beforeinput', (e) => {
                const allowed = /^[0-9\-]$/;
                if (e.inputType == 'insertText' && !allowed.test(e.data)) e.preventDefault();
                if (e.inputType == 'insertText' && editable.dataset.hasEdited == 'false') {
                    editable.textContent = '';
                    editable.dataset.hasEdited = 'true';
                }
            });

            cellDiv.appendChild(editable);
            cell.appendChild(cellDiv);
            row.appendChild(cell);

            spans.push(editable);
        }

        const totalCell = document.createElement('td');
        totalCell.className = 'total-cell';
        totalCell.textContent = '0';
        totalCell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        totalCell.style.color = curr_colour.text;
        row.appendChild(totalCell);

        function calc() {
            let sum = 0;
            spans.forEach(span => {
                const val = parseInt(span.textContent, 10);
                if (!isNaN(val)) sum += val;
            });
            totalCell.textContent = sum;
        }

        spans.forEach(s => s.addEventListener('input', calc));
        calc();

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    scrollWrapper.appendChild(table);
    gameDiv.appendChild(scrollWrapper);

    if (type.value == 'Spinner Wheel') {
        if (fiveCrownsNum != 1) roundBtn.style.display = 'flex';
        
        closeGameBox('wheel');
        replaceSectors('five_crowns', shuffle(fiveCrownsRounds.map(p => `${p}`)));
    }
}

function generateFiveCrownsResults() {
    const table = document.getElementById(`${currGame.tag}_table`);
    const rows = table.querySelectorAll('tbody tr');
    const results = [];

    rows.forEach(row => results.push(roundResults(row, -1)));

    results.sort((a, b) => {
        const diff = a.points - b.points;
        return diff != 0 ? diff : a.name.localeCompare(b.name);
    });
    while (results[0].points == -1) results.push(results.shift());

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.points == results[index - 1].points) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        result.reward = pointsSystem[currentPlace - 1];
        result.base = pointsSystem[currentPlace - 1];
    });

    return results;
}

function submitFiveCrowns(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header('h2', `${place(result.place)} - ${result.name}`));
        const points = toSOrNotToS(result.points, 'point');
        playerBox.appendChild(header('h3', `Result: ${points}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Switch Golf
//


// #region

function createSwitchGolf() {
    const gameDiv = document.getElementById(`${currGame.tag}_game`);
    gameDiv.appendChild(document.createElement('br'));

    const table = document.createElement('table');
    table.id = `${currGame.tag}_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.textContent = '';
    blankHeader.style.backgroundColor = curr_colour.hex;
    blankHeader.style.color = curr_colour.text;
    headerRow.appendChild(blankHeader);

    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Score';
    scoreHeader.style.backgroundColor = curr_colour.hex;
    scoreHeader.style.color = curr_colour.text;
    headerRow.appendChild(scoreHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    gameDiv.appendChild(table);

    wheelOrderPlayers.forEach(player => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('th');
        nameCell.textContent = player;
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        const scoreCell = document.createElement('td');
        scoreCell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        scoreCell.style.color = curr_colour.text;
        const editable = document.createElement('span');
        editable.className = 'editable';
        editable.contentEditable = 'true';
        editable.textContent = '+0';

        editable.dataset.hasEdited = 'false';
        editable.addEventListener('beforeinput', (e) => {
            const allowed = /^[0-9\-+]$/;
            if (e.inputType == 'insertText' && !allowed.test(e.data)) e.preventDefault();
            if (e.inputType == 'insertText' && editable.dataset.hasEdited == 'false') {
                editable.textContent = '';
                editable.dataset.hasEdited = 'true';
            }
        });

        scoreCell.appendChild(editable);
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });
}

function generateSwitchGolfResults() {
    const table = document.getElementById(`${currGame.tag}_table`);
    const rows = table.querySelectorAll('tbody tr');
    const results = [];

    rows.forEach(row => {
        const name = row.querySelector('th').textContent.trim();
        const player = currPlayers.find(p => p.name == name);
        const col = row.querySelector('.editable');
        let final = parseInt(col.textContent.trim(), 10) ?? 9999;

        results.push({
            player_id: player.player_id,
            name: name,
            points: !isNaN(final) ? final : 9999
        });
    });

    results.sort((a, b) => {
        const diff = a.points - b.points;
        return diff != 0 ? diff : a.name.localeCompare(b.name);
    });

    while (results[0].points == 9999) results.push(results.shift());

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index !== 0) {
            if (result.points == results[index - 1].points) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        result.reward = pointsSystem[currentPlace - 1];
        result.base = pointsSystem[currentPlace - 1];
    });

    return results;
}

function submitSwitchGolf(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header('h2', `${place(result.place)} - ${result.name}`));
        const prefix = result.points > 0 ? '+' : '';
        playerBox.appendChild(header('h3', `Result: ${prefix}${result.points}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Mario Kart
//


// #region

let marioKartType = 'Normal';

function setupMarioKart(setup) {
    if (currPlayers.length > 4) {
        marioKartType = 'Time Trial';
        currGame.starting = 'wheel_order';
        return;
    }

    const options = document.createElement('select');
    options.id = 'mario_kart_options';
    options.className = 'game_select';
    options.appendChild(createOption('', 'Normal or Time Trial...'))
    options.appendChild(createOption('Normal', ''));
    options.appendChild(createOption('Time Trial', ''));
    setup.appendChild(options);

    options.addEventListener('change', () => {
        currGame.starting = options.value == 'Normal' ? '' : 'wheel_order';
        marioKartType = options.value;
    });
}

function addMarioKartExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    header.innerHTML = currGame.header;

    if (marioKartType == 'Normal') {
        game.extras.push(`Normal Game`);
    } else if (marioKartType == 'Time Trial') {
        game.extras.push(`Time Trial Game`);
    } else {
        console.error(`Error with ${marioKartType}`);
    }
}

function createMarioKart() {
    if (marioKartType == 'Normal') {
        createTable();
    } else if (marioKartType == 'Time Trial') {
        createTimeTrialTable();
    } else {
        console.error(`Error with ${marioKartType}`);
    }
}

function createTimeTrialTable() {
    const gameDiv = document.getElementById(`${currGame.tag}_game`);
    gameDiv.appendChild(document.createElement('br'));

    const table = document.createElement('table');
    table.id = `${currGame.tag}_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.style.backgroundColor = curr_colour.hex;
    blankHeader.style.color = curr_colour.text;
    headerRow.appendChild(blankHeader);

    const timeHeader = document.createElement('th');
    timeHeader.textContent = 'Time (min:sec.ms)';
    timeHeader.style.backgroundColor = curr_colour.hex;
    timeHeader.style.color = curr_colour.text;
    headerRow.appendChild(timeHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    const createTimeInput = (type) => {
        const editable = document.createElement('span');
        editable.className = 'editable';
        editable.contentEditable = 'true';
        editable.textContent = '0';

        let max = Infinity;
        if (type == 'sec') max = 59;
        if (type == 'ms') max = 999;

        editable.dataset.hasEdited = 'false';
        editable.addEventListener('beforeinput', (e) => {
            const allowed = /^[0-9]$/;
            if (e.inputType == 'insertText' && !allowed.test(e.data)) e.preventDefault();
            if (e.inputType == 'insertText' && editable.dataset.hasEdited == 'false') {
                editable.textContent = '';
                editable.dataset.hasEdited = 'true';
            }
        });

        editable.addEventListener('blur', () => {
            let value = parseInt(editable.textContent) || 0;
            if (type == 'sec' && value > 59) value = 59;
            if (type == 'ms' && value > 999) value = 999;
            if (value < 0) value = 0;
            editable.textContent = value;
            editable.dataset.hasEdited = 'false';
        });
        return editable;
    }

    wheelOrderPlayers.forEach(player => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = player;
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        const timeCell = document.createElement('td');
        timeCell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        timeCell.style.color = curr_colour.text;
        timeCell.appendChild(createTimeInput('min'));
        timeCell.appendChild(document.createTextNode(':'));
        timeCell.appendChild(createTimeInput('sec'));
        timeCell.appendChild(document.createTextNode('.'));
        timeCell.appendChild(createTimeInput('ms'));
        row.appendChild(timeCell);

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    gameDiv.appendChild(table);
}

function generateMarioKartResults() {
    if (marioKartType == 'Normal') {
        return generateTableResults();
    } else if (marioKartType == 'Time Trial') {
        return generateTimeTrialResults();
    } else {
        console.error(`Error with ${marioKartType}`);
    }
}

function generateTimeTrialResults() {
    const results = [];
    const table = document.getElementById(`${currGame.tag}_table`);
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const name = row.children[0].textContent;
        const inputs = row.querySelectorAll('span');
        const min = parseInt(inputs[0].textContent) || 0;
        const sec = parseInt(inputs[1].textContent) || 0;
        const ms = parseInt(inputs[2].textContent) || 0;
        const totalMs = (min * 60 * 1000) + (sec * 1000) + ms;
        const player = currPlayers.find(p => p.name == name);

        results.push({
            player_id: player.player_id,
            name,
            time: `${min}:${String(sec).padStart(2, '0')}.${String(ms).padStart(3, '0')}`,
            totalMs
        });
    });

    results.sort((a, b) => {
        const diff = a.totalMs - b.totalMs;
        return diff != 0 ? diff : a.name.localeCompare(b.name);
    });
    const first = results[0];
    while (results[0].totalMs == 0) {
        const curr = results.shift();
        results.push(curr);
        if (curr == first) break;
    }

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.totalMs == results[index - 1].totalMs) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        result.reward = pointsSystem[currentPlace - 1];
        result.base = pointsSystem[currentPlace - 1];
    });

    return results;
}

function submitMarioKart(results) {
    if (marioKartType == 'Normal') {
        submitTableGame(results);
    } else if (marioKartType == 'Time Trial') {
        submitTimeTrial(results);
    } else {
        console.error(`Error with ${marioKartType}`);
    }
}

function submitTimeTrial(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header('h2', `${place(result.place)} - ${result.name}`));
        playerBox.appendChild(header('h3', `Time: ${result.time}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Table Rounds
//


// #region

let roundCount = 1;

function createEditableScoreCell() {
    const td = document.createElement('td');
    td.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
    td.style.color = curr_colour.text;

    const cellDiv = document.createElement('div');
    cellDiv.className = 'score-cell';

    const editable = document.createElement('span');
    editable.className = 'editable';
    editable.contentEditable = 'true';
    editable.textContent = '0';
    editable.dataset.hasEdited = 'false';

    editable.addEventListener('beforeinput', (e) => {
        const allowed = /^[0-9\-]$/;
        if (e.inputType === 'insertText' && !allowed.test(e.data)) e.preventDefault();
        if (e.inputType === 'insertText' && editable.dataset.hasEdited === 'false') {
            editable.textContent = '';
            editable.dataset.hasEdited = 'true';
        }
    });

    editable.addEventListener('input', updateTotals);

    const prefix = document.createElement('span');
    prefix.className = 'prefix';
    const suffix = document.createElement('span');
    suffix.className = 'suffix';

    if (currGame.name == 'Monopoly' || currGame.name == 'Game of Life') prefix.textContent = '$';
    if (currGame.name == 'Unstable Unicorns') suffix.textContent = ' unicorns';
    if (currGame.name == 'Llamas Unleashed') suffix.textContent = ' animals';
    if (currGame.name == 'Cards Against Humanity') suffix.textContent = ' cards';
    if (currGame.name == 'Boomerang Fu') suffix.textContent = ' kills';

    cellDiv.appendChild(prefix);
    cellDiv.appendChild(editable);
    cellDiv.appendChild(suffix);
    td.appendChild(cellDiv);
    return td;
}

function updateTotals() {
    const table = document.getElementById(`${currGame.tag}_table`);
    const tbodyRows = table.querySelectorAll('tbody tr');

    tbodyRows.forEach(row => {
        let total = 0;
        const scoreCells = row.querySelectorAll('td:not(.total-cell) .editable');
        scoreCells.forEach(editable => {
            const val = parseInt(editable.textContent);
            if (!isNaN(val)) total += val;
        });

        row.querySelector('.total-cell').textContent = total;
    });
}

function createTableRounds() {
    roundBtn.style.display = 'flex';
    const gameDiv = document.getElementById(`${currGame.tag}_game`);
    gameDiv.appendChild(document.createElement('br'));

    const table = document.createElement('table');
    table.id = `${currGame.tag}_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.textContent = '';
    blankHeader.className = 'name-column';
    blankHeader.style.backgroundColor = curr_colour.hex;
    blankHeader.style.color = curr_colour.text;
    headerRow.appendChild(blankHeader);

    const roundHeader = document.createElement('th');
    roundHeader.textContent = 'Round 1';
    roundHeader.className = 'round-header';
    roundHeader.style.backgroundColor = curr_colour.hex;
    roundHeader.style.color = curr_colour.text;
    headerRow.appendChild(roundHeader);

    const totalHeader = document.createElement('th');
    totalHeader.textContent = 'Total';
    totalHeader.id = 'total-header';
    totalHeader.style.backgroundColor = curr_colour.hex;
    totalHeader.style.color = curr_colour.text;
    headerRow.appendChild(totalHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    gameDiv.appendChild(table);

    const rows = currGame.starting == 'wheel_order' ?
        [...wheelOrderPlayers] : currPlayers.map(p => p.name).sort();

    rows.forEach(player => {
        const row = document.createElement('tr');
        row.dataset.player = player;

        const nameCell = document.createElement('th');
        nameCell.textContent = player;
        nameCell.className = 'name-column';
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        const scoreCell = createEditableScoreCell();
        row.appendChild(scoreCell);

        const totalCell = document.createElement('td');
        totalCell.className = 'total-cell';
        totalCell.textContent = '0';
        totalCell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        totalCell.style.color = curr_colour.text;
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });
}

function nextRound() {
    if (currGame.name == 'Five Crowns') {
        if (fiveCrownsOrder.length == fiveCrownsNum - 1) roundBtn.style.display = 'none';
        closeGameBox('wheel');
        replaceSectors('five_crowns', shuffle(fiveCrownsRounds.map(p => `${p}`)));
    } else {
        roundCount++;

        const table = document.getElementById(`${currGame.tag}_table`);
        const headerRow = table.querySelector('thead tr');

        let roundText = `Round ${roundCount}`;
        if (currGame.name == 'Alphabetix') roundText = '';//getNextLetter();

        const newRoundHeader = document.createElement('th');
        newRoundHeader.textContent = roundText;
        newRoundHeader.className = 'round-header';
        newRoundHeader.style.backgroundColor = curr_colour.hex;
        newRoundHeader.style.color = curr_colour.text;
        headerRow.insertBefore(newRoundHeader, document.getElementById('total-header'));

        const tbodyRows = table.querySelectorAll('tbody tr');

        tbodyRows.forEach(row => {
            const newScoreCell = createEditableScoreCell();
            const totalCell = row.querySelector('.total-cell');
            row.insertBefore(newScoreCell, totalCell);
        });

        if (currGame.name != 'Alphabetix') {
            centerOrStart(table.parentElement, 'align');
        }

        updateTotals();
    }
}

function generateTableRoundsResults() {
    roundBtn.style.display = 'none';
    const table = document.getElementById(`${currGame.tag}_table`);
    const rows = table.querySelectorAll('tbody tr');
    const results = [];

    rows.forEach(row => results.push(roundResults(row, -1)));

    const info = gameInfo(currGame.name);
    results.sort((a, b) => {
        let diff = 0;
        if (info.winner_criteria == 'lowest') diff = a.points - b.points;
        if (info.winner_criteria == 'highest') diff = b.points - a.points;
        return diff != 0 ? diff : a.name.localeCompare(b.name);
    });
    while (results[0].points == -1) results.push(results.shift());

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.points == results[index - 1].points) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        result.reward = pointsSystem[currentPlace - 1];
        result.base = pointsSystem[currentPlace - 1];
    });

    return results;
}

function submitTableRoundsGame(results) {
    roundCount = 1;
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach(result => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header('h2', `${place(result.place)} - ${result.name}`));
        const points = toSOrNotToS(result.points, 'point');
        playerBox.appendChild(header('h3', `Result: ${points}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Table
//


// #region

function setupGolf(setup) {
    const options = document.createElement('select');
    options.id = 'golf_options';
    options.className = 'game_select';
    options.appendChild(createOption('', 'Rounds or Limit...'))
    options.appendChild(createOption('Rounds', ''));
    options.appendChild(createOption('Limit', ''));
    setup.appendChild(options);

    const rounds = createNumInput('Rounds', 15, 'How many rounds...');
    const limit = createNumInput('Limit', 99, `What's the limit...`);
    
    setup.appendChild(rounds);
    setup.appendChild(limit);

    options.addEventListener('change', () => {
        const option = document.getElementById('golf_options').value;
        rounds.style.display = option == 'Rounds' ? 'flex' : 'none';
        limit.style.display = option == 'Limit' ? 'flex' : 'none';
        document.getElementById('golf_start').style.display = 'flex';
    });
}

function setupCah(setup) {
    const win = createNumInput('win', 15, 'How many cards to win...');
    win.style.display = 'flex';
    setup.appendChild(win);
}

function setupQuoits(setup) {
    const options = document.createElement('select');
    options.id = 'quoits_options';
    options.className = 'game_select';
    options.appendChild(createOption('', 'Rounds or Limit...'))
    options.appendChild(createOption('Rounds', ''));
    options.appendChild(createOption('Limit', ''));
    setup.appendChild(options);

    const rounds = createNumInput('Rounds', 15, 'How many rounds...');
    const limit = createNumInput('Limit', 99, `What's the limit...`);
    
    setup.appendChild(rounds);
    setup.appendChild(limit);

    options.addEventListener('change', () => {
        const option = document.getElementById('quoits_options').value;
        rounds.style.display = option == 'Rounds' ? 'flex' : 'none';
        limit.style.display = option == 'Limit' ? 'flex' : 'none';
        document.getElementById('quoits_start').style.display = 'flex';
    });
}

function addGolfExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    
    const option = document.getElementById('golf_options');
    if (!option) return;
    option.style.display = 'none';
    console.log(option);
    if (option.value == 'Rounds') {
        const roundsNum = document.getElementById('golf_roundsNum');
        if (!roundsNum) return;
        header.innerHTML = `Total Rounds: ${roundsNum.value}`;
        game.extras.push(`${roundsNum.value} rounds`);
    } else if (option.value == 'Limit') {
        const limitNum = document.getElementById('golf_limitNum');
        if (!limitNum) return;
        header.innerHTML = `Total Limit: ${limitNum.value}`;
        game.extras.push(`${limitNum.value} limit`);
    }
}

function addCahExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    
    const wins = document.getElementById('cah_winNum');
    if (!wins) return;
    header.innerHTML = `Get ${wins.value} cards to win!`;
    game.extras.push(`${wins.value} cards`);
}

function addQuoitsExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    
    const option = document.getElementById('quoits_options');
    if (!option) return;
    option.style.display = 'none';
    if (option.value == 'Rounds') {
        const roundsNum = document.getElementById('quoits_roundsNum');
        if (!roundsNum) return;
        const rounds = toSOrNotToS(roundsNum.value, 'round');
        header.innerHTML = `Throw those rings for ${rounds}!`;
        game.extras.push(`${roundsNum.value} rounds`);
    } else if (option.value == 'Limit') {
        const limitNum = document.getElementById('quoits_limitNum');
        if (!limitNum) return;
        const limit = toSOrNotToS(limitNum.value, 'point');
        header.innerHTML = `Throw those rings until you get to ${limit}!`;
        game.extras.push(`${limitNum.value} limit`);
    } else {
        header.innerHTML = 'Throws those rings!';
    }
}

function createTable() {
    const gameDiv = document.getElementById(`${currGame.tag}_game`);
    
    gameDiv.appendChild(document.createElement('br'));

    const table = document.createElement('table');
    table.id = `${currGame.tag}_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.style.backgroundColor = curr_colour.hex;
    blankHeader.style.color = curr_colour.text;
    headerRow.appendChild(blankHeader);

    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Score';
    scoreHeader.style.backgroundColor = curr_colour.hex;
    scoreHeader.style.color = curr_colour.text;
    headerRow.appendChild(scoreHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    gameDiv.appendChild(table);

    const rows = currGame.starting == 'wheel_order' ?
        [...wheelOrderPlayers] : currPlayers.map(p => p.name).sort();

    rows.forEach(player => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('th');
        nameCell.textContent = player;
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        const scoreCell = document.createElement('td');
        scoreCell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        scoreCell.style.color = curr_colour.text;
        const cellDiv = document.createElement('div');
        cellDiv.className = 'score-cell';

        const editable = document.createElement('span');
        editable.className = 'editable';
        editable.contentEditable = 'true';
        editable.textContent = '0';

        editable.dataset.hasEdited = 'false';
        editable.addEventListener('beforeinput', (e) => {
            const allowed = /^[0-9\-]$/;
            if (e.inputType == 'insertText' && !allowed.test(e.data)) e.preventDefault();
            if (e.inputType == 'insertText' && editable.dataset.hasEdited == 'false') {
                editable.textContent = '';
                editable.dataset.hasEdited = 'true';
            }
        });

        const prefix = document.createElement('span');
        prefix.className = 'prefix';
        const suffix = document.createElement('span');
        suffix.className = 'suffix';

        if (currGame.name == 'Monopoly' || currGame.name == 'Game of Life') prefix.textContent = '$';
        if (currGame.name == 'Unstable Unicorns') suffix.textContent = ' unicorns';
        if (currGame.name == 'Llamas Unleashed') suffix.textContent = ' animals';
        if (currGame.name == 'Cards Against Humanity') suffix.textContent = ' cards';
        if (currGame.name == 'Boomerang Fu') suffix.textContent = ' kills';

        cellDiv.appendChild(prefix);
        cellDiv.appendChild(editable);
        cellDiv.appendChild(suffix);
        scoreCell.appendChild(cellDiv);
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });
}

function generateTableResults() {
    let results = [];
    const table = document.getElementById(`${currGame.tag}_table`);
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const name = row.querySelector('th').textContent.trim();
        const scoreSpan = row.querySelector('.editable');
        const rawScore = scoreSpan ? scoreSpan.textContent.trim() : '0';
        const points = parseInt(rawScore, 10);
        const player = currPlayers.find(p => p.name == name);

        results.push({
            player_id: player.player_id,
            name: name,
            points: isNaN(points) ? -1 : points
        });
    });

    // Sort by points then alphabetically
    results.sort((a, b) => {
        let points = -1;
        if (currGame.winner_criteria == 'highest') {
            points = b.points - a.points;
        } else if (currGame.winner_criteria == 'lowest') {
            points = a.points - b.points;
        } else {
            console.error(`Error with winner in ${currGame.name}: ${currGame.winner_criteria}`);
        }
        return points != 0 ? points : a.name.localeCompare(b.name);
    });
    while (results[0].points == -1) results.push(results.shift());

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.points == results[index - 1].points) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        result.reward = pointsSystem[currentPlace - 1];
        result.base = pointsSystem[currentPlace - 1];
    });

    return results;
}

function submitTableGame(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header(
            'h2', `${place(result.place)} - ${result.name}`
        ));
        let points = '';
        if (currGame.name == 'Monopoly' || currGame.name == 'Game of Life') {
            points = `$${result.points}`;
        } else if (currGame.name == 'Unstable Unicorns') {
            points = toSOrNotToS(result.points, 'unicorn');
        } else if (currGame.name == 'Llamas Unleashed') {
            points = toSOrNotToS(result.points, 'animal');
        } else if (currGame.name == 'Cards Against Humanity') {
            points = toSOrNotToS(result.points, 'card');
        } else {
            points = toSOrNotToS(result.points, 'point');
        }

        playerBox.appendChild(header('h3', `Result: ${points}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Counter
//


// #region

function createCounter() {
    const gameDiv = document.getElementById(`${currGame.tag}_game`);
    
    gameDiv.appendChild(document.createElement('br'));

    const table = document.createElement('table');
    table.id = `${currGame.tag}_table`;

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    const blankHeader = document.createElement('th');
    blankHeader.style.backgroundColor = curr_colour.hex;
    blankHeader.style.color = curr_colour.text;
    headerRow.appendChild(blankHeader);

    const scoreHeader = document.createElement('th');
    scoreHeader.textContent = 'Score';
    scoreHeader.style.backgroundColor = curr_colour.hex;
    scoreHeader.style.color = curr_colour.text;
    headerRow.appendChild(scoreHeader);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    table.appendChild(tbody);
    gameDiv.appendChild(table);

    const rows = currGame.starting == 'wheel_order' ?
        [...wheelOrderPlayers] : currPlayers.map(p => p.name).sort();

    rows.forEach(player => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('th');
        nameCell.textContent = player;
        nameCell.style.backgroundColor = curr_colour.hex;
        nameCell.style.color = curr_colour.text;
        row.appendChild(nameCell);

        const scoreCell = document.createElement('td');
        scoreCell.style.backgroundColor = hexToRgba(curr_colour.hex, 0.6);
        scoreCell.style.color = curr_colour.text;
        const cellDiv = document.createElement('div');
        cellDiv.className = 'score-cell';

        const editable = document.createElement('span');
        editable.className = 'editable';
        editable.contentEditable = 'true';
        editable.textContent = '0';

        editable.dataset.hasEdited = 'false';
        editable.addEventListener('beforeinput', (e) => {
            const allowed = /^[0-9\-]$/;
            if (e.inputType == 'insertText' && !allowed.test(e.data)) e.preventDefault();
            if (e.inputType == 'insertText' && editable.dataset.hasEdited == 'false') {
                editable.textContent = '';
                editable.dataset.hasEdited = 'true';
            }
        });

        const prefix = document.createElement('span');
        prefix.className = 'prefix';
        const suffix = document.createElement('span');
        suffix.className = 'suffix';

        if (currGame.name == 'Monopoly' || currGame.name == 'Game of Life') prefix.textContent = '$';
        if (currGame.name == 'Unstable Unicorns') suffix.textContent = ' unicorns';
        if (currGame.name == 'Llamas Unleashed') suffix.textContent = ' animals';
        if (currGame.name == 'Cards Against Humanity') suffix.textContent = ' cards';
        if (currGame.name == 'Boomerang Fu') suffix.textContent = ' kills';

        cellDiv.appendChild(prefix);
        cellDiv.appendChild(editable);
        cellDiv.appendChild(suffix);
        scoreCell.appendChild(cellDiv);
        row.appendChild(scoreCell);

        tbody.appendChild(row);
    });

    /*
    const WINNING_SCORE = 9;

    let container = document.getElementById('left_tournament');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.color = 'black';

    const scores = { [opp1.id]: 0, [opp2.id]: 0 };

    const statusTitle = header('h3', '&nbsp;', '', 'score_status');
    container.appendChild(statusTitle);

    function createInteractiveScoreBox(player) {
        function updateMatchStatus() {
            const p1Score = scores[opp1.id];
            const p2Score = scores[opp2.id];
            const maxScore = Math.max(p1Score, p2Score);
            
            if (maxScore < WINNING_SCORE - 1) {
                statusTitle.innerHTML = '&nbsp;';
                return;
            }

            const scoreDiff = Math.abs(p1Score - p2Score);
            const leadingPlayer = p1Score > p2Score ? opp1.name : opp2.name;

            if (p1Score == p2Score) {
                statusTitle.innerHTML = 'Deuce';
            } else if (scoreDiff == 1 && maxScore >= WINNING_SCORE) {
                statusTitle.innerHTML = `Advantage: ${leadingPlayer}`;
            } else if (scoreDiff >= 2 && maxScore >= WINNING_SCORE) {
                statusTitle.innerHTML = '&nbsp;';
            } else {
                statusTitle.innerHTML = `Game Point: ${leadingPlayer}`;
            }
        }
        
        const box = document.createElement('div');
        box.className = 'scorebox';

        const name = document.createElement('h4');
        name.textContent = player.name;
        box.appendChild(name);

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = `score_${player.id}`;
        scoreDisplay.textContent = '0';
        box.appendChild(scoreDisplay);

        const leftHover = document.createElement('div');
        leftHover.className = 'hover-area left-hover';
        box.appendChild(leftHover);

        const leftSymbol = document.createElement('span');
        leftSymbol.textContent = '-';
        leftSymbol.className = 'hover-symbol';
        leftHover.appendChild(leftSymbol);

        const rightHover = document.createElement('div');
        rightHover.className = 'hover-area right-hover';
        box.appendChild(rightHover);

        const rightSymbol = document.createElement('span');
        rightSymbol.textContent = '+';
        rightSymbol.className = 'hover-symbol';
        rightHover.appendChild(rightSymbol);
        
        box.addEventListener('click', (e) => {
            const rect = box.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            if (clickX < rect.width / 2) {
                if (scores[player.id] > 0) {
                    scores[player.id]--;
                }
            } else {
                scores[player.id]++;
            }
            scoreDisplay.textContent = scores[player.id];
            updateMatchStatus();

            const opponentId = (player.id === opp1.id) ? opp2.id : opp1.id;
            const wonByTwo = (scores[player.id] - scores[opponentId]) >= 2;

            if (scores[player.id] >= WINNING_SCORE && wonByTwo) {
                submitMatchResult(tournamentId, matchId, player.id, scores);
                return;
            }
        });

        return box;
    }

    const scoreboard = document.createElement('div');
    scoreboard.id = 'tournament_scoreboard';
    scoreboard.appendChild(createInteractiveScoreBox(opp1));
    scoreboard.appendChild(createInteractiveScoreBox(opp2));
    container.appendChild(scoreboard);
    */
}

function generateCounterResults() {
    let results = [];
    const table = document.getElementById(`${currGame.tag}_table`);
    const rows = table.querySelectorAll('tbody tr');

    rows.forEach(row => {
        const name = row.querySelector('th').textContent.trim();
        const scoreSpan = row.querySelector('.editable');
        const rawScore = scoreSpan ? scoreSpan.textContent.trim() : '0';
        const points = parseInt(rawScore, 10);
        const player = currPlayers.find(p => p.name == name);

        results.push({
            player_id: player.player_id,
            name: name,
            points: isNaN(points) ? -1 : points
        });
    });

    // Sort by points then alphabetically
    results.sort((a, b) => {
        let points = -1;
        if (currGame.winner_criteria == 'highest') {
            points = b.points - a.points;
        } else if (currGame.winner_criteria == 'lowest') {
            points = a.points - b.points;
        } else {
            console.error(`Error with winner in ${currGame.name}: ${currGame.winner_criteria}`);
        }
        return points != 0 ? points : a.name.localeCompare(b.name);
    });
    while (results[0].points == -1) results.push(results.shift());

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.points == results[index - 1].points) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
        result.reward = pointsSystem[currentPlace - 1];
        result.base = pointsSystem[currentPlace - 1];
    });

    return results;
}

function submitCounterGame(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header(
            'h2', `${place(result.place)} - ${result.name}`
        ));
        let points = '';
        if (currGame.name == 'Monopoly' || currGame.name == 'Game of Life') {
            points = `$${result.points}`;
        } else if (currGame.name == 'Unstable Unicorns') {
            points = toSOrNotToS(result.points, 'unicorn');
        } else if (currGame.name == 'Llamas Unleashed') {
            points = toSOrNotToS(result.points, 'animal');
        } else if (currGame.name == 'Cards Against Humanity') {
            points = toSOrNotToS(result.points, 'card');
        } else {
            points = toSOrNotToS(result.points, 'point');
        }

        playerBox.appendChild(header('h3', `Result: ${points}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Knockout
//


// #region

function setupSkipBo(setup) {
    const win = createNumInput('card', 15, 'How many cards...');
    win.style.display = 'flex';
    setup.appendChild(win);
}

function addSkipBoExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    
    const cards = document.getElementById('skip_bo_cardNum');
    if (!cards) return;
    header.innerHTML = `Get rid of all ${cards.value} cards to win!`;
    game.extras.push(`${cards.value} cards`);
}

function createKnockout() {
    const gameDiv = document.getElementById(`${currGame.tag}_game`);

    const knockoutContainer = document.createElement('div');
    knockoutContainer.id = 'knockoutContainer';
    gameDiv.appendChild(knockoutContainer);

    const knockout = document.createElement('div');
    knockout.id = 'knockoutPlayers';
    knockoutContainer.appendChild(knockout);

    const order = document.createElement('div');
    order.id = 'knockoutOrder';
    knockoutContainer.appendChild(order);

    const place = (index) => {
        if (currGame.winner_criteria == 'first') return index + 1;
        if (currGame.winner_criteria == 'last') return currPlayers.length - index;
        return -1;
    };

    const updateOrderStyles = (orderDiv) => {
        const place = orderDiv.textContent.split('. ')[0];
        if (place == 1) orderDiv.style.background = gold;
        if (place == 2) orderDiv.style.background = silver;
        if (place == 3) orderDiv.style.background = bronze;
        if (place > 3) orderDiv.style.background = blue;
    };

    currPlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player-box';
        playerDiv.textContent = player.name;
        playerDiv.style.color = 'black';

        playerDiv.addEventListener('click', () => {
            if (!playerDiv.classList.contains('selected')) {
                knockout.removeChild(playerDiv);

                playerDiv.classList.add('selected');
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order-box';
                orderDiv.style.color = 'black';
                orderDiv.textContent = `${place(order.children.length)}. ${player.name}`;

                orderDiv.addEventListener('click', () => {
                    playerDiv.classList.remove('selected');
                
                    playerDiv.style.backgroundColor = '';
                    playerDiv.style.color = 'black';
                
                    knockout.appendChild(playerDiv);
                    order.removeChild(orderDiv);
                    
                    const orderArray = Array.from(order.children);
                    if (currGame.winner_criteria == 'last') orderArray.reverse();
                    orderArray.forEach((child, index) => {
                        const curr = child.textContent.split('. ');
                        console.log(index);
                        console.log(curr);
                        child.style.color = 'black';
                        child.textContent = `${place(index)}. ${child.textContent.split('. ')[1]}`;
                        updateOrderStyles(child);
                    });
                });

                if (currGame.winner_criteria == 'first') order.appendChild(orderDiv);
                if (currGame.winner_criteria == 'last') order.prepend(orderDiv);

                Array.from(order.children).forEach((child) => {
                    updateOrderStyles(child);
                });
            }
        });

        knockout.appendChild(playerDiv);
    });
}

function generateKnockoutResults() {
    const otherPlayers = document.getElementById('knockoutPlayers');
    let others = [];
    Array.from(otherPlayers.children).forEach(p => others.push(p));

    const order = document.getElementById('knockoutOrder');
    const results = Array.from(order.children).map(orderDiv => {
        const [place, name] = orderDiv.textContent.split('. ');
        if (currGame.winner_criteria == 'first' || currGame.winner_criteria == 'last') {
            const numPlace = parseInt(place);
            const player = currPlayers.find(p => p.name == name);
            return {
                player_id: player.player_id,
                name,
                place: numPlace,
                reward: pointsSystem[numPlace - 1],
                base: pointsSystem[numPlace - 1]
            };
        } else {
            console.error(`Error with winner in ${currGame.name}: ${currGame.winner_criteria}`);
        }
    });
    others.forEach(p => {
        results.push({
            player_id: currPlayers.find(p => p.name == p.textContent).player_id,
            name: p.textContent,
            place: results[results.length - 1].place - 1,
            reward: pointsSystem[place - 1]
        });
    });

    return results;
}

function submitKnockoutGame(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header(
            'h2', `${place(result.place)} - ${result.name}`
        ));
        playerBox.appendChild(header('h3', reward(result)));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Single
//


// #region

function setupJenga(setup) {
    const options = document.createElement('select');
    options.id = 'jenga_options';
    options.className = 'game_select';
    options.appendChild(createOption('', 'Version...'))
    options.appendChild(createOption('Normal', ''));
    options.appendChild(createOption('Goofy', ''));
    setup.appendChild(options);
}

function addJengaExtras(header) {
    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    
    const option = document.getElementById('jenga_options');
    if (!option) return;
    option.style.display = 'none';
    console.log(option);
    if (option.value == 'Normal') {
        header.innerHTML = currGame.header;
        game.extras.push('Normal Game');
    } else if (option.value == 'Goofy') {
        header.innerHTML = `Enjoy Goofy Jenga!${currGame.header}`;
        game.extras.push(`Goofy Game`);
    } else {
        console.error(`Error with ${option.value}, somehow`);
    }
}

function createSingle() {
    const gameDiv = document.getElementById(`${currGame.tag}_game`);

    const singleContainer = document.createElement('div');
    singleContainer.id = 'singleContainer';
    gameDiv.appendChild(singleContainer);

    const single = document.createElement('div');
    single.id = 'singlePlayers';
    singleContainer.appendChild(single);

    currPlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.id = `${player.name}_single_box`;
        playerDiv.className = 'player-box';
        playerDiv.style.color = 'black';
        playerDiv.textContent = player.name;

        playerDiv.addEventListener('click', () => {
            currPlayers.forEach(p => {
                const div = document.getElementById(`${p.name}_single_box`);
                if (currGame.winner_criteria == 'winner') {
                    div.style.background = p.name == player.name ? gold : blue;
                } else if (currGame.winner_criteria == 'loser') {
                    div.style.background = p.name != player.name ? gold : blue;
                }
            });
        });

        single.appendChild(playerDiv);
    });
}

function generateSingleResults() {
    let results = [];
    let loss = currSystem == 'Points & Cones' ? '1 cone' : 'Nothing';
    currPlayers.forEach(p => {
        const div = document.getElementById(`${p.name}_single_box`);
        const win = div.style.background == gold;
        results.push({
            player_id: p.player_id,
            name: p.name,
            place: win ? 1 : currPlayers.length,
            reward: win ? '1 point' : loss,
            base: win ? '1 point' : loss
        });
    });

    results.sort((a, b) => {
        const compare = a.place - b.place;
        return compare != 0 ? compare : a.name.localeCompare(b.name);
    });
    
    return results;
}

function submitSingleGame(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        const place = result.place == 1 ? `Winner` : `Loser`;
        playerBox.appendChild(header('h2', `${place} - ${result.name}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Team
//


// #region

let currTeams = [];

function addTeams(teamsDiv, teamSize = 2, numTeams = null, type = 'Team') {
    currTeams = [];
    teamsDiv.innerHTML = '';

    let draggedPlayer = null;

    const addPlayers = (curr, num) => {
        const team = [];
        const teamDiv = document.createElement('div');
        teamDiv.id = `team_${num}`;
        teamDiv.className = 'team-container';
        styleBox(teamDiv, null);
        teamDiv.dataset.team = num;

        const teamHeader = document.createElement('h3');
        teamHeader.innerHTML = `${type} ${num}`;
        teamHeader.style.paddingBottom = '1rem';
        teamDiv.appendChild(teamHeader);

        // Drag & Drop
        teamDiv.addEventListener('dragover', (e) => {
            e.preventDefault()
        });
        teamDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedPlayer) {
                teamDiv.appendChild(draggedPlayer);
                draggedPlayer = null;
            }
        });

        // Hover
        teamDiv.addEventListener('mouseenter', () => {
            styleBox(teamDiv, curr_colour.hex);
        });
        teamDiv.addEventListener('mouseleave', () => {
            styleBox(teamDiv, null);
        });

        curr.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-box-3';
            playerDiv.draggable = true;
            playerDiv.style.color = 'black';
            playerDiv.textContent = player;

            // Drag event handlers
            playerDiv.addEventListener('dragstart', () => {
                draggedPlayer = playerDiv;
                setTimeout(() => playerDiv.style.display = 'none', 0);
            });

            playerDiv.addEventListener('dragend', () => {
                draggedPlayer = null;
                playerDiv.style.display = 'block';
            });

            team.push(player);
            teamDiv.appendChild(playerDiv);
        });

        teamsDiv.appendChild(teamDiv);
        currTeams.push(format(team));
    };

    const curr = shuffle(currPlayers.map(p => p.name));
    const totalPlayers = curr.length;

    let teams = [];

    if (numTeams) {
        for (let i = 0; i < numTeams; i++) teams.push([]);
        curr.forEach((p, i) => teams[i % numTeams].push(p));
    } else {
        for (let i = 0; i < totalPlayers; i += teamSize) {
            teams.push(curr.slice(i, i + teamSize));
        }
    }

    teams.forEach((team, i) => addPlayers(team, i + 1));
}

function createTeam(gameDiv, teamSize = 2, numTeams = null) {
    const teams = document.createElement('div');
    teams.id = 'teams';
    gameDiv.appendChild(teams);
    addTeams(teams, teamSize, numTeams);

    const buttons = document.createElement('div');
    buttons.id = 'teamButtons';
    gameDiv.appendChild(buttons);

    if (currPlayers.length !== 2) {
        const randomise = createButton('', 'button', 'Randomise');
        styleButton(randomise, curr_colour.text, curr_colour.hex, 'none', 'flex');
        randomise.addEventListener('click', () => {
            addTeams(teams, teamSize, numTeams)
        });
        buttons.appendChild(randomise);
    }

    const start = createButton('', 'button', 'Start');
    styleButton(start, curr_colour.text, curr_colour.hex, 'none', 'flex');
    start.addEventListener('click', () => {
        currTeams = [];
        const teamDivs = teams.querySelectorAll('.team-container');
        teamDivs.forEach(div => {
            const players = Array.from(div.querySelectorAll('.player-box-3')).map(p => p.textContent);
            currTeams.push(players);
        });
        let play = true;
        if (currPlayers.length % 2 == 0) {
            play = currTeams.every(t => t.length == teamSize);
        } else {
            play = currTeams.every(t => t.length == teamSize || t.length == teamSize - 1);
        }

        let formatted = [];
        currTeams.forEach(t => formatted.push(format(t)));
        
        if (play) {
            teams.style.display = 'none';
            buttons.style.display = 'none';
    
            if (currGame.starting == 'wheel_first') {
                player_team = true;
                closeGameBox('wheel');
                replaceSectors('players', shuffle(formatted));
            } else {
                startGame();
            }
        }
    });
    buttons.appendChild(start);
}

function playTeam() {
    document.getElementById(`${currGame.tag}_setup`).style.display = 'none';
    const gameDiv = document.getElementById(`${currGame.tag}_game`);
    gameDiv.style.display = 'flex';
    if (currTeams.length == 2) {
        const playersDiv = document.createElement('div');
        playersDiv.id = 'teamPlayers';
        playersDiv.style.marginTop = '30px';

        const team = (teamPlayers) => {
            const playerDiv = document.createElement('div');
            playerDiv.id = `${teamPlayers}_box`;
            playerDiv.className = 'player-box-3';
            playerDiv.style.color = 'black';
            playerDiv.textContent = format(teamPlayers);

            playerDiv.addEventListener('click', () => {
                currTeams.forEach(t => {
                    const box = document.getElementById(`${t}_box`);
                    box.style.background = t == teamPlayers ? gold : blue;
                });
                document.getElementById('submit').style.display = 'flex';
            });

            playersDiv.appendChild(playerDiv);
        };

        team(currTeams[0]);
        const vsDiv = document.createElement('div');
        vsDiv.className = 'versus';
        vsDiv.textContent = 'vs';
        playersDiv.appendChild(vsDiv);
        team(currTeams[1]);

        gameDiv.appendChild(playersDiv);
    } else if (currTeams.length > 2 && currTeams.length <= 5) {
        currTeams = shuffle(currTeams);
        createTournament(currTeams);
    } else {
        console.error(`Error with teams length: ${currTeams.length}`);
    }
}

async function generateTeamResults() {
    let results = [];
    let loss = currSystem == 'Points & Cones' ? '1 cone' : 'Nothing';
    if (currTeams.length == 2) {
        const teamPlayers = document.getElementById('teamPlayers');
        Array.from(teamPlayers.children).filter(t => t.className != 'versus')
        .forEach(t => {
            const names = split(t.textContent);
            names.forEach(name => {
                let player_id = currPlayers.find(p => p.name == name).player_id;
                let place = t.style.background == gold ? 1 : 2;
                let reward = t.style.background == gold ? '1 point' : loss;
                let base = t.style.background == gold ? '1 point' : loss;
                results.push({ player_id, name, place, reward, base });
            });
        });
    } else if (currTeams.length > 2 && currTeams.length <= 5) {
        const res = await fetch(`${route}/tournament/${currTournamentId}/results`);
        const finalResults = await res.json();

        const filtered = finalResults
            .filter(fr => !fr.name.includes('BYE'))
            .sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

        let currPlace = 1;
        let i = 0;
        let newPoints = getPointsSystem(currTeams.length);

        while (i < filtered.length) {
            const tiedTeams = [filtered[i]];
            let j = i + 1;

            while (j < filtered.length && parseInt(filtered[j].rank) == parseInt(filtered[i].rank)) {
                tiedTeams.push(filtered[j]);
                j++;
            }

            tiedTeams.forEach(team => {
                const names = split(team.name);
                names.forEach(name => {
                    let player = currPlayers.find(p => p.name == name);
                    results.push({
                        player_id: player.player_id,
                        name: name,
                        place: currPlace,
                        reward: newPoints[currPlace - 1],
                        base: newPoints[currPlace - 1]
                    });
                });
            });

            currPlace += tiedTeams.length;
            i = j;
        }
    } else {
        console.error(`Error with teams length: ${currTeams.length}`);
    }

    results.sort((a, b) => {
        const compare = a.place - b.place;
        return compare != 0 ? compare : a.name.localeCompare(b.name);
    });

    return results;
}

function submitTeamGame(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header(
            'h2', `${place(result.place)} - ${result.name}`
        ));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Team Points
//


// #region

let currWin = '';
let currPointTeams = [];
let teamPointsResults = [];

function addTeamPoints(teamsDiv, teamSize = 2, numTeams = null, type = 'Team') {
    currWin = '';
    currPointTeams = [];
    teamsDiv.innerHTML = '';

    let draggedPlayer = null;

    const addPlayers = (curr, num) => {
        const team = [];
        const teamDiv = document.createElement('div');
        teamDiv.id = `team_${num}`;
        teamDiv.className = 'team-container';
        styleBox(teamDiv, null);
        teamDiv.dataset.team = num;

        const teamHeader = document.createElement('h3');
        teamHeader.innerHTML = `${type} ${num}`;
        teamHeader.style.paddingBottom = '1rem';
        teamDiv.appendChild(teamHeader);

        // Drag & Drop
        teamDiv.addEventListener('dragover', (e) => {
            e.preventDefault()
        });
        teamDiv.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedPlayer) {
                teamDiv.appendChild(draggedPlayer);
                draggedPlayer = null;
            }
        });

        // Hover
        teamDiv.addEventListener('mouseenter', () => {
            styleBox(teamDiv, curr_colour.hex);
        });
        teamDiv.addEventListener('mouseleave', () => {
            styleBox(teamDiv, null);
        });

        curr.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'player-box-3';
            playerDiv.draggable = true;
            playerDiv.style.color = 'black';
            playerDiv.textContent = player;

            // Drag event handlers
            playerDiv.addEventListener('dragstart', () => {
                draggedPlayer = playerDiv;
                setTimeout(() => playerDiv.style.display = 'none', 0);
            });

            playerDiv.addEventListener('dragend', () => {
                draggedPlayer = null;
                playerDiv.style.display = 'block';
            });

            team.push(player);
            teamDiv.appendChild(playerDiv);
        });

        teamsDiv.appendChild(teamDiv);
        currPointTeams.push(format(team));
    };

    const curr = shuffle(currPlayers.map(p => p.name));
    const totalPlayers = curr.length;

    let teams = [];

    if (numTeams) {
        for (let i = 0; i < numTeams; i++) teams.push([]);
        curr.forEach((p, i) => teams[i % numTeams].push(p));
    } else {
        for (let i = 0; i < totalPlayers; i += teamSize) {
            teams.push(curr.slice(i, i + teamSize));
        }
    }

    teams.forEach((team, i) => addPlayers(team, i + 1));
}

function createTeamPoints(gameDiv, teamSize = 2, numTeams = null) {
    const teams = document.createElement('div');
    teams.id = 'teams';
    gameDiv.appendChild(teams);
    addTeamPoints(teams, teamSize, numTeams);

    const buttons = document.createElement('div');
    buttons.id = 'teamButtons';
    gameDiv.appendChild(buttons);

    if (currPlayers.length !== 2) {
        const randomise = createButton('', 'button', 'Randomise');
        styleButton(randomise, curr_colour.text, curr_colour.hex, 'none', 'flex');
        randomise.addEventListener('click', () => {
            addTeamPoints(teams, teamSize, numTeams)
        });
        buttons.appendChild(randomise);
    }

    const submit = createButton('', 'button', 'Submit');
    styleButton(submit, curr_colour.text, curr_colour.hex, 'none', 'flex');
    submit.addEventListener('click', () => {
        currPointTeams = [];
        const teamDivs = teams.querySelectorAll('.team-container');
        teamDivs.forEach(div => {
            const playerBoxes = div.querySelectorAll('.player-box-3');
            const players = Array.from(playerBoxes).map(p => p.textContent);
            currPointTeams.push(players);
        });
        let play = true;
        if (numTeams && currPointTeams.length != numTeams) play = false;
        if (currPlayers.length % 2 == 0) {
            play = currPointTeams.every(t => t.length == teamSize);
        } else {
            const half = Math.floor(currPlayers.length / numTeams);
            play = currPointTeams.every(t => t.length == teamSize || t.length == half);
        }

        let formatted = [];
        currPointTeams.forEach(t => formatted.push(format(t)));

        if (play) {
            teams.style.display = 'none';
            buttons.style.display = 'none';
            createTeamPointsExtras(gameDiv, formatted);
        }
    });
    buttons.appendChild(submit);
}

function createTeamPointsExtras(gameDiv, teams) {
    gameDiv.style.gap = '2rem';
    const points = createNumInput('Points', 99, 'How many points to win...');
    points.style.display = 'flex';
    gameDiv.appendChild(points);

    const winDiv = document.createElement('div');
    winDiv.id = 'team_point_setup_win';
    winDiv.appendChild(createCheckbox('Win by 2', 'win'));
    winDiv.appendChild(createCheckbox('Win by 3', 'win'));
    winDiv.appendChild(createCheckbox('No win condition', 'win'));
    gameDiv.appendChild(winDiv);

    const options = winDiv.querySelectorAll('.win-checkbox');
    options.forEach(c => {
        c.addEventListener('change', () => {
            if (c.checked) {
                options.forEach(cb => {
                    if (cb != c) cb.checked = false;
                });
            }
        });
    });

    const start = createButton('', 'button', 'Start');
    styleButton(start, curr_colour.text, curr_colour.hex, 'none', 'flex');
    start.addEventListener('click', () => {
        if (currGame.starting == 'wheel_first') {
            player_team = true;
            closeGameBox('wheel');
            replaceSectors('players', shuffle(teams));
        } else {
            startGame();
        }
    });
    gameDiv.appendChild(start);
}

function playTeamPoints() {
    document.getElementById(`${currGame.tag}_setup`).style.display = 'none';
    const gameDiv = document.getElementById(`${currGame.tag}_game`);
    gameDiv.style.display = 'flex';
    if (currPointTeams.length == 2) {
        const winNumDiv = document.getElementById(`${currGame.tag}_pointsNum`);
        gameDiv.appendChild(renderMatchTeamPoints(
            { id: 1, name: format(currPointTeams[0]) },
            { id: 2, name: format(currPointTeams[1]) },
            winNumDiv?.value ? winNumDiv.value : 5,
            currWin == 'Win by 2' ? 2 : currWin == 'Win by 3' ? 3 : 1
        ));
        const submit = document.getElementById('submit')
        submit.style.display = 'none';
    /*} else if (currPointTeams.length > 2 && currPointTeams.length <= 5) {
        currPointTeams = shuffle(currPointTeams);
        createTournament(currPointTeams);*/
    } else {
        console.error(`Error with teams length: ${currPointTeams.length}`);
    }
}

function renderMatchTeamPoints(team1, team2, win_score, win_margin) {
    console.log(team1);
    console.log(team2);
    console.log(win_score);
    console.log(win_margin);
    const id1 = team1.id;
    const id2 = team2.id;
    const scores = { [id1]: 0, [id2]: 0 };

    const div = document.createElement('div');
    div.id = 'team_points_section';
    div.style.display = 'flex';
    div.style.color = 'black';

    const statusTitle = header('h3', '&nbsp;', '', 'score_status');
    div.appendChild(statusTitle);

    const createInteractiveScoreBox = (team, opp) => {
        const updateMatchStatus = () => {
            const t1Score = scores[id1];
            const t2Score = scores[id2];
            const maxScore = Math.max(t1Score, t2Score);
            console.log(`${t1Score} - ${t2Score}`);

            if (maxScore < win_score - win_margin) {
                statusTitle.innerHTML = '&nbsp;';
                return;
            }

            const scoreDiff = Math.abs(t1Score - t2Score);
            const leadingTeam = t1Score > t2Score ? team1.name : team2.name;

            if (win_margin == 1) {
                if (t1Score == t2Score) {
                    statusTitle.innerHTML = 'Next point wins';
                } else if (scoreDiff >= 1 && maxScore >= win_score - 1) {
                    statusTitle.innerHTML = `Game Point: ${leadingTeam}`;
                } else {
                    statusTitle.innerHTML = '&nbsp;';
                }
            } else if (win_margin == 2) {
                if (t1Score >= win_score - 1 && t2Score >= win_score - 1) {
                    if (t1Score == t2Score) {
                        statusTitle.innerHTML = 'Deuce';
                    } else if (scoreDiff >= 1) {
                        statusTitle.innerHTML = `Advantage: ${leadingTeam}`;
                    } else {
                        statusTitle.innerHTML = '&nbsp;';
                    }
                } else if (scoreDiff > 0 && maxScore == win_score - 1) {
                    statusTitle.innerHTML = `Game Point: ${leadingTeam}`;
                } else {
                    statusTitle.innerHTML = '&nbsp;';
                }
            } else if (win_margin == 3) {
                if (t1Score >= win_score - 2 && t2Score >= win_score - 2) {
                    if (t1Score == t2Score) {
                        statusTitle.innerHTML = 'Triple Deuce';
                    } else if (scoreDiff == 1) {
                        statusTitle.innerHTML = `Slight Edge: ${leadingTeam}`;
                    } else if (scoreDiff == 2) {
                        statusTitle.innerHTML = `Game Point: ${leadingTeam}`;
                    } else {
                        statusTitle.innerHTML = '&nbsp;';
                    }
                } else if (scoreDiff >= 2 && maxScore == win_score - 1) {
                    statusTitle.innerHTML = `Game Point: ${leadingTeam}`;
                } else {
                    statusTitle.innerHTML = '&nbsp;';
                }
            } else {
                console.error(`Error with win margin: ${win_margin}`);
            }
        };
        
        const box = document.createElement('div');
        box.className = 'scorebox';

        const name = document.createElement('h4');
        name.textContent = team.name;
        box.appendChild(name);

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = `score_${team.id}`;
        scoreDisplay.textContent = '0';
        box.appendChild(scoreDisplay);

        const leftHover = document.createElement('div');
        leftHover.className = 'hover-area left-hover';
        box.appendChild(leftHover);

        const leftSymbol = document.createElement('span');
        leftSymbol.textContent = '-';
        leftSymbol.className = 'hover-symbol';
        leftHover.appendChild(leftSymbol);

        const rightHover = document.createElement('div');
        rightHover.className = 'hover-area right-hover';
        box.appendChild(rightHover);

        const rightSymbol = document.createElement('span');
        rightSymbol.textContent = '+';
        rightSymbol.className = 'hover-symbol';
        rightHover.appendChild(rightSymbol);
        
        box.addEventListener('click', (e) => {
            const rect = box.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            if (clickX < rect.width / 2) {
                if (scores[team.id] > 0) {
                    scores[team.id]--;
                }
            } else {
                scores[team.id]++;
            }
            scoreDisplay.textContent = scores[team.id];
            updateMatchStatus();

            const wonPoints = scores[team.id] >= win_score;
            const wonByMargin = (scores[team.id] - scores[opp.id]) >= win_margin;
            if (wonPoints && wonByMargin) {
                teamPointsResults.push({
                    game_num: gameNumber,
                    winner: team.name,
                    loser: opp.name,
                    winning_score: scores[team.id],
                    losing_score: scores[opp.id]
                });
                submitGame();
            }
        });

        return box;
    }

    const scoreboard = document.createElement('div');
    scoreboard.id = 'team_scoreboard';
    scoreboard.appendChild(createInteractiveScoreBox(team1, team2));
    scoreboard.appendChild(createInteractiveScoreBox(team2, team1));
    div.appendChild(scoreboard);

    return div;
}

async function generateTeamPointsResults() {
    let results = [];
    let loss = currSystem == 'Points & Cones' ? '1 cone' : 'Nothing';
    if (currPointTeams.length == 2) {
        console.log(teamPointsResults);
        const game = teamPointsResults.find(r => r.game_num == gameNumber);
        split(game.winner).sort().forEach(n => {
            results.push({
                player_id: currPlayers.find(p => p.name == n).player_id,
                name: n,
                place: 1,
                points: game.winning_score,
                reward: '1 point',
                base: '1 point'
            });
        });
        split(game.loser).sort().forEach(n => {
            results.push({
                player_id: currPlayers.find(p => p.name == n).player_id,
                name: n,
                place: currPlayers.length,
                points: game.losing_score,
                reward: loss,
                base: loss
            });
        });
    /*} else if (currPointTeams.length > 2 && currPointTeams.length <= 5) {
        
        const res = await fetch(`${route}/tournament/${currTournamentId}/results`);
        const finalResults = await res.json();

        const filtered = finalResults
            .filter(fr => !fr.name.includes('BYE'))
            .sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

        let currPlace = 1;
        let i = 0;
        let newPoints = getPointsSystem(currPointTeams.length);

        while (i < filtered.length) {
            const tiedTeams = [filtered[i]];
            let j = i + 1;

            while (j < filtered.length && parseInt(filtered[j].rank) == parseInt(filtered[i].rank)) {
                tiedTeams.push(filtered[j]);
                j++;
            }

            tiedTeams.forEach(team => {
                const names = split(team.name);
                names.forEach(name => {
                    let player = currPlayers.find(p => p.name == name);
                    results.push({
                        player_id: player.player_id,
                        name: name,
                        place: currPlace,
                        reward: newPoints[currPlace - 1],
                        base: newPoints[currPlace - 1]
                    });
                });
            });

            currPlace += tiedTeams.length;
            i = j;
        }*/
    } else {
        console.error(`Error with teams length: ${currPointTeams.length}`);
    }

    results.sort((a, b) => {
        const compare = a.place - b.place;
        return compare != 0 ? compare : a.name.localeCompare(b.name);
    });

    return results;
}

function submitTeamPointsGame(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        const place = result.place == 1 ? 'Winner' : 'Loser';
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header('h2', `${place} - ${result.name}`));
        playerBox.appendChild(header('h3', `Result: ${result.points}`));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Tournaments
//


// #region

let numTournaments = 0;
let currTournamentId = 0;

async function createTournament(curr) {
    let players = [...curr];
    if (currGame.name == 'Switch Tennis') {
        players = [];
        curr.forEach(p => players.push(format(p)));
    }
    
    const res = await fetch(`${route}/tournament/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            players,
            sessionId,
            game: currGame.name,
            id: ++numTournaments
        })
    });

    if (res.ok) {
        const data = await res.json();
        currTournamentId = data.tournamentId;

        const div = document.getElementById(`${currGame.tag}_game`);
        div.style.display = 'flex';
        div.style.overflowY = 'visible';
        div.innerHTML = '';

        const section = document.createElement('div');
        section.id = 'tournament_section';
        div.appendChild(section);

        const left = document.createElement('div');
        left.id = 'left_tournament';
        left.style.display = 'flex';
        section.appendChild(left);

        const right = document.createElement('div');
        right.id = 'right_tournament';
        right.className = 'box';
        right.style.border = 'none';
        right.style.display = 'flex';
        section.appendChild(right);

        const oldBracket = document.getElementById('tournament_bracket');
        if (oldBracket) oldBracket.remove();

        const bracketDiv = document.createElement('div');
        bracketDiv.id = 'tournament_bracket';
        bracketDiv.className = 'brackets-viewer';
        right.appendChild(bracketDiv);

        loadBracket(currTournamentId);
    } else {
        const err = await res.json();
        console.error('Failed to create tournament:', err);
        alert('Error creating tournament');
    }
}

async function loadBracket(id) {
    const res = await fetch(`${route}/tournament/${id}`);
    const data = await res.json();

    window.bracketsViewer.render({
        stages: data.bracket.stage,
        matches: data.bracket.match,
        matchGames: data.bracket.match_game,
        participants: data.bracket.participant,
    }, {
        selector: '#tournament_bracket',
        clear: true,
    });

    setTimeout(async () => {
        attachMatchClickHandlers(id);
    }, 100);
}

async function attachMatchClickHandlers(tournamentId) {
    const matchEls = document.querySelectorAll('[data-match-id]');
    const points = currGame.winner_criteria == 'points';

    matchEls.forEach(matchEl => {
        const matchId = matchEl.getAttribute('data-match-id');

        matchEl.addEventListener('click', async () => {
            const res = await fetch(`${route}/tournament/${tournamentId}`);
            const data = await res.json();

            const match = data.bracket.match.find(m => m.id == matchId);
            if (match.status == 4) return;
            const participants = data.bracket.participant;

            const opp1 = participants.find(p => p.id === match.opponent1?.id);
            const opp2 = participants.find(p => p.id === match.opponent2?.id);

            if (!opp1 || !opp2) return;

            if (opp1.name.includes('BYE')) {
                submitMatchResult(tournamentId, matchId, opp2.id);
                return;
            } else if (opp2.name.includes('BYE')) {
                submitMatchResult(tournamentId, matchId, opp1.id);
                return;
            }
    
            if (points) {
                renderMatchPoints(matchId, tournamentId, opp1, opp2);
            } else {
                renderMatchWinner(matchId, tournamentId, opp1, opp2);
            }
        });
    });
}

function renderMatchPoints(matchId, tournamentId, opp1, opp2) {
    const WINNING_SCORE = 9;

    let container = document.getElementById('left_tournament');
    container.innerHTML = '';
    container.style.display = 'flex';
    container.style.color = 'black';

    const scores = { [opp1.id]: 0, [opp2.id]: 0 };

    const statusTitle = header('h3', '&nbsp;', '', 'score_status');
    container.appendChild(statusTitle);

    function createInteractiveScoreBox(player) {
        function updateMatchStatus() {
            const p1Score = scores[opp1.id];
            const p2Score = scores[opp2.id];
            const maxScore = Math.max(p1Score, p2Score);
            
            if (maxScore < WINNING_SCORE - 1) {
                statusTitle.innerHTML = '&nbsp;';
                return;
            }

            const scoreDiff = Math.abs(p1Score - p2Score);
            const leadingPlayer = p1Score > p2Score ? opp1.name : opp2.name;

            if (p1Score == p2Score) {
                statusTitle.innerHTML = 'Deuce';
            } else if (scoreDiff == 1 && maxScore >= WINNING_SCORE) {
                statusTitle.innerHTML = `Advantage: ${leadingPlayer}`;
            } else if (scoreDiff >= 2 && maxScore >= WINNING_SCORE) {
                statusTitle.innerHTML = '&nbsp;';
            } else {
                statusTitle.innerHTML = `Game Point: ${leadingPlayer}`;
            }
        }
        
        const box = document.createElement('div');
        box.className = 'scorebox';

        const name = document.createElement('h4');
        name.textContent = player.name;
        box.appendChild(name);

        const scoreDisplay = document.createElement('div');
        scoreDisplay.id = `score_${player.id}`;
        scoreDisplay.textContent = '0';
        box.appendChild(scoreDisplay);

        const leftHover = document.createElement('div');
        leftHover.className = 'hover-area left-hover';
        box.appendChild(leftHover);

        const leftSymbol = document.createElement('span');
        leftSymbol.textContent = '-';
        leftSymbol.className = 'hover-symbol';
        leftHover.appendChild(leftSymbol);

        const rightHover = document.createElement('div');
        rightHover.className = 'hover-area right-hover';
        box.appendChild(rightHover);

        const rightSymbol = document.createElement('span');
        rightSymbol.textContent = '+';
        rightSymbol.className = 'hover-symbol';
        rightHover.appendChild(rightSymbol);
        
        box.addEventListener('click', (e) => {
            const rect = box.getBoundingClientRect();
            const clickX = e.clientX - rect.left;

            if (clickX < rect.width / 2) {
                if (scores[player.id] > 0) {
                    scores[player.id]--;
                }
            } else {
                scores[player.id]++;
            }
            scoreDisplay.textContent = scores[player.id];
            updateMatchStatus();

            const opponentId = (player.id === opp1.id) ? opp2.id : opp1.id;
            const wonByTwo = (scores[player.id] - scores[opponentId]) >= 2;

            if (scores[player.id] >= WINNING_SCORE && wonByTwo) {
                submitMatchResult(tournamentId, matchId, player.id, scores);
                return;
            }
        });

        return box;
    }

    const scoreboard = document.createElement('div');
    scoreboard.id = 'tournament_scoreboard';
    scoreboard.appendChild(createInteractiveScoreBox(opp1));
    scoreboard.appendChild(createInteractiveScoreBox(opp2));
    container.appendChild(scoreboard);
}

function renderMatchWinner(matchId, tournamentId, opp1, opp2) {
    let container = document.getElementById('left_tournament');
    container.innerHTML = '';
    container.style.display = 'flex';

    container.appendChild(header('h3', 'Who won?'));

    const buttons = document.createElement('div');
    buttons.id = 'tournament_buttons';
    container.appendChild(buttons);

    const player1 = createButton('', 'button', opp1.name);
    styleButton(player1, curr_colour.text, curr_colour.hex, 'none');
    player1.addEventListener('click', () => {
        submitMatchResult(tournamentId, matchId, opp1.id);
    });
    buttons.appendChild(player1);

    const player2 = createButton('', 'button', opp2.name);
    styleButton(player2, curr_colour.text, curr_colour.hex, 'none');
    player2.addEventListener('click', () => {
        submitMatchResult(tournamentId, matchId, opp2.id);
    });
    buttons.appendChild(player2);
}

async function submitMatchResult(tournamentId, matchId, winnerId, scores) {
    let container = document.getElementById('left_tournament');
    if (container) container.innerHTML = '';

    await fetch(`${route}/tournament/${tournamentId}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, winnerId, scores })
    });

    await loadBracket(tournamentId);

    checkIfFinalMatch(tournamentId);
}

async function checkIfFinalMatch(tournamentId) {
    const res = await fetch(`${route}/tournament/${tournamentId}`);
    const data = await res.json();
    const matches = data.bracket.match;
    const sortedMatches = [...matches].sort((a, b) => a.id - b.id);

    const last = sortedMatches[sortedMatches.length - 1];
    const secondLast = sortedMatches[sortedMatches.length - 2];
    const loserBracket = sortedMatches[sortedMatches.length - 3];

    const isFinished = m => m.opponent1?.result && m.opponent2?.result;

    const isGrandFinal1Done = isFinished(secondLast);
    const isGrandFinal2Done = isFinished(last);
    const isLoserBracketDone = isFinished(loserBracket);

    if (!isGrandFinal1Done || !isLoserBracketDone) return;

    const loserId = loserBracket.opponent1?.result === 'win'
        ? loserBracket.opponent1.id : loserBracket.opponent2.id;

    const gf1LoserId = secondLast.opponent1?.result === 'loss'
        ? secondLast.opponent1.id
        : secondLast.opponent2.id;

    if (gf1LoserId === loserId || isGrandFinal2Done) {
        currTournamentId = tournamentId;
        await submitGame();
        document.getElementById('right_tournament').style.display = 'none';
    }
}

async function generateTournamentResults() {
    const res = await fetch(`${route}/tournament/${currTournamentId}/results`);
    const finalResults = await res.json();

    const filtered = finalResults
        .filter(fr => !fr.name.includes('BYE'))
        .sort((a, b) => parseInt(a.rank) - parseInt(b.rank));

    let results = [];
    let currPlace = 1;
    let i = 0;

    while (i < filtered.length) {
        const tiedPlayers = [filtered[i]];
        let j = i + 1;

        while (j < filtered.length && parseInt(filtered[j].rank) == parseInt(filtered[i].rank)) {
            tiedPlayers.push(filtered[j]);
            j++;
        }

        tiedPlayers.forEach(player => {
            const id = currPlayers.find(p => p.name == player.name).player_id;
            results.push({
                player_id: id,
                name: player.name,
                place: currPlace,
                reward: pointsSystem[currPlace - 1],
                base: pointsSystem[currPlace - 1]
            });
        });

        currPlace += tiedPlayers.length;
        i = j;
    }

    return results;
}

function submitTournamentGame(results) {
    let resultsBox = document.getElementById(`${currGame.tag}_results`);

    results.forEach((result) => {
        let playerBox = document.createElement('div');
        playerBox.id = `${currGame.tag}_box`;
        playerBox.className = 'curr_game_box';
        playerBox.style.color = 'black';
        playerBox.style.background = placeColour(result.place);
        playerBox.appendChild(header(
            'h2', `${place(result.place)} - ${result.name}`
        ));
        playerBox.appendChild(header('h3', `Reward: ${reward(result)}`));
        resultsBox.appendChild(playerBox);
    });
    showResults(resultsBox);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Multiple
//


// #region

function setupSuperSmashBros(setup) {
    const type = document.createElement('select');
    type.id = 'smash_type';
    type.className = 'game_select';
    type.appendChild(createOption('', 'Tournament or Knockout...'))
    type.appendChild(createOption('Tournament', ''));
    type.appendChild(createOption('Knockout', ''));
    type.appendChild(createOption('Table', ''));
    setup.appendChild(type);
}

function setupSwitchBasketball(setup) {
    const type = document.createElement('select');
    type.id = 's_basketball_type';
    type.className = 'game_select';
    type.appendChild(createOption('', 'Teams or Table...'))
    type.appendChild(createOption('Teams', ''));
    type.appendChild(createOption('Table', ''));
    setup.appendChild(type);
}

function createMultiple() {
    if (currGame.name == 'Super Smash Bros') {
        const type = document.getElementById('smash_type').value;
        if (!type) return;
        if (type == 'Tournament') {
            currGame.results_type = 'tournament';
            currGame.winner_criteria = 'winner';
            createTournament(shuffle(currPlayers));
        } else if (type == 'Knockout') {
            currGame.results_type = 'knockout';
            currGame.winner_criteria = 'last';
            createKnockout();
        } else if (type == 'table') {
            currGame.results_type = 'table';
            currGame.winner_criteria = 'lowest';
            createTable();
        }
    } else if (currGame.name == 'Switch Basketball') {
        const type = document.getElementById('s_basketball_type').value;
        if (!type) return;
        if (type == 'Teams') {
            currGame.results_type = 'team';
            currGame.winner_criteria = 'winner';
            createTeam(document.getElementById('s_basketball_game'), 2);
        } else if (type == 'Table') {
            currGame.results_type = 'table';
            currGame.winner_criteria = 'highest';
            createTable();
        }
    } else if (currGame.name == 'Minigolf Adventure') {
        currGame.results_type = 'table';
        currGame.winner_criteria = 'lowest';
        createTable();
    }
}

function generateMultipleResults() {
    if (currGame.name == 'Super Smash Bros') {
        const type = document.getElementById('smash_type').value;
        if (!type) return [];
        if (type == 'Tournament') return generateTournamentResults();
        if (type == 'Knockout') return generateKnockoutResults();
        if (type == 'Table') return generateTableResults();
    } else if (currGame.name == 'Switch Basketball') {
        const type = document.getElementById('s_basketball_type').value;
        if (!type) return [];
        if (type == 'Teams') return generateTeamResults();
        if (type == 'Table') return generateTableResults();
    }
    return [];
}

function submitMultipleGame(results) {
    if (currGame.name == 'Super Smash Bros') {
        const type = document.getElementById('smash_type').value;
        if (!type) return;
        if (type == 'Tournament') submitTournamentGame(results);
        if (type == 'Knockout') submitKnockoutGame(results);
        if (type == 'Table') submitTableGame(results);
    } else if (currGame.name == 'Switch Basketball') {
        const type = document.getElementById('s_basketball_type').value;
        if (!type) return [];
        if (type == 'Teams') return submitTeamGame(results);
        if (type == 'Table') return submitTableGame(results);
    }
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Generating, Submitting and Showing Results
//


// #region

function generateResults() {
    switch (currGame.name) {
        case 'Alphabetix': return generateAlphabetixResults();
        case 'Mario Party': return generateMarioPartyResults();
        case 'Betrayal': return generateBetrayalResults();
        case 'Five Crowns': return generateFiveCrownsResults();
        case 'Switch Golf': return generateSwitchGolfResults();
        case 'Mario Kart': return generateMarioKartResults();
        default: switch (currGame.results_type) {
            case 'table_rounds': return generateTableRoundsResults();
            case 'table': return generateTableResults();
            case 'knockout': return generateKnockoutResults();
            case 'single': return generateSingleResults();
            case 'team': return generateTeamResults();
            case 'team_points': return generateTeamPointsResults();
            case 'tournament': return generateTournamentResults();
            case 'counter': return generateCounterResults();
            //case 'counter_rounds': return generateCounterRoundsResults();
            case 'multiple': return generateMultipleResults();
            default: return [];
        }
    }
}

function submitResults(results) {
    switch (currGame.name) {
        case 'Alphabetix': submitAlphabetix(results); break;
        case 'Mario Party': submitMarioParty(results); break;
        case 'Betrayal': submitBetrayal(results); break;
        case 'Five Crowns': submitFiveCrowns(results); break;
        case 'Switch Golf': submitSwitchGolf(results); break;
        case 'Mario Kart': submitMarioKart(results); break;
        default: switch (currGame.results_type) {
            case 'table_rounds': submitTableRoundsGame(results); break;
            case 'table': submitTableGame(results); break;
            case 'knockout': submitKnockoutGame(results); break;
            case 'single': submitSingleGame(results); break;
            case 'tournament': submitTournamentGame(results); break;
            case 'team': submitTeamGame(results); break;
            case 'team_points': submitTeamPointsGame(results); break;
            case 'counter': submitCounterGame(results); break;
            //case 'counter_rounds': submitCounterRoundsGame(results); break;
            case 'multiple': submitMultipleGame(results); break;
        }
    }
    
    logResults(results);
    if (gamesLeft.length != 0) document.getElementById('end').style.display = 'flex';
    if (gamesLeft.length == 0) document.getElementById('refresh').style.display = 'flex';

    showOverallResults();
}

function showResults(div) {
    div.style.display = 'flex';

    const specialityPlayers = currPlayers.filter(p => {
        return p.speciality.includes(currGame.name);
    }).map(p => p.name);

    console.log(specialityPlayers);
}

function showOverallResults() {
    const div = document.getElementById(`${currGame.tag}_results_div`);
    div.style.display = 'flex';
    
    const resultsLine = document.getElementById('results_line');
    resultsLine.style.borderColor = curr_colour.hex;
    resultsLine.style.display = 'flex';

    const resultsDiv = document.querySelectorAll('.results_section');
    resultsDiv.forEach(d => d.style.display = 'flex');
    
    const overall = document.getElementById('overall_results');
    overall.innerHTML = '';
    let results = [];

    theGame.players.forEach(p => {
        const points = p.g_point + p.c_point + p.special_w_point + p.special_l_point;
        const cones =
            gog_version == 'private' ? 
            p.pg_cone + p.f20g_cone + p.l_cone + p.c_cone + p.w_cone + p.v_cone :
            gog_version == 'public' ?
            p.pg_cone + p.l_cone + p.c_cone + p.w_cone + p.v_cone : 0;

        results.push({ name: p.name, points, cones });
    });

    results.sort((a, b) => {
        const comparePoints = b.points - a.points;
        const compareCones = a.cones - b.cones;
        return comparePoints != 0 ? comparePoints :
                compareCones != 0 ? compareCones : a.name.localeCompare(b.name);
    });

    let currentPlace = 1;
    let extraPlaces = 0;
    results.forEach((result, index) => {
        if (index != 0) {
            if (result.points == results[index - 1].points && result.cones == results[index - 1].cones) {
                extraPlaces++;
            } else {
                currentPlace += extraPlaces + 1;
                extraPlaces = 0;
            }
        }
        result.place = currentPlace;
    });

    console.log(results);
    results.forEach(r => {
        const box = document.createElement('div');
        box.className = 'curr_game_box';
        box.style.background = placeColour(r.place);
        box.style.color = 'black';
        
        box.appendChild(header('h2', `${place(r.place)} - ${r.name}`));
        box.appendChild(header('h3', toSOrNotToS(r.points, 'point')));
        box.appendChild(header(
            'h3',
            gog_version == 'private' ? toSOrNotToS(r.cones, 'cone') :
            gog_version == 'public' ? toSOrNotToS(r.cones, 'shot') : ''
        ));

        overall.appendChild(box);
    });

    overall.style.display = 'flex';
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Logs
//


// #region

function log420Game(results) {
    results
        .filter(r => r.played)
        .forEach(r => {
            logCone(r.player_id, '4:20');
            if (r.reward == '1 point') logPoint(r.player_id, 'game');
            if (r.reward == '1 cone') logCone(r.player_id, 'loss');
        });
    
    theGame.games.push({
        game_id: `game_${gameNumber}`,
        num: gameNumber,
        status: 'complete',
        selected_by: gameSelection,
        votes: currVotes,
        name: '4:20 Game',
        extras: [],
        players: four20Players,
        speciality: [],
        results,
        after: []
    });
}

function logResults(results) {
    results.forEach(r => {
        const player = overallPlayers.find(p => p.player_id == r.player_id);
        const isSpeciality = player.speciality.includes(currGame.name);
        const won = r.place == 1;
        let firstWord = r.reward.split(' ')[0];
        let num = !isNaN(firstWord) ? parseInt(firstWord) : -1;

        if (isSpeciality && won) {
            num--;
            logPoint(r.player_id, 'speciality_w');
        } else if (isSpeciality && !won) {
            num++;
            logPoint(r.player_id, 'speciality_l');
        }

        if (r.reward.includes('1 coin flip cone')) {
            logCone(r.player_id, 'coin');
        } else if (r.reward.includes('1 cone')) {
            logCone(r.player_id, 'loss');
        } else if (r.reward.includes('1 coin flip shot')) {
            logCone(r.player_id, 'coin');
        } else if (r.reward.includes('1 shot')) {
            logCone(r.player_id, 'loss');
        } else if (r.reward.includes('1 coin flip point')) {
            logPoint(r.player_id, 'coin');
        } else if (r.reward.includes('point') && num != -1) {
            for (let i = 0; i < num; i++) {
                logPoint(r.player_id, 'game');
            }
        }
    });

    let game = theGame.games.find(g => g.name == currGame.name && g.num == gameNumber);
    game.status = 'complete';
    game.results = results;
}

function logCone(id, type) {
    let player = overallPlayers.find(p => p.player_id == id);
    if (!player) return;
    switch (type) {
        case 'pre-game': case 'break': player.pg_cone++; break;
        case '4:20': player.f20g_cone++; break;
        case 'loss': player.l_cone++; break;
        case 'coin': player.c_cone++; break;
        case 'wheel': player.w_cone++; break;
        case 'victory': player.v_cone++; break;
        default: console.error(`Error with point type: ${type}`);
    }
}

function logPoint(id, type) {
    let player = overallPlayers.find(p => p.player_id == id);
    if (!player) return;
    switch (type) {
        case 'game': player.g_point++; break;
        case 'coin': player.c_point++; break;
        case 'speciality_w': player.special_w_point++; break;
        case 'speciality_l': player.special_l_point--; break;
        default: console.error(`Error with point type: ${type}`);
    }
}

function logNeigh(id, type) {
    let player = overallPlayers.find(p => p.player_id == id);
    if (!player) return;
    if (type == 'Neigh') player.neigh--;
    if (type == 'Super Neigh') player.super_neigh--;
    if (player.neigh < 0) player.neigh = 0;
    if (player.super_neigh < 0) player.super_neigh = 0;

    let lastGame = theGame.games.at(-1);
    if (lastGame) lastGame.after.push(`${player.name} NEIGHED ${currGame.name}`);
}

function logGooC(id, type) {
    let player = overallPlayers.find(p => p.player_id == id);
    if (!player) return;
    switch (type) {
        case 'add': player.gooc_total++; break;
        case 'use': player.gooc_used++; break;
        default: console.error(`Error with gooc type: ${type}`);
    }
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Games
//
//


// #region

function createGame() {
    openGameBox();

    const oldGame = document.querySelector('.curr_game');
    console.log(oldGame);
    oldGame.remove();
    
    const newGame = document.createElement('div');
    newGame.className = 'curr_game';
    newGame.id = `${currGame.tag}`;
    newGame.style.display = 'flex';
    gameModal.insertBefore(newGame, buttonBox);

    const setup = document.createElement('div');
    setup.id = `${currGame.tag}_setup`;
    setup.className = 'curr_game_setup';
    newGame.appendChild(setup);

    if (currGame.name == 'Alphabetix') setupAlphabetix(setup);
    if (currGame.name == 'Mario Party') setupMarioParty(setup);
    if (currGame.name == 'Lego Party') setupMarioParty(setup);
    if (currGame.name == 'Betrayal') setupBetrayal(setup);
    if (currGame.name == 'Five Crowns') setupFiveCrowns(setup);
    if (currGame.name == 'Mario Kart') setupMarioKart(setup);
    if (currGame.name == 'Golf') setupGolf(setup);
    if (currGame.name == 'Cards Against Humanity') setupCah(setup);
    if (currGame.name == 'Quoits') setupQuoits(setup);
    if (currGame.name == 'Skip Bo') setupSkipBo(setup);
    if (currGame.name == 'Jenga') setupJenga(setup);
    if (currGame.name == 'Super Smash Bros') setupSuperSmashBros(setup);
    if (currGame.name == 'Switch Basketball') setupSwitchBasketball(setup);
    
    if (!isTeams(currGame) && currGame.name != 'Alphabetix') {
        const btn = createButton(`${currGame.tag}_start`, 'button', 'Start');
        styleButton(btn, curr_colour.text, curr_colour.hex, 'none');
        btn.addEventListener('click', () => {
            setup.style.display = 'none';
            if (currGame.starting == 'wheel_first') {
                wheel_first = true;
                closeGameBox('wheel');
                replaceSectors('players', shuffle(currPlayers.map(p => p.name)));
            } else if (currGame.starting == 'wheel_order') {
                wheel_order = true;
                wheelOrder = currPlayers.map(p => p.name);
                closeGameBox('wheel');
                replaceSectors('players', shuffle(wheelOrder));
            } else {
                startGame();
            }
        });
        setup.appendChild(btn);
    }

    const gameHeader = document.createElement('div');
    gameHeader.id = `${currGame.tag}_header`;
    gameHeader.className = 'curr_game_header';
    newGame.appendChild(gameHeader);

    const game = document.createElement('div');
    game.id = `${currGame.tag}_game`;
    game.className = 'curr_game_game';
    newGame.appendChild(game);

    const resultsDiv = document.createElement('div');
    resultsDiv.id = `${currGame.tag}_results_div`;
    resultsDiv.className = 'curr_game_results_div';
    newGame.appendChild(resultsDiv);

    const resultsSection1 = document.createElement('div');
    resultsSection1.className = 'results_section';
    resultsDiv.appendChild(resultsSection1);

    resultsSection1.appendChild(header('h2', 'Game Results:'));
    const results = document.createElement('div');
    results.id = `${currGame.tag}_results`;
    results.className = 'curr_game_results';
    resultsSection1.appendChild(results);

    const line = document.createElement('div');
    line.id = 'results_line';
    resultsDiv.appendChild(line);

    const resultsSection2 = document.createElement('div');
    resultsSection2.className = 'results_section';
    resultsDiv.appendChild(resultsSection2);

    resultsSection2.appendChild(header('h2', 'Overall Results:'));
    const overall = document.createElement('div');
    overall.id = `overall_results`;
    overall.className = 'curr_game_results';
    resultsSection2.appendChild(overall);

    if (isTeams(currGame) && currGame.name != 'Mario Party') {
        if (currGame.results_type == 'team_points') {
            const half = Math.ceil(currPlayers.length / 2);
            createTeamPoints(setup, half, 2);
        } else {
            createTeam(setup, 2);
        }
    }
}

function startGame() {
    console.log('currGame', currGame);
    const playerNames = currPlayers.map(p => p.name);
    const specialityPlayers = currPlayers.filter(p => {
        return p.speciality.includes(currGame.name)
    }).map(p => p.name);
    
    theGame.games.push({
        game_id: `game_${gameNumber}`,
        num: gameNumber,
        status: 'active',
        selected_by: gameSelection,
        votes: currVotes,
        name: currGame.name,
        extras: [],
        players: playerNames,
        speciality: specialityPlayers,
        results: [],
        after: []
    });
    currVotes = [];
    
    if (currGame.name == 'Quoits') {
        currGame.winner_criteria = 'highest';
        currGame.results_type = 'table_rounds';
    }
    switch (currGame.name) {
        case 'Alphabetix': createAlphabetix(); break;
        case 'Mario Party': createMarioParty(); break;
        case 'Betrayal': createBetrayal(); break;
        case 'Five Crowns': createFiveCrowns(); break;
        case 'Switch Golf': createSwitchGolf(); break;
        case 'Mario Kart': createMarioKart(); break;
        //case 'Quoits': createTableRounds(); break;
        default:
            switch (currGame.results_type) {
                case 'table_rounds': createTableRounds(); break;
                case 'table': createTable(); break;
                case 'knockout': createKnockout(); break;
                case 'single': createSingle(); break;
                case 'tournament': createTournament(shuffle(playerNames)); break;
                case 'team': playTeam(); break;
                case 'team_points': playTeamPoints(); break;
                //case 'counter': createCounter(); break;
                //case 'counter_rounds': createCounterRounds(); break;
                case 'multiple': createMultiple(); break;
            }
    }

    const setup = document.getElementById(`${currGame.tag}_setup`);
    if (setup) setup.style.display = 'none';
    const noPlayers = document.getElementById('noPlayers');
    if (noPlayers) noPlayers.style.display = 'none';
    let header = document.getElementById(`${currGame.tag}_header`);

    switch (currGame.name) {
        case 'Alphabetix': addAlphabetixExtras(header); break;
        case 'Mario Party': addMarioPartyExtras(header); break;
        case 'Five Crowns': addFiveCrownsExtras(header); break;
        case 'Mario Kart': addMarioKartExtras(header); break;
        case 'Golf': addGolfExtras(header); break;
        case 'Cards Against Humanity': addCahExtras(header); break;
        case 'Quoits': addQuoitsExtras(header); break;
        case 'Skip Bo': addSkipBoExtras(header); break;
        case 'Jenga': addJengaExtras(header); break;
        default: header.innerHTML = currGame.header;
    }

    header.style.display = 'flex';
    document.getElementById(`${currGame.tag}_game`).style.display = 'flex';

    document.getElementById('end').style.display = 'none';
    document.getElementById('refresh').style.display = 'none';

    if (currGame.name == 'Super Smash Bros') {
        const type = document.getElementById('smash_type').value;
        if (type && type != 'Tournament') {
            document.getElementById('submit').style.display = 'flex';
        }
    } else if (
        currGame.results_type != 'tournament' && currGame.results_type != 'team' &&
        currGame.results_type != 'team_points' &&  currGame.name != 'Betrayal'
    ) {
        document.getElementById('submit').style.display = 'flex';
    }
}

async function submitGame() {
    document.getElementById(`${currGame.tag}_game`).style.display = 'none';
    const results = generateResults();
    
    let box = document.getElementById('coin_box');
    if (!box) {
        box = document.createElement('div');
        box.id = `coin_box`;
    }

    let coins = [];
    const resultCoins = results.filter(r => r.base == 'pn' || r.base == 'pc' || r.base == 'nc');
    resultCoins.forEach(r => coins.push(createCoin(resultCoins.length, results, coins, box, r)));

    if (coins.length == 0) submitResults(results);
    document.getElementById(`${currGame.tag}`).appendChild(box);
    const starting = document.getElementById('starting-player')
    if (starting) starting.style.display = 'none';
    document.getElementById(`${currGame.tag}_header`).style.display = 'none';
    document.getElementById('submit').style.display = 'none';
}

function refreshGames() {
    console.log('Refreshing games!!!');
    console.log('Before:', gamesLeft);
    console.log(theGame.possible_games);
    console.log(gamesInfo);

    if (gameSelection == 'Choose') {
        const box = document.getElementById(`${currGame.tag}_box`)
        if (box) box.remove();
    }
    const size = currPlayers.length;
    theGame.possible_games
    .filter(game => {
        const info = gameInfo(game);
        return size >= info.player_min && size <= info.player_max;
    })
    .forEach(game => {
        const info = gameInfo(game);
        gamesLeft.push(info);
        if (gameSelection == 'Choose') {
            const curr = document.getElementById(`choosing-${info.type}`);
            if (curr) createChoosingBox(curr, info);
        }
    });
    console.log('After:', gamesLeft);

    let lastGame = theGame.games.at(-1);
    lastGame.after.push('Refreshed games');
    refreshCount = ++theGame.refresh_count;
}

async function nextGame(from) {
    gameNumber++;
    otherWelcome.innerHTML = `Game ${gameNumber}`;
    otherWelcome.style.display = 'flex';
    document.getElementById('end').style.display = 'none';
    document.getElementById('refresh').style.display = 'none';
    document.getElementById(`${currGame.tag}`).innerHTML = '';

    updateHeaderButtons('show');
    intrudeBtn.style.display = 'flex';
    abandonBtn.style.display = 'flex';
    breakConeBtn.style.display = 'flex';
    victoryConeBtn.style.display = 'flex';

    if (currGame.name == '4:20 Game') {
        four20game.style.display = 'none';
        camera.style.display = 'none';
        photoDivDiv.style.display = 'none';
        if (gameSelection == 'Wheel') {
            const games = gamesLeft.filter(g => g.name != '4:20 Game');
            replaceSectors('games', shuffle(games.map(p => p.name)));
        } else if (gameSelection == 'Choose') {
            const box = document.getElementById(`four20game_box`);
            if (box.parentElement.childElementCount > 1) {
                box.remove();
            } else {
                box.parentElement.parentElement.remove();
            }
            openChoosing();
        } else if (gameSelection == 'Vote') {
            openVote();
        }
        await saveGameState(false);
        closeGameBox('end');
        return;
    }
    
    if (gameSelection == 'Wheel') {
        if (from == 'refreshed') {
            replaceSectors('games', shuffle(gamesLeft.map(p => p.name)));
        } else {
            const games = gamesLeft.filter(g => g.name != currGame.name);
            replaceSectors('games', shuffle(games.map(p => p.name)));
        }
    }
    
    const speciality = document.getElementById('specialityTitle')
    if (speciality) speciality.style.display = 'none';
    const results = document.getElementById(`${currGame.tag}_results`)
    if (results) results.style.display = 'none';
    const coin = document.getElementById('coin_box')
    if (coin) coin.style.display = 'none';

    four20game.style.display = 'none';
    wheelCone.style.display = 'none';
    askNeigh.style.display = 'none';
    
    await saveGameState(false);
    closeGameBox('end');
    
    gameTitle.innerText = `Game ${gameNumber}`;
    if (gameSelection == 'Choose') openChoosing();
    if (gameSelection == 'Vote') openVote();
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Starting, Saving and Finishing a Game of Games
//


// #region

function noSession() {
    headerTitle.innerHTML = '';
    headerTitle.style.textDecoration = 'none';
    headerTitle.appendChild(header('h1', `Session ${sessionId} Not Found`));

    document.getElementById('finish').style.display = 'none';

    const homeBtn = document.getElementById('home-button');
    homeBtn.addEventListener('click', () => {
        window.location.href = '/';
    });
    
    intrudeBtn.style.display = 'none';
    abandonBtn.style.display = 'none';
    breakConeBtn.style.display = 'none';
    victoryConeBtn.style.display = 'none';
}

function initialiseButtons() {
    //const homeBtn = document.getElementById('home-button');
    //homeBtn.addEventListener('click', () => saveGoG());

    const finishBtn = document.getElementById('finish');
    finishBtn.style.display = 'flex';
    finishBtn.addEventListener('click', () => finishGoG());

    const neighBtns = document.querySelectorAll('.neigh-button');
    neighBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'yesNeigh1') neigh(true, 1);
            if (btn.id == 'yesNeigh2') neigh(true, 2);
            if (btn.id == 'yesNeigh3') neigh(true, 3);
            if (btn.id == 'noNeigh1') neigh(false, 1);
            if (btn.id == 'noNeigh2') neigh(false, 2);
            if (btn.id == 'noNeigh3') neigh(false, 3);
        });
    });

    const closeBtns = document.querySelectorAll('.middle-close');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'intrude-game-close') closeIntrude();
            if (btn.id == 'abandon-game-close') closeAbandon();
            if (btn.id == 'break-cone-close') closeBreakCone();
            if (btn.id == 'victory-cone-close') closeVictoryCone();
        });
    });

    const four20Btns = document.querySelectorAll('.four20-button');
    four20Btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'four20') start420Game();
            if (btn.id == 'option_photo') createCamera();
            if (btn.id == 'capture') capturePhoto(true);
            if (btn.id == 'retake') retakePhoto();
        });
    });

    const four20Upload = document.getElementById('fileInput');
    four20Upload.addEventListener('click', () => upload());

    const gameBtns = document.querySelectorAll('.game-action-button');
    gameBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'complete') complete420Game(true);
            if (btn.id == 'round') nextRound();
            if (btn.id == 'submit') submitGame();
            if (btn.id == 'end') nextGame();
            if (btn.id == 'refresh') {
                refreshGames();
                nextGame('refreshed');
            }
        });
    });

    const bottomBtns = document.querySelectorAll('.bottom-button');
    bottomBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'intrude') openIntrude();
            if (btn.id == 'abandon') openAbandon();
            if (btn.id == 'vote') submitVotes();
            if (btn.id == 'break-cone') openBreakCone();
            if (btn.id == 'victory-cone') openVictoryCone();
        });
    });

    const spin = document.getElementById('spin');
    if (spin) spin.addEventListener('click', () => spinWheel('games'));
    const spin2 = document.getElementById('spin2');
    if (spin2) spin2.addEventListener('click', () => spinWheel('cone'));
}

async function initialise(sessionId) {
    try {
        logoBox();
        setInterval(timeDisplay, 1000);
        timeDisplay();
        loadMenuBurger();

        user_data = await loadUserOption();
        const pfp = document.getElementById('profile-pic');
        pfp.addEventListener('click', () => openUserModal(
            userModal, userBox, curr_colour, setupUserModal
        ));

        initialiseUserButtons(userModal, userBox);

        console.log(user_data);
        headerTitle.innerHTML = '';
        if (!user_data.authenticated || (user_data.user.role != 'admin' && user_data.user.role != 'owner')) {
            headerTitle.appendChild(header('h1', `Access Denied`));
            return;
        }
        headerTitle.appendChild(header('h1', `Access Granted`));

        gog_version = user_data.user.version;


        //startTime = new Date();
        const [ gamesRes, playersRes, pointsRes, sessionRes ] = await Promise.all([
            fetch(`${route}/games`),
            fetch(`${route}/players`),
            fetch(`${route}/points`),
            fetch(`${route}/sessions/${sessionId}`)
        ]);
        
        
        if (!gamesRes.ok) console.error('Games error');
        if (!playersRes.ok) console.error('Players error');
        if (!pointsRes.ok) console.error('Points error');
        if (!sessionRes.ok) console.error('Session error');
        if (!gamesRes.ok || !playersRes.ok || !pointsRes.ok || !sessionRes.ok) {
            console.error('Failed to load one or more resources');
            return;
        }
        
        gamesInfo = await gamesRes.json();
        allPlayers = await playersRes.json();
        allSystems = await pointsRes.json();
        sessionOverview = await sessionRes.json();
        session = sessionOverview.session;

        console.log('gamesInfo: ', gamesInfo);
        console.log('allPlayers: ', allPlayers);
        console.log('allSystems: ', allSystems);
        console.log('session: ', session);
        console.log('players: ', sessionOverview.players);
        console.log('gamesPlayed: ', sessionOverview.games_played);
        console.log('possibleGames: ', sessionOverview.possible_games);

        if (!session) {
            noSession();
            return;
        }

        const size = sessionOverview.players.length;
        const possible = sessionOverview.possible_games.filter(g => {
            const info = gameInfo(g);
            return size >= info.player_min && size <= info.player_max;
        });

        const other = gamesInfo
        .filter(i => size < i.player_min || size > i.player_max);
        console.log('Not played: ', other.map(p => p.name));
        
        theGame = {
            gog_id: session.name,
            status: session.status,
            start_time: session.start_time,
            finish_time: session.finish_time,
            points_system: session.points_system,
            num_speciality: session.speciality_count,
            refresh_count: session.refresh_count,
            intruded: session.intruded ?? [],
            abandoned: session.abandoned ?? [],
            extra: session.extra ?? [],
            players: sessionOverview.players ?? [],
            possible_games: sessionOverview.possible_games ?? [],
            games: sessionOverview.games_played ?? [],
            final_results: []
        };

        headerTitle.innerHTML = '';
        headerTitle.appendChild(header('h1', `${theGame.gog_id}`));
        updateHeaderButtons('start');

        gameSelection = 'Choose';
        startTime = new Date(session.start_time);
    
        overallPlayers = theGame.players;
        currPlayers = theGame.players.filter(p => p.is_playing);
        currPlayers = display(currPlayers);
    
        currSystem = theGame.points_system;
        pointsSystem = getPointsSystem(currPlayers.length);
    
        numSpeciality = parseInt(theGame.num_speciality);
    
        refreshCount = parseInt(theGame.refresh_count);
        let refreshedGames = getAllGamesSinceLastReset();
        gamesLeft = gamesInfo.filter(g => {
            if (!theGame.possible_games.includes(g.name)) return false;
            return !refreshedGames.find(g2 => g2.name == g.name);
        });
        gameNumber = theGame.games.length + 1;
        games = gamesInfo.map(g => g.name);
        
        initialiseButtons();
        if (gamesLeft.length == 0) {
            const result = document.getElementById('refresh-result');
            const div = document.getElementById('refresh-games');
            
            result.style.display = 'flex';
            div.style.display = 'flex';
        
            const yesBtn = document.getElementById('refresh-yes');
            yesBtn.addEventListener('click', () => {
                result.style.display = 'none';
                div.style.display = 'none';
                refreshGames();
                // SAVE GAME STATE LATER!!!!
                start();
            });

            const noBtn = document.getElementById('refresh-no');
            const options = [
                'Refresh or end the game.',
                'Seriously? You *have* to refresh or end it all.',
                `We've been over this.`,
                'Refresh. The. Games. Or. Go. Home.',
                `You're embarrassing yourself.`,
                'The Game of Games Gods demand a refresh or home time.',
                'You know what you need to do.',
                `Let's not make this harder than it has to be.`,
                'Cam says: REFRESH NOW OR BE MY LADY LADY.'
            ];
            let i = 0;
            noBtn.addEventListener('click', () => {
                result.textContent = `${options[i]}`;
                result.style.display = 'flex';
                i = i == options.length - 1 ? 0 : i + 1;
            });
        } else {
            startGoG(theGame.games.length == 0);
        }
    } catch (err) {
        console.error('Failed to load session data', err);
    }
}

function start() {
    updateHeaderButtons('start');
    updateHeaderButtons('show');
    if (gameSelection == 'Wheel') {
        let games = gamesLeft.map(p => p.name);
        if (games.length == 0) {
            refreshGames();
            games = gamesLeft.map(p => p.name);
        }
        replaceSectors('games', shuffle(games));
    }
    if (gameSelection == 'Choose') openChoosing();
    if (gameSelection == 'Vote') openVote();
};

function startGoG(newGame) {
    console.log('The Game', theGame);
    //console.log('Game Info', gamesInfo);
    //console.log('All Players', allPlayers);
    //console.log('Game Number', gameNumber);
    //console.log('Games Left', gamesLeft);
    //console.log('New Game', newGame);
    //console.log('Points System', pointsSystem);

    welcome.style.display = newGame ? 'flex' : 'none';
    otherWelcome.innerHTML = newGame ? '' : `Game ${gameNumber}`;

    intrudeBtn.style.display = newGame ? 'none': 'flex';
    abandonBtn.style.display = newGame ? 'none': 'flex';
    breakConeBtn.style.display = newGame ? 'none' : 'flex';
    victoryConeBtn.style.display = newGame ? 'none' : 'flex';
    const breakTitle = breakConeBtn.querySelector('h3');
    const victoryTitle = victoryConeBtn.querySelector('h3');
    if (gog_version == 'private') {
        breakTitle.innerHTML = 'Break<br>Cone';
        victoryTitle.innerHTML = 'Victory<br>Cone';
    } else if (gog_version == 'public') {
        breakTitle.innerHTML = 'Break<br>Shot';
        victoryTitle.innerHTML = 'Victory<br>Shot';
    }

    const result = document.getElementById('pre-game-result');
    /*
    if (newGame && currSystem == 'Points & Cones') {
        const div = document.getElementById('pre-game');
        const header = document.getElementById('pre-game-header');
        header.innerHTML = gog_version == 'private' ? 'Has everyone done the pre-game cone?' :
            gog_version == 'public' ? 'Has everyone done the pre-game shot?' : '';
        
        result.style.display = 'flex';
        div.style.display = 'flex';
    
        const yesBtn = document.getElementById('pre-game-yes');
        yesBtn.addEventListener('click', () => {
            currPlayers.forEach(p => logCone(p.player_id, 'pre-game'));
            result.style.display = 'none';
            div.style.display = 'none';
            start();
        });

        const noBtn = document.getElementById('pre-game-no');
        let options = [];
        if (gog_version == 'private') {
            options = [
                'Pre-game cone is non-negotiable.',
                `No cone, no game. Them's the rules.`,
                'You have *one* job here.',
                `This is why we can't have nice things.`,
                'The Game of Games Gods are displeased.',
                'JUST FUCKING DO IT!!!',
                `Don't make me get Cam.`,
                `Come on, we've talked about this.`,
                'Do not pass go. Do not collect 200 cones. (but pls have 1 cone x)'
            ];
        } else if (gog_version == 'public') {
            options = [
                'Pre-game shot is non-negotiable.',
                `No shot, no game. Them's the rules.`,
                'You have *one* job here.',
                `This is why we can't have nice things.`,
                'The Game of Games Gods are displeased.',
                'JUST FUCKING DO IT!!!',
                `Don't make me get Cam.`,
                `Come on, we've talked about this.`,
                'Do not pass go. Do not collect 200 shots. (but pls have 1 shot x)'
            ];
        }
        let i = 0;
        noBtn.addEventListener('click', () => {
            result.textContent = `${options[i]}`;
            result.style.display = 'flex';
            i = i == options.length - 1 ? 0 : i + 1;
        });
    } else {*/
        result.style.display = 'none';
        start();
    //}
}

async function saveGameState(incomplete) {
    try {
        const curr = theGame.games.at(-1);
        await fetch(`${route}/sessions/${sessionId}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                theGame: theGame,
                currentGame: curr,
                currGameInfo: currGame,
                incomplete: incomplete
            })
        });
        console.log(curr);
        console.log(currGame);
        if (curr.name == '4:20 Game') save420GamePhoto();
        console.log('Game state saved.');
    } catch (err) {
        console.error('Failed to save game state', err);
    }
}

async function saveGoG() {
  try {
    await saveGameState(true);
    window.location.href = '/';
  } catch (err) {
    console.error('Failed to save GoG before going home', err);
  }
}

async function finishGoG() {
    //await saveGameState(false);

    theGame.status = 'complete';
    theGame.finish_time = new Date();
    theGame.final_results = [];

    theGame.players.forEach(p => {
        theGame.final_results.push({
            player_id: p.player_id,
            name: p.name,
            points: p.g_point + p.c_point + p.special_w_point + p.special_l_point,
            cones:
                gog_version == 'private' ?
                p.pg_cone + p.f20g_cone + p.l_cone + p.c_cone + p.w_cone + p.v_cone :
                gog_version == 'public' ?
                p.pg_cone + p.l_cone + p.c_cone + p.w_cone + p.v_cone : 0
        });
    });
    
    theGame.final_results.sort((a, b) => {
        const points = b.points - a.points;
        const cones = a.cones - b.cones;
        const names = a.name.localeCompare(b.name);
        return points != 0 ? points : cones != 0 ? cones : names;
    });

    let place = 1;
    let extras = 0;
    theGame.final_results.forEach((r, i) => {
        if (i != 0) {
            const prev = theGame.final_results[i - 1];
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
        const response = await fetch(`${route}/sessions/${sessionId}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                theGame: theGame,
                finalResults: theGame.final_results
            })
        });
        if (!response.ok) throw new Error('Failed to complete GoG');
        window.location.href = `results.html?sessionId=${sessionId}`;
    } catch (err) {
        console.error('Error finishing GoG:', err);
    }
}

initialise(sessionId);

// #endregion

