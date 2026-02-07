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
import { renderUserProfile, setupUserModal, backArrow } from './user.js';
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
import { toonHead } from './themes/toon_head.js';
import { BASE_ROUTE } from './config.js';

let route = `${BASE_ROUTE}/api/user`;

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
    'thumbs': thumbs.properties,
    'toon-head': toonHead.properties
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

/*export function renderSwapAvatarPage(div, user) {
    div.innerHTML = '';
    const title = document.getElementById('user-profile-title');
    title.textContent = 'Swap Avatar';

    backArrow('show');

    /*const filters_div = document.createElement('div');
    filters_div.id = 'user_avatar_filters';
    div.appendChild(filters_div);* /

    const avatar_div = document.createElement('div');
    avatar_div.id = 'swap_avatar_div';
    div.appendChild(avatar_div);

    console.log(user);
    const avatars = document.createElement('div');
    avatars.id = 'user_avatar_options';
    avatar_div.appendChild(avatars);

    let sorting = 'custom';
    const curr = user.avatar_seed;
    let options = user.avatars ?? [];
    options.sort((a, b) => {
        if (sorting == 'custom') return a.custom_order - b.custom_order;
        if (sorting == 'seed') return a.seed.localeCompare(b.seed);
        if (sorting == 'time') return b.created_at - a.created_at;
        return true;
    }).forEach(o => {
        const avatar = document.createElement('img');
        if (o.seed == curr) {
            avatar.className = 'user_avatar_option user_avatar_option_selected';
        } else {
            avatar.className = 'user_avatar_option';
        }
        avatar.src = o.seed;
        avatars.appendChild(avatar);
        avatar.addEventListener('click', async () => {
            if (o.seed == curr) {
                avatar.className = 'user_avatar_option user_avatar_option_selected';
            } else {
                avatar.className = 'user_avatar_option';
            }
            const res = await fetch(`${route}/change/avatar`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player_id: user.player_id,
                    avatar: o.seed
                })
            });
            const data = await res.json();
            if (data.avatar == o.seed) {
                user.avatar_seed = o.seed;
                renderUserProfile(div, user);
            }
            const pfp = document.getElementById('profile-pic');
            pfp.src = o.seed;
        });
    });
}*/

export function renderSwapAvatarPage(div, user) {
    div.innerHTML = '';
    const title = document.getElementById('user-profile-title');
    title.textContent = 'Swap Avatar';

    backArrow('show');

    const avatar_div = document.createElement('div');
    avatar_div.id = 'swap_avatar_div';
    div.appendChild(avatar_div);

    /* ---------- STATE ---------- */
    let sorting = 'custom';
    let isEditingOrder = false;

    const curr = user.avatar_seed;
    let options = [...(user.avatars ?? [])];

    /* ---------- SORT CONTROLS ---------- */
    const controls = document.createElement('div');
    controls.id = 'avatar_controls';

    const sortSelect = document.createElement('select');
    sortSelect.className = 'user-input';
    ['custom', 'theme', 'time'].forEach(v => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v.charAt(0).toUpperCase() + v.slice(1);
        sortSelect.appendChild(opt);
    });

    sortSelect.value = sorting;
    sortSelect.addEventListener('change', () => {
        sorting = sortSelect.value;
        isEditingOrder = false;
        renderAvatars();
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit Order';
    editBtn.className = 'user-button user-input';
    editBtn.style.display = sorting === 'custom' ? 'block' : 'none';

    editBtn.addEventListener('click', async () => {
        if (!isEditingOrder) {
            isEditingOrder = true;
            editBtn.textContent = 'Save Order';
            enableDrag();
        } else {
            isEditingOrder = false;
            editBtn.textContent = 'Edit Order';
            saveCustomOrder();
            disableDrag();
        }
    });

    controls.appendChild(sortSelect);
    controls.appendChild(editBtn);
    div.appendChild(controls);

    /* ---------- AVATAR CONTAINER ---------- */
    const avatars = document.createElement('div');
    avatars.id = 'user_avatar_options';
    avatar_div.appendChild(avatars);

    /* ---------- RENDER ---------- */
    function renderAvatars() {
        avatars.innerHTML = '';

        editBtn.style.display = sorting === 'custom' ? 'block' : 'none';

        options
            .sort((a, b) => {
                if (sorting === 'custom') return a.custom_order - b.custom_order;
                if (sorting === 'theme') return a.seed.localeCompare(b.seed);
                if (sorting === 'time') return b.created_at - a.created_at;
                return 0;
            })
            .forEach(o => {
                const avatar = document.createElement('img');
                avatar.src = o.seed;
                avatar.dataset.seed = o.seed;
                avatar.className =
                    o.seed === curr
                        ? 'user_avatar_option user_avatar_option_selected'
                        : 'user_avatar_option';

                avatar.addEventListener('click', async () => {
                    if (isEditingOrder) return;

                    const res = await fetch(`${route}/change/avatar`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            player_id: user.player_id,
                            avatar: o.seed
                        })
                    });

                    const data = await res.json();
                    if (data.avatar === o.seed) {
                        user.avatar_seed = o.seed;
                        renderAvatars();
                        //renderUserProfile(div, user);
                    }

                    document.getElementById('profile-pic').src = o.seed;
                });

                avatars.appendChild(avatar);
            });

        if (isEditingOrder) enableDrag();
    }

    /* ---------- DRAG & DROP ---------- */
    function enableDrag() {
        [...avatars.children].forEach(el => {
            el.draggable = true;

            el.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', el.dataset.seed);
                el.classList.add('dragging');
            });

            el.addEventListener('dragend', () => {
                el.classList.remove('dragging');
            });

            el.addEventListener('dragover', e => {
                e.preventDefault();
                const dragging = avatars.querySelector('.dragging');
                if (dragging && el !== dragging) {
                    avatars.insertBefore(dragging, el);
                }
            });
        });
    }

    function disableDrag() {
        [...avatars.children].forEach(el => {
            el.draggable = false;
        });
    }

    /* ---------- SAVE ORDER ---------- */
    async function saveCustomOrder() {
        options = [...avatars.children].map((el, i) => {
            const avatar = options.find(o => o.seed === el.dataset.seed);
            avatar.custom_order = i;
            return avatar;
        });

        await fetch(`${route}/change/avatar_order`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player_id: user.player_id,
                order: options.map(o => ({
                    seed: o.seed,
                    custom_order: o.custom_order
                }))
            })
        });
    }

    renderAvatars();
}

export function renderAvatarPage(div, user, type) {
    div.innerHTML = '';

    const title = document.getElementById('user-profile-title');
    backArrow('show');

    if (type == 'creating') {
        title.textContent = 'Creating Avatar';
    } else if (type == 'updating') {
        title.textContent = 'Updating Avatar';
        getCurrSetupFromSeed(user.avatar_seed);
    } else {

    }

    const avatar_div = document.createElement('div');
    avatar_div.id = 'avatar_div';
    div.appendChild(avatar_div);

    const avatar_pb_div = document.createElement('div');
    avatar_pb_div.id = 'avatar_preview_and_base';
    avatar_div.appendChild(avatar_pb_div);

    const avatar_preview = document.createElement('img');
    avatar_preview.id = 'avatar_preview';
    avatar_preview.src = createLink();
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

function createLink() {
    const base = `https://api.dicebear.com/9.x/`;
    const theme = `${curr_setup['theme']}`;
    const radius = `/svg?radius=50`;
    const seed = `&seed=${curr_setup['seed']}`;
    const flip = `&flip=${curr_setup['flip']}`;
    const rotate = `&rotate=${curr_setup['rotate']}`;
    const scale = `&scale=${curr_setup['scale']}`;
    const curr_colour = curr_setup['background'];
    const colour = curr_colour == '' || curr_colour == '[]' ? `&backgroundColor[]` : 
        curr_colour.startsWith('#') ? `&backgroundColor=${curr_colour.slice(1)}` :
        curr_colour.length == 6 ? `&backgroundColor=${curr_colour}` : '';

    let colour2 = '';
    let bgRot = '';
    if (curr_setup['backgroundType'] == 'gradientLinear') {
        const colour_var_2 = curr_setup['background2'];
        if (colour_var_2.startsWith('#')) {
            colour2 = `,${colour_var_2.slice(1)}`;
        } else if (colour_var_2.length == 6) {
            colour2 = `,${colour_var_2}`;
        }
        bgRot = `&backgroundRotation=${curr_setup['backgroundRotation']}`;
    }

    const bgType = `&backgroundType=${curr_setup['backgroundType']}`;
    const x = `&translateX=${curr_setup['translateX']}`;
    const y = `&translateY=${curr_setup['translateY']}`;

    let options = [];
    Object.entries(curr_setup['extras']).forEach(([key_var, val_var]) => {
        const key = `${key_var}`;
        const val = `${val_var}`;
        const left =
            key.includes('Colour') ? key.replace('Colour', 'Color') :
            key.includes('moustache') ? key.replace('moustache', 'mustache') : key;
        const right =
            val.startsWith('#') ? val.slice(1) :
            toOOrNotToO(theme, val) ? val.replace('oustache', 'ustache') : val;
        options.push(`&${left}=${right}`);
    });

    return base + theme + radius + seed + flip +
        rotate + scale + colour + colour2 +
        bgRot + bgType + x + y + options.join('');
}

function updateAvatar() {
    const preview = document.getElementById('avatar_preview');
    preview.src = createLink();
    console.log(curr_setup);
}

function toOOrNotToO(key, val) {
    if (key == 'adventurer') return val == 'moustache';
    if (key == 'big-smile') return val == 'moustache';
    if (key == 'personas') return val == 'beardMoustache';
    return false;
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
    'micah.base',
    'miniavs.blushes',
    'notionists.base',
    'rings.ring',
    'toon-head.body',
    'toon-head.head'
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

    const saveBtn = header(
        'button', 'Save Avatar', '', 'avatar-btn', 'user-button user-input'
    )
    div.appendChild(saveBtn);
    const preview = document.getElementById('avatar_preview');
    saveBtn.addEventListener('click', async () => {
        const res = await fetch(`${route}/change/avatar`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                player_id: curr_setup['seed'],
                avatar: preview.src
            })
        });
        const data = await res.json();
        if (data.avatar == preview.src) await setupUserModal();
        const pfp = document.getElementById('profile-pic');
        pfp.src = preview.src;
    });

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
    renderTheme(themes[i], section, props, curr_setup['extras']);
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
    } else if (key == 'toon-head') {
        renderToonHead(section, props, curr);
    }
}

function renderBaseOptions(div) {
    console.log('render base');

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
    const div = document.querySelector('.background_colour_div');
    const grad = document.querySelector('.gradient_colour_div');
    const parent = div.parentElement;
    div.remove();
    grad.remove();
    
    const colour = key == 'icons' ? '#000000' : '#FFFFFF';
    const def_colour = curr_setup['background'] ?? colour;
    setupColour(parent, 'backgroundColour', def_colour);

    const def_colour2 = curr_setup['background2'] ?? colour;
    setupColour(parent, 'backgroundColour2', def_colour2);
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
        options = [...new Set(options)];
        const curr = option.innerHTML;
        let i = options.indexOf(curr);
        if (dir == 'left') i -= 1;
        if (dir == 'right') i += 1;
        if (i == -1) i = options.length - 1;
        if (i == options.length) i = 0;
        console.log(i);
        console.log(options);
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
    const def_earrings = curr['earringsProbability'] == '0' ?
        'None' : curr['earrings'] ?? 'None';
    setupGallery(div, 'earrings', earrings, def_earrings, true);
    
    let eyebrows = getItems(props, 'eyebrows').enum;
    const def_eyebrows = curr['eyebrows'] ?? 'variant01';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let features = getItems(props, 'features').enum;
    features.push('None');
    const def_features = curr['featuresProbability'] == '0' ?
        'None' : curr['features'] ?? 'None';
    setupGallery(div, 'features', features, def_features, true);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);

    let hair = getItems(props, 'hair').enum;
    hair.push('None');
    const def_hair = curr['hairProbability'] == '0' ?
        'None' : curr['hair'] ?? 'short01';
    setupGallery(div, 'hair', hair, def_hair, true);

    const def_hair_colour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hair_colour);

    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'variant01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);

    const def_skin = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skin);
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
    const def_eyebrows = curr['eyebrows'] ?? 'variant01';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyebrows'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);

    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['eyebrows'] ?? 'variant01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
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
    const def_accessories = curr['accessoriesProbability'] == '0' ?
        'None' : curr['accessories'] ?? 'None';
    setupGallery(div, 'accessories', accessories, def_accessories, true);

    const def_accessories_colour = curr['accessoriesColour'] ?? '#000000';
    setupColour(div, 'accessoriesColour', def_accessories_colour);
    
    const def_clothes_colour = curr['clothesColour'] ?? '#000000';
    setupColour(div, 'clothesColour', def_clothes_colour);
    
    let clothing = getItems(props, 'clothing').enum;
    const def_clothing = curr['clothing'] ?? 'blazerAndShirt';
    setupGallery(div, 'clothing', clothing, def_clothing, false);
    
    let clothingGraphic = getItems(props, 'clothingGraphic').enum;
    const def_clothingGraphic = curr['clothingGraphic'] ?? 'diamond';
    setupGallery(div, 'clothingGraphic', clothingGraphic, def_clothingGraphic, false);
    
    let eyebrows = getItems(props, 'eyebrows').enum;
    const def_eyebrows = curr['eyebrows'] ?? 'default';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'default';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    const def_facialHair = curr['facialHairProbability'] == '0' ?
        'None' : curr['facialHair'] ?? 'None';
    setupGallery(div, 'facialHair', facialHair, def_facialHair, true);

    const def_facialHair_colour = curr['facialHairColour'] ?? '#724133';
    setupColour(div, 'facialHairColour', def_facialHair_colour);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'default';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
    
    let top = getItems(props, 'top').enum;
    const def_top = curr['top'] ?? 'shortFlat';
    setupGallery(div, 'top', top, def_top, false);
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
    const def_eyebrows = curr['eyebrows'] ?? 'default';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'default';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'default';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
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
    const def_cheek = curr['cheekProbability'] == '0' ?
        'None' : curr['cheek'] ?? 'None';
    setupGallery(div, 'cheek', cheek, def_cheek, true);
    
    let ear = getItems(props, 'ear').enum;
    const def_ear = curr['ear'] ?? 'variant01';
    setupGallery(div, 'ear', ear, def_ear, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let face = getItems(props, 'face').enum;
    const def_face = curr['face'] ?? 'variant01';
    setupGallery(div, 'face', face, def_face, false);

    let frontHair = getItems(props, 'frontHair').enum;
    const def_frontHair = curr['frontHair'] ?? 'variant01';
    setupGallery(div, 'frontHair', frontHair, def_frontHair, false);
    
    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'short01';
    setupGallery(div, 'hair', hair, def_hair, false);

    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'variant0101';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
    
    let sideburn = getItems(props, 'sideburn').enum;
    const def_sideburn = curr['sideburn'] ?? 'variant01';
    setupGallery(div, 'sideburn', sideburn, def_sideburn, false);

    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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
    const def_cheek = curr['cheekProbability'] == '0' ?
        'None' : curr['cheek'] ?? 'None';
    setupGallery(div, 'cheek', cheek, def_cheek, true);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'variant0101';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
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
    const def_accessories = curr['accessoriesProbability'] == '0' ?
        'None' : curr['accessories'] ?? 'None';
    setupGallery(div, 'accessories', accessories, def_accessories, true);

    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'normal';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'shortHair';
    setupGallery(div, 'hair', hair, def_hair, false);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);

    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'awkwardSmile';
    setupGallery(div, 'mouth', mouth, def_mouth, false);

    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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

    const def_baseColour = curr['baseColour'] ?? '#EDB98A';
    setupColour(div, 'baseColour', def_baseColour);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'eva';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let face = getItems(props, 'face').enum;
    const def_face = curr['face'] ?? 'round01';
    setupGallery(div, 'face', face, def_face, false);
    
    let mouth = getItems(props, 'mouth').enum;
    mouth.push('None');
    const def_mouth = curr['mouthProbability'] == '0' ?
        'None' : curr['mouth'] ?? 'bite';
    setupGallery(div, 'mouth', mouth, def_mouth, true);
    
    let sides = getItems(props, 'sides').enum;
    sides.push('None');
    const def_sides = curr['sidesProbability'] == '0' ?
        'None' : curr['sides'] ?? 'None';
    setupGallery(div, 'sides', sides, def_sides, true);

    let texture = getItems(props, 'texture').enum;
    texture.push('None');
    const def_texture = curr['textureProbability'] == '0' ?
        'None' : curr['texture'] ?? 'None';
    setupGallery(div, 'texture', texture, def_texture, true);
        
    let top = getItems(props, 'top').enum;
    top.push('None');
    const def_top = curr['topProbability'] == '0' ?
        'None' : curr['top'] ?? 'None';
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
    const def_eyes = curr['eyes'] ?? 'eva';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'bite';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
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

    const def_base = curr['baseColour'] ?? '#EDB98A';
    setupColour(div, 'baseColour', def_base);
    
    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    const def_beard = curr['beardProbability'] == '0' ?
        'None' : curr['beard'] ?? 'None';
    setupGallery(div, 'beard', beard, def_beard, true);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let face = getItems(props, 'face').enum;
    const def_face = curr['face'] ?? 'variant01';
    setupGallery(div, 'face', face, def_face, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'variant01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);

    let moustache = getItems(props, 'moustache').enum;
    moustache.push('None');
    const def_moustache = curr['moustacheProbability'] == '0' ?
        'None' : curr['moustache'] ?? 'None';
    setupGallery(div, 'moustache', moustache, def_moustache, true);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
    
    let top = getItems(props, 'top').enum;
    const def_top = curr['top'] ?? 'variant01';
    setupGallery(div, 'top', top, def_top, false);
    
    const def_topColour = curr['topColour'] ?? '#000000';
    setupColour(div, 'topColour', def_topColour);
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
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'variant01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
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
    const def_facialHair = curr['facialHairProbability'] == '0' ?
        'None' : curr['facialHair'] ?? 'None';
    setupGallery(div, 'facialHair', facialHair, def_facialHair, true);
    
    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'plain';
    setupGallery(div, 'hair', hair, def_hair, false);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);
    
    let mood = getItems(props, 'mood').enum;
    const def_mood = curr['mood'] ?? 'neutral';
    setupGallery(div, 'mood', mood, def_mood, false);

    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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
    const def_eyes = curr['eyes'] ?? 'plain';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'plain';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
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
    const def_shape1 = curr['shape1'] ?? 'a';
    setupGallery(div, 'shape1', shape1, def_shape1, false);
    
    const x1 = getItems(props, 'shape1OffsetX');
    const def_x1 = curr['shape1OffsetX'] ?? x1?.default ?? null;
    setupSlider(div, 'shape1OffsetX', x1.minimum, x1.maximum, def_x1, 5);
    
    const y1 = getItems(props, 'shape1OffsetY');
    const def_y1 = curr['shape1OffsetY'] ?? y1?.default ?? null;
    setupSlider(div, 'shape1OffsetY', y1.minimum, y1.maximum, def_y1, 5);
    
    const r1 = getItems(props, 'shape1Rotation');
    const def_r1 = curr['shape1Rotation'] ?? r1?.default ?? null;
    setupSlider(div, 'shape1Rotation', r1.minimum, r1.maximum, def_r1, 5);
    
    let shape2 = getItems(props, 'shape2').enum;
    const def_shape2 = curr['shape2'] ?? 'a';
    setupGallery(div, 'shape2', shape2, def_shape2, false);
    
    const x2 = getItems(props, 'shape2OffsetX');
    const def_x2 = curr['shape2OffsetX'] ?? x2?.default ?? null;
    setupSlider(div, 'shape2OffsetX', x2.minimum, x2.maximum, def_x2, 5);
    
    const y2 = getItems(props, 'shape2OffsetY');
    const def_y2 = curr['shape2OffsetY'] ?? y2?.default ?? null;
    setupSlider(div, 'shape2OffsetY', y2.minimum, y2.maximum, def_y2, 5);
    
    const r2 = getItems(props, 'shape2Rotation');
    const def_r2 = curr['shape2Rotation'] ?? r2?.default ?? null;
    setupSlider(div, 'shape2Rotation', r2.minimum, r2.maximum, def_r2, 5);
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
    const def_icon = curr['icon'] ?? 'emojiSmile';
    setupGallery(div, 'icon', icon, def_icon, false);
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
    const def_row1 = curr['row1'] ?? 'xooox';
    setupGallery(div, 'row1', row1, def_row1, false);
    
    let row2 = getItems(props, 'row2').enum;
    const def_row2 = curr['row2'] ?? 'oxoxo';
    setupGallery(div, 'row2', row2, def_row2, false);
    
    let row3 = getItems(props, 'row3').enum;
    const def_row3 = curr['row3'] ?? 'ooxoo';
    setupGallery(div, 'row3', row3, def_row3, false);
    
    let row4 = getItems(props, 'row4').enum;
    const def_row4 = curr['row4'] ?? 'oxoxo';
    setupGallery(div, 'row4', row4, def_row4, false);
    
    let row5 = getItems(props, 'row5').enum;
    const def_row5 = curr['row5'] ?? 'xooox';
    setupGallery(div, 'row5', row5, def_row5, false);
    
    const def_colour = curr['rowColour'] ?? '#000000';
    setupColour(div, 'rowColour', def_colour);
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
    const def_beard = curr['beardProbability'] == '0' ?
        'None' : curr['beard'] ?? 'None';
    setupGallery(div, 'beard', beard, def_beard, true);

    let earrings = getItems(props, 'earrings').enum;
    earrings.push('None');
    const def_earrings = curr['earringsProbability'] == '0' ?
        'None' : curr['earrings'] ?? 'None';
    setupGallery(div, 'earrings', earrings, def_earrings, true);

    const def_earringsColour = curr['earringsColour'] ?? '#000000';
    setupColour(div, 'earringsColour', def_earringsColour);

    let eyebrows = getItems(props, 'eyebrows').enum;
    const def_eyebrows = curr['eyebrows'] ?? 'variant01';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    const def_eyebrowsColour = curr['eyebrowsColour'] ?? '#000000';
    setupColour(div, 'eyebrowsColour', def_eyebrowsColour);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    const def_eyesColour = curr['eyesColour'] ?? '#000000';
    setupColour(div, 'eyesColour', def_eyesColour);
    
    let freckles = getItems(props, 'freckles').enum;
    freckles.push('None');
    const def_freckles = curr['frecklesProbability'] == '0' ?
        'None' : curr['freckles'] ?? 'None';
    setupGallery(div, 'freckles', freckles, def_freckles, true);
    
    const def_frecklesColour = curr['frecklesColour'] ?? '#000000';
    setupColour(div, 'frecklesColour', def_frecklesColour);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    const def_glassesColour = curr['glassesColour'] ?? '#000000';
    setupColour(div, 'glassesColour', def_glassesColour);

    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'variant01';
    setupGallery(div, 'hair', hair, def_hair, false);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);

    let hairAccessories = getItems(props, 'hairAccessories').enum;
    hairAccessories.push('None');
    const def_hairAccessories = curr['hairAccessoriesProbability'] == '0' ?
        'None' : curr['hairAccessories'] ?? 'None';
    setupGallery(div, 'hairAccessories', hairAccessories, def_hairAccessories, true);
    
    const def_hairAccessoriesColour = curr['hairAccessoriesColour'] ?? '#000000';
    setupColour(div, 'hairAccessoriesColour', def_hairAccessoriesColour);
    
    let head = getItems(props, 'head').enum;
    const def_head = curr['head'] ?? 'variant01';
    setupGallery(div, 'head', head, def_head, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'happy01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    const def_mouthColour = curr['mouthColour'] ?? '#000000';
    setupColour(div, 'mouthColour', def_mouthColour);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
    
    const def_noseColour = curr['noseColour'] ?? '#000000';
    setupColour(div, 'noseColour', def_noseColour);
    
    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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
    const def_eyebrows = curr['eyebrows'] ?? 'variant01';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    const def_eyebrowsColour = curr['eyebrowsColour'] ?? '#000000';
    setupColour(div, 'eyebrowsColour', def_eyebrowsColour);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    const def_eyesColour = curr['eyesColour'] ?? '#000000';
    setupColour(div, 'eyesColour', def_eyesColour);
    
    let freckles = getItems(props, 'freckles').enum;
    freckles.push('None');
    const def_freckles = curr['frecklesProbability'] == '0' ?
        'None' : curr['freckles'] ?? 'None';
    setupGallery(div, 'freckles', freckles, def_freckles, true);
    
    const def_frecklesColour = curr['frecklesColour'] ?? '#000000';
    setupColour(div, 'frecklesColour', def_frecklesColour);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    const def_glassesColour = curr['glassesColour'] ?? '#000000';
    setupColour(div, 'glassesColour', def_glassesColour);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'happy01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    const def_mouthColour = curr['mouthColour'] ?? '#000000';
    setupColour(div, 'mouthColour', def_mouthColour);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
    
    const def_noseColour = curr['noseColour'] ?? '#000000';
    setupColour(div, 'noseColour', def_noseColour);
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

    const def_baseColour = curr['baseColour'] ?? '#EDB98A';
    setupColour(div, 'baseColour', def_baseColour);

    let earrings = getItems(props, 'earrings').enum;
    earrings.push('None');
    const def_earrings = curr['earringsProbability'] == '0' ?
        'None' : curr['earrings'] ?? 'None';
    setupGallery(div, 'earrings', earrings, def_earrings, true);
    
    const def_earringColour = curr['earringColour'] ?? '#000000';
    setupColour(div, 'earringColour', def_earringColour);

    let ears = getItems(props, 'ears').enum;
    const def_ears = curr['ears'] ?? 'attached';
    setupGallery(div, 'ears', ears, def_ears, false);

    const def_eyeShadowColour = curr['eyeShadowColour'] ?? '#000000';
    setupColour(div, 'eyeShadowColour', def_eyeShadowColour);

    let eyebrows = getItems(props, 'eyebrows').enum;
    const def_eyebrows = curr['eyebrows'] ?? 'up';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    const def_eyebrowsColour = curr['eyebrowsColour'] ?? '#000000';
    setupColour(div, 'eyebrowsColour', def_eyebrowsColour);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'eyes';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    const def_eyesColour = curr['eyesColour'] ?? '#000000';
    setupColour(div, 'eyesColour', def_eyesColour);
    
    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    const def_facialHair = curr['facialHairProbability'] == '0' ?
        'None' : curr['facialHair'] ?? 'None';
    setupGallery(div, 'facialHair', facialHair, def_facialHair, true);
    
    const def_facialHairColour = curr['facialHairColour'] ?? '#724133';
    setupColour(div, 'facialHairColour', def_facialHairColour);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    const def_glassesColour = curr['glassesColour'] ?? '#000000';
    setupColour(div, 'glassesColour', def_glassesColour);
    
    let hair = getItems(props, 'hair').enum;
    hair.push('None');
    const def_hair = curr['hairProbability'] == '0' ?
        'None' : curr['hair'] ?? 'dannyPhantom';
    setupGallery(div, 'hair', hair, def_hair, true);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'smile';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    const def_mouthColour = curr['mouthColour'] ?? '#000000';
    setupColour(div, 'mouthColour', def_mouthColour);

    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'curve';
    setupGallery(div, 'nose', nose, def_nose, false);

    let shirt = getItems(props, 'shirt').enum;
    const def_shirt = curr['shirt'] ?? 'collared';
    setupGallery(div, 'shirt', shirt, def_shirt, false);
    
    const def_shirtColour = curr['shirtColour'] ?? '#000000';
    setupColour(div, 'shirtColour', def_shirtColour);
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
    const def_blushes = curr['blushesProbability'] == '0' ?
        'None' : curr['blushes'] ?? 'None';
    setupGallery(div, 'blushes', blushes, def_blushes, true);

    let body = getItems(props, 'body').enum;
    const def_body = curr['body'] ?? 'tShirt';
    setupGallery(div, 'body', body, def_body, false);
    
    const def_bodyColour = curr['bodyColour'] ?? '#000000';
    setupColour(div, 'bodyColour', def_bodyColour);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'normal';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'classic01';
    setupGallery(div, 'hair', hair, def_hair, false);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);

    let head = getItems(props, 'head').enum;
    const def_head = curr['head'] ?? 'normal';
    setupGallery(div, 'head', head, def_head, false);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'default';
    setupGallery(div, 'mouth', mouth, def_mouth, false);

    let moustache = getItems(props, 'moustache').enum;
    moustache.push('None');
    const def_moustache = curr['moustacheProbability'] == '0' ?
        'None' : curr['moustache'] ?? 'None';
    setupGallery(div, 'moustache', moustache, def_moustache, true);

    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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
    const def_beard = curr['beardProbability'] == '0' ?
        'None' : curr['beard'] ?? 'None';
    setupGallery(div, 'beard', beard, def_beard, true);
    
    let body = getItems(props, 'body').enum;
    const def_body = curr['body'] ?? 'variant01';
    setupGallery(div, 'body', body, def_body, false);
    
    let bodyIcon = getItems(props, 'bodyIcon').enum;
    bodyIcon.push('None');
    const def_bodyIcon = curr['bodyIconProbability'] == '0' ?
        'None' : curr['bodyIcon'] ?? 'None';
    setupGallery(div, 'bodyIcon', bodyIcon, def_bodyIcon, true);
    
    let brows = getItems(props, 'brows').enum;
    const def_brows = curr['brows'] ?? 'variant01';
    setupGallery(div, 'brows', brows, def_brows, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let gesture = getItems(props, 'gesture').enum;
    gesture.push('None');
    const def_gesture = curr['gestureProbability'] == '0' ?
        'None' : curr['gesture'] ?? 'None';
    setupGallery(div, 'gesture', gesture, def_gesture, true);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'variant01';
    setupGallery(div, 'hair', hair, def_hair, false);
    
    let lips = getItems(props, 'lips').enum;
    const def_lips = curr['lips'] ?? 'variant01';
    setupGallery(div, 'lips', lips, def_lips, false);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
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
    const def_brows = curr['brows'] ?? 'variant01';
    setupGallery(div, 'brows', brows, def_brows, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    let lips = getItems(props, 'lips').enum;
    const def_lips = curr['lips'] ?? 'variant01';
    setupGallery(div, 'lips', lips, def_lips, false);
    
    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'variant01';
    setupGallery(div, 'nose', nose, def_nose, false);
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
    const def_accessories = curr['accessoriesProbability'] == '0' ?
        'None' : curr['accessories'] ?? 'None';
    setupGallery(div, 'accessories', accessories, def_accessories, true);
    
    const def_clothingColour = curr['clothingColour'] ?? '#000000';
    setupColour(div, 'clothingColour', def_clothingColour);
    
    let face = getItems(props, 'face').enum;
    const def_face = curr['face'] ?? 'smile';
    setupGallery(div, 'face', face, def_face, false);
    
    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    const def_facialHair = curr['facialHairProbability'] == '0' ?
        'None' : curr['facialHair'] ?? 'None';
    setupGallery(div, 'facialHair', facialHair, def_facialHair, true);
    
    let head = getItems(props, 'head').enum;
    const def_head = curr['head'] ?? 'short1';
    setupGallery(div, 'head', head, def_head, false);

    const def_headContrastColour = curr['headContrastColour'] ?? '#724133';
    setupColour(div, 'headContrastColour', def_headContrastColour);
    
    let mask = getItems(props, 'mask').enum;
    mask.push('None');
    const def_mask = curr['maskProbability'] == '0' ?
        'None' : curr['mask'] ?? 'None';
    setupGallery(div, 'mask', mask, def_mask, true);
    
    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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
    const def_body = curr['body'] ?? 'rounded';
    setupGallery(div, 'body', body, def_body, false);
    
    const def_clothingColour = curr['clothingColour'] ?? '#000000';
    setupColour(div, 'clothingColour', def_clothingColour);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'open';
    setupGallery(div, 'eyes', eyes, def_eyes, false);

    let facialHair = getItems(props, 'facialHair').enum;
    facialHair.push('None');
    const def_facialHair = curr['facialHairProbability'] == '0' ?
        'None' : curr['facialHair'] ?? 'None';
    setupGallery(div, 'facialHair', facialHair, def_facialHair, true);

    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'shortCombover';
    setupGallery(div, 'hair', hair, def_hair, false);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);

    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'smile';
    setupGallery(div, 'mouth', mouth, def_mouth, false);

    let nose = getItems(props, 'nose').enum;
    const def_nose = curr['nose'] ?? 'smallRound';
    setupGallery(div, 'nose', nose, def_nose, false);
    
    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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
    const def_accessories = curr['accessoriesProbability'] == '0' ?
        'None' : curr['accessories'] ?? 'None';
    setupGallery(div, 'accessories', accessories, def_accessories, true);
    
    const def_accessoriesColour = curr['accessoriesColour'] ?? '#000000';
    setupColour(div, 'accessoriesColour', def_accessoriesColour);

    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    const def_beard = curr['beardProbability'] == '0' ?
        'None' : curr['beard'] ?? 'None';
    setupGallery(div, 'beard', beard, def_beard, true);
    
    let clothing = getItems(props, 'clothing').enum;
    const def_clothing = curr['clothing'] ?? 'variant01';
    setupGallery(div, 'clothing', clothing, def_clothing, false);
    
    const def_clothingColour = curr['clothingColour'] ?? '#000000';
    setupColour(div, 'clothingColour', def_clothingColour);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    const def_eyesColour = curr['eyesColour'] ?? '#000000';
    setupColour(div, 'eyesColour', def_eyesColour);
    
    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    const def_glassesColour = curr['glassesColour'] ?? '#000000';
    setupColour(div, 'glassesColour', def_glassesColour);
    
    let hair = getItems(props, 'hair').enum;
    const def_hair = curr['hair'] ?? 'short01';
    setupGallery(div, 'hair', hair, def_hair, false);
    
    const def_hairColour = curr['hairColour'] ?? '#724133';
    setupColour(div, 'hairColour', def_hairColour);
    
    let hat = getItems(props, 'hat').enum;
    hat.push('None');
    const def_hat = curr['hatProbability'] == '0' ?
        'None' : curr['hat'] ?? 'None';
    setupGallery(div, 'hat', hat, def_hat, true);
    
    const def_hatColour = curr['hatColour'] ?? '#000000';
    setupColour(div, 'hatColour', def_hatColour);

    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'happy01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    const def_mouthColour = curr['mouthColour'] ?? '#000000';
    setupColour(div, 'mouthColour', def_mouthColour);
    
    const def_skinColour = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skinColour);
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
    const def_eyes = curr['eyes'] ?? 'variant01';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    const def_eyesColour = curr['eyesColour'] ?? '#000000';
    setupColour(div, 'eyesColour', def_eyesColour);
    
    let glasses = getItems(props, 'glasses').enum;
    glasses.push('None');
    const def_glasses = curr['glassesProbability'] == '0' ?
        'None' : curr['glasses'] ?? 'None';
    setupGallery(div, 'glasses', glasses, def_glasses, true);
    
    const def_glassesColour = curr['glassesColour'] ?? '#000000';
    setupColour(div, 'glassesColour', def_glassesColour);

    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'happy01';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    const def_mouthColour = curr['mouthColour'] ?? '#000000';
    setupColour(div, 'mouthColour', def_mouthColour);
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

    const def_ringColour = curr['ringColour'] ?? '#000000';
    setupColour(div, 'ringColour', def_ringColour);

    let ring1 = getItems(props, 'ringOne').enum;
    const def_ring1 = curr['ringOne'] ?? 'full';
    setupGallery(div, 'ringOne', ring1, def_ring1, false);
    
    const r1 = getItems(props, 'ringOneRotation');
    const def_r1 = curr['ringOneRotation'] ?? r1?.default ?? null;
    setupSlider(div, 'ringOneRotation', r1.minimum, r1.maximum, def_r1, 5);
    
    let ring2 = getItems(props, 'ringTwo').enum;
    const def_ring2 = curr['ringTwo'] ?? 'full';
    setupGallery(div, 'ringTwo', ring2, def_ring2, false);
    
    const r2 = getItems(props, 'ringTwoRotation');
    const def_r2 = curr['ringTwoRotation'] ?? r2?.default ?? null;
    setupSlider(div, 'ringTwoRotation', r2.minimum, r2.maximum, def_r2, 5);
    
    let ring3 = getItems(props, 'ringThree').enum;
    const def_ring3 = curr['ringThree'] ?? 'full';
    setupGallery(div, 'ringThree', ring3, def_ring3, false);
    
    const r3 = getItems(props, 'ringThreeRotation');
    const def_r3 = curr['ringThreeRotation'] ?? r3?.default ?? null;
    setupSlider(div, 'ringThreeRotation', r3.minimum, r3.maximum, def_r3, 5);
    
    let ring4 = getItems(props, 'ringFour').enum;
    const def_ring4 = curr['ringFour'] ?? 'full';
    setupGallery(div, 'ringFour', ring4, def_ring4, false);
    
    const r4 = getItems(props, 'ringFourRotation');
    const def_r4 = curr['ringFourRotation'] ?? r4?.default ?? null;
    setupSlider(div, 'ringFourRotation', r4.minimum, r4.maximum, def_r4, 5);
    
    let ring5 = getItems(props, 'ringFive').enum;
    const def_ring5 = curr['ringFive'] ?? 'full';
    setupGallery(div, 'ringFive', ring5, def_ring5, false);
    
    const r5 = getItems(props, 'ringFiveRotation');
    const def_r5 = curr['ringFiveRotation'] ?? r5?.default ?? null;
    setupSlider(div, 'ringFiveRotation', r5.minimum, r5.maximum, def_r5, 5);
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
    const def_shape1 = curr['shape1'] ?? 'ellipse';
    setupGallery(div, 'shape1', shape1, def_shape1, false);
    
    const def_shape1Colour = curr['shape1Colour'] ?? '#000000';
    setupColour(div, 'shape1Colour', def_shape1Colour);
    
    const x1 = getItems(props, 'shape1OffsetX');
    const def_x1 = curr['shape1OffsetX'] ?? x1?.default ?? null;
    setupSlider(div, 'shape1OffsetX', x1.minimum, x1.maximum, def_x1, 5);
    
    const y1 = getItems(props, 'shape1OffsetY');
    const def_y1 = curr['shape1OffsetY'] ?? y1?.default ?? null;
    setupSlider(div, 'shape1OffsetY', y1.minimum, y1.maximum, def_y1, 5);
    
    const r1 = getItems(props, 'shape1Rotation');
    const def_r1 = curr['shape1Rotation'] ?? r1?.default ?? null;
    setupSlider(div, 'shape1Rotation', r1.minimum, r1.maximum, def_r1, 5);

    let shape2 = getItems(props, 'shape2').enum;
    const def_shape2 = curr['shape2'] ?? 'ellipse';
    setupGallery(div, 'shape2', shape2, def_shape2, false);
    
    const def_shape2Colour = curr['shape2Colour'] ?? '#000000';
    setupColour(div, 'shape2Colour', def_shape2Colour);
    
    const x2 = getItems(props, 'shape2OffsetX');
    const def_x2 = curr['shape2OffsetX'] ?? x2?.default ?? null;
    setupSlider(div, 'shape2OffsetX', x2.minimum, x2.maximum, def_x2, 5);
    
    const y2 = getItems(props, 'shape2OffsetY');
    const def_y2 = curr['shape2OffsetY'] ?? y2?.default ?? null;
    setupSlider(div, 'shape2OffsetY', y2.minimum, y2.maximum, def_y2, 5);
    
    const r2 = getItems(props, 'shape2Rotation');
    const def_r2 = curr['shape2Rotation'] ?? r2?.default ?? null;
    setupSlider(div, 'shape2Rotation', r2.minimum, r2.maximum, def_r2, 5);

    let shape3 = getItems(props, 'shape3').enum;
    const def_shape3 = curr['shape3'] ?? 'ellipse';
    setupGallery(div, 'shape3', shape3, def_shape3, false);
    
    const def_shape3Colour = curr['shape3Colour'] ?? '#000000';
    setupColour(div, 'shape3Colour', def_shape3Colour);
    
    const x3 = getItems(props, 'shape3OffsetX');
    const def_x3 = curr['shape3OffsetX'] ?? x3?.default ?? null;
    setupSlider(div, 'shape3OffsetX', x3.minimum, x3.maximum, def_x3, 5);
    
    const y3 = getItems(props, 'shape3OffsetY');
    const def_y3 = curr['shape3OffsetY'] ?? y3?.default ?? null;
    setupSlider(div, 'shape3OffsetY', y3.minimum, y3.maximum, def_y3, 5);
    
    const r3 = getItems(props, 'shape3Rotation');
    const def_r3 = curr['shape3Rotation'] ?? r3?.default ?? null;
    setupSlider(div, 'shape3Rotation', r3.minimum, r3.maximum, def_r3, 5);
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
    const def_eyes = curr['eyes'] ?? 'variant5W10';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    const def_eyesColour = curr['eyesColour'] ?? '#000000';
    setupColour(div, 'eyesColour', def_eyesColour);

    let face = getItems(props, 'face').enum;
    const def_face = curr['face'] ?? 'variant1';
    setupGallery(div, 'face', face, def_face, false);
    
    const fX = getItems(props, 'faceOffsetX');
    const def_fX = curr['faceOffsetX'] ?? fX?.default ?? null;
    setupSlider(div, 'faceOffsetX', fX.minimum, fX.maximum, def_fX, 5);
    
    const fY = getItems(props, 'faceOffsetY');
    const def_fY = curr['faceOffsetY'] ?? fY?.default ?? null;
    setupSlider(div, 'faceOffsetY', fY.minimum, fY.maximum, def_fY, 5);
    
    const fR = getItems(props, 'faceRotation');
    const def_fR = curr['faceRotation'] ?? fR?.default ?? null;
    setupSlider(div, 'faceRotation', fR.minimum, fR.maximum, def_fR, 5);

    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'variant1';
    setupGallery(div, 'mouth', mouth, def_mouth, false);
    
    const def_mouthColour = curr['mouthColour'] ?? '#000000';
    setupColour(div, 'mouthColour', def_mouthColour);

    const def_shapeColour = curr['shapeColour'] ?? '#000000';
    setupColour(div, 'shapeColour', def_shapeColour);
    
    const sX = getItems(props, 'shapeOffsetX');
    const def_sX = curr['shapeOffsetX'] ?? sX?.default ?? null;
    setupSlider(div, 'shapeOffsetX', sX.minimum, sX.maximum, def_sX, 5);
    
    const sY = getItems(props, 'shapeOffsetY');
    const def_sY = curr['shapeOffsetX'] ?? sY?.default ?? null;
    setupSlider(div, 'shapeOffsetY', sY.minimum, sY.maximum, def_sY, 5);
    
    const sR = getItems(props, 'shapeRotation');
    const def_sR = curr['shapeRotation'] ?? sR?.default ?? null;
    setupSlider(div, 'shapeRotation', sR.minimum, sR.maximum, def_sR, 5);
}

// #endregion


// -------------------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------------------
// 
//                          Toon Head
// 


// #region

function renderToonHead(div, props, curr) {
    div.innerHTML = '';
    updateBaseOptions('toon-head');
    
    let beard = getItems(props, 'beard').enum;
    beard.push('None');
    const def_beard = curr['beardProbability'] == '0' ?
        'None' : curr['beard'] ?? 'None';
    setupGallery(div, 'beard', beard, def_beard, true);
    
    let clothes = getItems(props, 'clothes').enum;
    const def_clothes = curr['clothes'] ?? 'tShirt';
    setupGallery(div, 'clothes', clothes, def_clothes, false);
    
    const def_clothesColour = curr['clothesColour'] ?? '#000000';
    setupColour(div, 'clothesColour', def_clothesColour);
    
    let eyebrows = getItems(props, 'eyebrows').enum;
    const def_eyebrows = curr['eyebrows'] ?? 'neutral';
    setupGallery(div, 'eyebrows', eyebrows, def_eyebrows, false);
    
    let eyes = getItems(props, 'eyes').enum;
    const def_eyes = curr['eyes'] ?? 'happy';
    setupGallery(div, 'eyes', eyes, def_eyes, false);
    
    let hair = getItems(props, 'hair').enum;
    hair.push('None');
    const def_hair = curr['hairProbability'] == '0' ?
        'None' : curr['hair'] ?? 'spiky';
    setupGallery(div, 'hair', hair, def_hair, true);
    
    let rearHair = getItems(props, 'rearHair').enum;
    const def_rearHair = curr['rearHair'] ?? 'neckHigh';
    setupGallery(div, 'rearHair', rearHair, def_rearHair, false);
    
    const def_hairColour = curr['hairColour'] ?? '#000000';
    setupColour(div, 'hairColour', def_hairColour);
    
    let mouth = getItems(props, 'mouth').enum;
    const def_mouth = curr['mouth'] ?? 'smile';
    setupGallery(div, 'mouth', mouth, def_mouth, false);

    const def_skin = curr['skinColour'] ?? '#EDB98A';
    setupColour(div, 'skinColour', def_skin);
}

// #endregion

