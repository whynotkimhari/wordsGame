const inputEl = document.querySelector('#input');
const answerEl = document.querySelector('#answer');
const selectEl = document.querySelector('#select');

handleFetchLib(run);

/// FETCH JSON LIB
async function handleFetchLib(callBack) {
    fetch('words-3000.json')
        .then(res => res.json())
        .then(callBack)
    selectEl.addEventListener('change', (e) => {
        console.log(e.target.value)
        fetch(e.target.value)
            .then(res => res.json())
            .then(callBack)
    });
}

function run(dictionary) {
    console.log(dictionary)
    var usedWord = [];
    inputEl.addEventListener('change', (e) => {
        var val = e.target.value;

        if(usedWord.indexOf(val) == -1) {
            var times = 0;
            e.target.value = "";

            console.log(val)
            console.log(dictionary[val])

            if(dictionary[val]) {
                wordGiveBack = dictionary[val][Math.floor(Math.random() * dictionary[val].length)];

                while(usedWord.indexOf(wordGiveBack) !== - 1) {
                    wordGiveBack = dictionary[val][Math.floor(Math.random() * dictionary[val].length)];
                    times++;

                    if(times > 20) break;
                }

                if(usedWord.indexOf(wordGiveBack) == - 1) {
                    usedWord.push(val);
                    console.log(wordGiveBack)
                    usedWord.push(wordGiveBack);
                    answerEl.innerHTML = `<h1>${wordGiveBack}</h1>`
                }

                else {
                    answerEl.innerHTML = `<h1>You defeat me!</h1>`
                }
            }

            else {
                answerEl.innerHTML = `<h1>Your word does not exist in this library</h1>`
            }
        }

        else {
            answerEl.innerHTML = `<h1>We have used this word before, mate!</h1>`
        }
    })
    
    // console.log(dictionary['dead'])
}