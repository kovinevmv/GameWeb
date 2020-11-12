// Общий класс от которого идет наследование игрока, огня, демона, золота ..
class Entity  {
    constructor(){
        this.pos_x = 0;
        this.pos_y = 0; // позиция объекта
        this.size_x = 0;
        this.size_y =0; // размеры объекта
    }
}

// Золото
class Fuel extends Entity{
    constructor(){
        super();
        // Картинка 7
        this.dirSprite = "7";
    }

    // Отрисовка картиника на карте
    draw(ctx) {
        sm.drawSprite(ctx, this.dirSprite, this.pos_x, this.pos_y);
    }
    // Уничтожение
    kill() {
        gm.kill(this);
    }
    update() {}
}

// Демон
class Object1 extends Entity{
    constructor(){
        super();
        this.move_x = 0;
        this.move_y = 0;
    }
    draw (ctx) {}
}

// Огонь
class Object2 extends Entity{
    constructor(){
        super();
        this.dirSprite = "5";
    }
    draw(ctx) {
        sm.drawSprite(ctx, this.dirSprite, this.pos_x, this.pos_y);
    }
    kill() {
        gm.kill(this);
    }
    update() {}
}

// Лвлап
class Lv extends Entity{
    constructor(){
        super();
        this.dirSprite = "6";
    }

    draw(ctx) {
        sm.drawSprite(ctx, this.dirSprite, this.pos_x, this.pos_y);
    }
    kill() {
        gm.kill(this);
    }
    update() {}
}

// Граница
class Border extends Entity{
    constructor() {
        super();
        this.move_x = 0;
        this.move_y = 0;
    }

    draw(ctx) {}
}

// Финиш
class Finish extends Entity{
    constructor() {
        super();
        this.move_x = 0;
        this.move_y = 0;
    }

    draw(ctx) {}
}

// Игрок
class Player extends Entity {
    constructor() {
        super();
        this.move_x = 0;
        this.move_y = 0;
        this.deltaSprite = 1000; //  Для анимации счетчик времени одного слайда картинки
        this.dirSprite = "3_1"; // Картинка скелета
        this.speed = 5; // Скорость
        this.speed_x = 5;  // Ускорение
    }

    // Нарисовать игрока
    draw(ctx) {
        // Если тип - 0 скелет
        if (element.type === 0) {
            // Здесь происходит анимации
            // Либо отображение одной картинки, либо другой
            // Увеличиваем счетчик одно картинки
            this.deltaSprite++;
            if (this.deltaSprite % 10 === 0) {
                // Выбрать картинку скелета делающего шага
                this.dirSprite = "3_1";

                // Выбрать картинку скелета сделавшего шаг
                if (this.deltaSprite % 20 === 0) {
                    this.dirSprite = "3_2";
                }
            }
        }
        // Если тип - 1 кабан
        if (element.type === 1) {
            this.deltaSprite++;
            if (this.deltaSprite % 10 === 0) {
                this.dirSprite = "3_3";

                if (this.deltaSprite % 20 === 0) {
                    this.dirSprite = "3_4";
                }
            }
        }
        // Если тип - 2 грифон
        if (element.type === 2) {
            this.deltaSprite++;
            if (this.deltaSprite % 10 === 0) {
                this.dirSprite = "2";

                if (this.deltaSprite % 20 === 0) {
                    this.dirSprite = "2_2";
                }
            }
        }
        // Нариовать картинку игрока
        sm.drawSprite(ctx, this.dirSprite, this.pos_x, this.pos_y);
    }

    // Обновление физики
    update() {
        pm.update(this);
    }

    // Если игрок сопрокоснулся с чем-то
    onTouchEntity(obj) {
        // Если золото
        if (obj.name.match(/fuel/)) {
            // Убрать золото
            obj.kill();
            // Продолжить движение
            this.pos_x += this.speed;
            // Увлечить очки
            gm.score++;
            // Звук взятия золота
            SM.playSound(5);
            // Перериосвать очки в верхней панеле
            $('#playerScore').text(`Points: ${gm.score}`);
        }
        // Если финиш
        if (obj.name.match(/finish/)) {
            // Убрать игрока
            this.kill();
            // Если есть еще уровни
            if (gm.curr_level < gm.max_level) {
                // Увеличить счетчик уровней
                gm.levelUp();
                // Отобразить окно прохождения уровня
                $('#nextLevelAlertModal').css('display', 'block');
            } else if (gm.curr_level == gm.max_level) {
                // Если это последнее уровень, показать победное окно
                gm.gameEnd(false);
            }
        }
        // Если это лвлап
        if (obj.name.match(/lv/)) {
            // Убрать его
            obj.kill();
            // Продолжить движение
            this.pos_x += this.speed;

            // Если был кабаном, стать грифоном
            if (element.type === 1) {
                // Картинка - грифон, меньше скорость, другие размеры
                this.dirSprite = "2", element.type = 2, this.speed -= 3, this.speed_x -= 3, this.size_x = 100, this.size_y = 80;
                SM.playSound(1);
            } else {
                // Иначе - кабан, больше скорость, другие размеры
                this.dirSprite = "3_3", element.type = 1, this.speed += 2, this.speed_x += 2, this.size_x = 63, this.size_y = 90, element.type = 1;
                SM.playSound(2);
            }
        }

        // Если демон
        if (obj.name.match(/object1/)) {
            this.kill();
            // Умер, конец игры
            this.speed = 0;
            gm.gameEnd(true);
        }

        // Если огонь
        if (obj.name.match(/object2/)) {
            // если на кабане или скелет
            if (element.type === 0 || element.type === 1) {
                // Умер, конец игры
                this.kill();
                this.speed = 0;
                SM.stopAll();
                gm.gameEnd(true);
            }

            // Если на грифоне, то убрать огонь, продолжить движение
            if (element.type === 2) {
                obj.kill();
                this.pos_x += this.speed;
            }
        }
        // Если граница, не выходить за границу
        if (obj.name.match(/border/)) {
            if (this.move_y) {
                this.move_y = 0;
            }
            this.pos_x += this.speed;
        }

    }
    kill() {
        gm.kill(this);
    }
}