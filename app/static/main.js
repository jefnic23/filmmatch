const current = document.getElementById('current'),
    answers = document.getElementById('answers')
;

document.addEventListener('DOMContentLoaded', () => {
    current.innerHTML = first.name;
    for (let i = 0; i < answers.children.length; i++) {
        answers.children[i].innerHTML = data[0][i].name;
    }
});