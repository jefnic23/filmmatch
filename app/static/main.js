const current = document.getElementById("current");
const answers = document.getElementById("answers");

function getStats() {
    let statistics = localStorage.getItem("statistics");
    return (statistics == true) ? JSON.parse(statistics) : {'lastPlayed': "Never", 'daysPlayed': 0, 'rightAnswers': 0, 'avgAnswers': 0, 'avgPct': 0};
}

function getGameState(lastPlayed, data) {
    let game_state = localStorage.getItem("game_state");
    return (game_state == false || compDay() > lastPlayed) ? {"gameLength": data.length, "answers": 0, "compPct": 0, "status": "in_progress"} : JSON.parse(game_state);
}

function updateStats(stats, lastPlayed, rightAnswers) {
    return ;
}

function updateGameState(game_state, answers) {
    return ;
}

function compDay() {
    let today = new Date()
    let offset = today.getTimezoneOffset();
    today = new Date(today.getTime() - (offset*60*1000));
    return today.toISOString().split('T')[0];
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
    let guess = el.innerHTML;
    let answer = data.shift().filter(getAnswer)[0];
    if (guess == answer.name) {
        updateScore();
        startRound(answer);
    } else {
        alert("Wrong =(");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var stats = getStats();
    var game_state = getGameState(stats.lastPlayed, data);
    startRound(first);
});