// Главный класс, отвечающий ща события в игре
class gameManager { // менеджер игры
    constructor(){
        this.factory = null; // фабрика объектов на карте
        this.entities =null; // объекты на карте (игрок, огонь, золото...)
        this.player = null; // указатель на объект игрока
        this.score = 0; // очки
        this.pause = false; // на паузе
        this.curr_level = 1; // текущий уровень
        this.max_level = 3; // максимальный уровень
        this.laterKill = []; // массив объектов, необходимых убрать (вышедшие за пределы экрана, взятое золото)
    }

    initPlayer(obj) { // инициализация игрока
        this.player = obj;
    }
    update() { // обновление информации
        if (this.player === null)
            return;

        // Если не на паузе, то двигаться вправо
        if (!this.pause) {
            this.player.move_x = 1;
            this.player.move_y = 0;
            // Сдвинуть мир
            window_x += this.player.speed;
        }

        // Если нажали на кнопку движения, сместить игрока
        if (em.action["up"]) {
            this.player.move_y = -1;
        }
        if (em.action["down"]) {
            this.player.move_y = 1;
        }
        if (em.action["left"]) {
            this.player.move_x = -1;
        }
        if (em.action["right"]) {
            this.player.move_x = 2;
        }
        // Если на паузу, задать паузу
        if (em.action["pause"]) {
            this.pause = true;
            SM.playBG(false);
        }

        //обновление информации по всем объектам на карте
        this.entities.forEach(function (e) {
            try {
                e.update();
            } catch(ex) {}
        });

        // Убрать несуществующие объекты
        for(var i = 0; i < this.laterKill.length; i++) {
            var idx = this.entities.indexOf(this.laterKill[i]);
            if(idx > -1)
                this.entities.splice(idx, 1); // удаление из массива 1 объекта
        }
        if (this.laterKill.length > 0) // очистка массива laterKill
            this.laterKill.length = 0;

        // Нарисовать карту
        mm.draw(ctx);
        // нарисовать объекты
        this.draw(ctx);
    }

    // нарисовать объекты
    draw(ctx) {
        // Каждый обхект рисуем
        for (var e = 0; e < this.entities.length; e++) {
            this.entities[e].draw(ctx);
        }
    }

    // Загрузка
    loadAll() {
        SM.init(); // инициализация музыки
        sm.loadAtlas("atlas.json", "spritesheet.png"); // загрузка атласа и картинок
        gm.factory['Player'] = new Player(); // инициализация фабрики
        gm.factory['finish'] = new Finish();
        gm.factory['object1'] =new  Object1();
        gm.factory['object2'] = new Object2();
        gm.factory['lv'] = new Lv();
        gm.factory['fuel'] =new Fuel();
        gm.factory['border'] =new Border();
        mm.loadMap("maps/" + gm.curr_level + ".json"); // загрузка карты
        mm.parseEntities(); // разбор сущностей карты
        mm.draw(ctx); // отобразить карту
        em.setup(); // настройка событий
    }
    // Начало уровня
    play() {
        // Нарисовать верхнюю панель
        showGameInfo();
        // Иницализация прямоугольника (canvas) для игры
		docSetup();

		//Очистка игрока, объектов, фабрики с предыдущего уровня
		gm.player = null;
		gm.entities = [];
		gm.factory = {};
				
		// Загрука менеджера, смотри выше функцию
        gm.loadAll();
        // Фоновая музыка - старт
        SM.playBG(true);
        // Нарисовать мир
        updateWorld();
    }

    kill(obj) {
        this.laterKill.push(obj);
    }

    // Конец игры
	gameEnd(gameover){
        // Если проиграл
		if(gameover) {
		    // Конец фоновой музыке
			SM.playBG(false);
			// Звук поражения
            SM.playSound(3);
            // Окно поражения
            $('#gameResult').text('You lose!');
            $('#gameResultText').html('You died, although the skeletons are so dead');
            $('#gameResultModal').css('display', 'block');
        }
        else {
            // Если прошел игры
			SM.playBG(false);
			// Музыка победы
			SM.playSound(4);
			// Окно победы
            $('#gameResult').text('You win!');
            $('#gameResultText').html('Congratulation! End game');
            $('#gameResultModal').css('display', 'block');
		}
        // Сохранить очки
        setScore();
    }

    // Повышение уровня
	levelUp(){
		SM.playSound(6);
        this.curr_level++;
        SM.playBG(false);
	}
}