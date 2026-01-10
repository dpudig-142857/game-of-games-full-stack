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
let baseProperties = Object.keys(basic.properties);
baseProperties.push('backgroundColour2');
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
    'background': '#FFFFFF',
    'background2': '#FFFFFF',
    'backgroundType': 'solid',
    'backgroundRotation': '0',
    'translateX': '0',
    'translateY': '0',
    'extras': {}
};

// SEED ORDER
// 0 - https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=ff0000&translateX=0&translateY=0&eyes=shades&mouth=cute"
// 1 - 

function getCurrSetupFromSeed(seed) {
    const [, rest] = seed.split('api.dicebear.com/9.x/');
    if (!rest) return;

    const [theme, query] = rest.split('/svg?');
    curr_setup['theme'] = theme;

    const params = new URLSearchParams(query);
    curr_setup['extras'] ??= {};

    for (const [key, val] of params.entries()) {
        if (key == 'backgroundColor[]') {
            curr_setup['background'] = '';
            curr_setup['background2'] = '';
        } else if (key == 'backgroundColor') {
            const colours = val.split(',');
            curr_setup['background']  = colours[0] ?? '';
            curr_setup['background2'] = colours[1] ?? colours[0] ?? '';
        } else if (baseProperties.includes(key)) {
            curr_setup[key] = val;
        } else if (key.includes('Color')) {
            const start = key.split('Color')[0];
            curr_setup['extras'][`${start}Colour`] = val;
        } else if (key.includes('mustache')) {
            const fixed = key.replace('mustache', 'moustache');
            curr_setup['extras'][fixed] = val;
        } else {
            curr_setup['extras'][key] = val;
        }
    }
}

export function renderAvatarPage(div, user, type) {
    div.innerHTML = '';

    const title = document.getElementById('user-profile-title');

    if (type == 'creating') {
        title.textContent = 'Creating Avatar';
    } else if (type == 'updating') {
        title.textContent = 'Updating Avatar';
        getCurrSetupFromSeed(user.avatar_seed);
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
        curr_setup['theme'],
        curr_setup['seed'],
        curr_setup['flip'],
        curr_setup['rotate'],
        curr_setup['scale'],
        curr_setup['background'],
        curr_setup['background2'],
        curr_setup['backgroundType'],
        curr_setup['backgroundRotation'],
        curr_setup['translateX'],
        curr_setup['translateY']
    ) + createExtras(curr_setup['extras']);
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
    colour_var_2 = '',
    backgroundType_var = 'solid',
    backgroundRotation_var = '0',
    x_var = '0',
    y_var = '0'
) {
    const base = `https://api.dicebear.com/9.x/${theme_var}`;
    const radius = `/svg?radius=50`;
    const seed = `&seed=${seed_var}`;
    const flip = `&flip=${flip_var}`;
    const rotate = `&rotate=${rotate_var}`;
    const scale = `&scale=${scale_var}`;
    const colour = colour_var == '' || colour_var == '[]' ? `&backgroundColor[]` : 
        colour_var.startsWith('#') ? `&backgroundColor=${colour_var.slice(1)}` :
        colour_var.length == 6 ? `&backgroundColor=${colour_var}` : '';

    let colour2 = '';
    if (backgroundType_var == 'gradientLinear') {
        if (colour_var_2.startsWith('#')) {
            colour2 = `,${colour_var_2.slice(1)}`;
        } else if (colour_var_2.length == 6) {
            colour2 = `,${colour_var_2}`;
        }
    }

    const backgroundType = `&backgroundType=${backgroundType_var}`;
    const backgroundRotation = backgroundType_var == 'gradientLinear' ?
        `&backgroundRotation=${backgroundRotation_var}` : '';
    const x = `&translateX=${x_var}`;
    const y = `&translateY=${y_var}`;
    return base + radius + seed + flip + rotate + scale + colour +
        colour2 + backgroundType + backgroundRotation + x + y;
}

function createExtras(extras) {
    //console.log(extras);
    let options = [];
    Object.entries(extras).forEach(([key_var, val_var]) => {
        const key = `${key_var}`;
        const val = `${val_var}`;
        const left =
            key.includes('Colour') ? key.replace('Colour', 'Color') :
            key.includes('moustache') ? key.replace('moustache', 'mustache') : key;
        const right =
            val.startsWith('#') ? val.slice(1) :
            val.includes('moustache') ? val.replace('moustache', 'mustache') : val;
        options.push(`&${left}=${right}`);
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
        curr_setup['background'],
        curr_setup['background2'],
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

    const theme = curr_setup['theme'];
    let words = [];
    theme.split('-').forEach(w => words.push(startUpper(w)));
    const option = header(
        'h2', words.join(' '), '', `theme_option`, `avatar_option_text`
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

    renderTheme(
        theme,
        otherOptions,
        Object.entries(allDiceBearOptions[theme])
        .filter(([key, _]) => !baseProperties.includes(key)),
        curr_setup['extras']
    )
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

    const base = document.getElementById('avatar_base');
    base.innerHTML = '';
    renderBaseOptions(base);
    renderTheme(key, section, props, curr_setup['extras']);
    updateAvatar();
}

function renderTheme(key, section, props, curr) {
    if (key == 'adventurer') {
        renderAdventurer(section, props, curr);
    } else if (key == 'adventurer-neutral') {
        renderAdventurerNeutral(section, props, curr);
    } else if (key == 'avataaars') {
        renderAvataaars(section, props, curr);
    } else if (key == 'avataaars-neutral') {
        renderAvataaarsNeutral(section, props, curr);
    } else if (key == 'big-ears') {
        renderBigEars(section, props, curr);
    } else if (key == 'big-ears-neutral') {
        renderBigEarsNeutral(section, props, curr);
    } else if (key == 'big-smile') {
        renderBigSmile(section, props, curr);
    } else if (key == 'bottts') {
        renderBottts(section, props, curr);
    } else if (key == 'bottts-neutral') {
        renderBotttsNeutral(section, props, curr);
    } else if (key == 'croodles') {
        renderCroodles(section, props, curr);
    } else if (key == 'croodles-neutral') {
        renderCroodlesNeutral(section, props, curr);
    } else if (key == 'dylan') {
        renderDylan(section, props, curr);
    } else if (key == 'fun-emoji') {
        renderFunEmoji(section, props, curr);
    } else if (key == 'glass') {
        renderGlass(section, props, curr);
    } else if (key == 'icons') {
        renderIcons(section, props, curr);
    } else if (key == 'identicon') {
        renderIdenticon(section, props, curr);
    } else if (key == 'lorelei') {
        renderLorelei(section, props, curr);
    } else if (key == 'lorelei-neutral') {
        renderLoreleiNeutral(section, props, curr);
    } else if (key == 'micah') {
        renderMicah(section, props, curr);
    } else if (key == 'miniavs') {
        renderMiniavs(section, props, curr);
    } else if (key == 'notionists') {
        renderNotionists(section, props, curr);
    } else if (key == 'notionists-neutral') {
        renderNotionistsNeutral(section, props, curr);
    } else if (key == 'open-peeps') {
        renderOpenPeeps(section, props, curr);
    } else if (key == 'personas') {
        renderPersonas(section, props, curr);
    } else if (key == 'pixel-art') {
        renderPixelArt(section, props, curr);
    } else if (key == 'pixel-art-neutral') {
        renderPixelArtNeutral(section, props, curr);
    } else if (key == 'rings') {
        renderRings(section, props, curr);
    } else if (key == 'shapes') {
        renderShapes(section, props, curr);
    } else if (key == 'thumbs') {
        renderThumbs(section, props, curr);
    }
}

function renderBaseOptions(div) {
    const def_flip = curr_setup['flip'] ?? 'false';
    setupSwitch(div, 'flip', def_flip);

    const def_rotate = curr_setup['rotate'] ?? 0;
    const rotate = basicDiceBearOptions['rotate'];
    setupSlider(
        div, 'rotate', rotate.minimum,
        rotate.maximum, def_rotate, 5
    );
    
    const def_scale = curr_setup['scale'] ?? 100;
    const scale = basicDiceBearOptions['scale'];
    setupSlider(
        div, 'scale', scale.minimum, scale.maximum, def_scale, 5
    );
    
    const def_x = curr_setup['translateX'] ?? 0;
    const x = basicDiceBearOptions['translateX'];
    setupSlider(
        div, 'translateX', x.minimum, x.maximum, def_x, 5
    );
    
    const def_y = curr_setup['translateY'] ?? 0;
    const y = basicDiceBearOptions['translateY'];
    setupSlider(
        div, 'translateY', y.minimum, y.maximum, def_y, 5
    );

    const def_bg = curr_setup['background'] ?? '#FFFFFF';
    setupColour(div, 'backgroundColour', def_bg);
    
    const def_bg_type = curr_setup['backgroundType'] ?? 'solid';
    const bg_type = ['solid', 'gradientLinear'];
    setupGallery(div, 'backgroundType', bg_type, def_bg_type, false);
    
    const def_bg_rot = curr_setup['backgroundRotation'] ?? 0;
    setupSlider(
        div, 'backgroundRotation', 0,
        360, def_bg_rot, 5
    );

    const def_bg_2 = curr_setup['background2'] ?? '#FFFFFF';
    setupColour(div, 'backgroundColour2', def_bg_2);
}

function updateBaseOptions(key) {
    const colour = key == 'icons' ? '#000000' : '#FFFFFF';
    const div = document.querySelector('.background_colour_div');
    const grad = document.querySelector('.gradient_colour_div');
    const parent = div.parentElement;
    div.remove();
    grad.remove();
    setupColour(parent, 'backgroundColour', colour);
    setupColour(parent, 'backgroundColour2', '#FFFFFF');
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
                curr_setup['extras'][`${key}Probability`] = '0';
            } else {
                curr_setup['extras'][key] = `${val}`;
                curr_setup['extras'][`${key}Probability`] = '100';
            }
        } else if (key == 'backgroundType') {
            curr_setup['backgroundType'] = `${val}`;
        } else {
            curr_setup['extras'][key] = `${val}`;
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
            const rot = document.querySelector('.background_rotation');
            const grad = document.querySelector('.gradient_colour_div');
            if (options[i] == 'gradientLinear') {
                rot.style.display = 'flex';
                grad.style.display = 'flex';
            } else {
                rot.style.display = 'none';
                grad.style.display = 'none';
            }
        }
        updateSetup(options[i]);
        updateAvatar();
    }

    updateSetup(initial);
    options = options.sort();

    const section = document.createElement('div');
    section.id = `${key}_section`;
    if (baseProperties.includes(key)) {
        section.className = 'avatar_options_section base';
    } else {
        section.className = 'avatar_options_section';
    }
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
    const def = colour.startsWith('#') ? `${colour.slice(1)}` :
        colour.length == 6 ? `${colour}` : '000000';

    const updateSetup = (val) => {
        const col = val.startsWith('#') ? `${val.slice(1)}` :
            val.length == 6 ? `${val}` : '';
        if (key == 'backgroundColour') {
            curr_setup['background'] = col;
        } else if (key == 'backgroundColour2') {
            curr_setup['background2'] = col;
        } else {
            curr_setup['extras'][key] = col;
        }
    };

    const type = key.split('Colour')[0];
    let text = '';

    const section = document.createElement('div');
    section.id = 'colour_section';
    if (key == 'backgroundColour') {
        section.style.display = 'flex';
        section.className = 'avatar_options_section background_colour_div base';
        text = `Background Colour:`
    } else if (key == 'backgroundColour2') {
        section.style.display = curr_setup['backgroundType'] == 'gradientLinear' ?
            'flex' : 'none';
        section.className = 'avatar_options_section gradient_colour_div base';
        text = `Background Colour 2:`
    } else {
        section.style.display = 'flex';
        section.className = 'avatar_options_section';
        text = `${splitCapitals(type)} Colour:`
    }
    div.appendChild(section);

    section.appendChild(header(
        'h2', text, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = 'colour_options';
    options.className = 'avatar_option';
    section.appendChild(options);

    updateSetup(def);
    const colourHeader = header(
        'h2', `#${def}`, '', 'colour_option', 'avatar_option_text'
    );
    options.appendChild(colourHeader);
    
    const option = document.createElement('input');
    option.id = 'avatar_colour';
    option.type = 'color';
    option.value = `#${def}`;
    options.appendChild(option);
    console.log(key, ' - ', def);

    option.addEventListener('input', (e) => {
        colourHeader.innerHTML = e.target.value;
        updateSetup(e.target.value);
        updateAvatar();
    });
}

function setupSwitch(div, key, def) {
    const updateSetup = (val) => {
        if (baseProperties.includes(key)) {
            curr_setup[key] = `${val}`;
        } else {
            curr_setup['extras'][key] = `${val}`;
        }
    };
    
    updateSetup(def);
    const section = document.createElement('div');
    section.id = 'switch_section';
    if (key == 'flip') {
        section.className = 'avatar_options_section base';
    } else {
        section.className = 'avatar_options_section';
    }
    div.appendChild(section);

    section.appendChild(header(
        'h2', `${splitCapitals(key)}:`, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = 'switch_options';
    options.className = 'avatar_option';
    section.appendChild(options);

    const text = def == 'true' ? 'Flipped' : 'Normal';
    const switchHeader = header(
        'h2', text, '', 'switch_option', 'avatar_option_text'
    );
    options.appendChild(switchHeader);

    switchHeader.addEventListener('click', () => {
        if (switchHeader.innerHTML == 'Normal') {
            switchHeader.innerHTML = 'Flipped';
            updateSetup('true');
        } else {
            switchHeader.innerHTML = 'Normal';
            updateSetup('false');
        }
        updateAvatar();
    });
    
    /*const option = document.createElement('input');
    option.id = 'avatar_switch';
    option.type = 'checkbox';
    options.appendChild(option);

    option.addEventListener('input', (e) => {
        switchHeader.innerHTML = option.checked ? 'Flipped' : 'Normal';
        updateSetup(`${option.checked}`);
        updateAvatar();
    });*/
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
        section.className = 'avatar_options_section background_rotation base';
        section.style.display = curr_setup['backgroundType'] == 'gradientLinear' ?
            'flex' : 'none';
    } else if (baseProperties.includes(key)) {
        section.className = 'avatar_options_section base';
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

function renderAdventurer(div, props, curr) {
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
    setupColour(div, 'hairColour', '#724133');

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant01', false);

    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Adventurer Neutral
// 


// #region

function renderAdventurerNeutral(div, props, curr) {
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

function renderAvataaars(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('avataaars');

    let accessories = getItems(props, 'accessories').enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, 'None', true);
    setupColour(div, 'accessoriesColour', '#000000');
    
    setupColour(div, 'clothesColour', '#000000');
    
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
    setupColour(div, 'facialHairColour', '#000000');
    
    setupColour(div, 'hairColour', '#724133');
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'default', false);
    
    setupColour(div, 'skinColour', '#EDB98A');
    
    let top = getItems(props, 'top').enum;
    setupGallery(div, 'top', top, 'shortFlat', false);
    // TODO: if top is hat, hijab, turban, winterHat1, winterHat02, winterHat03, winerHat04, add hatColour
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Avataaars Neutral
// 


// #region

function renderAvataaarsNeutral(div, props, curr) {
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

function renderBigEars(div, props, curr) {
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
    setupColour(div, 'hairColour', '#724133');
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant0101', false);
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
    
    let sideburn = getItems(props, 'sideburn').enum;
    setupGallery(div, 'sideburn', sideburn, 'variant01', false);

    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Big Ears Neutral
// 


// #region

function renderBigEarsNeutral(div, props, curr) {
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

function renderBigSmile(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('big-smile');

    let accessories = getItems(props, 'accessories').enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, 'None', true);

    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'normal', false);

    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'shortHair', false);
    setupColour(div, 'hairColour', '#724133');

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'awkwardSmile', false);

    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Bottts
// 


// #region

function renderBottts(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('bottts');
    console.log(curr);

    const def_baseColour = curr['baseColour'] ?? '#EDB98A';
    setupColour(div, 'baseColour', def_baseColour);
    
    const def_eyes = curr['eyes'] ?? 'eva';
    const eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    const def_face = curr['face'] ?? 'round01';
    const face = getItems(props, 'face').enum;
    setupGallery(div, 'face', face, def_face, false);
    
    const def_mouth = curr['mouthProbability'] == '0' ?
        'None' : curr['mouth'] ?? 'bite';
    const mouth = getItems(props, 'mouth').enum;
    mouth.push('None');
    setupGallery(div, 'mouth', mouth, def_mouth, true);
    
    const def_sides = curr['sidesProbability'] == '0' ?
        'None' : curr['sides'] ?? 'None';
    const sides = getItems(props, 'sides').enum;
    sides.push('None');
    setupGallery(div, 'sides', sides, def_sides, true);

    const def_texture = curr['textureProbability'] == '0' ?
        'None' : curr['texture'] ?? 'None';
    const texture = getItems(props, 'texture').enum;
    texture.push('None');
    setupGallery(div, 'texture', texture, def_texture, true);
        
    const def_top = curr['topProbability'] == '0' ?
        'None' : curr['top'] ?? 'None';
    const top = getItems(props, 'top').enum;
    top.push('None');
    setupGallery(div, 'top', top, def_top, true);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Bottts Neutral
// 


// #region

function renderBotttsNeutral(div, props, curr) {
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

function renderCroodles(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('croodles');

    setupColour(div, 'baseColour', '#EDB98A');
    
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
    setupColour(div, 'topColour', '#000000');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Croodles Neutral
// 


// #region

function renderCroodlesNeutral(div, props, curr) {
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

function renderDylan(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('dylan');

    const facialHair = ['None', 'default'];
    setupGallery(div, 'facialHair', facialHair, 'None', true);
    
    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'plain', false);
    setupColour(div, 'hairColour', '#724133');
    
    let mood = getItems(props, 'mood').enum;
    setupGallery(div, 'mood', mood, 'neutral', false);

    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Fun Emoji
// 


// #region

function renderFunEmoji(div, props, curr) {
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

function renderGlass(div, props, curr) {
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

function renderIcons(div, props, curr) {
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

function renderIdenticon(div, props, curr) {
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

    setupColour(div, 'rowColour', '#000000');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei
// 


// #region

function renderLorelei(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('lorelei');

    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    setupGallery(div, 'beard', beard, 'None', true);

    let earrings = getItems(props, 'earrings').enum;
    earrings.push('None');
    setupGallery(div, 'earrings', earrings, 'None', true);
    setupColour(div, 'earringsColour', '#000000');

    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'variant01', false);
    setupColour(div, 'eyebrowsColour', '#000000');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    setupColour(div, 'eyesColour', '#000000');
    
    let freckles = getItems(props, 'freckles').enum;
    freckles.push('None');
    setupGallery(div, 'freckles', freckles, 'None', true);
    setupColour(div, 'frecklesColour', '#000000');

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    setupColour(div, 'glassesColour', '#000000');

    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'variant01', false);
    setupColour(div, 'hairColour', '#724133');

    let hairAccessories = getItems(props, 'hairAccessories').enum;
    hairAccessories.push('None');
    setupGallery(div, 'hairAccessories', hairAccessories, 'None', true);
    setupColour(div, 'hairAccessoriesColour', '#000000');
    
    let head = getItems(props, 'head').enum;
    setupGallery(div, 'head', head, 'variant01', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'happy01', false);
    setupColour(div, 'mouthColour', '#000000');
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
    setupColour(div, 'noseColour', '#000000');
    
    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Lorelei Neutral
// 


// #region

function renderLoreleiNeutral(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('lorelei-neutral');

    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'variant01', false);
    setupColour(div, 'eyebrowsColour', '#000000');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    setupColour(div, 'eyesColour', '#000000');
    
    let freckles = getItems(props, 'freckles').enum;
    freckles.push('None');
    setupGallery(div, 'freckles', freckles, 'None', true);
    setupColour(div, 'frecklesColour', '#000000');

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    setupColour(div, 'glassesColour', '#000000');
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'happy01', false);
    setupColour(div, 'mouthColour', '#000000');
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
    setupColour(div, 'noseColour', '#000000');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Micah
//


// #region

function renderMicah(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('micah');

    setupColour(div, 'baseColour', '#EDB98A');

    let earrings = getItems(props, 'earrings').enum;
    earrings.push('None');
    setupGallery(div, 'earrings', earrings, 'None', true);
    setupColour(div, 'earringColour', '#000000');

    let ears = getItems(props, 'ears').enum;
    setupGallery(div, 'ears', ears, 'attached', false);

    setupColour(div, 'eyeShadowColour', '#000000');

    let eyebrows = getItems(props, 'eyebrows').enum;
    setupGallery(div, 'eyebrows', eyebrows, 'up', false);
    setupColour(div, 'eyebrowsColour', '#000000');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'eyes', false);
    setupColour(div, 'eyesColour', '#000000');
    
    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    setupGallery(div, 'facialHair', facialHair, 'None', true);
    setupColour(div, 'facialHairColour', '#000000');

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    setupColour(div, 'glassesColour', '#000000');
    
    let hair = getItems(props, 'hair').enum;
    hair.push('None');
    setupGallery(div, 'hair', hair, 'dannyPhantom', true);
    setupColour(div, 'hairColour', '#724133');
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'smile', false);
    setupColour(div, 'mouthColour', '#000000');

    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'curve', false);

    let shirt = getItems(props, 'shirt').enum;
    setupGallery(div, 'shirt', shirt, 'collared', false);
    setupColour(div, 'shirtColour', '#000000');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Miniavs
// 


// #region

function renderMiniavs(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('micah');
    
    let blushes = ['None', 'default'];
    setupGallery(div, 'blushes', blushes, 'None', true);

    let body = getItems(props, 'body').enum;
    setupGallery(div, 'body', body, 'tShirt', false);
    setupColour(div, 'bodyColour', '#000000');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'normal', false);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    
    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'classic01', false);
    setupColour(div, 'hairColour', '#724133');

    let head = getItems(props, 'head').enum;
    setupGallery(div, 'head', head, 'normal', false);
    
    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'default', false);

    let moustache = getItems(props, 'moustache').enum;
    moustache.push('None');
    setupGallery(div, 'moustache', moustache, 'None', true);

    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Notionists
// 


// #region

function renderNotionists(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('notionists');
    
    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    setupGallery(div, 'beard', beard, 'None', true);
    
    let body = getItems(props, 'body').enum;
    setupGallery(div, 'body', body, 'variant01', false);
    
    let bodyIcon = getItems(props, 'bodyIcon').enum;
    bodyIcon.push('None');
    setupGallery(div, 'bodyIcon', bodyIcon, 'None', true);
    
    let brows = getItems(props, 'brows').enum;
    setupGallery(div, 'brows', brows, 'variant01', false);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);

    let gesture = getItems(props, 'gesture').enum;
    gesture.push('None');
    setupGallery(div, 'gesture', gesture, 'None', true);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    
    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'variant01', false);
    
    let lips = getItems(props, 'lips').enum;
    setupGallery(div, 'lips', lips, 'variant01', false);
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Notionists Neutral
// 


// #region

function renderNotionistsNeutral(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('notionists-neutral');
    
    let brows = getItems(props, 'brows').enum;
    setupGallery(div, 'brows', brows, 'variant01', false);
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    
    let lips = getItems(props, 'lips').enum;
    setupGallery(div, 'lips', lips, 'variant01', false);
    
    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'variant01', false);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Open Peeps
// 


// #region

function renderOpenPeeps(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('open-peeps');

    let accessories = getItems(props, 'accessories').enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, 'None', true);
    
    setupColour(div, 'clothingColour', '#000000');
    
    let face = getItems(props, 'face').enum;
    setupGallery(div, 'face', face, 'smile', false);
    
    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    setupGallery(div, 'facialHair', facialHair, 'None', true);
    
    let head = getItems(props, 'head').enum;
    setupGallery(div, 'head', head, 'short1', false);

    setupColour(div, 'headContrastColour', '#724133');
    
    let mask = getItems(props, 'mask').enum;
    mask.push('None');
    setupGallery(div, 'mask', mask, 'None', true);
    
    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Personas
// 


// #region

function renderPersonas(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('personas');

    let body = getItems(props, 'body').enum;
    setupGallery(div, 'body', body, 'rounded', false);
    
    setupColour(div, 'clothingColour', '#000000');

    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'open', false);

    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    setupGallery(div, 'facialHair', facialHair, 'None', true);

    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'shortCombover', false);
    setupColour(div, 'hairColour', '#724133');

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'smile', false);

    let nose = getItems(props, 'nose').enum;
    setupGallery(div, 'nose', nose, 'smallRound', false);
    
    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Pixel Art
// 


// #region

function renderPixelArt(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('pixel-art');

    let accessories = getItems(props, 'accessories').enum;
    accessories.push('None');
    setupGallery(div, 'accessories', accessories, 'None', true);
    setupColour(div, 'accessoriesColour', '#000000');

    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    setupGallery(div, 'beard', beard, 'None', true);
    
    let clothing = getItems(props, 'clothing').enum;
    setupGallery(div, 'clothing', clothing, 'variant01', false);
    setupColour(div, 'clothingColour', '#000000');
    
    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    setupColour(div, 'eyesColour', '#000000');
    
    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    setupColour(div, 'glassesColour', '#000000');
    
    let hair = getItems(props, 'hair').enum;
    setupGallery(div, 'hair', hair, 'short01', false);
    setupColour(div, 'hairColour', '#724133');
    
    let hat = getItems(props, 'hat').enum;
    hat.push('None');
    setupGallery(div, 'hat', hat, 'None', true);
    setupColour(div, 'hatColour', '#000000');

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'happy01', false);
    setupColour(div, 'mouthColour', '#000000');
    
    setupColour(div, 'skinColour', '#EDB98A');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Pixel Art Neutral
// 


// #region

function renderPixelArtNeutral(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('pixel-art-neutral');

    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant01', false);
    setupColour(div, 'eyesColour', '#000000');
    
    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    setupGallery(div, 'glasses', glasses, 'None', true);
    setupColour(div, 'glassesColour', '#000000');

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'happy01', false);
    setupColour(div, 'mouthColour', '#000000');
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Rings
// 


// #region

function renderRings(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('rings');

    setupColour(div, 'ringColour', '#000000');

    let ring1 = getItems(props, 'ringOne').enum;
    setupGallery(div, 'ringOne', ring1, 'full', false);

    const ring1Rot = getItems(props, 'ringOneRotation');
    setupSlider(
        div, 'ringOneRotation', ring1Rot.minimum,
        ring1Rot.maximum, ring1Rot?.default ?? null, 5
    );

    let ring2 = getItems(props, 'ringTwo').enum;
    setupGallery(div, 'ringTwo', ring2, 'full', false);

    const ring2Rot = getItems(props, 'ringTwoRotation');
    setupSlider(
        div, 'ringTwoRotation', ring2Rot.minimum,
        ring2Rot.maximum, ring2Rot?.default ?? null, 5
    );

    let ring3 = getItems(props, 'ringThree').enum;
    setupGallery(div, 'ringThree', ring3, 'full', false);

    const ring3Rot = getItems(props, 'ringThreeRotation');
    setupSlider(
        div, 'ringThreeRotation', ring3Rot.minimum,
        ring3Rot.maximum, ring3Rot?.default ?? null, 5
    );

    let ring4 = getItems(props, 'ringFour').enum;
    setupGallery(div, 'ringFour', ring4, 'full', false);

    const ring4Rot = getItems(props, 'ringFourRotation');
    setupSlider(
        div, 'ringFourRotation', ring4Rot.minimum,
        ring4Rot.maximum, ring4Rot?.default ?? null, 5
    );

    let ring5 = getItems(props, 'ringFive').enum;
    setupGallery(div, 'ringFive', ring5, 'full', false);

    const ring5Rot = getItems(props, 'ringFiveRotation');
    setupSlider(
        div, 'ringFiveRotation', ring5Rot.minimum,
        ring5Rot.maximum, ring5Rot?.default ?? null, 5
    );
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Shapes
// 


// #region

function renderShapes(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('shapes');

    let shape1 = getItems(props, 'shape1').enum;
    setupGallery(div, 'shape1', shape1, 'ellipse', false);
    setupColour(div, 'shape1Colour', '#000000');
    
    const shape1X = getItems(props, 'shape1OffsetX');
    setupSlider(
        div, 'shape1OffsetX', shape1X.minimum,
        shape1X.maximum, shape1X?.default ?? null, 5
    );
    
    const shape1Y = getItems(props, 'shape1OffsetY');
    setupSlider(
        div, 'shape1OffsetY', shape1Y.minimum,
        shape1Y.maximum, shape1Y?.default ?? null, 5
    );
    
    const shape1Rot = getItems(props, 'shape1Rotation');
    setupSlider(
        div, 'shape1Rotation', shape1Rot.minimum,
        shape1Rot.maximum, shape1Rot?.default ?? null, 5
    );

    let shape2 = getItems(props, 'shape2').enum;
    setupGallery(div, 'shape2', shape2, 'ellipse', false);
    setupColour(div, 'shape2Colour', '#000000');
    
    const shape2X = getItems(props, 'shape2OffsetX');
    setupSlider(
        div, 'shape2OffsetX', shape2X.minimum,
        shape2X.maximum, shape2X?.default ?? null, 5
    );
    
    const shape2Y = getItems(props, 'shape2OffsetY');
    setupSlider(
        div, 'shape2OffsetY', shape2Y.minimum,
        shape2Y.maximum, shape2Y?.default ?? null, 5
    );
    
    const shape2Rot = getItems(props, 'shape2Rotation');
    setupSlider(
        div, 'shape2Rotation', shape2Rot.minimum,
        shape2Rot.maximum, shape2Rot?.default ?? null, 5
    );

    let shape3 = getItems(props, 'shape3').enum;
    setupGallery(div, 'shape3', shape3, 'ellipse', false);
    setupColour(div, 'shape3Colour', '#000000');
    
    const shape3X = getItems(props, 'shape3OffsetX');
    setupSlider(
        div, 'shape3OffsetX', shape3X.minimum,
        shape3X.maximum, shape3X?.default ?? null, 5
    );
    
    const shape3Y = getItems(props, 'shape3OffsetY');
    setupSlider(
        div, 'shape3OffsetY', shape3Y.minimum,
        shape3Y.maximum, shape3Y?.default ?? null, 5
    );
    
    const shape3Rot = getItems(props, 'shape3Rotation');
    setupSlider(
        div, 'shape3Rotation', shape3Rot.minimum,
        shape3Rot.maximum, shape3Rot?.default ?? null, 5
    );
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Thumbs
// 


// #region

function renderThumbs(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('thumbs');

    let eyes = getItems(props, 'eyes').enum;
    setupGallery(div, 'eyes', eyes, 'variant5W10', false);
    setupColour(div, 'eyesColour', '#000000');

    let face = getItems(props, 'face').enum;
    setupGallery(div, 'face', face, 'variant1', false);
    
    const faceX = getItems(props, 'faceOffsetX');
    setupSlider(
        div, 'faceOffsetX', faceX.minimum,
        faceX.maximum, faceX?.default ?? null, 5
    );
    
    const faceY = getItems(props, 'faceOffsetY');
    setupSlider(
        div, 'faceOffsetY', faceY.minimum,
        faceY.maximum, faceY?.default ?? null, 5
    );
    
    const faceRot = getItems(props, 'faceRotation');
    setupSlider(
        div, 'faceRotation', faceRot.minimum,
        faceRot.maximum, faceRot?.default ?? null, 5
    );

    let mouth = getItems(props, 'mouth').enum;
    setupGallery(div, 'mouth', mouth, 'variant1', false);
    setupColour(div, 'mouthColour', '#000000');

    setupColour(div, 'shapeColour', '#000000');
    
    const shapeX = getItems(props, 'shapeOffsetX');
    setupSlider(
        div, 'shapeOffsetX', shapeX.minimum,
        shapeX.maximum, shapeX?.default ?? null, 5
    );
    
    const shapeY = getItems(props, 'shapeOffsetY');
    setupSlider(
        div, 'shapeOffsetY', shapeY.minimum,
        shapeY.maximum, shapeY?.default ?? null, 5
    );
    
    const shapeRot = getItems(props, 'shapeRotation');
    setupSlider(
        div, 'shapeRotation', shapeRot.minimum,
        shapeRot.maximum, shapeRot?.default ?? null, 5
    );
}

// #endregion

