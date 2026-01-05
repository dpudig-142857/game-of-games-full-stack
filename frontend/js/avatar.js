// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Global Imports
// 


// #region

import {
    header,
    startUpper
} from './utils.js';
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

console.log(allDiceBearOptions);

let curr_setup = {
    'theme': 'fun-emoji',
    'seed': '0',
    'flip': 'false',
    'rotate': '0',
    'scale': '100',
    'colour': '#ffffff',
    'colour_type': 'solid',
    'colour_rotation': '0',
    'x': '0',
    'y': '0',
    'other': {}
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

    //console.log(user);
    const avatar_div = document.createElement('div');
    avatar_div.id = 'avatar_div';
    div.appendChild(avatar_div);

    const avatar_preview_div = document.createElement('div');
    avatar_preview_div.id = 'avatar_preview_div';
    avatar_div.appendChild(avatar_preview_div);

    const avatar_preview = document.createElement('img');
    avatar_preview.id = 'avatar_preview';
    avatar_preview.src = createFunEmojiLink(
        `${user.player_id}`,
        'true',
        '0',
        '100',
        '#ffffff',
        'solid',
        '0',
        '0',
        '0',
        'plain',
        'plain'
    );
    avatar_preview_div.appendChild(avatar_preview);

    const avatar_options = document.createElement('div');
    avatar_options.id = 'avatar_options';
    avatar_div.appendChild(avatar_options);
    
    setupThemeGallery(avatar_options);
}

function createBaseLink(
    theme_var = 'fun-emoji',
    seed_var = '0',
    flip_var = 'false',
    rotate_var = '0',
    scale_var = '100',
    colour_var = '#ffffff',
    colour_type_var = 'solid',
    colour_rotation_var = '0',
    x_var = '0',
    y_var = '0'
) {
    const base = `https://api.dicebear.com/9.x/${theme_var}`;
    curr_setup.theme = theme_var;

    const radius = `/svg?radius=50`;

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

    const colour_type = `&backgroundType=${colour_type_var}`;
    curr_setup.colour_type = colour_type_var;

    const colour_rotation = colour_type_var == 'gradientLinear' ?
        `&backgroundRotation=${colour_rotation_var}` : '';
    curr_setup.colour_rotation = colour_rotation_var;

    const x = `&translateX=${x_var}`;
    curr_setup.x = x_var;

    const y = `&translateY=${y_var}`;
    curr_setup.y = y_var;

    return base + radius + seed + flip + rotate + scale +
        colour + colour_type + colour_rotation + x + y;
}

function updateAvatar() {
    const preview = document.getElementById('avatar_preview');
    preview.src = createBaseLink(
        curr_setup.theme,
        curr_setup.seed,
        curr_setup.flip,
        curr_setup.rotate,
        curr_setup.scale,
        curr_setup.colour,
        curr_setup.x,
        curr_setup.y
    )// + createExtras(curr_setup.other);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                              Theme
// 


// #region

const themes = Object.keys(allDiceBearOptions);

const ignore = [
    'basic.seed',
    'basic.radius',
    'basic.size',
    'basic.clip',
    'basic.randomizeIds',
    'adventurer.base',
    'avataaars.base',
    'avataaars.nose',
    'avataaars.style',
    'avataaars-neutral.nose',
    'big-smile.face',
    'dylan.facialHair',
    'lorelei.freckles',
    'lorelei.hairAccessories',
    'lorelei-neutral.freckles',
    'micah.base',
    'miniavs.blushes',
    'notionists.base',
    'rings.ring'
];

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

    const otherOptions = document.createElement('div');
    otherOptions.id = 'avatar_options';
    div.appendChild(otherOptions);

    leftArrow.addEventListener('click', () => {
        updateTheme(otherOptions, option, 'left');
    });
    
    rightArrow.addEventListener('click', () => {
        updateTheme(otherOptions, option, 'right');
    });

    renderFunEmoji(
        otherOptions,
        Object.entries(allDiceBearOptions['fun-emoji'])
    );
}

function updateTheme(section, option, dir) {
    const curr = option.innerHTML.toLowerCase();
    let i = themes.indexOf(curr.split(' ').join('-'));
    if (dir == 'left') i -= 1;
    if (dir == 'right') i += 1;
    if (i == -1) i = themes.length - 1;
    if (i == themes.length) i = 0;
    let words = [];
    themes[i].split('-').forEach(word => {
        words.push(startUpper(word));
    });
    option.innerHTML = words.join(' ');
    console.log(themes[i]);
    const props = Object.entries(allDiceBearOptions[themes[i]])
    .filter(([key, val]) => !baseProperties.includes(key))
    .filter(([key, val]) => !ignore.includes(`${themes[i]}.${key}`))

    if (themes[i] == 'adventurer') {
        renderAdventurer();
    } else if (themes[i] == 'adventurer-neutral') {
        renderAdventurerNeutral();
    } else if (themes[i] == 'avataaars') {
        renderAvataaars();
    } else if (themes[i] == 'avataaars-neutral') {
        renderAvataaarsNeutral();
    } else if (themes[i] == 'big-ears') {
        renderBigEars();
    } else if (themes[i] == 'big-ears-neutral') {
        renderBigEarsNeutral();
    } else if (themes[i] == 'big-smile') {
        renderBigSmile();
    } else if (themes[i] == 'bottts') {
        renderBottts();
    } else if (themes[i] == 'bottts-neutral') {
        renderBotttsNeutral();
    } else if (themes[i] == 'croodles') {
        renderCroodles();
    } else if (themes[i] == 'croodles-neutral') {
        renderCroodlesNeutral();
    } else if (themes[i] == 'dylan') {
        renderDylan(section, props);
    } else if (themes[i] == 'fun-emoji') {
        renderFunEmoji(section, props);
    } else if (themes[i] == 'glass') {
        renderGlass();
    } else if (themes[i] == 'icons') {
        renderIcons();
    } else if (themes[i] == 'identicon') {
        renderIdenticon();
    } else if (themes[i] == 'lorelei') {
        renderLorelei();
    } else if (themes[i] == 'lorelei-neutral') {
        renderLoreleiNeutral();
    } else if (themes[i] == 'micah') {
        renderMicah();
    } else if (themes[i] == 'miniavs') {
        renderMiniavs();
    } else if (themes[i] == 'notionists') {
        renderNotionists();
    } else if (themes[i] == 'notionists-neutral') {
        renderNotionistsNeutral();
    } else if (themes[i] == 'open-peeps') {
        renderOpenPeeps();
    } else if (themes[i] == 'personas') {
        renderPersonas();
    } else if (themes[i] == 'pixel-art') {
        renderPixelArt();
    } else if (themes[i] == 'pixel-art-neutral') {
        renderPixelArtNeutral();
    } else if (themes[i] == 'rings') {
        renderRings();
    } else if (themes[i] == 'shapes') {
        renderShapes();
    } else if (themes[i] == 'thumbs') {
        renderThumbs();
    }
    /*.forEach(([key, val]) => {
        if (key.includes('Probability')) {
            let min = val.minimum;
            let max = val.maximum;
            console.log(key, ' - ', min, ' to ', max);
        } else if (key.includes('Color')) {
            console.log(key);
        } else {
            console.log(key, ' - ', val);
        }
    });*/
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
    updateAvatar();
}

function renderBaseOptions(div) {
    setupSwitch(div, 'flip');

    const rotate = basicDiceBearOptions['rotate'];
    setupSlider(div, 'rotate', rotate.minimum, rotate.maximum, rotate.default, 5);
    
    const scale = basicDiceBearOptions['scale'];
    setupSlider(div, 'scale', scale.minimum, scale.maximum, scale.default, 5);
    
    const x = basicDiceBearOptions['translateX'];
    setupSlider(div, 'translateX', x.minimum, x.maximum, x.default, 5);
    
    const y = basicDiceBearOptions['translateY'];
    setupSlider(div, 'translateY', y.minimum, y.maximum, y.default, 5);

    setupColour(div, 'backgroundColor');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Options
// 


// #region

function setupGallery(div, type, options, initial) {
    options = options.sort();

    const section = document.createElement('div');
    section.id = `${type}_section`;
    section.className = 'avatar_options_section';
    div.appendChild(section);

    section.appendChild(header(
        'h2', `${startUpper(type)}:`, '', '', 'avatar_option_title'
    ));

    const options_div = document.createElement('div');
    options_div.id = `${type}_options`;
    options_div.className = 'avatar_option';
    section.appendChild(options_div);
    
    const leftArrow = document.createElement('img');
    leftArrow.className = 'avatar_arrow';
    leftArrow.id = 'left_arrow';
    leftArrow.src = 'assets/arrow.svg';
    options_div.appendChild(leftArrow);

    const option = header(
        'h2', initial, '', `${type}_option`, `avatar_option_text`
    );
    options_div.appendChild(option);

    const rightArrow = document.createElement('img');
    rightArrow.className = 'avatar_arrow';
    rightArrow.id = 'right_arrow';
    rightArrow.src = 'assets/arrow.svg';
    options_div.appendChild(rightArrow);

    leftArrow.addEventListener('click', () => {
        updateOption(option, options, 'left');
        //if (type == 'eye') updateEye(option, 'left');
        //if (type == 'mouth') updateMouth(option, 'left');
    });
    
    rightArrow.addEventListener('click', () => {
        updateOption(option, options, 'right');
        //if (type == 'eye') updateEye(option, 'right');
        //if (type == 'mouth') updateMouth(option, 'right');
    });
}

function setupColour(div, key) {
    const section = document.createElement('div');
    section.id = 'colour_section';
    section.className = 'avatar_options_section';
    div.appendChild(section);

    const text = `${startUpper(key.split('Color')[0])} Colour:`;
    section.appendChild(header(
        'h2', text, '', '', 'avatar_option_title'
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

function setupSwitch(div, key) {
    const section = document.createElement('div');
    section.id = 'switch_section';
    section.className = 'avatar_options_section';
    div.appendChild(section);

    section.appendChild(header(
        'h2', `${startUpper(key)}:`, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = 'switch_options';
    options.className = 'avatar_option';
    section.appendChild(options);

    //const switchHeader = header(
    //    'h2', , '', 'switch_option', 'avatar_option_text'
    //);
    //options.appendChild(switchHeader);
    
    const option = document.createElement('input');
    option.id = 'avatar_switch';
    option.type = 'checkbox';
    options.appendChild(option);

    option.addEventListener('input', (e) => {
        
    });
}

function setupSlider(div, key, min, max, val, step) {
    const section = document.createElement('div');
    section.id = 'slider_section';
    section.className = 'avatar_options_section';
    div.appendChild(section);

    section.appendChild(header(
        'h2', `${startUpper(key)}:`, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = 'slider_options';
    options.className = 'avatar_option';
    section.appendChild(options);

    const sliderHeader = header(
        'h2', val, '', 'slider_option', 'avatar_option_text'
    );
    options.appendChild(sliderHeader);
    
    const option = document.createElement('input');
    option.id = 'avatar_slider';
    option.type = 'range';
    option.min = min;
    option.max = max;
    option.value = val;
    option.step = step;
    options.appendChild(option);

    option.addEventListener('input', (e) => {
        sliderHeader.innerHTML = option.value;
    });
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Adventurer
// 


// #region

function renderAventurer(div) {

}

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

function renderDylan(div, props) {
    div.innerHTML = '';

    renderBaseOptions(div);
    props.forEach(([key, val]) => {
        if (key == 'hair' || key == 'mood') {
            const options = val.items.enum;
            setupGallery(div, key, options, options[0]);
        } else if (key.includes('Color')) {
            setupColour(div, key);
        } else if (key == 'facialHairProbability') {
            setupGallery(div, 'facialHair', ['None', 'Default'], 'None');
        } else {
            console.log(key, ' - ', val);
        }
    });
}

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

function renderFunEmoji(div, props) {
    div.innerHTML = '';

    renderBaseOptions(div);
    props.forEach(([key, val]) => {
        if (key == 'eyes' || key == 'mouth') {
            setupGallery(div, key, val.items.enum, 'plain');
        } else {
            console.log(key, ' - ', val);
        }
    });
}

function createFunEmojiLink(
    seed_var = '0',
    flip_var = 'false',
    rotate_var = '0',
    scale_var = '100',
    colour_var = '#ffffff',
    colour_type_var = 'solid',
    colour_rotation_var = '0',
    x_var = '0',
    y_var = '0',
    eyes_var = 'plain',
    mouth_var = 'plain'
) {
    const base = createBaseLink(
        'fun-emoji',
        seed_var,
        flip_var,
        rotate_var,
        scale_var,
        colour_var,
        colour_type_var,
        colour_rotation_var,
        x_var,
        y_var
    );
    const eyes = `&eyes=${eyes_var}`;
    const mouth = `&mouth=${mouth_var}`;

    const other = {
        'eyes': eyes_var,
        'mouth': mouth_var
    }
    curr_setup.other = other;

    return base + eyes + mouth;
}

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

