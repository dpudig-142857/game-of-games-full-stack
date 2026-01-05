// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Global Imports
// 


// #region

import { header } from './utils.js';
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

const basicDiceBearOptions = basic.properties;
const baseProperties = Object.keys(basic.properties);
const allDiceBearOptions = {
    'adventurer': adventurer.properties,
    'adventurer-neutral': adventurerNeutral.properties,
    'avataaars': avatars.properties,
    'avataaars-neutral': avatarsNeutral.properties,
    'big-ears': bigEars.properties,
    'big-ears-neutral': bigEarsNeutral.properties,
    'big-smile': bigSmile.properties,
    'bottts': bots.properties,
    'bottts-neutral': botsNeutral.properties,
    'croodles': croodles.properties,
    'croodles-neutral': croodlesNeutral.properties,
    'dylan': dylan.properties,
    'fun-emoji': funEmoji.properties,
    'glass': glass.properties,
    'icons': icons.properties,
    'identicon': identicon.properties,
    'lorelei': lorelei.properties,
    'lorelei-neutral': loreleiNeutral.properties,
    'micah': micah.properties,
    'miniavs': miniavs.properties,
    'notionists': notionists.properties,
    'notionists-neutral': notionistsNeutral.properties,
    'open-peeps': openPeeps.properties,
    'personas': personas.properties,
    'pixel-art': pixelArt.properties,
    'pixel-art-neutral': pixelArtNeutral.properties,
    'rings':  rings.properties,
    'shapes': shapes.properties,
    'thumbs': thumbs.properties
};

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Build Avatar
// 


// #region

console.log(basicDiceBearOptions);
console.log(allDiceBearOptions);
/*Object.entries(allDiceBearOptions).forEach(([theme, prop]) => {
    let keys = [];
    let vals = [];
    Object.entries(prop).forEach(([key, val]) => {
        if (!Object.keys(basicDiceBearOptions).includes(key)) {
            keys.push(key);
            vals.push(val);
        }
    });
    console.log(`${theme} - ${keys.join(', ')}`);
});*/

let curr_setup = {
    'theme': 'fun-emoji',
    'seed': '0',
    'flip': 'false',
    'rotate': '0',
    'scale': '100',
    'colour': '#ffffff',
    'x': '0',
    'y': '0',
    'eyes': 'plain',
    'mouth': 'plain'
};

export function renderAvatarPage(div, user, type) {
    div.innerHTML = '';

    const title = document.getElementById('user-profile-title');

    if (type == 'creating') {
        title.textContent = 'Creating Avatar';
    } else if (type == 'updating') {
        title.textContent = 'Updating Avatar';
    } else {

    }

    console.log(user);
    const avatar_div = document.createElement('div');
    avatar_div.id = 'avatar_div';
    div.appendChild(avatar_div);

    const avatar_preview_div = document.createElement('div');
    avatar_preview_div.id = 'avatar_preview_div';
    avatar_div.appendChild(avatar_preview_div);

    const avatar_preview = document.createElement('img');
    avatar_preview.id = 'avatar_preview';
    avatar_preview.src = createAvatarLink(
        'fun-emoji',
        `${user.player_id}`,
        'true',
        '0',
        '100',
        '#ffffff',
        '0',
        '0',
        'plain',
        'lilSmile'
    );
    avatar_preview_div.appendChild(avatar_preview);

    const avatar_options = document.createElement('div');
    avatar_options.id = 'avatar_options';
    avatar_div.appendChild(avatar_options);
    
    setupThemeGallery(avatar_options);
    //setupGallery(avatar_options, 'eye');
    //setupGallery(avatar_options, 'mouth');
    //setupColour(avatar_options);
    
    /*
Flip
Rotate
Scale
X
Y
    */
}

function createAvatarLink(
    theme_var = 'fun-emoji',
    seed_var = '0',
    flip_var = 'false',
    rotate_var = '0',
    scale_var = '100',
    colour_var = '#ffffff',
    x_var = '0',
    y_var = '0',
    eyes_var = 'plain',
    mouth_var = 'plain'
) {
    const base = `https://api.dicebear.com/9.x/`;
    
    const theme = `${theme_var}/svg?radius=50`;
    curr_setup.theme = theme_var;
    
    const seed = `&seed=${seed_var}`;
    curr_setup.seed = seed_var;

    const flip = `&flip=${flip_var}`;
    curr_setup.flip = flip_var;
    
    const rotate = `&rotate=${rotate_var}`;
    curr_setup.rotate = rotate_var;
    
    const scale = `&scale=${scale_var}`;
    curr_setup.scale = scale_var;
    
    const colour = colour_var == '' || colour_var == '[]' ? `&backgroundColor[]` : 
        colour_var.startsWith('#') ? `&backgroundColor=${colour_var.slice(1)}` : '';
    curr_setup.colour = colour_var;
    
    const x = `&translateX=${x_var}`;
    curr_setup.x = x_var;
    
    const y = `&translateY=${y_var}`;
    curr_setup.y = y_var;
    
    const eyes = `&eyes=${eyes_var}`;
    curr_setup.eyes = eyes_var;
    
    const mouth = `&mouth=${mouth_var}`;
    curr_setup.mouth = mouth_var;

    return base + theme + seed + flip + rotate +
        scale + colour + x + y + eyes + mouth;
}

function updateAvatar() {
    const preview = document.getElementById('avatar_preview');
    preview.src = createAvatarLink(
        curr_setup.theme,
        curr_setup.seed,
        curr_setup.flip,
        curr_setup.rotate,
        curr_setup.scale,
        curr_setup.colour,
        curr_setup.x,
        curr_setup.y,
        curr_setup.eyes,
        curr_setup.mouth
    );
}

function setupColour(div) {
    const section = document.createElement('div');
    section.id = 'colour_section';
    section.className = 'avatar_options_section';
    div.appendChild(section);

    section.appendChild(header(
        'h2', 'Colour:', '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = 'colour_options';
    options.className = 'avatar_option';
    section.appendChild(options);

    const colourHeader = header(
        'h2', '#ffffff', '', 'colour_option', 'avatar_option_text'
    );
    options.appendChild(colourHeader);
    
    const option = document.createElement('input');
    option.id = 'avatar_colour';
    option.type = 'color';
    option.value = '#ffffff';
    options.appendChild(option);

    option.addEventListener('input', (e) => {
        // Get the selected color value
        const colour = e.target.value;
        colourHeader.innerHTML = colour;
        curr_setup.colour = colour;
        updateAvatar();
    });
}

function setupGallery(div, type) {
    const section = document.createElement('div');
    section.id = `${type}_section`;
    section.className = 'avatar_options_section';
    div.appendChild(section);
    
    const text = type.charAt(0).toUpperCase() + type.slice(1) + ':';
    section.appendChild(header(
        'h2', text, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = `${type}_options`;
    options.className = 'avatar_option';
    section.appendChild(options);
    
    const leftArrow = document.createElement('img');
    leftArrow.className = 'avatar_arrow';
    leftArrow.id = 'left_arrow';
    leftArrow.src = 'assets/arrow.svg';
    options.appendChild(leftArrow);

    const option = header(
        'h2', 'plain', '', `${type}_option`, `avatar_option_text`
    );
    options.appendChild(option);

    const rightArrow = document.createElement('img');
    rightArrow.className = 'avatar_arrow';
    rightArrow.id = 'right_arrow';
    rightArrow.src = 'assets/arrow.svg';
    options.appendChild(rightArrow);

    leftArrow.addEventListener('click', () => {
        if (type == 'eye') updateEye(option, 'left');
        if (type == 'mouth') updateMouth(option, 'left');
    });

    rightArrow.addEventListener('click', () => {
        if (type == 'eye') updateEye(option, 'right');
        if (type == 'mouth') updateMouth(option, 'right');
    });
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                              Theme
// 


// #region

const themes = Object.keys(allDiceBearOptions);
console.log(themes);

function setupThemeGallery(div) {
    const section = document.createElement('div');
    section.id = `theme_section`;
    section.className = 'avatar_options_section';
    div.appendChild(section);
    
    section.appendChild(header(
        'h2', 'Theme:', '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = `theme_options`;
    options.className = 'avatar_option';
    section.appendChild(options);
    
    const leftArrow = document.createElement('img');
    leftArrow.className = 'avatar_arrow';
    leftArrow.id = 'left_arrow';
    leftArrow.src = 'assets/arrow.svg';
    options.appendChild(leftArrow);

    const option = header(
        'h2', 'Fun Emoji', '', `theme_option`, `avatar_option_text`
    );
    options.appendChild(option);

    const rightArrow = document.createElement('img');
    rightArrow.className = 'avatar_arrow';
    rightArrow.id = 'right_arrow';
    rightArrow.src = 'assets/arrow.svg';
    options.appendChild(rightArrow);

    leftArrow.addEventListener('click', () => {
        updateTheme(option, 'left');
    });
    
    rightArrow.addEventListener('click', () => {
        updateTheme(option, 'right');
    });
}

function updateTheme(option, dir) {
    const curr = option.innerHTML.toLowerCase();
    let i = themes.indexOf(curr.split(' ').join('-'));
    if (dir == 'left') i -= 1;
    if (dir == 'right') i += 1;
    if (i == -1) i = themes.length - 1;
    if (i == themes.length) i = 0;
    let words = [];
    themes[i].split('-').forEach(word => {
        words.push(word.charAt(0).toUpperCase() + word.slice(1));
    });
    option.innerHTML = words.join(' ');
    console.log(themes[i]);
    const props = allDiceBearOptions[themes[i]];
    Object.entries(props).forEach(([key, val]) => {
        console.log(key);
        console.log(val);
    });
    console.log(' ');
    //curr_setup.theme = themes[i];
    //updateAvatar();
}

function updateOption(div, options, dir) {
    const curr = div.innerHTML;
    let i = options.indexOf(curr);
    if (dir == 'left') i -= 1;
    if (dir == 'right') i += 1;
    if (i == -1) i = options.length - 1;
    if (i == options.length) i = 0;
    div.innerHTML = options[i];

    //updateAvatar();
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Adventurer
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Adventurer Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Avataaars
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Avataaars Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Big Ears
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Big Ears Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Big Smile
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Bottts
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Bottts Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Croodles
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Croodles Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Dylan
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Fun Emoji
// 


// #region

const eye_list = [
    'closed',
    'closed2',
    'crying',
    'cute',
    'glasses',
    'love',
    'pissed',
    'plain',
    'sad',
    'shades',
    'sleepClose',
    'stars',
    'tearDrop',
    'wink',
    'wink2'
];

const mouth_list = [
    'cute',
    'drip',
    'faceMask',
    'kissHeart',
    'lilSmile',
    'pissed',
    'plain',
    'sad',
    'shout',
    'shy',
    'sick',
    'smileLol',
    'smileTeeth',
    'tongueOut',
    'wideSmile'
];

function updateEye(option, dir) {
    const curr = option.innerHTML;
    let i = eye_list.indexOf(curr);
    if (dir == 'left') i -= 1;
    if (dir == 'right') i += 1;
    if (i == -1) i = eye_list.length - 1;
    if (i == eye_list.length) i = 0;
    option.innerHTML = eye_list[i];
    curr_setup.eyes = eye_list[i];
    updateAvatar();
}

function updateMouth(option, dir) {
    const curr = option.innerHTML;
    let i = mouth_list.indexOf(curr);
    if (dir == 'left') i -= 1;
    if (dir == 'right') i += 1;
    if (i == -1) i = mouth_list.length - 1;
    if (i == mouth_list.length) i = 0;
    option.innerHTML = mouth_list[i];
    curr_setup.mouth = mouth_list[i];
    updateAvatar();
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Glass
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Icons
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Identicon
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Initials
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Micah
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Miniavs
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Notionists
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Notionists Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Open Peeps
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Personas
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Pixel Art
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Pixel Art Neutral
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Rings
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Shapes
// 


// #region



// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Thumbs
// 


// #region



// #endregion

