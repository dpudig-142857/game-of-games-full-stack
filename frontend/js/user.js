import {
    header,
    styleBox
} from './utils.js';
import { BASE_ROUTE } from './config.js';
import { renderSwapAvatarPage, renderAvatarPage } from './avatar.js';

let route = `${BASE_ROUTE}/api/user`;

const default_pfp = 'https://api.iconify.design/mdi/account-circle.svg';

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

    document.addEventListener('click', (e) => {
        const headerRight = document.querySelector('.header-right');

        if (!headerRight.contains(e.target)) {
            burgerInput.checked = false;
            menu.classList.remove('open');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            burgerInput.checked = false;
            menu.classList.remove('open');
        }
    });

    const home = document.getElementById('menu-home');
    home.addEventListener('click', () => {
        window.location.href = '/';
    });

    const start = document.getElementById('menu-start');
    if (start) start.addEventListener('click', () => {

    });

    const cont = document.getElementById('menu-continue');
    if (cont) cont.addEventListener('click', () => {
        window.location.href = 'continue.html';
    });
    
    const stats = document.getElementById('menu-stats');
    if (stats) stats.addEventListener('click', () => {
        window.open(`stats.html`);
    });

    const logs = document.getElementById('menu-logs');
    if (logs) logs.addEventListener('click', () => {
        window.open(`logs.html`);
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

export function backArrow(action) {
    const arrow = document.getElementById('user-profile-back');
    if (action == 'hide') {
        arrow.style.display = 'none';
        arrow.parentElement.style.justifyContent = 'flex-end';
    } else if (action == 'show') {
        arrow.style.display = 'flex';
        arrow.parentElement.style.justifyContent = 'space-between';
    }
}

export async function goBackUserProfile(to) {
    if (to == 'home') await setupUserModal();
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
        const title = document.getElementById('user-profile-title');
        title.innerHTML = '';

        const div = document.getElementById('user-profile-div');
        div.innerHTML = '';
        
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
    const user_data = await loadUserOption();
    const div = document.getElementById('user-profile-div');
    
    if (!user_data.authenticated) {
        //renderSignUpPage(div);
        renderLoginForm(div);
    } else {
        renderUserProfile(div, user_data.user);
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

    const title = document.getElementById('user-profile-title');
    title.textContent = 'Sign in';

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

    const password_div = document.createElement('div');
    password_div.className = 'user_input_div';
    form.appendChild(password_div);
    
    const password = document.createElement('input');
    password.type = 'password';
    password.id = 'password';
    password.placeholder = 'Password...';
    password.className = 'user-input';
    password.style.cursor = 'text';
    password_div.appendChild(password);

    const eye = document.createElement('img');
    eye.className = 'password_eye';
    eye.src = 'assets/eye_on.svg';
    password_div.appendChild(eye);
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

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Sign Up
//


// #region

function renderSignUpPage(div) {
    div.innerHTML = '';
    
    const title = document.getElementById('user-profile-title');
    title.innerHTML = 'Sign Up';

    renderSignUpStep1(div);
}

// Step 1:

// Username
// Password
// Confirm password

// If Username already exists or passwords don't match, throw error
// If Username doesn't exist and passwords match, clear step 1 and open step 2

function renderSignUpStep1(div) {
    div.innerHTML = '';

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

    const password_div = document.createElement('div');
    password_div.className = 'user_input_div';
    form.appendChild(password_div);
    
    const password = document.createElement('input');
    password.type = 'password';
    password.id = 'password';
    password.placeholder = 'Password...';
    password.className = 'user-input';
    password.style.cursor = 'text';
    password_div.appendChild(password);

    const eye = document.createElement('img');
    eye.className = 'password_eye';
    eye.src = 'assets/eye_on.svg';
    password_div.appendChild(eye);
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

    const confirm_div = document.createElement('div');
    confirm_div.className = 'user_input_div';
    form.appendChild(confirm_div);
    
    const confirm = document.createElement('input');
    confirm.type = 'password';
    confirm.id = 'password';
    confirm.placeholder = 'Confirm Password...';
    confirm.className = 'user-input';
    confirm.style.cursor = 'text';
    confirm_div.appendChild(confirm);

    const confirm_eye = document.createElement('img');
    confirm_eye.className = 'password_eye';
    confirm_eye.src = 'assets/eye_on.svg';
    confirm_div.appendChild(confirm_eye);
    confirm_eye.addEventListener('click', () => {
        if (confirm.type == 'password') {
            confirm.type = 'text';
            confirm_eye.src = 'assets/eye_off.svg';
        } else {
            confirm.type = 'password';
            confirm_eye.src = 'assets/eye_on.svg';
        }
    });

    const err = header(
        'h3', 'ERROR', 'red',
        'user-profile-error', 'middle-title'
    );
    err.style.visibility = 'hidden';
    form.appendChild(err);

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'user-button user-input';
    btn.innerHTML = 'Next';
    btn.addEventListener('click', () => {
        if (password.value != confirm.value) {
            err.innerHTML = `Passwords don't match`;
            err.style.visibility = 'visible';
        } else {
            // TODO: connect to backend and check if username already exists
        }
    });
    form.appendChild(btn);
}

// Step 2:

// First name
// Family name
// Favourite Colour
// Birthday

// If everything is valid, clear step 2 and open step 3

function renderSignUpStep2(div) {
    div.innerHTML = '';


}

// Step 3:

// Build avatar

function renderSignUpStep3(div) {
    div.innerHTML = '';

    
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              User Profile
//


// #region

export function renderUserProfile(div, user) {
    div.innerHTML = '';
    console.log(user);
    backArrow('hide');

    const title = document.getElementById('user-profile-title');
    title.textContent = `User Account`;

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

    const avatar_btns_div = document.createElement('div');
    avatar_btns_div.id = 'avatar_btns_div';
    avatar_div.appendChild(avatar_btns_div);

    const swapBtn = header(
        'button', 'Swap Avatar', '', 'swap-avatar-btn', 'user-button user-input'
    )
    avatar_btns_div.appendChild(swapBtn);
    swapBtn.addEventListener('click', () => {
        renderSwapAvatarPage(div, user);
    });

    const editBtn = header(
        'button', 'Edit Avatar', '', 'edit-avatar-btn', 'user-button user-input'
    )
    avatar_btns_div.appendChild(editBtn);
    editBtn.addEventListener('click', () => {
        renderAvatarPage(div, user, 'updating');
    });

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

    const err = header(
        'h3', 'ERROR', 'red',
        'user-profile-error', 'middle-title'
    );
    err.style.visibility = 'hidden';
    form.appendChild(err);

    const og_username = user.username;
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

    const updateUsername = (type) => {
        if (type == 'Save') username.removeAttribute('readonly');
        if (type == 'Edit') username.setAttribute('readonly', true);
        username.classList.toggle('user_read');
        usernameBtn.innerHTML = `${type} Username`;
        err.style.visibility = 'hidden';
    }

    usernameBtn.addEventListener('click', async () => {
        if (username.hasAttribute('readonly')) {
            updateUsername('Save');
        } else if (username.value == og_username) {
            updateUsername('Edit');
        } else {
            const res = await fetch(`${route}/change/username`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player_id: user.player_id,
                    username: username.value
                })
            });
            const data = await res.json();
            if (data.ok) {
                updateUsername('Edit');
            } else {
                err.innerHTML = data.error;
                err.style.visibility = 'visible';
            }
        }
    });

    const password_section = document.createElement('div');
    password_section.className = 'user_input_section';
    form.appendChild(password_section);

    const change_password = document.createElement('div');
    change_password.id = 'user_change_password';
    password_section.appendChild(change_password);

    const old_div = document.createElement('div');
    old_div.className = 'user_input_div';
    change_password.appendChild(old_div);

    const old_password = document.createElement('input');
    old_password.type = 'password';
    old_password.id = 'old_password';
    old_password.placeholder = 'Old Password...';
    old_password.className = 'user-input';
    old_password.style.cursor = 'text';
    old_div.appendChild(old_password);

    const old_eye = document.createElement('img');
    old_eye.className = 'password_eye';
    old_eye.src = 'assets/eye_on.svg';
    old_div.appendChild(old_eye);
    old_eye.addEventListener('click', () => {
        if (old_password.type == 'password') {
            old_password.type = 'text';
            old_eye.src = 'assets/eye_off.svg';
        } else {
            old_password.type = 'password';
            old_eye.src = 'assets/eye_on.svg';
        }
    });

    const password_div = document.createElement('div');
    password_div.className = 'user_input_div';
    change_password.appendChild(password_div);

    const password = document.createElement('input');
    password.type = 'password';
    password.id = 'password';
    password.placeholder = 'New Password...';
    password.className = 'user-input';
    password.style.cursor = 'text';
    password_div.appendChild(password);

    const eye = document.createElement('img');
    eye.className = 'password_eye';
    eye.src = 'assets/eye_on.svg';
    password_div.appendChild(eye);
    eye.addEventListener('click', () => {
        if (password.type == 'password') {
            password.type = 'text';
            eye.src = 'assets/eye_off.svg';
        } else {
            password.type = 'password';
            eye.src = 'assets/eye_on.svg';
        }
    });

    const confirm_div = document.createElement('div');
    confirm_div.className = 'user_input_div';
    change_password.appendChild(confirm_div);
    
    const confirm = document.createElement('input');
    confirm.type = 'password';
    confirm.id = 'password';
    confirm.placeholder = 'Confirm Password...';
    confirm.className = 'user-input';
    confirm.style.cursor = 'text';
    confirm_div.appendChild(confirm);

    const confirm_eye = document.createElement('img');
    confirm_eye.className = 'password_eye';
    confirm_eye.src = 'assets/eye_on.svg';
    confirm_div.appendChild(confirm_eye);
    confirm_eye.addEventListener('click', () => {
        if (confirm.type == 'password') {
            confirm.type = 'text';
            confirm_eye.src = 'assets/eye_off.svg';
        } else {
            confirm.type = 'password';
            confirm_eye.src = 'assets/eye_on.svg';
        }
    });

    const passwordBtn = header(
        'button', 'Change Password', '', 'password-btn', 'user-button user-input'
    );
    password_section.appendChild(passwordBtn);
    passwordBtn.addEventListener('click', async () => {
        if (passwordBtn.innerHTML == 'Change Password') {
            
            change_password.style.visibility = 'visible';
            err.style.visibility = 'hidden';
            passwordBtn.innerHTML = 'Save Password';
        } else if (passwordBtn.innerHTML == 'Save Password') {
            if (old_password.value == '') {
                err.innerHTML = `Old Password Required`;
                err.style.visibility = 'visible';
            } else if (password.value == '') {
                err.innerHTML = `New Password Required`;
                err.style.visibility = 'visible';
            } else if (confirm.value == '') {
                err.innerHTML = `Confirm Password Required`;
                err.style.visibility = 'visible';
            } else if (password.value != confirm.value) {
                err.innerHTML = `Passwords don't match`;
                err.style.visibility = 'visible';
            } else {
                const res = await fetch(`${route}/change/password`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        player_id: user.player_id,
                        old_password: old_password.value,
                        new_password: password.value
                    })
                });
                const data = await res.json();
                if (data.ok) {
                    err.style.visibility = 'hidden';
                    change_password.style.visibility = 'hidden';
                    passwordBtn.innerHTML = 'Change Password';
                } else {
                    err.innerHTML = data.error;
                    err.style.visibility = 'visible';
                }
            }

        }
    });
    
    if (user.role == 'admin' || user.role == 'owner') {
        const other_div = document.createElement('div');
        other_div.className = 'user_input_section';
        form.appendChild(other_div);
        
        let curr_version = user.version;
        const versionBtn = header(
            'button', '', '', 'password-btn', 'user-button user-input'
        );
        other_div.appendChild(versionBtn);
        let change_header = (ver) => {
            versionBtn.innerHTML = ver == 'private' ?
                'Switch to Public' : 'Switch to Private'
        }
        change_header(curr_version);

        versionBtn.addEventListener('click', async () => {
            curr_version = curr_version == 'public' ?
                'private' : 'public'

            const res = await fetch(`${route}/change/version`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    player_id: user.player_id,
                    version: curr_version
                })
            });
            const data = await res.json();
            if (data) change_header(curr_version);
        });
    }

    const logoutBtn = header(
        'button', 'Log out', '', 'logout-btn', 'user-button user-input'
    )
    div.appendChild(logoutBtn);
    logoutBtn.addEventListener('click', logout);
}

export async function initialiseUser(modal, box, curr_colour) {
    user_data = await loadUserOption();
    console.log(user_data);
    const pfp = document.getElementById('profile-pic');
    pfp.addEventListener('click', () => openUserModal(
        modal, box, curr_colour, setupUserModal
    ));
    
    const back = document.getElementById('user-profile-back');
    back.addEventListener('click', () => goBackUserProfile('home'));
    
    const close = document.getElementById('user-profile-close');
    close.addEventListener('click', () => closeUserModal(modal, box));

    return user_data;
}
