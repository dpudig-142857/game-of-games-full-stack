export function logoBox() {
    const logoDiv = document.getElementById('logo-area');
    logoDiv.innerHTML = '';
    Object.assign(logoDiv.style, {
        flex: '0 0 auto',
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        alignItems: 'center',
    });

    const img = document.createElement('img');
    img.src = 'assets/GameofGamesV4-Transparent.png';
    img.alt = 'GoG Logo';
    img.className = 'logo';
    img.style.width = '5rem';
    logoDiv.appendChild(img);

    const div = document.createElement('div');
    div.className = 'hover-box';
    logoDiv.appendChild(div);
    Object.assign(div.style, {
        display: 'none',
        position: 'absolute',
        right: '-1rem',
        bottom: '5rem',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#33eaff',
        textShadow: '#0ff 0.1rem 0.1rem 0.5rem',
        padding: '1rem 1.5rem',
        borderRadius: '2rem',
        width: 'max-content',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: 800,
        textAlign: 'center',
        flexDirection: 'column',
        gap: '1rem',
    });

    const text = (type, text) => {
        const p = document.createElement('p');
        p.innerHTML = `<strong>${type}:</strong> ${text}`;
        div.appendChild(p);
    }

    text('Founders', 'The Boys');
    text('Logo Design', 'Madi Foley');
    text('UI/UX Design', 'Dan Pudig');
    text('Full-Stack Development', 'Dan Pudig');

    const hover = (show) => div.style.display = show ? 'flex' : 'none';

    logoDiv.addEventListener('mouseenter', () => hover(true));
    logoDiv.addEventListener('mouseleave', () => hover(false));
    div.addEventListener('mouseover', () => hover(true));
    div.addEventListener('mouseleave', () => hover(false));
}

export function updateTimeDisplays() {
    // Current time
    const now = new Date();
    let currTime = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });
    const currTimeDiv = document.getElementById('current-time');
    currTimeDiv.innerHTML = '';
    currTimeDiv.appendChild(header('h3', `🕒 ${currTime}`));

    const e = document.getElementById('time-extra');
    e.innerHTML = '';
    if (currTime.includes('04:20')) {
        e.appendChild(header('h3', '🐀 Ratatouille!'));
        e.style.display = 'flex';
    } else if (currTime.includes('11:11')) {
        e.appendChild(header('h3', '🌟 Make a wish!'));
        e.style.display = 'flex';
    } else {
        e.style.display = 'none';
    }
    return now;
}

export function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
}

export function hexToRgba(hex, alpha = 0.85) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function hexToTextColour(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r*299 + g*587 + b*114) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

export function styleBox(box, colour) {
    if (colour == null) {
        box.style.background = 'transparent';
        box.style.boxShadow = 'none';
        return;
    }
    box.style.color = hexToTextColour(colour);
    box.style.background = `linear-gradient(
        135deg,
        ${hexToRgba(colour, 0.9)} 0%,
        ${hexToRgba(colour, 0.75)} 50%,
        ${hexToRgba(colour, 0.9)} 100%
    )`;
    box.style.boxShadow = `
        0 0 0.5rem ${hexToRgba(colour, 0.7)},
        0 0 1rem ${hexToRgba(colour, 0.55)}
    `;
    box.style.textShadow = 'none';
}

export function getDisplayNames(players) {
    return players.map((p, _, all) => {
        const name = p.name;
        const player_id = p.player_id;

        const same = all.filter(o => o.name == name);
        if (same.length == 1) return { name, player_id };

        let i = 1;
        let last = p.family.slice(0, i);
        while (same.some(o => o != p && last == o.family.slice(0, i))) {
            i++;
            last = p.family.slice(0, i);
        }

        return { name: `${name} ${last}`, player_id };
    });
}

export function header(type, text, colour = '', id = '', className = '') {
    let header = document.createElement(type);
    header.innerHTML = text;
    if (colour != '') header.style.color = colour;
    if (id != '') header.id = id;
    if (className != '') header.className = className
    return header;
}

export function format(players) {
    if (players.length == 1) return players[0];
    if (players.length == 2) return `${players[0]} and ${players[1]}`;
    return `${players.slice(0, -1).join(', ')} and ${players[players.length - 1]}`;
}

export function split(players) {
    if (!players.includes(' and ')) return [players];

    const lastAndIndex = players.lastIndexOf(' and ');
    const before = players.slice(0, lastAndIndex);
    const last = players.slice(lastAndIndex + 5);
    const names = before.length > 0 ? before.split(', ') : [];
    names.push(last);
    return names;
}

export function place(num) {
    if (num == 1) return '1st';
    if (num == 2) return '2nd';
    if (num == 3) return '3rd';
    if (num >= 4) return `${num}th`;
    return '';
}

export function placeColour(num) {
    if (num == 1) return '#FFD700';
    if (num == 2) return '#D9D9D9';
    if (num == 3) return '#E67E22';
    if (num >= 4) return '#33EAFF';
    return '';
}

export function typeText(ver, type) {
    if (ver == 'private') {
        switch (type) {
            case 'overall_cone': return 'Overall Cones:';
            case 'pg_cone': return 'Pre-Game/Break Cones:';
            case 'f20g_cone': return '4:20 Game Cones:';
            case 'l_cone': return 'Losing Cones:';
            case 'c_cone': return 'Coin Flip Cones:';
            case 'w_cone': return 'Wheel Cones:';
            case 'v_cone': return 'Victory Cones:';
        }
    } else if (ver == 'public') {
        switch (type) {
            case 'overall_cone': return 'Overall Shots:';
            case 'pg_cone': return 'Pre-Game/Break Shots:';
            case 'l_cone': return 'Losing Shots:';
            case 'c_cone': return 'Coin Flip Shots:';
            case 'w_cone': return 'Wheel Shots:';
            case 'v_cone': return 'Victory Shots:';
        }
    }
    switch (type) {
        case 'overall_point': return 'Overall Points:';
        case 'g_point': return 'Game Points:';
        case 'c_point': return 'Coin Flip Points:';
        case 'special_w_point': return 'Speciality Points Won:';
        case 'special_l_point': return 'Speciality Points Lost:';
        case 'neigh': return 'Neigh Cards Used:';
        case 'super_neigh': return 'Super Neigh Cards Used:';
        case 'gooc_total': return 'GooC Cards Earned:';
        case 'gooc_used': return 'GooC Cards Used:';
        case 'overall_game': return 'Games:';
        case 'overall_player': return 'Players:';
        default: return '';
    }
}

export function gameTypeText(type) {
    if (type == 'card') return '🎴 Card Games 🃏';
    if (type == 'board') return '🎲 Board Games ♟';
    if (type == 'video') return '🎮 Video Games 🕹️';
    if (type == 'party') return '🎉 Party Games 🍃';
    if (type == 'outdoor') return '🏕️ Outdoor Games 🏓';
    return '';
}

export function centerOrStart(div, type, dir = 'width') {
    setTimeout(() => {
        let overflow = true;
        if (dir == 'width') overflow = div.scrollWidth == div.clientWidth;
        if (dir == 'height') overflow = div.scrollHeight == div.clientHeight;
        if (type == 'justify') {
            div.style.justifyContent = overflow ? 'center' : 'flex-start';
        } else if (type == 'align') {
            div.style.alignItems = overflow ? 'center' : 'flex-start';
        }
    }, 0);
}

