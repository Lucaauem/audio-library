class AudioPlayer{
    ALL_SONGS = []
    TIMER_STEPS_MS = 500
    source = null
    audio = null
    currentPlayTime = 0
    timerInterval = null
    
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
            // Play audio
            this.audio.src = (this.source)
            this.audio.play()
            
            // Update time bar !FIXME!
            this.timerInterval = window.setInterval(() => {
                this.currentPlayTime += this.TIMER_STEPS_MS
                this.updateProcessBar()
            }, this.TIMER_STEPS_MS)
        }else{
            clearInterval(this.timerInterval)
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

    updateProcessBar(){
        if(this.audio.paused){
            clearInterval(this.timerInterval)
        }
        console.log(this.currentPlayTime)
    }
}