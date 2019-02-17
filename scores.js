// В localstorage хранятся очки всех игроков и имя текущего игрока. После обноавления страницы или через много лет они все оставутся.
// Вид хранения данных: ключ - значение
// GamerName1 - 100
// GamerName2 - 130
// GamerName3 - 444
// currentName - GamerName1
// -------------------------
// currentName - нужен для сохранения текущего имени, для таблицы очков его нужно игнорировать


// Компаратор для быстрой сортировки
function compare(a, b) {
    return parseInt(a.score) < parseInt(b.score) ? 1 : -1;
}

// Преобразование данных из localstorage в отсортированный массив
function getScores(){
    let scores = [];
    // Пройтись по localstorage
    for (let i=0; i < localStorage.length ; i++){
        // В localstorage также отдельно хранится имя игрока, если это не оно, то
        if (localStorage.key(i) != 'currentName') {

            // Добавить в массив пару: имя, очки
            scores.push( {
                name: localStorage.key(i),
                score: localStorage.getItem(localStorage.key(i))
            });
        }
    }

    // Отсортровать
    return scores.sort(compare);
}

// При загрузке страницы с очками
$(document).ready(() => {
    // Получение отсортированного массива очков
    let scores = getScores();

    // Если никто ранее не играл
    if (scores.length == 0) {
        // Поле - No scores. Play game!. Не отображать таблицу
        $('.w3-display-container')
        .html('<h1 class="w3-animate-fading w3-blue-gray">No scores. Play game!</h1>');
    }
    else {
        // Для каждого пары - имя, очки
        scores.forEach((item, idx) => {
            // Создать ячейку в таблице
            let score = `<tr class="w3-hover-dark-grey">
                            <td>${idx + 1}</td>
                            <td>${item.name}</td>
                            <td>${item.score}</td>
                        </tr>`;
            // Записать ее на страницу
            $('#scores').append(score);
        });
    }
});

