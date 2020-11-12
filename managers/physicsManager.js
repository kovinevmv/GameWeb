class physicManager {
    constructor() {}
    update(obj) {
        // Если
        if (obj.move_x === 0 && obj.move_y === 0)
            return "stop"; // скорости движения нулевые

        // Получние новой кординаты объекта с учетом его текущей позиции и скорости
        var newX = obj.pos_x + Math.floor(obj.move_x * obj.speed_x);
        var newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        var e = this.entityAtXY(obj, newX, newY); // объект на пути

        if (e !== null && obj.onTouchEntity) // если есть конфликт
            obj.onTouchEntity(e); // разбор конфликта внутри объекта
        //Если есть препятствие

        if (e === null) { // перемещаем объект на свободное место
            if (newX < window_x) {
                obj.pos_x = window_x;
            }
            else if (newX < window_x + $('.canvas').prop('width') - obj.size_x) {
                obj.pos_x = newX;
            }

            obj.pos_y = newY;
        }
        else {
            return "break"; // дальше двигаться нельзя
        }

        switch (obj.move_y) {
            case -1: // двигаемся вверх
                return "up";
            case 1: // двигаемся вниз
                return "down";
        }
    }

    // поиск объекта по координатам
    entityAtXY(obj, x, y) {
        for (var i = 0; i < gm.entities.length; i++) {
            var e = gm.entities[i]; // рассматриваем все объекты на карте
            if (e.name !== obj.name) { // имя не совпадает
                if (x + obj.size_x < e.pos_x || // не пересекаются
                    y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x ||
                    y > e.pos_y + e.size_y)
                    continue;
                return e; // найден объект
            }
        }
        return null; // объект не найден
    }
}