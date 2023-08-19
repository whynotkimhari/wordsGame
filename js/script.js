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
    1000: 0
}

/// API
const api = 'https://retoolapi.dev/pypiCl/data';
let userApiID = '';

///
var inputName;
var point = '';
var lives = '';
var usedWord;
var lastGiven;
var cntXtra;


//  MAIN
main();
function main() {
    render();
    getPlayerName();
    handleFetchLib(run);
    setInterval(render, 4500);
}

// FUNCTION TO GET PLAYER NAME
function getPlayerName() {
    swal({
        text: 'Enter your name to save your records',
        content: "input",
        buttons: ['Anonymous', 'OK']
    })
        .then(text => {
            if (text)
                inputName = text;

            fetch(api)
                .then(response => response.json())
                .then(array => {
                    let isExisted = false;
                    for (let i = 0; i < array.length; i++) {
                        if (array[i].name === inputName) {
                            isExisted = true;
                            point = array[i].content;
                            lives = array[i].lives;
                            usedWord = array[i].usedWord;
                            lastGiven = array[i].lastGiven;
                            cntXtra = array[i].counters;
                            userApiID = array[i].id;
                            break;
                        }
                    }

                    if (!isExisted) {
                        point = 0;
                        lives = 3;
                        usedWord = [];
                        lastGiven = "";
                        cntXtra = 0;
                    }

                    if (lastGiven) {
                        answerEl.innerHTML = `<h1><span class="word">${lastGiven}</span> was my last given word</h1>`
                    }
                    renderLivesPoints();
                })
        })
}

// FUNCTION TO PLAY AUDIO
function playAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

// FUNCTION TO OUT GAME AND SAVE, IF ANY
outEl.addEventListener('click', () => {
    swal({
        title: "Are you sure?",
        icon: "warning",
        text: "Leave your game and save",
        buttons: ['Just save', 'Save and Quit'],
        dangerMode: true,
    })
        .then((willDelete) => {
            console.log(willDelete)
            if (willDelete) {
                if (inputName && point) {
                    saveData()
                        .then(() => {
                            window.close();
                        })

                }
                else window.close();
            }

            else {
                if (inputName && point) saveData();
            }
        });
})

// FUNCTION TO SAVE DATA
async function saveData() {
    if (!userApiID) {
        return fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: inputName,
                content: point,
                lives: lives,
                usedWord: usedWord,
                lastGiven: lastGiven,
                counters: cntXtra
            })
        })
    }
    else {
        return fetch(api + '/' + userApiID, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: inputName,
                content: point,
                lives: lives,
                usedWord: usedWord,
                lastGiven: lastGiven,
                counters: cntXtra
            })
        })
    }

}

// RANKING HANDLER
rankEl.addEventListener('click', () => {
    fetch(api)
        .then(res => res.json())
        .then((array) => {
            var resultText = array.map((val) => {
                return {
                    name: val.name,
                    point: val.content
                }
            })
                .sort((a, b) => b.point - a.point)
                .slice(0, 10)
                .reduce((str, element) => {
                    if (element.name && element.point)
                        return str + `${element.name}: ${element.point} pts\n`;

                    else return str;
                }, "")

            swal({
                title: "Ranking",
                text: resultText
            })
        })
})

// HELP HANDLER
helpEl.addEventListener('click', () => {
    swal({
        title: "How to play?",
        text: `- Concatenating words like:
         egg-gas-socket-temples-sun-... 
         
         - You will have 3 lives and every 10 correct answers, you will get 1 extra more live 
         
         - If your lives lesser than 1, you will lose the game 
         
         - You can save the game, with the arrow button for later playing. Try your best!`,
        icon: "success",
        button: "Aww yiss!",
    });
})

/// FETCH JSON LIB
async function handleFetchLib(callBack) {
    fetch('json/words.json')
        .then(res => res.json())
        .then(callBack)
}

/// END GAME NOTIFIER
function endGameNotifier() {
    swal("You lost! Restart the game to play again", {
        buttons: ["Oh noez! I'm out", "Yezz sirrr!"]
    })
        .then((restart) => {
            if (restart) {
                swal("Poof! Your game has been restarted!", {
                    icon: "success",
                });
                location.reload();
            }
            else {
                swal({
                    title: "Are you sure?",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                })
                    .then((willDelete) => {
                        if (willDelete) {
                            window.close();
                        } else {
                            location.reload();
                        }
                    });
            }
        });
}

/// RENDER LIVES AND POINTS
function renderLivesPoints() {
    livesEl.innerHTML = `<i class='bx bxs-heart'></i> ${lives}`;
    pointsEl.innerHTML = `<i class='bx bx-plus-medical'></i> ${point}`;
}

/// MAIN LOGIC GAME
function run(dictionary) {

    renderLivesPoints();

    inputEl.addEventListener('change', (e) => {
        var inputWord = e.target.value.toLowerCase().trim();
        var lastPos = inputWord.length - 1;
        e.target.value = "";

        // If the input word is exist in the dictionary
        if (dictionary[inputWord[0]] === undefined) {
            answerEl.innerHTML = `<h1><span class="word">${inputWord}</span> does not exist in this dictionary</h1>`;
            if (lastGiven) {
                answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
            }
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
                        let times = 0;

                        var givenBackWord = dictionary[inputWord[lastPos]][Math.floor(Math.random() * dictionary[inputWord[lastPos]].length)];

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

        if (!lives) {
            if (inputName && point) {
                saveData();
            }

            endGameNotifier();
        }

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

/// WORDS GAME TEXT ANIMATION
async function changeColor(element, color) {
    element.style.color = color;
    await new Promise(resolve => setTimeout(resolve, 500));
    element.style.color = 'black';
}

async function render() {
    const elements = document.querySelectorAll('.title-sec span')

    for (const element of elements) {
        await changeColor(element, 'yellow');
    }
}
