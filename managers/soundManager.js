// Менеджер музыки
class soundManager {

	constructor(){

		//Вся музыка
        this.src_array = ['resources/music/tank.mp3',
			'resources/music/car.mp3',
            'resources/music/break.mp3',
            'resources/music/winner.mp3',
            'resources/music/fuel.wav',
            'resources/music/levelup.mp3'];

        this.Audio =  new Audio();
        this.Music =  new Audio();
        this.done = false; // Играет ди фоновая

	}

	init(){
		// Если не играет фоновая музыка
		if(!this.done){
			// Циклический запуск
			this.Music.src = "resources/music/background.mp3";
			this.Music.loop = true;
			this.Music.volume = 0.3;
			this.done = true;
		}
	}

	// Запуск/остновка фоновой музыки
	playBG(x){
		// Если true, запуск
		if(x)
			this.Music.play();
		// Если false, остановка
		else 
			this.Music.pause();
	}

	// Запуск музыки по индексу из массива
	playSound(x){
		this.Audio.pause();
		this.Audio.src = this.src_array[x - 1];
		this.Audio.play();
	}

	// Остновка всей музыки
	stopAll(){
		this.Audio.pause();
		this.Music.pause();
	}
}