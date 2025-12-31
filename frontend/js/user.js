import {
    header,
    styleBox
} from './utils.js';

import { BASE_ROUTE } from './config.js';
let route = `${BASE_ROUTE}/api/auth`;

const default_pfp = 'assets/default_pfp.svg';

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

let user_data = null;

const modal = document.getElementById('user-profile-modal');
const userBox = document.getElementById('user-profile-box');

export function loadMenuBurger() {
    const burgerInput = document.getElementById('burger');
    const menu = document.getElementById('menu');
    styleBox(menu, '#33eaff');

    burgerInput.addEventListener('change', () => {
        menu.classList.toggle('open', burgerInput.checked);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        const headerRight = document.querySelector('.header-right');

        if (!headerRight.contains(e.target)) {
            burgerInput.checked = false;
            menu.classList.remove('open');
        }
    });

    // Optional: close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            burgerInput.checked = false;
            menu.classList.remove('open');
        }
    });
}

export function updateProfilePic(user_data) {
    const pfp = document.getElementById('profile-pic');
    if (user_data?.authenticated) {
        pfp.src = user_data.user.avatar_seed;
    } else {
        pfp.src = default_pfp;
    }
}

// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Modal Setup
//


// #region

export function openUserModal(modal, modalBox, colour = null, callback = null) {
    modal.style.display = 'flex';
    modal.style.opacity = 0;
    modalBox.style.transform = 'translateY(100vh) scale(0.01)';

    if (colour) {
        modalBox.style.backgroundColor = colour.rgba;
        modalBox.style.borderColor = colour.rgba;
        modalBox.style.color = colour.text;
    }

    modalBox.offsetHeight;

    modal.style.transition = 'opacity 0.4s ease';
    modalBox.style.transition = 'transform 0.4s ease';

    modal.style.opacity = 1;
    modalBox.style.transform = 'translateY(0) scale(1)';

    modal.classList.add('active');
    document.body.classList.add('modal-active');

    if (typeof callback === 'function') {
        setTimeout(callback, 400);
    }
}

export function closeUserModal(modal, modalBox, callback = null) {
    modal.style.transition = 'opacity 0.4s ease';
    modalBox.style.transition = 'transform 0.4s ease';

    modal.style.opacity = 0;
    modalBox.style.transform = 'translateY(100vh) scale(0.01)';

    setTimeout(() => {
        modal.style.display = 'none';

        // Reset styles
        modal.style.opacity = '';
        modal.style.transition = '';
        modalBox.style.transform = '';
        modalBox.style.transition = '';
        
        modal.classList.remove('active');
        document.body.classList.remove('modal-active');

        if (typeof callback === 'function') {
            callback();
        }
    }, 400);
}

export async function setupUserModal() {
    const user_data = await loadUser();
    
    const title = document.getElementById('user-profile-title');
    const div = document.getElementById('user-profile-div');

    if (!user_data.authenticated) {
        title.textContent = 'Sign in';
        //renderSignUpPage(div);
        renderLoginForm(div);
    } else {
        const user = user_data.user;
        title.textContent = `${user.username}'s Account`
        renderUserProfile(div, user);
    }
}

async function loadUser() {
    const res = await fetch(`${route}/me`, {
        credentials: 'include'
    });
    if (!res.ok) return null;
    const data = await res.json();
    document.body.dataset.user = data.user?.username ?? null;
    return data;
}

async function login(username, password) {
    const res = await fetch(`${route}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok || !data.authenticated) {
        return {
            authenticated: false,
            text: data.text ?? 'Login failed'
        };
    }

    // Close modal then reload
    closeUserModal(modal, userBox, () => {
        location.reload();
    });

    return data;
}

async function logout() {
    const res = await fetch(`${route}/logout`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!res.ok) {
        alert('Logout failed');
        return { success: false };
    }

    await loadUserOption();
    closeUserModal(modal, userBox, () => {
        location.reload();
    });

    return { success: true };
}

export async function loadUserOption() {
    user_data = await loadUser();
    console.log(user_data);
    updateProfilePic(user_data);
    return user_data;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Sign In
//


// #region

function renderLoginForm(div) {
    div.innerHTML = '';

    const container = document.createElement('div');
    container.id = 'login_form_container';
    container.className = 'form_container';
    div.appendChild(container);

    const form = document.createElement('div');
    form.id = 'login_form';
    form.className = 'form';
    container.appendChild(form);

    const username = document.createElement('input');
    username.type = 'username';
    username.id = 'username';
    username.placeholder = 'Username...';
    username.className = 'user-input';
    username.style.cursor = 'text';
    form.appendChild(username);

    const password = document.createElement('input');
    password.type = 'password';
    password.id = 'password';
    password.placeholder = 'Password...';
    password.className = 'user-input';
    password.style.cursor = 'text';
    form.appendChild(password);
    
    const err = form.appendChild(header(
        'h3', 'ERROR', 'red',
        'user-profile-error', 'middle-title'
    ));
    err.style.visibility = 'hidden';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'user-button user-input';
    btn.innerHTML = 'Login';
    form.appendChild(btn);

    const eye = document.createElement('img');
    eye.id = 'password_eye';
    eye.src = 'assets/eye_on.svg';
    form.appendChild(eye);
    eye.addEventListener('click', () => {
        if (password.type == 'password') {
            password.type = 'text';
            eye.src = 'assets/eye_off.svg';
            eye.style.textDecoration = 'line-through';
        } else {
            password.type = 'password';
            eye.src = 'assets/eye_on.svg';
            eye.style.textDecoration = 'none';
        }
    });

    const error = (text) => {
        err.innerHTML = text;
        err.style.visibility = 'visible';
    }

    btn.addEventListener('click', async (e) => {
        e.preventDefault();

        const givenUsername = username.value;
        const givenPassword = password.value;
        if (givenUsername == '') {
            error('No Username given');
        } else if (givenPassword == '') {
            error('No Password given');
        } else {
            const res = await login(givenUsername, givenPassword);
            if (!res.authenticated) error(res.text ?? 'Login Error');
        }
    });

    const signup = document.createElement('div');
    signup.id = 'user-signup';
    signup.className = 'form';
    container.appendChild(signup);

    const signupTitle = header(
        'h2', `Or if you're new here, sign up!`, '',
        'user-profile-title', 'middle-title'
    );
    signup.appendChild(signupTitle);

    const signupBtn = document.createElement('button');
    signupBtn.type = 'submit';
    signupBtn.className = 'user-button user-input';
    signupBtn.innerHTML = 'Sign Up';
    signup.appendChild(signupBtn);

    signup.addEventListener('click', () => {
        renderSignUpPage(div);
    });
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Sign Up
//


// #region

let curr_setup = {
    'flip': 'false',
    'rotate': '0',
    'scale': '100',
    'colour': '',
    'x': '0',
    'y': '0',
    'eyes': '',
    'mouth': ''
}

function createAvatarLink(
    flip_var,
    rotate_var,
    scale_var,
    colour_var,
    x_var,
    y_var,
    eyes_var,
    mouth_var
) {
    const base = 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50';
    
    const flip = `&flip=${flip_var}`;
    curr_setup.flip = flip_var;
    
    const rotate = `&rotate=${rotate_var}`;
    curr_setup.rotate = rotate_var;
    
    const scale = `&scale=${scale_var}`;
    curr_setup.scale = scale_var;
    
    const colour = colour_var == '' || colour_var == '[]' ?
        `&backgroundColor[]` : `&backgroundColor=${colour_var}`;
    curr_setup.colour = colour_var;
    
    const x = `&translateX=${x_var}`;
    curr_setup.x = x_var;
    
    const y = `&translateY=${y_var}`;
    curr_setup.y = y_var;
    
    const eyes = `&eyes=${eyes_var}`;
    curr_setup.eyes = eyes_var;
    
    const mouth = `&mouth=${mouth_var}`;
    curr_setup.mouth = mouth_var;

    return base + flip + rotate + scale + colour + x + y + eyes + mouth;
}

function updateAvatar() {
    const preview = document.getElementById('avatar_preview');
    preview.src = createAvatarLink(
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

function setupOption(div, type) {
    const section = document.createElement('div');
    section.id = `${type}_section`;
    section.className = 'avatar_options_section';
    div.appendChild(section);

    const text = 
        type == 'eye' ? 'Eyes:' :
        type == 'mouth' ? 'Mouth:' : '';

    section.appendChild(header(
        'h2', text, '', '', 'avatar_option_title'
    ));

    const options = document.createElement('div');
    options.id = `${type}_options`;
    options.className = 'avatar_option';
    section.appendChild(options);
    
    const upArrow = document.createElement('img');
    upArrow.className = 'avatar_arrow';
    upArrow.id = 'up_arrow';
    upArrow.src = 'assets/arrow.svg';
    options.appendChild(upArrow);

    const option = header(
        'h2', 'plain', '', `${type}_option`, `avatar_option_text`
    );
    options.appendChild(option);

    const downArrow = document.createElement('img');
    downArrow.className = 'avatar_arrow';
    downArrow.id = 'down_arrow';
    downArrow.src = 'assets/arrow.svg';
    options.appendChild(downArrow);

    upArrow.addEventListener('click', () => {
        if (type == 'eye') updateEye(option, 'up');
        if (type == 'mouth') updateMouth(option, 'up');
    });

    downArrow.addEventListener('click', () => {
        if (type == 'eye') updateEye(option, 'down');
        if (type == 'mouth') updateMouth(option, 'down');
    });
}

function updateEye(option, dir) {
    const curr = option.innerHTML;
    let i = eye_list.indexOf(curr);
    if (dir == 'up') i -= 1;
    if (dir == 'down') i += 1;
    if (i == -1) i = eye_list.length - 1;
    if (i == eye_list.length) i = 0;
    option.innerHTML = eye_list[i];
    curr_setup.eyes = eye_list[i];
    updateAvatar();
}

function updateMouth(option, dir) {
    const curr = option.innerHTML;
    let i = mouth_list.indexOf(curr);
    console.log(i);
    console.log(mouth_list);
    if (dir == 'up') i -= 1;
    if (dir == 'down') i += 1;
    if (i == -1) i = mouth_list.length - 1;
    if (i == mouth_list.length) i = 0;
    option.innerHTML = mouth_list[i];
    curr_setup.mouth = mouth_list[i];
    updateAvatar();
}

function renderSignUpPage(div) {
    div.innerHTML = '';
    div.parentElement.style.overflow = 'hidden';

    // First name
    // Family name
    // Colour
    // Birthday
    // Username
    // Password
    // Confirm password

    const title = document.getElementById('user-profile-title');
    title.innerHTML = 'Sign Up';

    const container = document.createElement('div');
    container.id = 'signup_form_container';
    container.className = 'form_container';
    div.appendChild(container);

    const form = document.createElement('div');
    form.id = 'signup_form';
    form.className = 'form';
    container.appendChild(form);

    const username = document.createElement('input');
    username.innerHTML = '';
    username.type = 'text';
    username.id = 'username';
    username.placeholder = 'Username...';
    username.className = 'user-input';
    username.style.cursor = 'text';
    form.appendChild(username);

    const password = document.createElement('input');
    password.type = 'text';
    password.id = 'password';
    password.placeholder = 'Password...';
    password.className = 'user-input';
    password.style.cursor = 'text';
    form.appendChild(password);

    const confirm = document.createElement('input');
    confirm.type = 'text';
    confirm.id = 'password';
    confirm.placeholder = 'Confirm Password...';
    confirm.className = 'user-input';
    confirm.style.cursor = 'text';
    form.appendChild(confirm);

    const err = header(
        'h3', 'ERROR', 'red',
        'user-profile-error', 'middle-title'
    );
    err.style.visibility = 'hidden';
    form.appendChild(err);

    const avatar_header = header(
        'h2', 'Build your avatar', '',
        'user-profile-avatar-title', 'middle-title'
    );
    avatar_header.style.textDecoration = 'underline';
    form.appendChild(avatar_header);

    const avatar_section = document.createElement('div');
    avatar_section.id = 'avatar_section';
    form.appendChild(avatar_section);

    const avatar_preview_div = document.createElement('div');
    avatar_preview_div.id = 'avatar_preview_div';
    avatar_section.appendChild(avatar_preview_div);

    const avatar_preview = document.createElement('img');
    avatar_preview.id = 'avatar_preview';
    avatar_preview.src = createAvatarLink(
        'true',
        '0',
        '100',
        'ff0000',
        '0',
        '0',
        'plain',
        'lilSmile'
    );
    avatar_preview_div.appendChild(avatar_preview);

    const avatar_options = document.createElement('div');
    avatar_options.id = 'avatar_options';
    avatar_section.appendChild(avatar_options);

    setupOption(avatar_options, 'eye');
    setupOption(avatar_options, 'mouth');

    /*const mouth_options = document.createElement('div');
    mouth_options.id = 'mouth_options';
    mouth_options.className = 'avatar_options_section';
    avatar_options.appendChild(mouth_options);
    
    mouth_options.appendChild(header('h1', '&#8593;'));
    mouth_options.appendChild(header(
        'h3', 'Plain', '', 'mouth_option_plain', 'mouth_option'
    ));
    mouth_options.appendChild(header('h1', '&#8595;'));*/
    /*
    eyes
    mouth
    colour

    flip
    rotate
    scale
    x
    y

    const link = createAvatarLink(
        'true',
        '0',
        '100',
        'ff0000',
        '0',
        '0',
        'shades',
        'smileTeeth'
    );
    console.log(link);
    
    const avatar = document.createElement('img');
    avatar.className = 'avatar_img';
    avatar.src = link;
    avatar_selection.appendChild(avatar);*/


    /*const avatars = getAvatars('ff0000');
    avatars.forEach(a => {
        const avatar = document.createElement('img');
        avatar.className = 'avatar_img';
        avatar.src = a;
        avatar_selection.appendChild(avatar);
    });*/

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'user-button user-input';
    btn.innerHTML = 'Confirm';
    form.appendChild(btn);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              User Profile
//


// #region

function renderUserProfile(div, user) {
    div.innerHTML = '';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';
    div.style.gap = '1rem';
    div.appendChild(header('p', `Role: ${user.role}`));
    const btn = header(
        'button', 'Log out', '', 'logout-btn', 'user-button user-input'
    )
    btn.style.cursor = 'pointer';
    div.appendChild(btn);
    //header(type, text, colour = '', id = '', className = '')

    btn.addEventListener('click', () => logout());
}
