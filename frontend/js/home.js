//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Global Variables
//


// #region

import {
    openModal,
    closeModal,
    setupModal,
    loadUserOption
} from '../js/user.js';

import {
    logoBox,
    updateTimeDisplays,
    hexToRgba
} from '../js/utils.js';

import { BASE_ROUTE } from './config.js';

let gog_version = 'private' // public vs private
let next = -1;

let user_data = null;

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
//              Buttons
//


// #region

function newGame() {
    console.log('Starting new game...');
    window.location.href = `create.html?sessionId=${next}`;
}

function continueGame() {
    console.log('Continuing game...');
    window.location.href = 'continue.html';
}

function viewLogs() {
    console.log('Viewing logs...');
    window.location.href = 'logs.html';
}

function viewStats() {
    console.log('Viewing stats...');
    window.location.href = 'stats.html';
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

    const res = await fetch(`${BASE_ROUTE}/api/sessions/home`);
    next = await res.json();

    user_data = await loadUserOption();
    console.log(user_data);
    const pfp = document.getElementById('profile-pic');
    pfp.addEventListener('click', () => openModal(
        modal, userBox, curr_colour, setupModal
    ));

    const close = document.getElementById('user-profile-close');
    close.addEventListener('click', () => closeModal(modal, userBox));

    const mainBtns = document.getElementById('buttons');
    mainBtns.style.display = user_data?.authenticated ? 'flex' : 'none';
    
    const hover = (btn, hover) => {
        const line = btn.querySelector('.scan-line');
        line.style.visibility = hover ? 'hidden' : 'visible';
        btn.classList.remove('neon-pulse');
        if (hover) btn.classList.add('neon-pulse');
        btn.style.transform = `scale(${hover ? '1.2' : '1'})`;
    };
    
    const btns = document.querySelectorAll('.btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id == 'start') newGame();
            if (btn.id == 'continue') continueGame();
            if (btn.id == 'logs') viewLogs();
            if (btn.id == 'stats') viewStats();
        });
        btn.addEventListener('mouseover', () => hover(btn, true));
        btn.addEventListener('mouseleave', () => hover(btn, false));
    });
}

// #endregion

initialise();
