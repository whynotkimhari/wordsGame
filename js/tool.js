/// WORDS GAME TEXT ANIMATION
export async function changeColor(element, color) {
    element.style.color = color;
    await new Promise(resolve => setTimeout(resolve, 500));
    element.style.color = 'black';
}

export async function render() {
    const elements = document.querySelectorAll('.title-sec span')

    for (const element of elements) {
        await changeColor(element, 'yellow');
    }
}

// FUNCTION TO PLAY AUDIO
export function playAudio(audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.play();
}

// FUNCTION TO SAVE DATA
export async function saveData(inputName, point, lives, usedWord, lastGiven, cntXtra, pass, userApiID, api) {
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
                counters: cntXtra,
                password: pass
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

/// FETCH JSON LIB
export async function handleFetchLib(callBack) {
    fetch('json/words.json')
        .then(res => res.json())
        .then(callBack)
}

/// END GAME NOTIFIER
export function endGameNotifier() {
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
                        if (willDelete) window.close();
                        else location.reload();
                    });
            }
        });
}