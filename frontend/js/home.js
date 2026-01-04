//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Global Variables
//


// #region

import {
    openUserModal,
    closeUserModal,
    setupUserModal,
    loadUserOption
} from './user.js';

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

import { adventurer } from './themes/adventurer.js';
import { adventurerNeutral } from './themes/adventurer_neutral.js';
import { avatars } from './themes/avatars.js';
import { avatarsNeutral } from './themes/avatars_neutral.js';
import { basic } from './themes/basic.js';
import { bigEars } from './themes/big_ears.js';
import { bigEarsNeutral } from './themes/big_ears_neutral.js';
import { bigSmile } from './themes/big_smile.js';
import { bots } from './themes/bots.js';
import { botsNeutral } from './themes/bots_neutral.js';
import { croodles } from './themes/croodles.js';
import { croodlesNeutral } from './themes/croodles_neutral.js';
import { dylan } from './themes/dylan.js';
import { funEmoji } from './themes/fun_emoji.js';
import { glass } from './themes/glass.js';
import { icons } from './themes/icons.js';
import { identicon } from './themes/identicon.js';
import { initials } from './themes/initials.js';
import { lorelei } from './themes/lorelei.js';
import { loreleiNeutral } from './themes/lorelei_neutral.js';
import { micah } from './themes/micah.js';
import { miniavs } from './themes/miniavs.js';
import { notionists } from './themes/notionists.js';
import { notionistsNeutral } from './themes/notionists_neutral.js';
import { openPeeps } from './themes/open_peeps.js';
import { personas } from './themes/personas.js';
import { pixelArt } from './themes/pixel_art.js';
import { pixelArtNeutral } from './themes/pixel_art_neutral.js';
import { rings } from './themes/rings.js';
import { shapes } from './themes/shapes.js';
import { thumbs } from './themes/thumbs.js';

const allDiceBearOptions = {
    adventurer: adventurer.properties,
    adventurerNeutral: adventurerNeutral.properties,
    avatars: avatars.properties,
    avatarsNeutral: avatarsNeutral.properties,
    basic: basic.properties,
    bigEars: bigEars.properties,
    bigEarsNeutral: bigEarsNeutral.properties,
    bigSmile: bigSmile.properties,
    bots: bots.properties,
    botsNeutral: botsNeutral.properties,
    croodles: croodles.properties,
    croodlesNeutral: croodlesNeutral.properties,
    dylan: dylan.properties,
    funEmoji: funEmoji.properties,
    glass: glass.properties,
    icons: icons.properties,
    identicon: identicon.properties,
    initials: initials.properties,
    lorelei: lorelei.properties,
    loreleiNeutral: loreleiNeutral.properties,
    micah: micah.properties,
    miniavs: miniavs.properties,
    notionists: notionists.properties,
    notionistsNeutral: notionistsNeutral.properties,
    openPeeps: openPeeps.properties,
    personas: personas.properties,
    pixelArt: pixelArt.properties,
    pixelArtNeutral: pixelArtNeutral.properties,
    rings:  rings.properties,
    shapes: shapes.properties,
    thumbs: thumbs.properties
};

console.log(allDiceBearOptions);
Object.entries(allDiceBearOptions).forEach(([theme, prop]) => {
    console.log(`${theme} - ${Object.keys(prop).join(', ')}`)
});

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
    pfp.addEventListener('click', () => openUserModal(
        modal, userBox, curr_colour, setupUserModal
    ));

    const close = document.getElementById('user-profile-close');
    close.addEventListener('click', () => closeUserModal(modal, userBox));

    gog_version = user_data.user?.version ?? 'public';

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
