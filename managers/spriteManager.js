// Отвечает за создание картинок, берет картинки из spritesheet.png
// Координаты картинок заданы в atlas.json
// У каждой картинки есть имя:
// 3_1, 3_2: скелет
// 3_3, 3_4: кабан
// 2, 2_2: грифон
// 7: золото
// 5: огонь
// 6: стрелка лвлапа

class spriteManager {
    constructor(){
        this.image =  new Image();
        this.sprites = [];
        this.imgLoaded = false;
        this.jsonLoaded = false;
    }

    // Поолучение картинок,
    loadAtlas(atlasJson, atlasImg) {
        fetch(atlasJson)
            .then(response => response.json())
            .then(json => sm.parseAtlas(json));

        this.loadImg(atlasImg);
    }

    loadImg(imgName) { // загрузка изображения
        this.image.onload = function () {
            sm.imgLoaded = true;
        };
        this.image.src = imgName;
    }

    parseAtlas(atlasJSON) { // разбор атласа с обеъектами
        var atlas = atlasJSON;
        for (var name in atlas.frames) { // проход по всем именам в frames
            var frame = atlas.frames[name].frame; // получение спрайта и сохранение в frame
            this.sprites.push({name: name, x:frame.x, y: frame.y, w: frame.w, h: frame.h}); // сохранение характеристик frame в виде объекта
        }
        this.jsonLoaded = true; // атлас разобран
    }

    drawSprite(ctx, name,  x, y) {
        // если изображение не загружено, то повторить запрос через 100 мс
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(function () {
                sm.drawSprite(ctx, name, x, y);
            }, 100);
        } else {
            var sprite = this.getSprite(name); // получить спрайт по имени
            if (!mm.isVisible(x, y, sprite.w, sprite.h))
                return; // не рисуем за пределами видимой зоны
            x -= mm.view.x;
            y -= mm.view.y;
            // отображаем спрайт на холсте
            ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x-window_x, y, sprite.w, sprite.h);
        }
    }

    getSprite(name) { // получить спрайт по имени
        for (var i = 0; i < this.sprites.length; i++) {
            var s = this.sprites[i];
            if (s.name === name)
                return s;
        }
        return null; // не нашли спрайт
    }
};