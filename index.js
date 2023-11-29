const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_FPLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},
      // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value;
        // localStorage.setItem(PLAYER_STRORGE_KEY, JSON.stringify(this.config));
    },
    songs: [
        {
            name: "Chuyen doi ta",
            singer:"110722",
            path:"./assets/music/song1.mp3",
            image:"./assets/img/img1.jpg",
        },
        {
            name: "Chung ta cua hien tai",
            singer:"110722",
            path:"./assets/music/song2.mp3",
            image:"./assets/img/img2.jpg",
        },
        {
            name: "Thang dien",
            singer:"110722",
            path:"./assets/music/song3.mp3",
            image:"./assets/img/img3.jpg"
        },
        {
            name: '3107 - id:072019',
            singer:'110722',
            path:"./assets/music/song4.mp3",
            image:"./assets/img/img4.jpg"
        },
        {
            name: 'Loi tam biet chua noi',
            singer:'110722',
            path:"./assets/music/song5.mp3",
            image:"./assets/img/img5.jpg"
        },
        {
            name: 'Vet mua',
            singer:'110722',
            path:"./assets/music/song6.mp3",
            image:"./assets/img/img6.jpg"
        },
        {
            name: 'Troi giau troi mang di',
            singer:'110722',
            path:"./assets/music/song7.mp3",
            image:"./assets/img/img7.jpg"
        },
        {
            name: 'Nguoi minh yeu chua chac da yeu minh',
            singer:'110722',
            path:"./assets/music/song8.mp3",
            image:"./assets/img/img8.jpg"
        },
        {
            name: 'Roi ra se ngam phao hoa cung nhau',
            singer:'110722',
            path:"./assets/music/song9.mp3",
            image:"./assets/img/img9.jpg"
        },
        {
            name: 'Finding you in sea of people',
            singer:'110722',
            path:"./assets/music/song10.mp",
            image:"./assets/img/img10.jpg",
        }
    ],

    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? "active" : ""}"data-index="${index}">
                    <div class="thumb" 
                    style="background-image: url(
                        '${song.image}'
                    )">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>    
            `;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        });
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xu ly CD quay / dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10s
            interations: Infinity

        })
        cdThumbAnimate.pause();

        // Xu Ly phong to / thu nho CD
        document.onscroll = function () {
            const srcollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - srcollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xu ly khi click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            } 
        };

        // Khi song duoc play 
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bi pause
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // khi tien do bai hat thay doi
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // Xu ly khi tua song
        progress.onchange = function(e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Khi next Song
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev Song
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xu ly bật tắt ramdom song
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);     
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Xu lý lặp lại một Song
        repeatBtn.onclick = function(e) { 
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);  
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Xu ly next song khi audio ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Lắng nghe clik hành vi playlist
        playlist.onclick=function (e) {
            const songNode = e.target.closest('.song:not(.active)');

            if (songNode || !e.target.closest('option')) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                } 

                // Xử lý khi click song option
                if (e.target.closest('.option')) {

                }
            }
        };
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntroView({
                behavior: "smooth",
                block: "nearest",
            });
        }, 300);
    },
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;

    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        // Gắn cấu hình config vào ứng dụng
        this.loadConfig();

        // Dinh nghia cac thuoc tinh cho object
        this.defineProperties();

        // Lang nghe / xu ly cac suc kien (DOM event)
        this.handleEvents();

        // Tai thong tin bai hat dau tien vao IU khi chay ung dung
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // Hiện thị trạng thái ban đầu repeat random
        randomBtn.classList.toggle("active", this.isRandom);
        repeatBtn.classList.toggle("active", this.isrepeat);
    }
};

app.start();
   