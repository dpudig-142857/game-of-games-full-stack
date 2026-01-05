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
    hexToTextColour,
    styleBox,
    getDisplayNames,
    header,
    place,
    gameTypeText,
    centerOrStart,
    hexToRgba
} from './utils.js';

import { BASE_ROUTE } from './config.js';

let route = `${BASE_ROUTE}/api/sessions`;

let gog_version = 'public'
//gog_version = 'private'

let user_data = null;

const urlParams = new URLSearchParams(window.location.search);
const sessionId = urlParams.get('sessionId');

if (!sessionId) {
    alert('Missing session ID!');
    window.location.href = '/';
}

let numGoG = -1;
let allPlayers = [];
let allGames = {};
let allGamesInfo = [];
let pointSystems = [];

let theGameTitle = '';
let thePoints = '';
let theNumSpeciality = -1;
let thePlayers = [];
let theGames = [];
let theSpecialities = [];

let sessionType = false;

const nextBtn = document.getElementById('nextBtn');
const startBtn = document.getElementById('startBtn');

let curr_colour = {
    hex: '#33eaff',
    rgba: hexToRgba('#33eaff', 0.85),
    text: '#000000'
}

const modal = document.getElementById('user-profile-modal');
const userBox = document.getElementById('user-profile-box');

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Helper Functions
//


// #region

function span(val) {
    return `<span class='smaller'>${val}</span>`;
}

function textToId(text, type = '') {
    return type == 'games' ? gameInfo('name', text).tag :
        `${text.toLowerCase().split(' ').join('-')}`;
}

function NOTbackgroundColour(label, notChecked) {
    /*function backgroundColour(label, isChecked) {
        if (isChecked) {
            label.style.background = ;
        } else {
            label.style.background = 'white';
        }
    }*/
    label.style.background = notChecked ?
        'white' :
        `linear-gradient(45deg,
            rgb(180, 216, 255) 5%,
            rgb(224, 244, 255) 15%,
            rgb(160, 198, 230) 35%,
            rgb(204, 232, 255) 50%,
            rgb(160, 198, 230) 70%,
            rgb(224, 244, 255) 85%,
            rgb(180, 216, 255) 95%
        )`;
}

function startBtnAnimation(type) {
    if (type == 'start') {
        startBtn.classList.remove('pulse-animation');
        startBtn.classList.add('pulse-animation');
        startBtn.style.display = 'flex';
        nextBtn.style.display = 'none';
    } else if (type == 'stop') {
        startBtn.style.display = 'none';
        nextBtn.style.display = 'flex';
    }
}

function gameInfo(type, value) {
    return type == 'id' ? allGamesInfo.find(gI => gI.game_id == value) :
           type == 'name' ? allGamesInfo.find(gI => gI.name == value) :
           type == 'tag' ? allGamesInfo.find(gI => gI.tag == value) : null;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Creating HTML Objects
//


// #region

function createCheckbox(id, type, text) {
    const checkbox = document.createElement('div');
    checkbox.className = 'checkbox';
    checkbox.id = textToId(text);

    const cbx = document.createElement('div');
    cbx.className = 'cbx';
    checkbox.appendChild(cbx);

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = `cbx-${id}/${textToId(text, type)}`;
    input.className = `${type}-checkbox`;
    if (theGames.find(g => g.name == text)) input.checked = true;
    cbx.appendChild(input);

    input.addEventListener('click', () => {
        const result = input.checked ? text : '';
        startBtnAnimation('stop');
        if (type == 'points') thePoints = result;
        if (type == 'speciality') {
            if (result == '') {
                theSpecialities.forEach(pS => pS.games = []);
                theNumSpeciality = -1;
            } else {
                const num = parseInt(result);
                if (!isNaN(num)) {
                    theSpecialities.forEach(pS => {
                        pS.games = pS.games.slice(0, num + 1);
                    });
                    theNumSpeciality = num;
                }
            }
        }
        if (type == 'games') {
            if (input.checked) {
                theGames.push(gameInfo('name', text));
            } else {
                theGames = theGames.filter(g => g.name != text);
            }
        }
    });

    const label = document.createElement('label');
    label.htmlFor = `cbx-${id}/${textToId(text, type)}`;
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

    const checkboxLabel = document.createElement('div');
    checkboxLabel.className = 'checkboxLabel';
    if (gog_version == 'public' && text == 'Points & Cones') {
        checkboxLabel.innerHTML = 'Points & Shots';
    } else {
        checkboxLabel.innerHTML = text;
    }
    checkbox.appendChild(checkboxLabel);

    return checkbox;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              All Steps
//


// #region

const steps = ['general', 'players', 'games', 'specialities', 'confirmation'];
let step = '';

export function showStep(stepId, refresh = null) {
    //console.log('thePoints: ', thePoints);
    //console.log('theNumSpeciality: ', theNumSpeciality);
    //console.log('thePlayers: ', thePlayers);
    //console.log('theGames: ', theGames);
    //console.log('theSpecialities: ', theSpecialities);
    if (refresh) initialiseButtons();

    const currButton = document.querySelector('.bottom-button.active');
    document.querySelectorAll('.bottom-button').forEach(btn => {
        btn.classList.remove('active')
    });
    if (!currButton || currButton.id != `${stepId}Btn`) {
        document.getElementById(`${stepId}Btn`)?.classList.add('active');
    }
    steps.forEach(id => {
        document.getElementById(`${id}-step`).style.display = 'none';
    });
    step = stepId == step ? '' : stepId;
    return stepId == step;
}

function nextStep() {
    console.log(step);
    switch (step) {
        case 'general': showPlayersStep(); break;
        case 'players': showGamesStep(); break;
        case 'games': showSpecialitiesStep(); break;
        case 'specialities':
            nextBtn.style.display = 'none';
            showConfirmationStep();
            break;
        default: showGeneralStep();
    }
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              General Step
//


// #region

function showGeneralStep() {
    const div = document.getElementById('general-step');
    div.innerHTML = '';
    const show = showStep('general');
    if (show) {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'general-section';
        section.appendChild(createPointsSystem());
        section.appendChild(createNumSpeciality());
        div.appendChild(section);
    }
    div.style.display = show ? 'flex' : 'none';
    if (noConfirmation) nextBtn.style.display = 'flex';
}

function createPointsSystem() {
    const box = document.createElement('div');
    box.className = 'box';
    box.appendChild(header('h2', 'Points System'));
    
    const pointsCheckboxes = document.createElement('div');
    pointsCheckboxes.id = 'points-checkboxes';
    pointsCheckboxes.className = 'checkboxes';
    box.appendChild(pointsCheckboxes);

    console.log("1")
    pointsCheckboxes.appendChild(createCheckbox(0, 'points', 'Just Points'));
    console.log("2")
    pointsCheckboxes.appendChild(createCheckbox(1, 'points', 'Points & Cones'));
    console.log("3")

    const points = pointsCheckboxes.querySelectorAll('.points-checkbox');
    points.forEach(checkbox => {
        if (checkbox.parentElement.parentElement.id == textToId(thePoints)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                points.forEach(cb => {
                    if (cb != checkbox) cb.checked = false;
                });
            }
        });
    });

    return box;
}

function createNumSpeciality() {
    const box = document.createElement('div');
    box.className = 'box';
    box.appendChild(header('h2', 'Number of Speciality Games'));
    
    const specialityCheckboxes = document.createElement('div');
    specialityCheckboxes.id = 'speciality-checkboxes';
    specialityCheckboxes.className = 'checkboxes';
    box.appendChild(specialityCheckboxes);

    specialityCheckboxes.appendChild(createCheckbox(0, 'speciality', '0'));
    specialityCheckboxes.appendChild(createCheckbox(1, 'speciality', '1'));
    specialityCheckboxes.appendChild(createCheckbox(2, 'speciality', '2'));
    specialityCheckboxes.appendChild(createCheckbox(3, 'speciality', '3'));
    // ???? IMPLEMENT NUM INPUT BOX ????
    // ???? MAYYYYBBBBBEEEEEE ????
    // 
    // specialityCheckboxes.appendChild(createCheckbox(4, 'speciality', 'More'));

    const speciality = specialityCheckboxes.querySelectorAll('.speciality-checkbox');
    speciality.forEach(checkbox => {
        if (checkbox.parentElement.parentElement.id == textToId(`${theNumSpeciality}`)) {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                speciality.forEach(cb => {
                    if (cb != checkbox) cb.checked = false;
                });

                theSpecialities.forEach(p => {
                    p.games = p.games.filter((_, i) => i <= theNumSpeciality - 1);
                });
            }
        });
    });

    return box;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Players Step
//


// #region

function showPlayersStep() {
    const div = document.getElementById('players-step');
    div.innerHTML = '';
    const show = showStep('players');
    if (show) {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'player-section';
        section.appendChild(createPlayers());
        div.appendChild(section);
    }
    div.style.display = show ? 'flex' : 'none';
    if (noConfirmation) nextBtn.style.display = 'flex';
}

function createPlayers() {
    const triggerAnimation = (box, colour, type) => {
        box.style.setProperty('--animation-color', colour);
        box.style.animation = 'none';
        box.offsetHeight;
        if (type == 'select') {
            box.style.animation = 'playerSelect 0.6s ease-out forwards';
            setTimeout(() => box.style.animation = 'none', 600);
        } else {
            box.style.animation = 'playerDeselect 0.4s ease-out forwards';
            setTimeout(() => box.style.animation = 'none', 400);
        }
    }

    const boxes = document.createElement('div');
    boxes.id = 'player-boxes';

    const names = getDisplayNames(allPlayers);
    names.sort((a, b) => a.name.localeCompare(b.name))
    .forEach(player => {
        const info = allPlayers.find(p => p.player_id == player.player_id);
        const box = document.createElement('div');
        box.id = `${player.player_id}-box`;
        box.className = 'player-box';
        box.appendChild(header('h4', player.name));
        
        box.addEventListener('click', () => {
            if (thePlayers.find(p => p.player_id == player.player_id)) {
                thePlayers = thePlayers.filter(p => p.player_id != player.player_id);
                styleBox(box, '#000000');
                triggerAnimation(box, info.colour, 'deselect');
                theSpecialities = theSpecialities.filter(p => {
                    return p.player_id != player.player_id;
                });
            } else {
                thePlayers.push(info);
                styleBox(box, info.colour);
                triggerAnimation(box, info.colour, 'select');
                theSpecialities.push({
                    player_id: player.player_id,
                    games: []
                })
            }
            startBtnAnimation('stop');
        });
        
        const selected = thePlayers.find(p => {
            return p.player_id == player.player_id;
        });
        styleBox(box, selected ? info.colour : '#000000');
        if (selected) triggerAnimation(box, info.colour, 'select');

        boxes.appendChild(box);
    });

    return boxes;
}


// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Games Step
//


// #region

function showGamesStep() {
    const div = document.getElementById('games-step');
    div.innerHTML = '';
    const show = showStep('games');
    if (show) {
        const num = thePlayers.length;
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'game-section';
        if (num == 0 || num == 1) {
            let text = '';
            if (num == 0) text = 'No players selected yet';
            if (num == 1) text = 'Not enough players selected yet';

            const box = document.createElement('div');
            box.id = 'no-games';
            box.className = 'box';
            box.appendChild(header('h2', text));
            section.appendChild(box);
        } else {
            section.appendChild(createGeneralGames());
            allGames.forEach(game => {
                const games = game.games.filter(g => {
                    return num >= g.player_min && num <= g.player_max;
                });
                section.appendChild(createGames(game.type, games));
            });
        }
        div.appendChild(section);
    }
    div.style.display = show ? 'flex' : 'none';
    if (noConfirmation) nextBtn.style.display = 'flex';
}

function createGeneralGames() {
    const box = document.createElement('div');
    box.className = 'box';
    box.appendChild(header('h2', 'General'));

    const buttons = document.createElement('div');
    buttons.className = 'game-buttons';
    box.appendChild(buttons);

    const deselect = document.createElement('button');
    deselect.textContent = 'Deselect All';
    deselect.className = 'game-btn';
    deselect.id = 'deselect-btn';
    styleBox(deselect, '#33eaff');
    deselect.addEventListener('click', () => {
        const id = `.game-checkboxes input[type='checkbox']`;
        document.querySelectorAll(id).forEach(g => g.checked = false);
        theGames = [];
    });
    deselect.addEventListener('mouseenter', () => styleBox(deselect, '#17bcd4'));
    deselect.addEventListener('mouseleave', () => styleBox(deselect, '#33eaff'));
    buttons.appendChild(deselect);
    
    const select = document.createElement('button');
    select.textContent = 'Select All';
    select.className = 'game-btn';
    select.id = 'select-btn';
    styleBox(select, '#33eaff');
    select.addEventListener('click', () => {
        const id = `.game-checkboxes input[type='checkbox']`;
        document.querySelectorAll(id).forEach(g => {
            theGames.push(gameInfo('tag', g.id.split('/')[1]));
            g.checked = true
        });
    });
    select.addEventListener('mouseenter', () => styleBox(select, '#17bcd4'));
    select.addEventListener('mouseleave', () => styleBox(select, '#33eaff'));
    buttons.appendChild(select);
    
    return box;
}

function createGames(type, games) {
    const box = document.createElement('div');
    box.className = 'box';
    box.appendChild(header('h2', gameTypeText(type)));

    const buttons = document.createElement('div');
    buttons.className = `game-buttons`;
    box.appendChild(buttons);

    const deselect = document.createElement('button');
    deselect.textContent = 'Deselect All';
    deselect.className = 'game-btn';
    deselect.id = `deselect-btn-${type}`;
    styleBox(deselect, '#33eaff');
    deselect.addEventListener('click', () => {
        const curr = document.getElementById(`${type}-games-checkboxes`);
        const id = `.game-checkboxes input[type='checkbox']`;
        curr.querySelectorAll(id).forEach(g => {
            g.checked = false
            const tag = g.id.split('/')[1]
            theGames = theGames.filter(gI => gI.tag != tag);
        });
    });
    deselect.addEventListener('mouseenter', () => styleBox(deselect, '#17bcd4'));
    deselect.addEventListener('mouseleave', () => styleBox(deselect, '#33eaff'));
    buttons.appendChild(deselect);
    
    const select = document.createElement('button');
    select.textContent = 'Select All';
    select.className = 'game-btn';
    select.id = `select-btn-${type}`;
    styleBox(select, '#33eaff');
    select.addEventListener('click', () => {
        const curr = document.getElementById(`${type}-games-checkboxes`);
        const id = `.game-checkboxes input[type='checkbox']`;
        curr.querySelectorAll(id).forEach(g => {
            g.checked = true
            const tag = g.id.split('/')[1]
            theGames.push(gameInfo('tag', tag))
        });
    });
    select.addEventListener('mouseenter', () => styleBox(select, '#17bcd4'));
    select.addEventListener('mouseleave', () => styleBox(select, '#33eaff'));
    buttons.appendChild(select);

    const check = document.createElement('div');
    check.id = `${type}-games-checkboxes`;
    check.className = 'checkboxes game-checkboxes';
    box.appendChild(check);

    let curr = games.sort((a, b) => a.name.localeCompare(b.name));
    if (gog_version == 'public') curr = curr.filter(g => g.name != '4:20 Game')
    curr.forEach((g, i) => check.appendChild(createCheckbox(i, 'games', g.name)));

    return box;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Specialities Step
//


// #region

function showSpecialitiesStep() {
    const div = document.getElementById('specialities-step');
    div.innerHTML = '';
    const show = showStep('specialities');
    if (show) {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'specialities-section';

        const noGames = theGames.length == 0;
        const noPlayers = thePlayers.length == 0;
        const onePlayer = thePlayers.length == 1;
        const noSpecialities = theNumSpeciality == 0;
        const numNotInt = theNumSpeciality == -1;
        if (noGames || noPlayers || onePlayer || noSpecialities || numNotInt) {
            let text = '';
            if (noGames) text = 'No games selected yet';
            if (noPlayers) text = 'No players selected yet';
            if (onePlayer) text = 'Not enough players selected yet';
            if (noSpecialities) text = 'No specialities';
            if (numNotInt) text = 'No number of specialities selected yet';

            const box = document.createElement('div');
            box.id = 'no-games';
            box.className = 'box';
            box.appendChild(header('h2', text));
            section.appendChild(box);
        } else {
            section.appendChild(createSpecialities(theNumSpeciality));
        }
        div.appendChild(section);
    }
    div.style.display = show ? 'flex' : 'none';
    if (noConfirmation) nextBtn.style.display = 'flex';
}

function createSpecialities(num) {
    const boxes = document.createElement('div');
    boxes.id = 'speciality-boxes';

    const names = getDisplayNames(thePlayers);
    thePlayers.sort((a, b) => a.name.localeCompare(b.name))
    .forEach(p => {
        const name = names.find(n => n.player_id == p.player_id);
        const box = document.createElement('div');
        box.id = `${p.player_id}-box`;
        box.className = 'speciality-box';
        box.appendChild(header('h4', name.name));

        const colour = allPlayers.find(pI => pI.player_id == p.player_id).colour;
        let votes = theSpecialities.find(pS => pS.player_id == p.player_id).games;
        const games = theGames.filter(g => g.name != '4:20 Game');

        for (let i = 0; i < votes.length && i < num; i++) {
            const vote = votes[i];
            box.appendChild(dropdown(true, vote, name, colour, games));
        }

        for (let i = votes.length; i < num; i++) {
            const text = `Speciality ${i + 1}`;
            box.appendChild(dropdown(false, text, name, colour, games));
        }
        
        styleBox(box, colour);
        boxes.appendChild(box);
    });

    return boxes;
}

function dropdown(speciality, text, player, colour, games) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.style.position = 'relative';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.id = 'dropbtn';
    btn.className = 'dropbtn';
    btn.appendChild(header('h4', speciality ? text.name : text));
    if (speciality) btn.dataset.value = text.tag;
    btn.style.color = hexToTextColour(colour);
    btn.style.backgroundColor = colour;
    dropdown.appendChild(btn);

    const content = document.createElement('div');
    content.className = 'dropdown-content';

    const create = (game) => {
        const option = document.createElement('a');
        option.href = '#';
        option.appendChild(header('h5', game.name));
        option.dataset.value = game.tag;
        option.style.textAlign = 'center';
        option.style.backgroundColor = colour;
        option.style.color = hexToTextColour(colour);
        option.addEventListener('click', (e) => {
            let curr = theSpecialities.find(p => p.player_id == player.player_id);
            if (curr && !curr.games.find(g => g.game_id == game.game_id)) {
                if (btn.dataset.value) {
                    curr.games = curr.games.filter(v => v.tag != btn.dataset.value);
                }
                curr.games.push(game);
                e.preventDefault();
                btn.innerHTML = '';
                btn.appendChild(header('h4', game.name));
                btn.dataset.value = game.tag;
                content.style.display = 'none';
            }
            startBtnAnimation('stop');
        });
        option.addEventListener('mouseenter', () => {
            let curr = theSpecialities.find(p => p.player_id == player.player_id);
            if (curr && !curr.games.find(g => g.game_id == game.game_id)) {
                option.style.transform = 'scale(1.07)';
                option.style.filter = 'brightness(90%)';
                option.style.cursor = 'pointer';
            } else {
                option.style.cursor = 'not-allowed';
            }
        });
        option.addEventListener('mouseleave', () => {
            let curr = theSpecialities.find(p => p.player_id == player.player_id);
            if (curr && !curr.games.find(g => g.game_id == game.game_id)) {
                option.style.transform = 'scale(1)';
                option.style.filter = 'brightness(100%)';
            }
        });
        return option;
    }

    games
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(g => content.appendChild(create(g)));
             
    dropdown.addEventListener('mouseenter', () => content.style.display = 'block');
    dropdown.addEventListener('mouseleave', () => content.style.display = 'none');
    dropdown.appendChild(content);

    return dropdown;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Confirmation Step
//


// #region

let noConfirmation = true;

function showConfirmationStep() {
    const div = document.getElementById('confirmation-step');
    div.innerHTML = '';
    const show = showStep('confirmation');
    if (show) {
        const section = document.createElement('div');
        section.className = 'section';
        section.id = 'confirmation-section';
        div.appendChild(section);

        let special = true;
        if (theNumSpeciality > 0) {
            theSpecialities.forEach(pS => {
                if (pS.games.length != theNumSpeciality) special = false;
            });
        }
        noConfirmation = thePoints == '' ||
            thePlayers.length == 0 || thePlayers.length == 1 ||
            theGames.length == 0 || theGames.length < theNumSpeciality ||
            theNumSpeciality == -1 || !special;

        if (noConfirmation) section.appendChild(createNoConfirmation());
        if (!noConfirmation) {
            const leftSection = document.createElement('div');
            leftSection.id = 'confirmation-left-section';
            leftSection.appendChild(createConfirmationGeneral());
            section.appendChild(leftSection);
        
            const rightSection = document.createElement('div');
            rightSection.id = 'confirmation-right-section';
            section.appendChild(rightSection);
    
            const right = document.createElement('div');
            right.id = 'confirming-right-section-boxes';
            right.appendChild(createConfirmationPlayers());
            right.appendChild(createConfirmationGames());
            rightSection.appendChild(right);

            startBtnAnimation('start');
        }
    }
    div.style.display = show ? 'flex' : 'none';
}

function createNoConfirmation() {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = 'confirmation-box';
    
    const div = document.createElement('div');
    div.id = 'no-confirmation';
    box.appendChild(div);
    
    let texts = [];
    const no = (type) => `No ${type} selected yet`;
    const enough = (type) => `Not enough ${type} selected yet`;

    if (thePoints == '') texts.push(no('point system'));
    if (theNumSpeciality == -1) texts.push(no('number of specialities'));

    if (thePlayers.length == 0) texts.push(no('players'));
    if (thePlayers.length == 1) texts.push(enough('players'));
    
    let noGames = theGames.length == 0;
    if (noGames) texts.push(no('games'));
    if (!noGames && theGames.length < theNumSpeciality) texts.push(enough('games'));

    if (theNumSpeciality > 0) {
        let special = true;
        theSpecialities.forEach(pS => {
            if (pS.games.length != theNumSpeciality) special = false;
        });
        if (!special) texts.push(enough('specialities'));
    }
    
    texts.forEach(text => div.appendChild(header('h2', text)));

    nextBtn.style.display = 'none';
    
    return box;
}

function createConfirmationGeneral() {
    let num = thePlayers.length;
    let text = `Points System<br>${span(`(1st - ${place(num)})`)}`;
    const currSystem = pointSystems.find(system => {
        if (thePoints == 'Just Points') {
            return system.num == num && system.type == 'points';
        } else if (thePoints == 'Points & Cones') {
            return system.num == num && system.type == 'cones';
        } else {
            return undefined;
        }
    });

    const box = document.createElement('div');
    box.className = 'box';
    box.id = 'confirmation-left-box';

    const section = document.createElement('div');
    section.className = 'confirmation-boxes-vertical';
    box.appendChild(header('h1', text));
    box.appendChild(section);
    
    if (currSystem) {
        currSystem.rewards.forEach(reward => {
            let text = reward;
            if (gog_version == 'private') {
                if (reward == 'pn') {
                    text = `Coin Flip<br>${span('Point or Nothing')}`;
                } else if (reward == 'pc') {
                    text = `Coin Flip<br>${span('Point or Cone')}`;
                } else if (reward == 'nc') {
                    text = `Coin Flip<br>${span('Nothing or Cone')}`;
                }
            } else if (gog_version == 'public') {
                if (reward == 'pn') {
                    text = `Coin Flip<br>${span('Point or Nothing')}`;
                } else if (reward == 'pc') {
                    text = `Coin Flip<br>${span('Point or Shot')}`;
                } else if (reward == 'nc') {
                    text = `Coin Flip<br>${span('Nothing or Shot')}`;
                } else if (reward == '1 cone') {
                    text = `1 shot`;
                }
            }

            const rewardBox = document.createElement('div');
            rewardBox.id = 'confirmation-box-system';
            rewardBox.className = 'confirmation-box';
            rewardBox.appendChild(header('h4', text));
            styleBox(rewardBox, '#33eaff');
            section.appendChild(rewardBox);
        });
    }

    return box;
}

function createConfirmationPlayers() {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = 'confirmation-right-box';

    const boxes = document.createElement('div');
    boxes.className = 'confirmation-boxes';
    box.appendChild(header('h1', 'Players'));
    box.appendChild(boxes);

    const displayNames = getDisplayNames(thePlayers);
    console.log(displayNames);
    thePlayers.sort((a, b) => a.name.localeCompare(b.name))
    .forEach(p => {
        const info = allPlayers.find(pI => pI.player_id == p.player_id);
        const display = displayNames.find(pI => pI.player_id == p.player_id);
        const playerBox = document.createElement('div');
        playerBox.className = 'confirmation-box';
        playerBox.appendChild(header('h4', display.name));

        if (theNumSpeciality >= 1) {
            const votes = theSpecialities.find(pS => {
                return pS.player_id == p.player_id;
            }).games;

            const div = document.createElement('div');
            div.id = 'confirmation-specialities';
            playerBox.appendChild(div);

            if (theNumSpeciality == 1) {
                const title = header('h5', 'Speciality Game:');
                title.style.textDecoration = 'underline dashed';
                div.appendChild(title);
                if (votes[0]) div.appendChild(header('h5', votes[0].name));
            } else if (theNumSpeciality > 1) {
                const title = header('h5', 'Speciality Games:');
                title.style.textDecoration = 'underline dashed';
                div.appendChild(title);
                votes.forEach(v => div.appendChild(header('h5', v.name)));
            }
        }

        styleBox(playerBox, info.colour);
        boxes.appendChild(playerBox);
    });

    centerOrStart(boxes, 'justify');
    return box;
}

function createConfirmationGames() {
    const box = document.createElement('div');
    box.className = 'box';
    box.id = 'confirmation-right-box';
    box.appendChild(header('h1', 'Games'));

    const boxes = document.createElement('div');
    boxes.className = 'confirmation-boxes';
    boxes.id = 'confirmation-games';
    box.appendChild(boxes);

    theGames.sort((a, b) => a.name.localeCompare(b.name))
    .forEach(g => {
        const gameBox = document.createElement('div');
        gameBox.className = 'confirmation-box';
        gameBox.id = 'confirmation-game-box';
        gameBox.appendChild(header('h4', g.name));
        styleBox(gameBox, '#33EAFF');
        boxes.appendChild(gameBox);
    });
    
    centerOrStart(boxes, 'justify');
    return box;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Old Rules from Index Page
//


// #region

function fillRules() {
    const rightDiv = document.getElementById('right');
    
    const main = document.createElement('h1');
    main.innerHTML = 'On the main page:';
    rightDiv.appendChild(main);

    const mainSec = document.createElement('div');
    mainSec.className = 'section';
    createRule(mainSec, 'box', 'Start New Game', 'Create a new Game of Games (outlined below)');
    createRule(mainSec, 'box', 'Continue Game', 'Continue an incomplete Game of Games');
    createRule(mainSec, 'box', 'View Logs', 'View the log of any previous Game of Games');
    createRule(mainSec, 'box', 'View Stats', 'View the overall stats of any player or any game');
    rightDiv.appendChild(mainSec);

    const create = document.createElement('h1');
    create.innerHTML = 'Creating a new Game of Games:';
    rightDiv.appendChild(create);

    const createSec = document.createElement('div');
    createSec.className = 'section';
    createRule(createSec, 'small-box', 'Step 1:', 'Select the options for the type of GoG that will be played');
    createRule(createSec, 'small-box', 'Step 2:', 'Select which players will be playing in the GoG');
    createRule(createSec, 'small-box', 'Step 3:', 'Select which games will be available to play in the GoG');
    createRule(createSec, 'small-box', 'Step 4:', 'Select the specialty game(s) for each player');
    createRule(createSec, 'small-box', 'Step 5:', 'Confirm the info and<br>begin the Game.<br>Good Luck!');
    rightDiv.appendChild(createSec);

    const play = document.createElement('h1');
    play.innerHTML = 'Playing the Game of Games:';
    rightDiv.appendChild(play);

    const playSec = document.createElement('div');
    playSec.className = 'section';
    createRule(playSec, 'small-box', 'Step 1:', '');
    rightDiv.appendChild(playSec);
}

function createRule(div, boxClass, title, text) {
    const box = document.createElement('div');
    box.className = `${boxClass}`;

    const header = document.createElement('h3');
    header.innerHTML = `${title}`;
    box.appendChild(header);

    box.appendChild(document.createElement('br'));

    const info = document.createElement('p');
    info.innerHTML = `${text}`;
    box.appendChild(info);

    div.appendChild(box);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Old Add New Player
//


// #region

/*const addPlayerButton = document.getElementById('addPlayer');
const addPlayerName = document.getElementById('addPlayerName')
const addPlayerConfirm = document.getElementById('confirmPlayer');

function createAddPlayer() {
    addPlayerButton.style.display = 'none';
    addPlayerName.style.display = 'flex';
    addPlayerConfirm.style.display = 'flex';
}

async function addPlayer(num, player) {
    // ADD PLAYER TO DATABASE WITH POST REQUEST TO BACKEND
    console.log(num);
    console.log(player);
}

async function confirmPlayer() {
    const playersDiv = document.getElementById('player-checkboxes');
    const num = playersDiv.children.length + 1;
    const player = addPlayerName ? addPlayerName.value : '';

    addPlayer(num, player);
    playersDiv.appendChild(createCheckbox(num, 'players', player));
    addPlayerName.value = '';

    addPlayerButton.style.display = 'flex';
    addPlayerName.style.display = 'none';
    addPlayerConfirm.style.display = 'none';
}*/

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Old Add New Game
//


// #region

/*function createAddGame() {
    document.getElementById('addGame').style.display = 'none';
    document.querySelectorAll('.addGameBox').forEach(s => s.style.display = 'flex');
    document.getElementById('confirmGame').style.display = 'flex';
}

function confirmGame() {
    const findCheckbox = (gameType) => {
        switch (gameType) {
            case 'card': return document.getElementById('cardGames');
            case 'board': return document.getElementById('boardGames');
            case 'video': return document.getElementById('videoGames');
            case 'outdoor': return document.getElementById('outdoorGames');
            case 'other': return document.getElementById('otherGames');
            default: console.error(`Nothing selected`);
        }
    }
    const type = document.getElementById('addGameType');
    const checkbox = findCheckbox(type.value);
    if (!checkbox) return;
    //console.log(checkbox);
    const name = document.getElementById('addGameName');
    const results = document.getElementById('addGameResults');
    const min = document.getElementById('addGameMin');
    const max = document.getElementById('addGameMax');
    //console.log(name.value);
    //console.log(results.value);
    //console.log(min.value);
    //console.log(max.value);
    checkbox.appendChild(createGameBox(name.value));
    name.value = type.value = results.value = min.value = max.value = '';
    document.getElementById('addGame').style.display = 'flex';
    document.querySelectorAll('.addGameBox').forEach(s => { s.style.display = 'none'; });
    document.getElementById('confirmGame').style.display = 'none';
}*/

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Initialise and Start
//


// #region

function hide(text) {
    const btns = document.querySelectorAll('.bottom-button');
    btns.forEach(btn => btn.style.display = 'none');

    const title = document.querySelector('.title h1');
    title.innerHTML = text;
}

async function initialize() {
    logoBox();
    setInterval(updateTimeDisplays, 1000);
    updateTimeDisplays();
    loadMenuBurger();

    user_data = await loadUserOption();
    const pfp = document.getElementById('profile-pic');
    pfp.addEventListener('click', () => openUserModal(
        modal, userBox, curr_colour, setupUserModal
    ));

    const close = document.getElementById('user-profile-close');
    close.addEventListener('click', () => closeUserModal(modal, userBox));
    
    console.log(user_data);
    if (!user_data.authenticated || (user_data.user.role != 'admin' && user_data.user.role != 'owner')) {
        hide('Access Denied');
        return;
    }

    gog_version = user_data.user.version;
    const btns = document.querySelectorAll('.bottom-button');
    btns.forEach(btn => {
        if (btn.id != 'startBtn') {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });

    const res = await fetch(`${route}/${sessionId}/creating`);
    const info = await res.json();
    theGameTitle = `Game of Games No. ${sessionId}`;
    numGoG = info.num;

    if (sessionId != numGoG) {
        hide('Invalid session ID');
        return;
    }

    allPlayers = info.players;
    allGames = info.games;
    allGames.forEach(g => {
        g.games.forEach(game => allGamesInfo.push(game));
    });
    pointSystems = info.pointSystems;

    sessionType = info.type;
    thePoints = info.thePoints;
    theNumSpeciality = info.theNumSpeciality;
    thePlayers = info.thePlayers;
    //theGames = info.theGames;
    info.theGames.forEach(g => {
        theGames.push(gameInfo('id', g.game_id));
    });
    thePlayers.forEach(p => {
        let games = [];
        p.specialities.forEach(g => {
            games.push(gameInfo('name', g));
        });
        theSpecialities.push({
            player_id: p.player_id,
            games
        });
    });
    
    console.log('numGoG - ', numGoG);
    console.log('allPlayers - ', allPlayers);
    console.log('allGames - ', allGames);
    console.log('allGamesInfo - ', allGamesInfo);
    console.log('pointSystems - ', pointSystems);
    console.log('sessionType - ', sessionType);
    console.log('thePoints - ', thePoints);
    console.log('theNumSpeciality - ', theNumSpeciality);
    console.log('thePlayers - ', thePlayers);
    console.log('theGames - ', theGames);
    console.log('theSpecialities - ', theSpecialities);
    
    const title = document.getElementById('title');
    title.innerHTML = '';
    title.appendChild(header('h1', `Creating ${theGameTitle}`));

    if (sessionType == 'center') {

    }

    btns.forEach(btn => {
        if (btn.id == 'startBtn') {
            if (sessionType == 'continue') {
                btn.innerHTML = 'Continue';
                btn.addEventListener('click', () => {
                    window.location.href = `game.html?sessionId=${sessionId}`;
                });
            } else if (sessionType == 'create') {
                btn.innerHTML = 'Start';
                btn.addEventListener('click', () => startGame());
            }
        } else {
            btn.addEventListener('click', () => {
                if (btn.id == 'nextBtn') nextStep();
                if (btn.id == 'generalBtn') showGeneralStep();
                if (btn.id == 'playersBtn') showPlayersStep();
                if (btn.id == 'gamesBtn') showGamesStep();
                if (btn.id == 'specialitiesBtn') showSpecialitiesStep();
                if (btn.id == 'confirmationBtn') showConfirmationStep();
            });
        }
    });
}

async function startGame() {
    //console.log('thePoints: ', thePoints);
    //console.log('theNumSpeciality: ', theNumSpeciality);
    //console.log('thePlayers: ', thePlayers);
    //console.log('theGames: ', theGames);
    //console.log('theSpecialities: ', theSpecialities);

    let startTime = new Date();

    let playersWithSpecialities = [];
    thePlayers.forEach(p => {
        const player = theSpecialities.find(pS => pS.player_id == p.player_id);
        playersWithSpecialities.push({
            player_id: p.player_id,
            name: p.name,
            specialities: player.games,
            is_playing: true
        })
    });

    const theGame = {
        id: numGoG,
        gog_id: theGameTitle,
        start_time: startTime.toISOString(),
        point_system: thePoints,
        num_speciality: theNumSpeciality,
        refresh_count: 0,
        players: playersWithSpecialities,
        games: theGames
    };

    try {
        const response = await fetch(`${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(theGame)
        });
        if (!response.ok) throw new Error(`Failed to create game: ${response.statusText}`);
        window.location.href = `game.html?sessionId=${sessionId}`;
    } catch (error) {
        console.error('Error starting game:', error);
        alert('Failed to start game. Please try again.');
    }
}

// #endregion


initialize();
