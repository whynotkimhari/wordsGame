const inputEl = document.querySelector('#input');
const answerEl = document.querySelector('#answer');
const livesEl = document.querySelector('#lives');
const pointsEl = document.querySelector('#points');
const helpEl = document.querySelector('#help');
const rankEl = document.querySelector('#rank');

const passAudio = new Audio('pass.mp3');
const wrongAudio = new Audio('wrong.mp3');
const victoryAudio = new Audio('victory.mp3');

render();
handleFetchLib(run);

rankEl.addEventListener('click', () => {
    fetch('db.json')
        .then(res => res.json())
        .then((array) => {
            // console.log(typeof array, array)
            var resultText = array.rankings.map((val) => {
                return {
                    name: val.name,
                    point: val.content
                }
            })
            .sort((a, b) => b.point - a.point)
            .reduce((str, element) => {
                return str + `${element.name}: ${element.point} pts\n`;
            }, "")

            swal({
                title: "Fake Ranking",
                text: resultText
            })
        })
})

helpEl.addEventListener('click', () => {
    swal({
        title: "How to play?",
        text: "- Concatenating words like: \n egg-gas-socket-temples-sun-... \n\n - You will have 10 lives and every 10 correct answers, you will get 1 extra more live \n\n - If your lives lesser than 1, you will lose the game \n\n - I may lose the game, but It is very hard for you to defeat me. Try your best!",
        icon: "success",
        button: "Aww yiss!",
    });
})

/// FETCH JSON LIB
async function handleFetchLib(callBack) {
    fetch('words.json')
        .then(res => res.json())
        .then(callBack)
}

function run(dictionary) {
    // console.log(dictionary)
    var point = 0;
    var lives = 10;
    var usedWord = [];
    var lastGiven = "";
    var cntXtra = 0;
    livesEl.innerHTML = `<i class='bx bxs-heart'></i> ${lives}`;
    pointsEl.innerHTML = `<i class='bx bx-plus-medical'></i> ${point}`;

    inputEl.addEventListener('change', (e) => {
        var inputWord = e.target.value.toLowerCase();
        var lastPos = inputWord.length - 1;
        e.target.value = "";

        // If the input word is exist in the dictionary
        if (dictionary[inputWord[0]].indexOf(inputWord) !== -1) {
            if (usedWord.indexOf(inputWord) !== -1) {
                wrongAudio.pause();
                wrongAudio.currentTime = 0;
                wrongAudio.play();
                lives--;
                answerEl.innerHTML = `<h1>We have used <span class="word">${inputWord}</span> before, mate!</h1>`;
                answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
            }

            else {
                if (lastGiven && (lastGiven[lastGiven.length - 1] !== inputWord[0])) {
                    wrongAudio.pause();
                    wrongAudio.currentTime = 0;
                    wrongAudio.play();
                    lives--;
                    answerEl.innerHTML = `<h1>Your word does not match with <span class="word">${lastGiven}</span>!</h1>`;
                    answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
                }
                else {
                    passAudio.pause();
                    passAudio.currentTime = 0;
                    passAudio.play();
                    point++;
                    cntXtra++

                    if (cntXtra == 10) {
                        lives++;
                        cntXtra = 0;
                    }
                    usedWord.push(inputWord);
                    let times = 0;

                    // console.log(inputWord)
                    // console.log(dictionary[inputWord[lastPos]])

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
                        victoryAudio.pause();
                        victoryAudio.currentTime = 0;
                        victoryAudio.play();
                        answerEl.innerHTML = `<h1>You defeat me! Congratulation!!!</h1>`;
                    }
                }
            }
        }

        else {
            wrongAudio.pause();
            wrongAudio.currentTime = 0;
            wrongAudio.play();
            lives--;
            answerEl.innerHTML = `<h1><span class="word">${inputWord}</span> does not exist in this library</h1>`
            if (lastGiven) {
                answerEl.innerHTML += `<h1>Try others to defeat <span class="word">${lastGiven}</span></h1>`;
            }
        }

        if (!lives) {
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
            // location.reload();
        }

        livesEl.innerHTML = `<i class='bx bxs-heart'></i> ${lives}`;
        pointsEl.innerHTML = `<i class='bx bx-plus-medical'></i> ${point}`;
    })
}

/// WORDS GAME TEXT 

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

setInterval(render, 4500);
