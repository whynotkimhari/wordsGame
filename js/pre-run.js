// FUNCTION FOR ADMIN TO REMOVE PLAYER FROM RANKINGS
function deleteUser(userID, api) {
    fetch(api + '/' + userID, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(()  => {
        fetch(api)
        .then(res => res.json())
        .then(array => {
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
                    return str + `<div class="title-admin">${element.name}: ${element.point} pts <button onclick="deleteUser(${element.id}, '${api}')">X</button></div>`
                }
                return str;
            }, "")
            Swal.fire({
                title: "Ranking",
                html: resultText
            })
        })
    })
}