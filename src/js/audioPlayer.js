class AudioPlayer{
    ALL_SONGS       = []
    TIMER_STEPS_MS  = 250
    currentPlayTime = 0
    source          = null
    audio           = null
    timerInterval   = null
    
    constructor(id, allSources){
        this.audio = document.getElementById(id)
        this.ALL_SONGS = allSources
    }

    changeSource(src, name, duration){
        this.source = src

        document.getElementById('songName').innerHTML = name
        document.getElementById('songDurationTime').innerHTML = duration
    }

    play(){
        if(this.source == null){
            return
        }

        document.getElementById('buttonPlay').classList.toggle('button-play-playing')
        
        if(this.audio.paused){
            if(this.currentPlayTime == 0){
                this.audio.src = this.source
            }

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
    }

    previous(){
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
            return
        }
        document.getElementById('songCurrentTime').innerHTML = this.toTimeString(this.currentPlayTime)
    }

    toTimeString(timeInSeconds){
        let time = Math.round(timeInSeconds / 1000)

        let minutes = parseInt(time / 60)
        let seconds = parseInt(time - minutes * 60)
        seconds = ('0' + seconds).slice(-2)

        return minutes + ':' + seconds
    }
}