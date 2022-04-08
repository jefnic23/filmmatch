const current = document.getElementById("current");
const answers = document.getElementById("answers");

function getStats() {
    let statistics = localStorage.getItem("statistics");
    return !statistics ? {'lastPlayed': "Never", 'daysPlayed': 0, 'rightAnswers': 0, 'avgAnswers': 0} : JSON.parse(statistics);
}

function getGameState() {
    let game_state = localStorage.getItem("game_state");
    return !game_state ? {"answers": 0, "status": "in_progress"} : JSON.parse(game_state);
}

function updateStats(stats, lastPlayed, rightAnswers) {
    stats.lastPlayed = lastPlayed;
    stats.daysPlayed++;
    stats.rightAnswers += rightAnswers;
    stats.avgAnswers = stats.rightAnswers / stats.daysPlayed;
    return localStorage.setItem("statistics", JSON.stringify(stats));
}

function updateGameState(game_state, answers, stat) {
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
    return current.children[0].innerHTML = parseInt(current.children[0].innerHTML)++;
}

function getAnswer(guess) {
    return guess.answer == true;
}

function checkAnswer(el) {
    let guess = el.innerText;
    let answer = data.shift().filter(getAnswer)[0];
    if (guess == answer.name) {
        updateScore();
        startRound(answer);
    } else {
        alert("Wrong =(");
        let stats = getStats();
        let game_state = getGameState();
        updateStats(stats, serv_day, parseInt(current.children[0].innerHTML));
        updateGameState(game_state, parseInt(current.children[0].innerHTML), "complete")
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var stats = getStats();
    var game_state = getGameState();
    if (stats.lastPlayed === "Never" || compDay(serv_day, stats.lastPlayed) || game_state.status === "in_progress") {
        startRound(first);
    } else {
        console.log(stats, game_state); //display game results
    }
});