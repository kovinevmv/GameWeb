// canvas Прямоуголник, на котором происходит отображение карты
// ctx Изображение на прямоуголнике
// window_x Движение карты вправо
// Струкутра element для хранения пары type, i
// ANIM - нужен для обновления изображения карты
var canvas, ctx, window_x, element ={type:0, i:0 }, ANIM;

// Создание менеджеров
let mm = new mapManager();
let sm = new spriteManager();
let em = new eventsManager();
let pm = new physicManager();
let SM = new soundManager();
let gm = new gameManager();

// Получение прямоугольника, его изображения из страницы game.html
function docSetup(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    window_x = 0;
    element ={type:0, i:0 };
}

// Текущее время
function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

// Обновление мира с течением времени
var step = 1/60, dt = 0, now, last = timestamp();
function updateWorld() {
    // Текущее время
    now = timestamp();
    // Насколько изменилось время по сравнению с предыдущим запуском обновления мира
    dt = dt + Math.min(1, (now - last) / 1000);

    // Если достаточно давно
    while (dt > step) {
        dt = dt - step;

        // Если не на паузе очистить все с прямогуольника и нарисовать новое положение всех объектов
        if (!gm.pause) {
            ctx.clearRect(0, 0, 1195, 800);
            gm.update();
        }

        // Если произошло событие прододжение игры (снятия паузы), то запуск музыки
        if (em.action["unpause"]) {
            gm.pause = false;
            SM.playBG(true);
        }
    }
    // Новое время для сравнения
    last = now;

    // Какая-то анимация
    ANIM = requestAnimationFrame(updateWorld, canvas);
}

// При загрузке страницы game.html у пользователя
$(document).ready(() => {
    // Нарисовать верхную панель с очками, именем и уровнем
    showGameInfo();
    // При нажатии на клавишу со старт, запусе игры, сокрытие клавишы старт
    $('#startGame').click(() => {
        gm.play();
        $('#startGame').css('display', 'none');
    });

    // Кнопка, появляющаяся при прохождениии уровня. Продолжить игру, новый уровень.
    $('#nextLevel').click(() => {
        // Скрыть это окно
        $('#nextLevelAlertModal').css('display', 'none');
        gm.play();
    });
})