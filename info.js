var playerName; // Имя игрока

// Нарисовать верхную панель с очками, именем и уровнем
function showGameInfo() {
    playerName = localStorage['currentName'];
    $('#playerName').text(`Name: ${playerName}`);
    $('#playerScore').text(`Points: ${gm.score}`);
    $('#currentLevel').text("Level: " + gm.curr_level + "/" + gm.max_level);
}

// Записать рекорд
function setScore() {

    // Имя текущего игрока
    let name = localStorage['currentName'];
    let search = false;

    // Пройтись по все сохраненным ранее игрокам в localstorage
    for (let i = 0; i < localStorage.length; i++) {
        // Если есть в списке
        if (localStorage.key(i) == name && localStorage.key(i) != 'currentName') {
            // Если набрал больше очков, чем ранее
            if (localStorage[localStorage.key(i)] < gm.score) {
                // Обновить очки
                localStorage[localStorage.key(i)] = gm.score;
                search = true; // Мы успешно записали новый результат
            }

            search = true; // Набрал меньше очков, но в таблице уже был
        }
    }

    // Впервые играет
    if (!search) {
        // Записать в данные
        localStorage[name] = gm.score;
    }
}