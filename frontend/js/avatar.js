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

function splitCapitals(str) {
    return startUpper(str).split(/(?=[A-Z])/).join(' ');
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
    'backgroundColor': '#FFFFFF',
    'backgroundType': 'solid',
    'backgroundRotation': '0',
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

    const avatar_pb_div = document.createElement('div');
    avatar_pb_div.id = 'avatar_preview_and_base';
    avatar_div.appendChild(avatar_pb_div);

    const avatar_preview = document.createElement('img');
    avatar_preview.id = 'avatar_preview';
    avatar_preview.src = createBaseLink(
        'fun-emoji',
        `${user.player_id}`,
        'false',
        '0',
        '100',
        '#FFFFFF',
        'solid',
        '0',
        '0',
        '0',
    ) + createExtras({
        'eyes': 'plain',
        'mouth': 'plain'
    });
    avatar_pb_div.appendChild(avatar_preview);

    const avatar_base = document.createElement('div');
    avatar_base.id = 'avatar_base';
    avatar_pb_div.appendChild(avatar_base);

    renderBaseOptions(avatar_base);

    const avatar_options = document.createElement('div');
    avatar_options.className = 'avatar_options';
    avatar_div.appendChild(avatar_options);
    
    setupThemeGallery(avatar_options);
}

function createBaseLink(
    theme_var = 'fun-emoji',
    seed_var = '0',
    flip_var = 'false',
    rotate_var = '0',
    scale_var = '100',
    colour_var = '#FFFFFF',
    backgroundType_var = 'solid',
    backgroundRotation_var = '0',
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
        colour_var.startsWith('#') ? `&backgroundColor=${colour_var.slice(1)}` :
        colour_var.length == 6 ? `&backgroundColor=${colour_var}` : '';
    curr_setup['colour'] = colour_var;

    const backgroundType = `&backgroundType=${backgroundType_var}`;
    curr_setup['backgroundType'] = backgroundType_var;

    const backgroundRotation = backgroundType_var == 'gradientLinear' ?
        `&backgroundRotation=${backgroundRotation_var}` : '';
    curr_setup['backgroundRotation'] = backgroundRotation_var;

    const x = `&translateX=${x_var}`;
    curr_setup['translateX'] = x_var;

    const y = `&translateY=${y_var}`;
    curr_setup['translateY'] = y_var;

    return base + radius + seed + flip + rotate + scale +
        colour + backgroundType + backgroundRotation + x + y;
}

function createExtras(extras) {
    console.log(extras);
    let options = [];
    Object.entries(extras).forEach(([key, val]) => {
        if (`${val}`.startsWith('#')) {
            options.push(`&${key}=${val.slice(1)}`);
        } else {
            options.push(`&${key}=${val}`);
        }
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
        curr_setup['backgroundType'],
        curr_setup['backgroundRotation'],
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
    otherOptions.className = 'avatar_options';
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
        .filter(([key, _]) => !baseProperties.includes(key))
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
    curr_setup['extras'] = {};
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
    updateAvatar();
}

function renderBaseOptions(div) {
    setupSwitch(div, 'flip');

    const rotate = basicDiceBearOptions['rotate'];
    setupSlider(div, 'rotate', rotate.minimum, rotate.maximum, 0, 5);
    
    const scale = basicDiceBearOptions['scale'];
    setupSlider(div, 'scale', scale.minimum, scale.maximum, 100, 5);
    
    const x = basicDiceBearOptions['translateX'];
    setupSlider(div, 'translateX', x.minimum, x.maximum, 0, 5);
    
    const y = basicDiceBearOptions['translateY'];
    setupSlider(div, 'translateY', y.minimum, y.maximum, 0, 5);

    setupColour(div, 'backgroundColor', '#FFFFFF');

    const bg_type = ['solid', 'gradientLinear'];
    setupGallery(div, 'backgroundType', bg_type, 'solid', false);

    setupSlider(div, 'backgroundRotation', 0, 360, 0, 5);
}

function updateBaseOptions(key) {
    const colour = key == 'icons' ? '#000000' : '#FFFFFF';
    const div = document.querySelector('.background_colour_div');
    const parent = div.parentElement;
    div.remove();
    setupColour(parent, 'backgroundColor', colour);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Options
// 


// #region

function setupGallery(div, key, options, initial, hasProbability) {
    const updateSetup = (val) => {
        if (hasProbability) {
            if (val == 'None') {
                curr_setup['extras'][`${key}Probability`] = 0;
            } else {
                curr_setup['extras'][key] = val;
                curr_setup['extras'][`${key}Probability`] = 100;
            }
        } else if (key == 'backgroundType') {
            curr_setup['backgroundType'] = val;
        } else {
            curr_setup['extras'][key] = val;
        }
    };

    const update = (dir) => {
        const curr = option.innerHTML;
        let i = options.indexOf(curr);
        if (dir == 'left') i -= 1;
        if (dir == 'right') i += 1;
        if (i == -1) i = options.length - 1;
        if (i == options.length) i = 0;
        option.innerHTML = options[i];
        if (key == 'backgroundType') {
            const bg = document.querySelector('.background_rotation');
            if (options[i] == 'gradientLinear') {
                bg.style.display = 'flex';
            } else {
                bg.style.display = 'none';
            }
        }
        updateSetup(options[i]);
        updateAvatar();
    }

    updateSetup(initial);
    options = options.sort();

    const section = document.createElement('div');
    section.id = `${key}_section`;
    section.className = 'avatar_options_section';
    div.appendChild(section);

    section.appendChild(header(
        'h2', `${splitCapitals(key)}:`, '', '', 'avatar_option_title'
    ));

    const options_div = document.createElement('div');
    options_div.id = `${key}_options`;
    options_div.className = 'avatar_option';
    section.appendChild(options_div);
    
    const leftArrow = document.createElement('img');
    leftArrow.className = 'avatar_arrow';
    leftArrow.id = 'left_arrow';
    leftArrow.src = 'assets/arrow.svg';
    options_div.appendChild(leftArrow);

    const option = header(
        'h2', initial, '', `${key}_option`, `avatar_option_text`
    );
    options_div.appendChild(option);

    const rightArrow = document.createElement('img');
    rightArrow.className = 'avatar_arrow';
    rightArrow.id = 'right_arrow';
    rightArrow.src = 'assets/arrow.svg';
    options_div.appendChild(rightArrow);

    leftArrow.addEventListener('click', () => update('left'));
    rightArrow.addEventListener('click', () => update('right'));
}

function setupColour(div, key, colour) {
    const updateSetup = (val) => {
        if (baseProperties.includes(key)) {
            curr_setup['colour'] = val;
        } else {
            curr_setup['extras'][key] = val;
        }
    };

    const type = key.split('Color')[0];
    const section = document.createElement('div');
    section.id = 'colour_section';
    section.className = 'avatar_options_section background_colour_div';
    div.appendChild(section);

    const text = `${splitCapitals(type)} Colour:`;
    section.appendChild(header(
        'h2', text, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = 'colour_options';
    options.className = 'avatar_option';
    section.appendChild(options);

    //let colour = '#000000';
    //if (type == 'background')
    //      colour = '#FFFFFF';
    //if (type == 'hair')
    //      colour = '#724133';
    //if (type == 'skin' || type == 'base')
    //      colour = '#EDB98A';
    updateSetup(colour.slice(1));
    const colourHeader = header(
        'h2', colour, '', 'colour_option', 'avatar_option_text'
    );
    options.appendChild(colourHeader);
    
    const option = document.createElement('input');
    option.id = 'avatar_colour';
    option.type = 'color';
    option.value = colour;
    options.appendChild(option);

    option.addEventListener('input', (e) => {
        colourHeader.innerHTML = e.target.value;
        updateSetup(e.target.value);
        updateAvatar();
    });
}

function setupSwitch(div, key) {
    const updateSetup = (val) => {
        if (baseProperties.includes(key)) {
            curr_setup[key] = val;
        } else {
            curr_setup['extras'][key] = val;
        }
    };
    
    updateSetup('false');
    const section = document.createElement('div');
    section.id = 'switch_section';
    section.className = 'avatar_options_section';
    div.appendChild(section);

    section.appendChild(header(
        'h2', `${splitCapitals(key)}:`, '', '', 'avatar_option_title'
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
        updateSetup(`${option.checked}`);
        updateAvatar();
    });
}

function setupSlider(div, key, min, max, val, step) {
    const updateSetup = (num) => {
        if (baseProperties.includes(key)) {
            curr_setup[key] = `${num}`;
        } else {
            curr_setup['extras'][key] = `${num}`;
        }
    };

    let def = val == null ? (min + max)/2 : val;
    updateSetup(def);
    const section = document.createElement('div');
    section.id = 'slider_section';
    if (key == 'backgroundRotation') {
        section.className = 'avatar_options_section background_rotation';
        section.style.display = 'none';
    } else {
        section.className = 'avatar_options_section';
    }
    div.appendChild(section);

    section.appendChild(header(
        'h2', `${splitCapitals(key)}:`, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = 'slider_options';
    options.className = 'avatar_option';
    section.appendChild(options);

    const sliderHeader = header(
        'h2', def, '', 'slider_option', 'avatar_option_text'
    );
    options.appendChild(sliderHeader);
    
    const option = document.createElement('input');
    option.id = 'avatar_slider';
    option.type = 'range';
    option.min = min;
    option.max = max;
    option.value = def;
    option.step = step;
    options.appendChild(option);

    const updateSlider = (num) => {
        sliderHeader.innerHTML = num;
        updateSetup(num);
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
        option.value = def;
        updateSlider(`${option.value}`);
    });

}

function getItems(props, item_key) {
    const item = props.find(([key]) => key === item_key);
    return item?.[1]?.items ?? { enum: [] };
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
    updateBaseOptions('adventurer');

    let earrings = getItems(props, 'earrings').enum;
    earrings.push('None');
    setupGallery(div, 'earrings', earrings, 'None', true);
    
    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'variant01', false);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);

    let features = getItems(props, 'features').enum;
    features.push('None');
    setupGallery(div, 'features', features, 'None', true);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);

    let hair = getItems(props, 'hair').enum;
    hair.push('None');
    setupGallery(div, 'hair', hair, 'short01', true);
    setupColour(div, 'hairColor', '#724133');

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant01', false);

    setupColour(div, 'skinColor', '#EDB98A');
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
    updateBaseOptions('adventurer-neutral');

    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'variant01', false);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant01', false);
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
    updateBaseOptions('avataaars');

    let accessories = getItems(props, 'accessories').enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, 'None', true);
    setupColour(div, 'accessoriesColor', '#000000');
    
    setupColour(div, 'clothesColor', '#000000');
    
    let clothing = getItems(props, 'clothing').enum;
    setupGallery(div, 'clothing', clothing, 'blazerAndShirt', false);
    // TODO: add clothingGraphic if clothing is graphic
    
    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'default', false);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'default', false);
    
    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    setupGallery(div, 'facialHair', facialHair, 'None', true);
    setupColour(div, 'facialHairColor', '#000000');
    
    setupColour(div, 'hairColor', '#724133');
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'default', false);
    
    setupColour(div, 'skinColor', '#EDB98A');
    
    let top = getItems(props, 'top').enum;
    setupGallery(div, 'top', top, 'shortFlat', false);
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
    updateBaseOptions('avataaars-neutral');

    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'default', false);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'default', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'default', false);
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
    updateBaseOptions('big-ears');

    let cheek = getItems(props, 'cheek').enum;
    cheek.push('None');
    setupGallery(div, 'cheek', cheek, 'None', true);
    
    let ear = getItems(props, 'ear').enum;
    setupGallery(div, 'ear', ear, 'variant01', false);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);

    let face = getItems(props, 'face').enum;
    setupGallery(div, 'face', face, 'variant01', false);

    let frontHair = getItems(props, 'frontHair').enum;
    setupGallery(div, 'frontHair', frontHair, 'variant01', false);
    
    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'short01', false);
    setupColour(div, 'hairColor', '#724133');
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant0101', false);
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
    
    let sideburn = getItems(props, 'sideburn').enum;
    setupGallery(div, 'sideburn', sideburn, 'variant01', false);

    setupColour(div, 'skinColor', '#EDB98A');
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
    updateBaseOptions('big-ears-neutral');

    let cheek = getItems(props, 'cheek').enum;
    cheek.push('None');
    setupGallery(div, 'cheek', cheek, 'None', true);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant0101', false);
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
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
    updateBaseOptions('big-smile');

    let accessories = getItems(props, 'accessories').enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, 'None', true);

    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'normal', false);

    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'shortHair', false);
    setupColour(div, 'hairColor', '#724133');

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'awkwardSmile', false);

    setupColour(div, 'skinColor', '#EDB98A');
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
    updateBaseOptions('bottts');

    setupColour(div, 'baseColor', '#EDB98A');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'eva', false);
    
    let face = getItems(props, 'face').enum;
    setupGallery(div, 'face', face, 'round01', false);
    
    let mouth = getItems(props, 'mouth').enum;
    mouth.push('None');
    setupGallery(div, 'mouth', mouth, 'bite', true);

    let sides = getItems(props, 'sides').enum;
    sides.push('None');
    setupGallery(div, 'sides', sides, 'None', true);

    let texture = getItems(props, 'texture').enum;
    texture.push('None');
    setupGallery(div, 'texture', texture, 'None', true);

    let top = getItems(props, 'top').enum;
    top.push('None');
    setupGallery(div, 'top', top, 'None', true);
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
    updateBaseOptions('bottts-neutral');

    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'eva', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'bite', false);
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
    updateBaseOptions('croodles');

    setupColour(div, 'baseColor', '#EDB98A');
    
    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    setupGallery(div, 'beard', beard, 'None', true);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    
    let face = getItems(props, 'face').enum;
    setupGallery(div, 'face', face, 'variant01', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant01', false);

    let moustache = getItems(props, 'moustache').enum;
    moustache.push('None');
    setupGallery(div, 'moustache', moustache, 'None', true);
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
    
    let top = getItems(props, 'top').enum;
    setupGallery(div, 'top', top, 'variant01', false);
    setupColour(div, 'topColor', '#000000');
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
    updateBaseOptions('croodles-neutral');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant01', false);
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
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
    updateBaseOptions('dylan');

    const facialHair = ['None', 'default'];
    setupGallery(div, 'facialHair', facialHair, 'None', true);
    
    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'plain', false);
    setupColour(div, 'hairColor', '#724133');
    
    let mood = getItems(props, 'mood').enum;
    setupGallery(div, 'mood', mood, 'neutral', false);

    setupColour(div, 'skinColor', '#EDB98A');
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
    updateBaseOptions('fun-emoji');

    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'plain', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'plain', false);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Glass
// 


// #region

function renderGlass(div, props) {
    div.innerHTML = '';
    updateBaseOptions('glass');

    let shape1 = getItems(props, 'shape1').enum;
    setupGallery(div, 'shape1', shape1, 'a', false);

    const x1 = getItems(props, 'shape1OffsetX');
    setupSlider(
        div, 'shape1OffsetX', x1.minimum,
        x1.maximum, x1?.default ?? null, 5
    );

    const y1 = getItems(props, 'shape1OffsetY');
    setupSlider(
        div, 'shape1OffsetY', y1.minimum,
        y1.maximum, y1?.default ?? null, 5
    );

    const r1 = getItems(props, 'shape1Rotation');
    setupSlider(
        div, 'shape1Rotation', r1.minimum,
        r1.maximum, r1?.default ?? null, 5
    );

    let shape2 = getItems(props, 'shape2').enum;
    setupGallery(div, 'shape2', shape2, 'a', false);

    const x2 = getItems(props, 'shape2OffsetX');
    setupSlider(
        div, 'shape2OffsetX', x2.minimum,
        x2.maximum, x2?.default ?? null, 5
    );

    const y2 = getItems(props, 'shape2OffsetY');
    setupSlider(
        div, 'shape2OffsetY', y2.minimum,
        y2.maximum, y2?.default ?? null, 5
    );

    const r2 = getItems(props, 'shape2Rotation');
    setupSlider(
        div, 'shape2Rotation', r2.minimum,
        r2.maximum, r2?.default ?? null, 5
    );
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Icons
// 


// #region

function renderIcons(div, props) {
    div.innerHTML = '';
    updateBaseOptions('icons');

    let icon = getItems(props, 'icon').enum;
    setupGallery(div, 'icon', icon, 'emojiSmile', false);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Identicon
// 


// #region

function renderIdenticon(div, props) {
    div.innerHTML = '';
    updateBaseOptions('identicon');

    let row1 = getItems(props, 'row1').enum;
    setupGallery(div, 'row1', row1, 'xooox', false);

    let row2 = getItems(props, 'row2').enum;
    setupGallery(div, 'row2', row2, 'oxoxo', false);

    let row3 = getItems(props, 'row3').enum;
    setupGallery(div, 'row3', row3, 'ooxoo', false);

    let row4 = getItems(props, 'row4').enum;
    setupGallery(div, 'row4', row4, 'oxoxo', false);

    let row5 = getItems(props, 'row5').enum;
    setupGallery(div, 'row5', row5, 'xooox', false);

    setupColour(div, 'rowColor', '#000000');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei
// 


// #region

function renderLorelei(div, props) {
    div.innerHTML = '';
    updateBaseOptions('lorelei');

    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    setupGallery(div, 'beard', beard, 'None', true);

    let earrings = getItems(props, 'earrings').enum;
    earrings.push('None');
    setupGallery(div, 'earrings', earrings, 'None', true);
    setupColour(div, 'earringsColor', '#000000');

    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'variant01', false);
    setupColour(div, 'eyebrowsColor', '#000000');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    setupColour(div, 'eyesColor', '#000000');
    
    let freckles = getItems(props, 'freckles').enum;
    freckles.push('None');
    setupGallery(div, 'freckles', freckles, 'None', true);
    setupColour(div, 'frecklesColor', '#000000');

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    setupColour(div, 'glassesColor', '#000000');

    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'variant01', false);
    setupColour(div, 'hairColor', '#724133');

    let hairAccessories = getItems(props, 'hairAccessories').enum;
    hairAccessories.push('None');
    setupGallery(div, 'hairAccessories', hairAccessories, 'None', true);
    setupColour(div, 'hairAccessoriesColor', '#000000');
    
    let head = getItems(props, 'head').enum;
    setupGallery(div, 'head', head, 'variant01', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'happy01', false);
    setupColour(div, 'mouthColor', '#000000');
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
    setupColour(div, 'noseColor', '#000000');
    
    setupColour(div, 'skinColor', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei Neutral
// 


// #region

function renderLoreleiNeutral(div, props) {
    div.innerHTML = '';
    updateBaseOptions('lorelei-neutral');

    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'variant01', false);
    setupColour(div, 'eyebrowsColor', '#000000');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    setupColour(div, 'eyesColor', '#000000');
    
    let freckles = getItems(props, 'freckles').enum;
    freckles.push('None');
    setupGallery(div, 'freckles', freckles, 'None', true);
    setupColour(div, 'frecklesColor', '#000000');

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    setupColour(div, 'glassesColor', '#000000');
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'happy01', false);
    setupColour(div, 'mouthColor', '#000000');
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
    setupColour(div, 'noseColor', '#000000');
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

