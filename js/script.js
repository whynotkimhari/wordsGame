import {
    render,
    playAudio,
    saveData,
    handleFetchLib,
    endGameNotifier,
} from '../js/tool.js';

/// ELEMENT VARIABLES
const inputEl = document.querySelector('#input');
const answerEl = document.querySelector('#answer');
const livesEl = document.querySelector('#lives');
const pointsEl = document.querySelector('#points');
const helpEl = document.querySelector('#help');
const rankEl = document.querySelector('#rank');
const outEl = document.querySelector('#out');

/// AUDIO VARIABLES
const passAudio = new Audio('mp3/pass.mp3');
const wrongAudio = new Audio('mp3/wrong.mp3');
const victoryAudio = new Audio('mp3/victory.mp3');

// CONST MESSAGES
const inputNameMsg = {
    text: 'Enter your name to save your records',
    content: "input",
    buttons: 'OK'
}

const inputPasswordMsg= {
    text: 'Enter/Create your password',
    content: "input",
    buttons: 'OK'
}

const incorrectPasswordMsg = {
    title: "Your password is incorrect",
    icon: "warning",
    buttons: 'OK',
    dangerMode: true,
}

const unknownErrorMsg = {
    title: "This page may meet some bugs! Please come later!",
    icon: "warning",
    text: '404',
    buttons: 'I got it!',
    dangerMode: true,
}

const outGameMsg = {
    title: "Are you sure?",
    icon: "warning",
    text: "Leave your game and save",
    buttons: ['Just save', 'Save and Quit'],
    dangerMode: true,
}

const helpMsg = {
    title: "How to play?",
    text: `- Concatenating words like:
     egg-gas-socket-temples-sun-... 
     
     - You will have 3 lives and every 10 correct answers, you will get 1 extra more live 
     
     - If your lives lesser than 1, you will lose the game 
     
     - You can save the game, with the arrow button for later playing or let the game save it for you!`,
    icon: "success",
    button: "Aww yiss!",
}

// REWARD
const reward = {
    20: 0,
    40: 0,
    60: 0,
    80: 0,
    100: 0,
    200: 0,
    400: 0,
    600: 0,
    800: 0,
    1000: 0,
    1100: 0,
    1200: 0,
    1300: 0,
    1400: 0,
    1500: 0,
    1600: 0,
    1700: 0,
    1800: 0,
    1900: 0,
    2000: 0,
    2100: 0,
    2200: 0,
    2300: 0,
    2400: 0,
}

/// API
const api = 'https://retoolapi.dev/pypiCl/data';
let userApiID = 0;

///
var inputName,
    point = '',
    lives = '',
    usedWord,
    lastGiven,
    cntXtra,
    pass = '';

let isAdmin = false;

//  MAIN
main();
function main() {
    render();
    handlePlayerName();
    handleFetchLib(run);
    setInterval(render, 4500);
}

// FUNCTION TO GET PLAYER NAME
function handlePlayerName() {
    swal(inputNameMsg)
    .then(text => {
        if (text) {
            inputName = text;
            if (inputName === 'admin') isAdmin = true;

            swal(inputPasswordMsg)
            .then(password => {
                if (password)
                    fetch(api)
                    .then(response => response.json())
                    .then(array => {
                        let isExisted = false;
                        for (let i = 0; i < array.length; i++) {
                            if (array[i].name === inputName && array[i].password === password) {
                                isExisted = true;
                                point = array[i].content;
                                lives = array[i].lives;
                                usedWord = array[i].usedWord;
                                lastGiven = array[i].lastGiven;
                                cntXtra = array[i].counters;
                                userApiID = array[i].id;
                                pass = array[i].password;
                                break;
                            }

                            else if (array[i].name === inputName && array[i].password !== password) {
                                swal(incorrectPasswordMsg)
                                .then(() => location.reload())
                            }
                        }

                        if (!isExisted) initNewPlayer(password);

                        if (lastGiven) answerEl.innerHTML =
                            `<h1><span class="word">${lastGiven}</span> was my last given word</h1>`;

                        renderLivesPoints();
                    })
                    .catch(err => {
                        swal(unknownErrorMsg)
                        .then(() => window.close())
                    })

                else location.reload();
            })
        }
        else location.reload();
    })
}

// FUNCTION INIT NEW PLAYER
function initNewPlayer(password) {
    point = 0;
    lives = 3;
    usedWord = [];
    lastGiven = "";
    cntXtra = 0;
    pass = password;
}


// FUNCTION TO OUT GAME AND SAVE, IF ANY
outEl.addEventListener('click', () => {
    swal(outGameMsg)
    .then((isExit) => {
        if (isExit) {
            if (inputName && point) {
                saveData(inputName, point, lives, usedWord, lastGiven, cntXtra, pass, userApiID, api)
                .then(window.close);
            }
            else window.close();
        }

        else {
            if (inputName && point) saveData(inputName, point, lives, usedWord, lastGiven, cntXtra, pass, userApiID, api);
        }
    });
})

// RANKING HANDLER
rankEl.addEventListener('click', () => {
    fetch(api)
    .then(res => res.json())
    .then((array) => {
        var resultText = array.map((val) => {
            return {
                name: val.name,
                point: val.content,
                id: val.id
            }
        })
        .sort((a, b) => b.point - a.point)
        .slice(0, 15)
        .reduce((str, element) => {
            if (element.name && element.point) {
                if (isAdmin) return str + `<div class="title-admin">${element.name}: ${element.point} pts <button onclick="deleteUser(${element.id}, '${api}')">X</button></div>`
                else return str + `<div class="title-user"><span class="element-name">${element.name}:</span> <span class="element-pts">${element.point} pts</span></div>`;
            }

            else return str;
        }, "")
        Swal.fire({
            title: "Ranking",
            html: resultText
        })
    })
})

// HELP HANDLER
helpEl.addEventListener('click', () => swal(helpMsg))

/// RENDER LIVES AND POINTS
function renderLivesPoints() {
    livesEl.innerHTML = `<i class='bx bxs-heart'></i> ${lives}`;
    pointsEl.innerHTML = `<i class='bx bx-plus-medical'></i> ${point}`;
}

/// MAIN LOGIC GAME
function run(dictionary) {

    renderLivesPoints();

    inputEl.addEventListener('change', (e) => {
        let inputWord = e.target.value.toLowerCase().trim(),
            lastPos = inputWord.length - 1;

        e.target.value = "";

        // If the input word is exist in the dictionary
        if (dictionary[inputWord[0]] === undefined) {
            answerEl.innerHTML = `<h1><span class="word">${inputWord}</span> does not exist in this dictionary</h1>`;
            if (lastGiven) 
                answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
            
            lives--;
            playAudio(wrongAudio);
        }
        else {
            if (dictionary[inputWord[0]].indexOf(inputWord) !== -1) {
                if (usedWord.indexOf(inputWord) !== -1) {
                    playAudio(wrongAudio);
                    lives--;
                    answerEl.innerHTML = `<h1>We have used <span class="word">${inputWord}</span> before, mate!</h1>`;
                    answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
                }

                else {
                    if (lastGiven && (lastGiven[lastGiven.length - 1] !== inputWord[0])) {
                        playAudio(wrongAudio);
                        lives--;
                        answerEl.innerHTML = `<h1>Your word does not match with <span class="word">${lastGiven}</span>!</h1>`;
                        answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
                    }
                    else {
                        playAudio(passAudio);
                        point++;
                        cntXtra++

                        if (cntXtra == 10) {
                            lives++;
                            cntXtra = 0;
                        }

                        usedWord.push(inputWord);

                        let times = 0,
                            givenBackWord = dictionary[inputWord[lastPos]][Math.floor(Math.random() * dictionary[inputWord[lastPos]].length)];

                        while (usedWord.indexOf(givenBackWord) !== -1 || givenBackWord === inputWord) {
                            givenBackWord = dictionary[inputWord[lastPos]][Math.floor(Math.random() * dictionary[inputWord[lastPos]].length)];
                            times++;

                            if (times > 10000) break;
                        }

                        if (usedWord.indexOf(givenBackWord) === -1) {
                            usedWord.push(givenBackWord);
                            answerEl.innerHTML = `<h1>My word is <span class="word">${givenBackWord}</span></h1>`;
                            lastGiven = givenBackWord;
                        }

                        else {
                            playAudio(victoryAudio);
                            answerEl.innerHTML = `<h1>You defeat me! Congratulation!!!</h1>`;
                        }
                    }
                }
            }

            else {
                playAudio(wrongAudio);
                lives--;
                answerEl.innerHTML = `<h1><span class="word">${inputWord}</span> does not exist in this dictionary</h1>`;
                if (lastGiven) {
                    answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
                }
            }
        }

        if (inputName && point)
            saveData(inputName, point, lives, usedWord, lastGiven, cntXtra, pass, userApiID, api)
            .then(rs => rs.json())
            .then(val => userApiID = val.id);

        if (!lives) endGameNotifier();

        livesEl.innerHTML = `<i class='bx bxs-heart'></i> ${lives}`;
        pointsEl.innerHTML = `<i class='bx bx-plus-medical'></i> ${point}`;

        if (reward[point] === 0) {
            reward[point]++;
            swal({
                icon: "success",
                title: "Congrats!",
                text: "You got " + point + " points! Keep tryin'",
                button: "Cool!",
            })
        }
    })
}

