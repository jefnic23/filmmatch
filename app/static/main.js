const current = document.getElementById("current");
const answers = document.getElementById("answers");

function startRound(c) {
    displayCurrent(c);
    for (let i = 0; i < answers.children.length; i++) {
        answers.children[i].innerHTML = data[0][i].name;
    }
}

function displayCurrent(c) {
    let caption = (c.category == "primaryTitle") ? "also starred..." : "also starred in...";
    current.children[0].innerHTML = c.name;
    current.children[1].innerHTML = caption;
}

function getAnswer(guess) {
    return guess.answer == true;
}

function checkAnswer(el) {
    let guess = el.innerHTML;
    let answer = data.shift().filter(getAnswer)[0];
    if (guess == answer.name) {
        alert("Correct!");
        startRound(answer);
    } else {
        alert("Wrong =(");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    startRound(first);
});