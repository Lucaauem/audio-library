class AudioPlayer{
    ALL_SONGS = []
    source = null
    audio = null
    
    constructor(id, allSources){
        this.audio = document.getElementById(id)
        this.ALL_SONGS = allSources
    }

    changeSource(src){
        this.source = src
    }

    play(){
        if(this.source == null){
            return
        }

        document.getElementById('buttonPlay').classList.toggle('button-play-playing')
        
        if(this.audio.paused){
            this.audio.src = (this.source)
            this.audio.play()
        }else{
            this.audio.pause()
        }
    }

    next(){
        if(this.source == null){
            return
        }

        let currentIndex = this.ALL_SONGS.indexOf(this.source)
        let nextIndex = (currentIndex + 1) % this.ALL_SONGS.length
        
        // !FIXME! -- not working while song is playing
        this.source = this.ALL_SONGS[nextIndex]
        this.play()
    }

    previous(){
        if(this.source == null){
            return
        }

        let currentIndex = this.ALL_SONGS.indexOf(this.source)
        let prevIndex = currentIndex != 0 ? (currentIndex - 1) : this.ALL_SONGS.length - 1

        this.source = this.ALL_SONGS[prevIndex]
        this.play()
    }

    pause(){

    }

    resume(){

    }

    mute(){

    }

    changeVolume(){
        
    }
}