// Менеждер карты
class mapManager {
	constructor(){
		this.mapData = null;
		this.tLayer = null;
		this.xCount = 0; //20
		this.yCount = 0; //6
		this.imgLoadCount = 0; // Количество загруженных изображений
		this.imgLoaded = false; // Изображения не загружены
		this.jsonLoaded = false; // json не загружен
		this.tSize = {x: 32, y: 32};
		this.mapSize = {x: 300, y: 20};
		this.view = {x: 0, y: 0, w: 9600, h: 650};
		this.tilesets =[];
	}

    // загрузка карты через запрос, получение объектов^ 1.json, 2.json ...
    loadMap(path) {
        fetch(path)
        .then(response => response.json())
        .then(json => mm.parseMap(json))
    }
    
    parseMap(tilesJSON) {
            this.mapData = tilesJSON; //разобрать JSON
            this.xCount = this.mapData.width; // соэранение ширины
            this.yCount = this.mapData.height; // сохранение высоты
            this.tSize.x = this.mapData.tilewidth; // сохранение размера блока
            this.tSize.y = this.mapData.tileheight; // сохранение размера блока
            this.mapSize.x = this.xCount * this.tSize.x; // вычисление размера карты
            this.mapSize.y = this.yCount * this.tSize.y;
            for (var i = 0; i < this.mapData.tilesets.length; i++) {
                var img = new Image(); // создаем переменную для хранения изображений
                img.onload = function () { // при загрузке изображения
                    mm.imgLoadCount++;
                    if (mm.imgLoadCount === mm.mapData.tilesets.length) {
                        mm.imgLoaded = true; // загружены все изображения
                    }
                };
                img.src = this.mapData.tilesets[i].image; // задание пути к изображению
                var t = this.mapData.tilesets[i]; //забираем tileset из карты
                var ts = { // создаем свой объект tileset
                    firstgid: t.firstgid, // с него начинается нумерация в data
                    image: img,
                    name: t.name, // имя элемента рисунка
                    xCount: Math.floor(t.imagewidth / mm.tSize.x), // горизонталь
                    yCount: Math.floor(t.imageheight / mm.tSize.y) // вертикаль
                }; // конец объявления ts
                this.tilesets.push(ts); // сохраняем tileset в массив
            } // окончание цикла for
            this.jsonLoaded = true; // когда разобран весь json
        }

	draw(ctx) { // отрисовка карты в контексте
        // если карта не загружена, то повторить прорисовку через 100 мс
        if (!mm.imgLoaded || !mm.jsonLoaded) {
            setTimeout(function () {
                mm.draw(ctx);
            }, 100);
        } else {
            var layerCount = 0;
            if (this.tLayer === null) {// проверка, что tLayer настроен
                for (var id = 0; id < this.mapData.layers.length; id++) {
                    // проходим по всем layer карты
                    var layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") {
                        this.tLayer = layer;
                    }
                }
            }
            for (var i = 0; i < this.tLayer.data.length; i++) { // проходим по всей карте  !!!
                if (this.tLayer.data[i] !== 0) { // если данных нет, то пропускаем
                    var tile = this.getTile(this.tLayer.data[i]); // получение блока по индексу
                    var pX = (i % this.xCount) * this.tSize.x; // вычисляем x в пикселях
                    var pY = Math.floor(i / this.xCount) * this.tSize.y;
                    // не рисуем за пределами видимой зоны
                    if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;
                    // сдвигаем видимую зону
                    pX -= this.view.x;
                    pY -= this.view.y;
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x, this.tSize.y, pX - window_x, pY, this.tSize.x, this.tSize.y); //
                    //отрисовка в контексте
                }
            }
        }
    }
    
    getTile(tileIndex) { // индекс блока
        var tile = {
            img: null, // изображение tileset
            px: 0, py: 0 // координаты блока в tileset
        };
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image; // изображение искомого tileset
        var id = tileIndex - tileset.firstgid; // индекс блока в tileset
        // блок прямоугольный, остаток от деления на xCount дает х в tileset
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);
        tile.px = x * mm.tSize.x;
        tile.py = y * mm.tSize.y;
        return tile; // возвращаем тайл для отображения
    }

    getTileset(tileIndex) { // получение блока по индексу
        for (var i = mm.tilesets.length - 1; i >= 0; i--) {
            // в каждом tilesets[i].firstgid записано число, с которого начинается нумерация блоков
            if (mm.tilesets[i].firstgid <= tileIndex) {
                // если индекс первого блока меньше , либо равен искомому, значит этот tileset и нужен
                return mm.tilesets[i];
            }
        }
        return null;
    }

    isVisible(x, y, width, height) {
        // не рисуем за пределами видимой зоны
        return !(x + width < this.view.x || y + height < this.y || x > this.view.x + this.view.w || y > this.view.y + this.view.h);
    }
	
    parseEntities() { // разбор слоя типа objectgroup
        if (!mm.imgLoaded || !mm.jsonLoaded) {
            setTimeout(function () {
                mm.parseEntities();
            }, 100);
        } else
            for (var j = 0; j < this.mapData.layers.length; j++) // просмотр всех слоев
                if (this.mapData.layers[j].type === 'objectgroup') {
                    var entities = this.mapData.layers[j]; // слой с объектами следует разобрать
                    for (var i = 0; i < entities.objects.length; i++) {
                        var e = entities.objects[i];
                        try {
                            // Создание объекта и указание его свойств
                            var obj = Object.create(gm.factory[e.type]);
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;

                            // Если это игрок (скелет), инициализировать игрока
                            // Задать изображение dirSprite = 3_1 то есть фигурка скелета
                            if (obj.name === 'Player') {
                                obj.dirSprite = '3_1';
                                gm.initPlayer(obj);
                            }
                            // Добавить в массив объектов
                            gm.entities.push(obj);
                        } catch (ex) {
                            // Ошибка создания
                            console.log("Error while creating: [" + e.gid + "]" + e.type + " " + ex);
                        }
                    }
                }
    }
}