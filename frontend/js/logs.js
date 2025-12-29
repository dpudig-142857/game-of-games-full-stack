//
// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Global Variables
//


// #region

import {
    logoBox,
    updateTimeDisplays,
    header
} from '../js/utils.js';

import { BASE_ROUTE } from './config.js';

let gog_version = 'private' // public vs private
let logs = [];
let selectedSort = 'Most Recent';
let selectedStatus = 'All';
let searchTerm = '';

let filtersDiv = document.getElementById('filters');
let logsDiv = document.getElementById('logs');

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Helper Functions
//


// #region

function colour(s) {
    if (s == 'complete') return 'rgba(40, 167, 69, 0.8)';
    if (s == 'incomplete') return 'rgba(220, 53, 69, 0.8)';
    if (s == 'active') return 'rgba(255, 193, 7, 0.8)'
    return 'rgba(0, 123, 255, 0.8)';
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Sort and Filter
//


// #region

function createSortandFilter() {
    const sortOptions = [
        'Most Recent', 'Least Recent',
        'Most Players', 'Least Players',
        'Most Games', 'Least Games',
        'Winner A-Z', 'Winner Z-A'
    ];
    const filterOptions = ['All', 'Complete', 'Active', 'Incomplete'];

    const sortDropdown = createDropdown('Sort...', sortOptions, (value) => {
        selectedSort = value;
        createLogs(selectedSort, selectedStatus, searchTerm);
    });

    const filterDropdown = createDropdown('Filter Status...', filterOptions, (value) => {
        selectedStatus = value;
        createLogs(selectedSort, selectedStatus, searchTerm);
    });

    const searchBox = document.createElement('input');
    searchBox.type = 'text';
    searchBox.placeholder = 'Search by player...';
    searchBox.className = 'search-box';
    searchBox.addEventListener('input', () => {
        searchTerm = searchBox.value.trim().toLowerCase();
        createLogs(selectedSort, selectedStatus, searchTerm);
    });

    const filter = document.getElementById('filters');
    filter.appendChild(sortDropdown);
    filter.appendChild(filterDropdown);
    filter.appendChild(searchBox);
}

function createDropdown(text, options, onSelect) {
    const dropdown = document.createElement('div');
    dropdown.className = 'dropdown';
    dropdown.style.position = 'relative';

    const btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'dropbtn';
    btn.style.background = '#33EAFF';
    btn.appendChild(header('h2', text, 'black'));
    dropdown.appendChild(btn);

    const content = document.createElement('div');
    content.className = 'dropdown-content';

    options.forEach(optionValue => {
        const option = document.createElement('a');
        option.href = '#';
        option.dataset.value = optionValue;
        option.style.textAlign = 'center';
        option.style.background = '#33EAFF';

        option.addEventListener('click', (e) => {
            e.preventDefault();
            btn.innerHTML = '';
            btn.dataset.value = optionValue;
            btn.appendChild(header('h2', optionValue, 'black'));
            content.style.display = 'none';
            onSelect(optionValue);
        });

        option.appendChild(header('h3', optionValue, 'black'));
        content.appendChild(option);
    });

    dropdown.addEventListener('mouseenter', () => { content.style.display = 'block'; });
    dropdown.addEventListener('mouseleave', () => { content.style.display = 'none'; });
    dropdown.appendChild(content);

    return dropdown;
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Logs
//


// #region

function createLogs(order = 'Most Recent', filter = 'All', nameSearch = '') {
    logsDiv.innerHTML = '';

    let newLogs = logs.filter(log => {
        const statusMatch = filter === 'All' || log.status === filter.toLowerCase();
        const nameMatch = !nameSearch || log.players.toLowerCase().includes(nameSearch);
        return statusMatch && nameMatch;
    });

    const recent = (a, b) => b.session_id - a.session_id;

    if (order == 'Most Recent') {
        newLogs.sort((a, b) => recent(a, b));
    } else if (order == 'Least Recent') {
        newLogs.sort((a, b) => recent(b, a));
    } else if (order == 'Most Players') {
        newLogs.sort((a, b) => {
            const aPlayers = a.players.split(' vs ');
            const bPlayers = b.players.split(' vs ');
            const diff = bPlayers.length - aPlayers.length;
            return diff != 0 ? diff : recent(b, a);
        });
    } else if (order == 'Least Players') {
        newLogs.sort((a, b) => {
            const aPlayers = a.players.split(' vs ');
            const bPlayers = b.players.split(' vs ');
            const diff = aPlayers.length - bPlayers.length;
            return diff != 0 ? diff : recent(b, a);
        });
    } else if (order == 'Most Games') {
        newLogs.sort((a, b) => {
            const diff = b.total_games - a.total_games;
            return diff != 0 ? diff : recent(b, a);
        });
    } else if (order == 'Least Games') {
        newLogs.sort((a, b) => {
            const diff = a.total_games - b.total_games;
            return diff != 0 ? diff : recent(b, a);
        });
    } else if (order == 'Winner A-Z') {
        newLogs.sort((a, b) => {
            if (!a.winner) return 1;
            if (!b.winner) return -1;
            return a.winner.localeCompare(b.winner) || recent(b, a);
        });
    } else if (order == 'Winner Z-A') {
        newLogs.sort((a, b) => {
            if (!a.winner) return 1;
            if (!b.winner) return -1;
            return b.winner.localeCompare(a.winner) || recent(b, a);
        });
    }

    newLogs.forEach(log => createBox(log));
    return newLogs;
}

function createBox(log) {
    const box = document.createElement('div');
    box.className = 'box';
    box.style.background = colour(log.status);
    box.appendChild(header('h3', log.name));

    const statusWinner = document.createElement('div');
    statusWinner.className = 'status-winner-row';

    const statusBadge = document.createElement('span');
    statusBadge.textContent = log.status.charAt(0).toUpperCase() + log.status.slice(1);
    statusBadge.className = 'status-badge ' + log.status;
    statusWinner.appendChild(statusBadge);

    if (log.status === 'complete' && log.winner) {
        const winnerText = document.createElement('span');
        winnerText.innerHTML = `<strong>Winner:</strong> ${log.winner}`;
        winnerText.className = 'winner-info';
        statusWinner.appendChild(winnerText);
    }

    box.appendChild(statusWinner);

    const players = document.createElement('h4');
    players.innerHTML = log.players.split(' vs ').join('<span class=`small-text`> vs </span>');
    players.className = 'players-info';
    box.appendChild(players);

    if (log.total_games != undefined) {
        const numGames = document.createElement('p');
        numGames.innerHTML = `<strong>Games Played:</strong> ${log.total_games}`;
        numGames.className = 'games-info';
        box.appendChild(numGames);
    }

    const statusDates = document.createElement('div');
    statusDates.className = 'status-and-dates';

    const from = document.createElement('p');
    const start = new Date(log.start_time);
    from.innerHTML = `<strong>Started:</strong> ${start.toLocaleString()}`;
    from.className = 'dates-info';
    statusDates.appendChild(from);

    const to = document.createElement('p');
    const finish = new Date(log.finish_time);
    const time = finish.toLocaleString();
    const text = log.status == 'complete' ? `${time}` : 'Not yet lol';
    to.innerHTML = `<strong>Finished:</strong> ${text}`;
    to.className = 'dates-info';
    statusDates.appendChild(to);

    box.appendChild(statusDates);

    box.addEventListener('click', () => {
        window.open(`results.html?sessionId=${log.session_id}`);
    });

    logsDiv.appendChild(box);
}

// #endregion


// ----------------------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------------------
//
//              Initialise
//


// #region

async function initialise() {
    try {
        logoBox();
        setInterval(updateTimeDisplays, 1000);
        updateTimeDisplays();
    
        const res = await fetch(`${BASE_ROUTE}/api/sessions/logs`);
        logs = await res.json();

        createSortandFilter();
        createLogs('Most Recent');
        //logs.forEach(log => createBox(log));
    } catch (err) {
        console.error('Failed to initialise: ', err);
    }
}

// #endregion

initialise();