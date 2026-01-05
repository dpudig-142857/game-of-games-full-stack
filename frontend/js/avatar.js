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
    'translateX': '0',
    'translateY': '0',
    'extras': {}
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
    avatar_preview.src = createBaseLink(
        'fun-emoji',
        `${user.player_id}`,
        'false',
        '0',
        '100',
        '#ffffff',
        'solid',
        '0',
        '0',
        '0',
    ) + createExtras({
        'eyes': 'plain',
        'mouth': 'plain'
    });
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
    curr_setup['theme'] = theme_var;

    const radius = `/svg?radius=50`;

    const seed = `&seed=${seed_var}`;
    curr_setup['seed'] = seed_var;

    const flip = `&flip=${flip_var}`;
    curr_setup['flip'] = flip_var;

    const rotate = `&rotate=${rotate_var}`;
    curr_setup['rotate'] = rotate_var;

    const scale = `&scale=${scale_var}`;
    curr_setup['scale'] = scale_var;

    const colour = colour_var == '' || colour_var == '[]' ? `&backgroundColor[]` : 
        colour_var.startsWith('#') ? `&backgroundColor=${colour_var.slice(1)}` : '';
    curr_setup['colour'] = colour_var;

    const colour_type = `&backgroundType=${colour_type_var}`;
    curr_setup['colour_type'] = colour_type_var;

    const colour_rotation = colour_type_var == 'gradientLinear' ?
        `&backgroundRotation=${colour_rotation_var}` : '';
    curr_setup['colour_rotation'] = colour_rotation_var;

    const x = `&translateX=${x_var}`;
    curr_setup['translateX'] = x_var;

    const y = `&translateY=${y_var}`;
    curr_setup['translateY'] = y_var;

    return base + radius + seed + flip + rotate + scale +
        colour + colour_type + colour_rotation + x + y;
}

function createExtras(extras) {
    console.log(extras);
    let options = [];
    Object.entries(extras).forEach(([key, val]) => {
        options.push(`&${key}=${val}`);
        curr_setup['extras'][key] = val;
    });
    console.log(options.join(''));
    return options.join('');
}

function updateAvatar() {
    const preview = document.getElementById('avatar_preview');
    preview.src = createBaseLink(
        curr_setup['theme'],
        curr_setup['seed'],
        curr_setup['flip'],
        curr_setup['rotate'],
        curr_setup['scale'],
        curr_setup['colour'],
        curr_setup['colour_type'],
        curr_setup['colour_rotation'],
        curr_setup['translateX'],
        curr_setup['translateY']
    ) + createExtras(curr_setup['extras']);
    console.log(curr_setup);
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
        .filter(([key, val]) => !baseProperties.includes(key))
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
    curr_setup['theme'] = themes[i];
    console.log(themes[i]);
    const props = Object.entries(allDiceBearOptions[themes[i]])
    .filter(([key]) => !baseProperties.includes(key))
    .filter(([key]) => !ignore.includes(`${themes[i]}.${key}`));

    if (themes[i] == 'adventurer') {
        renderAdventurer(section, props);
    } else if (themes[i] == 'adventurer-neutral') {
        renderAdventurerNeutral(section, props);
    } else if (themes[i] == 'avataaars') {
        renderAvataaars(section, props);
    } else if (themes[i] == 'avataaars-neutral') {
        renderAvataaarsNeutral(section, props);
    } else if (themes[i] == 'big-ears') {
        renderBigEars(section, props);
    } else if (themes[i] == 'big-ears-neutral') {
        renderBigEarsNeutral(section, props);
    } else if (themes[i] == 'big-smile') {
        renderBigSmile(section, props);
    } else if (themes[i] == 'bottts') {
        renderBottts(section, props);
    } else if (themes[i] == 'bottts-neutral') {
        renderBotttsNeutral(section, props);
    } else if (themes[i] == 'croodles') {
        renderCroodles(section, props);
    } else if (themes[i] == 'croodles-neutral') {
        renderCroodlesNeutral(section, props);
    } else if (themes[i] == 'dylan') {
        renderDylan(section, props);
    } else if (themes[i] == 'fun-emoji') {
        renderFunEmoji(section, props);
    } else if (themes[i] == 'glass') {
        renderGlass(section, props);
    } else if (themes[i] == 'icons') {
        renderIcons(section, props);
    } else if (themes[i] == 'identicon') {
        renderIdenticon(section, props);
    } else if (themes[i] == 'lorelei') {
        renderLorelei(section, props);
    } else if (themes[i] == 'lorelei-neutral') {
        renderLoreleiNeutral(section, props);
    } else if (themes[i] == 'micah') {
        renderMicah(section, props);
    } else if (themes[i] == 'miniavs') {
        renderMiniavs(section, props);
    } else if (themes[i] == 'notionists') {
        renderNotionists(section, props);
    } else if (themes[i] == 'notionists-neutral') {
        renderNotionistsNeutral(section, props);
    } else if (themes[i] == 'open-peeps') {
        renderOpenPeeps(section, props);
    } else if (themes[i] == 'personas') {
        renderPersonas(section, props);
    } else if (themes[i] == 'pixel-art') {
        renderPixelArt(section, props);
    } else if (themes[i] == 'pixel-art-neutral') {
        renderPixelArtNeutral(section, props);
    } else if (themes[i] == 'rings') {
        renderRings(section, props);
    } else if (themes[i] == 'shapes') {
        renderShapes(section, props);
    } else if (themes[i] == 'thumbs') {
        renderThumbs(section, props);
    }
}

function updateOption(type, div, options, dir) {
    const curr = div.innerHTML;
    let i = options.indexOf(curr);
    if (dir == 'left') i -= 1;
    if (dir == 'right') i += 1;
    if (i == -1) i = options.length - 1;
    if (i == options.length) i = 0;
    div.innerHTML = options[i];
    curr_setup['extras'][type] = options[i];
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
        updateOption(type, option, options, 'left');
        //if (type == 'eye') updateEye(option, 'left');
        //if (type == 'mouth') updateMouth(option, 'left');
    });
    
    rightArrow.addEventListener('click', () => {
        updateOption(type, option, options, 'right');
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
        if (baseProperties.includes(key)) {
            curr_setup['colour'] = colour;
        } else {
            curr_setup['extras'][key] = colour;
        }
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

    const switchHeader = header(
        'h2', 'Normal', '', 'switch_option', 'avatar_option_text'
    );
    options.appendChild(switchHeader);
    
    const option = document.createElement('input');
    option.id = 'avatar_switch';
    option.type = 'checkbox';
    options.appendChild(option);

    option.addEventListener('input', (e) => {
        switchHeader.innerHTML = option.checked ? 'Flipped' : 'Normal';
        if (baseProperties.includes(key)) {
            curr_setup[key] = option.checked ? 'true' : 'false';
        } else {
            curr_setup['extras'][key] = option.checked ? 'true' : 'false';
        }
        updateAvatar();
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

    const updateSlider = (num) => {
        sliderHeader.innerHTML = num;
        if (baseProperties.includes(key)) {
            curr_setup[key] = num;
        } else {
            curr_setup['extras'][key] = num;
        }
        updateAvatar();
    };

    option.addEventListener('input', () => {
        updateSlider(`${option.value}`);
    });

    const reset = document.createElement('input');
    reset.className = 'avatar_btn';
    reset.type = 'button';
    reset.value = 'Reset';
    options.appendChild(reset);

    reset.addEventListener('click', (e) => {
        e.preventDefault();
        option.value = val;
        updateSlider(`${option.value}`);
    });

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Adventurer
// 


// #region

function renderAdventurer(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let earrings = props['earrings'].items.enum;
    earrings.push('None');
    setupGallery(div, 'earrings', earrings, earrings[0]);
    
    let eyebrows = props['eyebrows'].items.enum;
    setupGallery(div, 'eyebrows', eyebrows, eyebrows[0]);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);

    let features = props['features'].items.enum;
    features.push('None');
    setupGallery(div, 'features', features, features[0]);

    let glasses = props['glasses'].items.enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, glasses[0]);

    let hair = props['hair'].items.enum;
    hair.push('None');
    setupGallery(div, 'hair', hair, hair[0]);
    setupColour(div, 'hairColor');

    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);

    setupColour(div, 'skinColor');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Adventurer Neutral
// 


// #region

function renderAdventurerNeutral(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let eyebrows = props['eyebrows'].items.enum;
    setupGallery(div, 'eyebrows', eyebrows, eyebrows[0]);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);

    let glasses = props['glasses'].items.enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, glasses[0]);

    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Avataaars
// 


// #region

function renderAvataaars(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let accessories = props['accessories'].items.enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, accessories[0]);
    setupColour(div, 'accessoriesColor');
    
    setupColour(div, 'clothesColor');
    
    let clothing = props['clothing'].items.enum;
    setupGallery(div, 'clothing', clothing, clothing[0]);
    // TODO: add clothingGraphic if clothing is graphic
    
    let eyebrows = props['eyebrows'].items.enum;
    setupGallery(div, 'eyebrows', eyebrows, eyebrows[0]);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);
    
    let facialHair = props['facialHair'].items.enum;
    facialHair.push('None');
    setupGallery(div, 'facialHair', facialHair, facialHair[0]);
    setupColour(div, 'facialHairColor');
    
    setupColour(div, 'hairColor');
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);
    
    setupColour(div, 'skinColor');
    
    let top = props['top'].items.enum;
    setupGallery(div, 'top', top, top[0]);
    // TODO: if top is hat, hijab, turban, winterHat1, winterHat02, winterHat03, winerHat04, add hatColor
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Avataaars Neutral
// 


// #region

function renderAvataaarsNeutral(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let eyebrows = props['eyebrows'].items.enum;
    setupGallery(div, 'eyebrows', eyebrows, eyebrows[0]);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Big Ears
// 


// #region

function renderBigEars(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let cheek = props['cheek'].items.enum;
    cheek.push('None');
    setupGallery(div, 'cheek', cheek, cheek[0]);
    
    let ear = props['ear'].items.enum;
    setupGallery(div, 'ear', ear, ear[0]);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);

    let face = props['face'].items.enum;
    setupGallery(div, 'face', face, face[0]);

    let frontHair = props['frontHair'].items.enum;
    setupGallery(div, 'frontHair', frontHair, frontHair[0]);
    
    let hair = props['hair'].items.enum;
    setupGallery(div, 'hair', hair, hair[0]);
    setupColour(div, 'hairColor');
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);
    
    let nose = props['nose'].items.enum;
    setupGallery(div, 'nose', nose, nose[0]);
    
    let sideburn = props['sideburn'].items.enum;
    setupGallery(div, 'sideburn', sideburn, sideburn[0]);
    
    setupColour(div, 'skinColor');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Big Ears Neutral
// 


// #region

function renderBigEarsNeutral(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let cheek = props['cheek'].items.enum;
    cheek.push('None');
    setupGallery(div, 'cheek', cheek, cheek[0]);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);
    
    let nose = props['nose'].items.enum;
    setupGallery(div, 'nose', nose, nose[0]);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Big Smile
// 


// #region

function renderBigSmile(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let accessories = props['accessories'].items.enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, accessories[0]);

    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);

    let hair = props['hair'].items.enum;
    setupGallery(div, 'hair', hair, hair[0]);
    setupColour(div, 'hairColor');

    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);

    setupColour(div, 'skinColor');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Bottts
// 


// #region

function renderBottts(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    setupColour(div, 'baseColor');
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);
    
    let face = props['face'].items.enum;
    setupGallery(div, 'face', face, face[0]);
    
    let mouth = props['mouth'].items.enum;
    mouth.push('None');
    setupGallery(div, 'mouth', mouth, mouth[0]);

    let sides = props['sides'].items.enum;
    sides.push('None');
    setupGallery(div, 'sides', sides, sides[0]);

    let texture = props['texture'].items.enum;
    texture.push('None');
    setupGallery(div, 'texture', texture, texture[0]);

    let top = props['top'].items.enum;
    top.push('None');
    setupGallery(div, 'top', top, top[0]);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Bottts Neutral
// 


// #region

function renderBotttsNeutral(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Croodles
// 


// #region

function renderCroodles(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    setupColour(div, 'baseColor');
    
    let beard = props['beard'].items.enum;
    beard.push('None');
    setupGallery(div, 'beard', beard, beard[0]);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);
    
    let face = props['face'].items.enum;
    setupGallery(div, 'face', face, face[0]);
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);

    let moustache = props['moustache'].items.enum;
    moustache.push('None');
    setupGallery(div, 'moustache', moustache, moustache[0]);
    
    let nose = props['nose'].items.enum;
    setupGallery(div, 'nose', nose, nose[0]);
    
    let top = props['top'].items.enum;
    setupGallery(div, 'top', top, top[0]);
    setupColour(div, 'topColor');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Croodles Neutral
// 


// #region

function renderCroodlesNeutral(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);
    
    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, eyes[0]);
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, mouth[0]);
    
    let nose = props['nose'].items.enum;
    setupGallery(div, 'nose', nose, nose[0]);
}

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

    const facialHair = ['None', 'Default'];
    setupGallery(div, 'facialHair', facialHair, facialHair[0]);
    
    let hair = props['hair'].items.enum;
    setupGallery(div, 'hair', hair, hair[0]);
    setupColour(div, 'hairColor');
    
    let mood = props['mood'].items.enum;
    setupGallery(div, 'mood', mood, mood[0]);

    setupColour(div, 'skinColor');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Fun Emoji
// 


// #region

function renderFunEmoji(div, props) {
    div.innerHTML = '';
    renderBaseOptions(div);

    let eyes = props['eyes'].items.enum;
    setupGallery(div, 'eyes', eyes, 'plain');
    
    let mouth = props['mouth'].items.enum;
    setupGallery(div, 'mouth', mouth, 'plain');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Glass
// 


// #region

function renderGlass(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Icons
// 


// #region

function renderIcons(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Identicon
// 


// #region

function renderIdenticon(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei
// 


// #region

function renderLorelei(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei Neutral
// 


// #region

function renderLoreleiNeutral(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Micah
// 


// #region

function renderMicah(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Miniavs
// 


// #region

function renderMiniavs(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Notionists
// 


// #region

function renderNotionists(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Notionists Neutral
// 


// #region

function renderNotionistsNeutral(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Open Peeps
// 


// #region

function renderOpenPeeps(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Personas
// 


// #region

function renderPersonas(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Pixel Art
// 


// #region

function renderPixelArt(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Pixel Art Neutral
// 


// #region

function renderPixelArtNeutral(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Rings
// 


// #region

function renderRings(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Shapes
// 


// #region

function renderShapes(div, props) {

}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Thumbs
// 


// #region

function renderThumbs(div, props) {

}

// #endregion

