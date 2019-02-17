// Менеджер нажатий клавиш

class eventsManager {
    constructor(){
        this.bind =  []; // сопоставление клавиш действиям
        this.action = []; // действия

    }

    setup() { // настройка сопоставления
        this.bind[87] = 'up'; // w - двигаться вверх
        this.bind[83] = 'down'; // s - двигаться вниз
        this.bind[38] = 'up';  // Аналогично для стрелок
        this.bind[40] = 'down';

        this.bind[65] = 'left'; // Влево
        this.bind[37] = 'left';

        this.bind[39] = 'right'; // Вправл
        this.bind[68] = 'right';

        this.bind[32] = 'pause';  // Пауза по пробелу
        this.bind[27] = 'unpause'; // Снятие паузы по Esc

        // Создания слушателя нажатия и отпускания клавиш
        document.body.addEventListener("keydown", this.onKeyDown);
        document.body.addEventListener("keyup", this.onKeyUp);
    }

    // В случае нажатия клавиши получаем по сохраненным кодам выше действие: up, down ...
    onKeyDown(event) {
        var action = em.bind[event.keyCode];

        // Если на эту клавишу есть действие то
        if (action) {
            em.action[action] = true; // выполняем действие
        }
    }

    // Когда отпустили - отменить
    onKeyUp(event) {
        var action = em.bind[event.keyCode];
        if (action)
            em.action[action] = false; // отменили действие
    }
};