import {
    header,
    styleBox
} from './utils.js';
import { BASE_ROUTE } from './config.js';
import { renderAvatarPage } from './avatar.js';

let route = `${BASE_ROUTE}/api/auth`;

const default_pfp = 'assets/default_pfp.svg';

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
        //renderAvatarPage(div, user, 'updating');
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
    eye.className = 'password_eye';
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
//              Avatar
//


// #region

/*let curr_setup = {
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
};*/

// SEED ORDER
// 0 - https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&flip=false&rotate=0&scale=100&backgroundColor=ff0000&translateX=0&translateY=0&eyes=shades&mouth=cute"
// 1 - 

function getCurrSetupFromSeed(seed) {
    const no_start = seed.split('api.dicebear.com/9.x/')[1];
    curr_setup.theme = no_start.split('/svg?')[0];
    const main = no_start.split('/svg?')[1];
    const options = main.split('&');
    for (const option in options) {
        if (option == 'backgroundColor[]') {
            curr_setup.colour = '';
            continue;
        }
        const key = option.split('=')[0];
        const val = option.split('=')[1];
    }
}



// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Sign Up
//


// #region

function renderSignUpPage(div) {
    div.innerHTML = '';
    div.parentElement.style.overflow = 'hidden';

    // Page 1:

    // Username
    // Password
    // Confirm password

    // If Username already exists or passwords don't match, throw error
    // If Username doesn't exist and passwords match, clear page 1 and open page 2

    // Page 2:

    // First name
    // Family name
    // Favourite Colour
    // Birthday

    // If everything is valid, clear page 2 and open page 3

    // Page 3:
    
    // Build avatar

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
        'fun-emoji',
        '0',
        'true',
        '0',
        '100',
        '#ffffff',
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
    console.log(user);

    const section = document.createElement('div');
    section.className = 'user_middle_div';
    div.appendChild(section);

    const avatar_div = document.createElement('div');
    avatar_div.className = 'user_avatar_div';
    section.appendChild(avatar_div);

    const avatar = document.createElement('img');
    avatar.id = 'user_avatar';
    avatar.src = user.avatar_seed;
    avatar_div.appendChild(avatar);

    const user_div = document.createElement('div');
    user_div.className = 'user_div';
    section.appendChild(user_div);

    const form = document.createElement('div');
    form.id = 'user_form';
    form.className = 'form';
    user_div.appendChild(form);

    const username_div = document.createElement('div');
    username_div.className = 'user_input_section';
    form.appendChild(username_div);

    const username = document.createElement('input');
    username.type = 'username';
    username.id = 'user_username';
    username.value = `${user.username}`;
    username.className = 'user-input user_read';
    username.style.cursor = 'text';
    username.setAttribute('readonly', true);
    username_div.appendChild(username);

    const usernameBtn = header(
        'button', 'Edit Username', '', 'username-btn', 'user-button user-input'
    )
    username_div.appendChild(usernameBtn);
    
    const password_div = document.createElement('div');
    password_div.className = 'user_input_section';
    form.appendChild(password_div);
    
    const password = document.createElement('input');
    password.type = 'password';
    password.id = 'user_password';
    password.placeholder = 'Password...';
    password.className = 'user-input user_read';
    password.style.cursor = 'text';
    password.setAttribute('readonly', true);
    password_div.appendChild(password);

    const eye = document.createElement('img');
    eye.id = 'user_eye';
    eye.className = 'password_eye';
    eye.src = 'assets/eye_on.svg';
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
    password_div.appendChild(eye);

    const logoutBtn = header(
        'button', 'Log out', '', 'logout-btn', 'user-button user-input'
    )
    div.appendChild(logoutBtn);
    logoutBtn.addEventListener('click', logout);
}
