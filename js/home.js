//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Global Variables
//


// #region

import {
    logoBox,
    updateTimeDisplays
} from '../js/utils.js';

const BASE_URL = 'http://localhost:3000';
let next = -1;

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

    const res = await fetch(`${BASE_URL}/api/sessions/home`);
    next = await res.json();
    
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
