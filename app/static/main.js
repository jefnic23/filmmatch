const pregame = document.getElementById('pregame');
const current = document.getElementById("current");
const answers = document.getElementById("answers");

function getStats() {
    let statistics = localStorage.getItem("statistics");
    return !statistics ? {'lastPlayed': "Never", 'daysPlayed': 0, 'rightAnswers': 0, 'avgAnswers': 0} : JSON.parse(statistics);
}

function getGameState(game_data=data, current=first) {
    let game_state = localStorage.getItem("game_state");
    return !game_state ? {"gameData": game_data, "current": current, "answers": 0, "status": "in_progress"} : JSON.parse(game_state);
}

function updateStats(stats, lastPlayed, rightAnswers) {
    stats.lastPlayed = lastPlayed;
    stats.daysPlayed++;
    stats.rightAnswers += rightAnswers;
    stats.avgAnswers = stats.rightAnswers / stats.daysPlayed;
    return localStorage.setItem("statistics", JSON.stringify(stats));
}

function updateGameState(game_state, game_data, current, answers, stat) {
    game_state.gameData = game_data;
    game_state.current = current;
    game_state.answers = answers;
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

function checkAnswer(el) {
    let guess = el.innerText;
    let answer = data.shift().filter(getAnswer)[0];
    let stats = getStats();
    let game_state = getGameState();
    if (guess == answer.name) {
        updateScore();
        updateStats(stats, serv_day, parseInt(current.children[0].innerHTML));
        updateGameState(game_state, data, answer, parseInt(current.children[0].innerHTML), "in_progress");
        startRound(answer);
    } else {
        alert("Wrong =(");
        let stats = getStats();
        updateStats(stats, serv_day, parseInt(current.children[0].innerHTML));
        updateGameState(game_state, data, answer, parseInt(current.children[0].innerHTML), "complete")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var stats = getStats();
    var game_state = getGameState();
    if (game_state.status === "in_progress" && game_state.answers > 0) {
        data = game_state.gameData;
        startRound(game_state.current);
        current.children[0].innerHTML = game_state.answers;
    } else if (stats.lastPlayed === "Never" || compDay(serv_day, stats.lastPlayed)) {
        pregame.style.display = 'flex';
        pregame.children[0].classList.add('animate__slideInDown');
        startRound(first);
    } else {
        console.log(stats, game_state); //display game results
    }
});