const pregame = document.getElementById('pregame');
const current = document.getElementById("current");
const answers = document.getElementById("answers");
const total_answers = document.getElementById('total-answers');
const avg_answers = document.getElementById('avg-answers');
const days_played = document.getElementById('days-played');
const last_played = document.getElementById('last-played');
const postgame = document.getElementById('postgame');
const matches = document.getElementById("matches");
const countdown = document.getElementById('countdown');
const toast = document.getElementById('toast');

function getStats() {
    let statistics = localStorage.getItem("statistics");
    return !statistics ? {'lastPlayed': "Never", 'daysPlayed': 0, 'totalAnswers': 0, 'avgAnswers': 0} : JSON.parse(statistics);
}

function getGameState(game_data=data, current=first) {
    let game_state = localStorage.getItem("game_state");
    return !game_state ? {"gameData": game_data, "current": current, "answers": 0, "strikes": 0, "guessed": [], "status": "in_progress"} : JSON.parse(game_state);
}

function updateStats(stats, lastPlayed, rightAnswers) {
    stats.lastPlayed = lastPlayed;
    stats.daysPlayed++;
    stats.totalAnswers += rightAnswers;
    stats.avgAnswers = stats.totalAnswers / stats.daysPlayed;
    return localStorage.setItem("statistics", JSON.stringify(stats));
}

function updateGameState(game_state, game_data, current, answers, strike, stat, guess, new_game=false) {
    game_state.gameData = game_data;
    game_state.current = current;
    game_state.answers = answers;
    !guess ? game_state.guessed = [] : game_state.guessed.push(guess); 
    !new_game ? game_state.strikes += strike : game_state.strikes = 0;
    game_state.status = stat;
    return localStorage.setItem("game_state", JSON.stringify(game_state));
}

function compDay(serv_day, lastPlayed) {
    return serv_day.toISOString().split('T')[0] > new Date(lastPlayed).toISOString().split('T')[0] ? true : false;
}

function startRound(c) {
    displayCurrent(c);
    for (let i = 0; i < answers.children.length; i++) {
        answers.children[i].innerHTML = data[0][i].name;
    }
}

function displayCurrent(c) {
    let caption = (c.category == "primaryTitle") ? "also starred..." : "also starred in...";
    current.children[1].innerHTML = c.name;
    current.children[2].innerHTML = caption;
}

function updateScore() {
    return current.children[0].innerHTML = parseInt(current.children[0].innerHTML) + 1;
}

function getAnswer(guess) {
    return guess.answer == true;
}

function resumeGame(guessed) {
    guessed.forEach((g) => {
        [...answers.children].forEach((c) => {
            if (c.innerHTML === g) {
                c.disabled = true;
                c.classList.add("bad-button");
                c.classList.remove("game-button");
            }
        });
    });
}

function disableButton(el) {
    el.disabled = true;
    el.classList.add("animate__headShake");
    setTimeout(() => {
        el.classList.add("bad-button");
        el.classList.remove("game-button");
    }, 300);
}

function restoreButtons() {
    [...answers.children].forEach((c) => {
        c.classList.remove('bad-button', 'animate__headShake');
        c.classList.add('game-button');
        c.disabled = false;
    });
}

function checkAnswer(el) {
    let guess = el.innerText;
    let answer = data[0].filter(getAnswer)[0];
    let game_state = getGameState();
    if (guess == answer.name) {
        data.shift();
        updateScore();
        updateGameState(game_state, data, answer, parseInt(current.children[0].innerHTML), 0, "in_progress", "");
        startRound(answer);
        restoreButtons();
    } else {
        disableButton(el);
        if (game_state.strikes < 2) {
            updateGameState(game_state, data, answer, parseInt(current.children[0].innerHTML), 1, "in_progress", guess);
        } else {
            let stats = getStats();
            updateStats(stats, serv_day, parseInt(current.children[0].innerHTML));
            updateGameState(game_state, data, answer, parseInt(current.children[0].innerHTML), 1, "complete", guess);
            endGame(game_state);
        }
    }
}

function startGame() {
    pregame.style.display = "none";
}

function getTomorrow() {
    let today = new Date();
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate()+1)
    tomorrow.setHours(0,0,0,0);
    return tomorrow.getTime();
}

function displayCountdown(tomorrow) {
    let today = new Date().getTime();
    let distance = tomorrow - today;
    let hh = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let mm = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let ss = Math.floor((distance % (1000 * 60)) / 1000); 
    let leadZeroTime = [hh, mm, ss].map(time => time < 10 ? `0${time}` : time);
    countdown.children[1].innerHTML = `${leadZeroTime[0]}:${leadZeroTime[1]}:${leadZeroTime[2]}`;
    return distance;
}

function showToast(text) {
    toast.innerHTML = text;
    toast.style.visibility = 'visible';
    toast.classList.remove('animate__fadeOutUp');
    toast.classList.add('animate__fadeInDown');
    setTimeout(() => {
        toast.classList.remove('animate__fadeInDown');
        toast.classList.add('animate__fadeOutUp');
    }, 3000);
}

function createShareable() {
    let g = getGameState();
    let d = serv_day.toISOString().split('T')[0];
    let m = g.answers;
    let ti = 'FilmMatch '.concat(d);
    let te = "Matches: ".concat(m);
    if (navigator.share) {
        navigator.share({
            title: ti,
            text: te,
        })
        .then(() => console.log('Share was successful.'))
        .catch((error) => console.log('Sharing failed', error));
    } else {
        navigator.clipboard.writeText(ti.concat("\n", te)).then(() => {
            showToast('Results copied to clipboard');
        });
    }
}

function endGame(game_state) {
    matches.innerHTML = game_state.answers;
    postgame.style.display = "flex";
    postgame.children[0].classList.add('animate__fadeInDown');
    let tomorrow = getTomorrow();
    displayCountdown(tomorrow); // initialize countdown
    let cd = setInterval(() => {
        let distance = displayCountdown(tomorrow);
        if (distance < 0) {
            countdown.children[1].innerHTML = 'Refresh to play now!';
            countdown.children[1].style.fontSize = '21px';
            clearInterval(cd);
        }
    }, 1000);
}

function openInfo() {
    info.classList.remove('animate__fadeOutDownBig')
    info.style.display = "block";
    info.classList.add('animate__fadeInUpBig');
}

function displayStats() {
    let stats = getStats();
    total_answers.children[1].innerHTML = stats.totalAnswers;
    avg_answers.children[1].innerHTML = Math.round(((stats.avgAnswers) + Number.EPSILON) * 100) / 100;
    days_played.children[1].innerHTML = stats.daysPlayed;
    if (stats.lastPlayed === "Never") {
        last_played.children[1].innerHTML = stats.lastPlayed;
    } else {
        last_played.children[1].innerHTML = new Date(stats.lastPlayed).toISOString().split('T')[0];
    }
}

function openStats() {
    displayStats();
    stats.classList.remove('animate__fadeOutDownBig')
    stats.style.display = "block";
    stats.classList.add('animate__fadeInUpBig');
}

function closeMenu(el) {
    let parent = el.parentElement;
    parent.classList.remove('animate__fadeInUpBig')
    parent.classList.add('animate__fadeOutDownBig');
    setTimeout(() => {
        parent.style.display = "none";
    }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
    var stats = getStats();
    var game_state = getGameState();
    if (game_state.status === "in_progress" && (game_state.answers > 0 || game_state.strikes > 0)) {
        data = game_state.gameData;
        startRound(game_state.current);
        resumeGame(game_state.guessed);
        current.children[0].innerHTML = game_state.answers;
    } else if (stats.lastPlayed === "Never" || compDay(serv_day, stats.lastPlayed)) {
        if (stats.lastPlayed === "Never") {
            pregame.style.display = 'flex';
            pregame.children[0].classList.add('animate__slideInDown');
        }
        updateGameState(game_state, data, first, 0, 0, "in_progress", "", new_game=true);
        startRound(first);
    } else {
        endGame(game_state);
    }
});
