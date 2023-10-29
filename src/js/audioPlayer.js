class AudioPlayer{
    ALL_SONGS       = []
    TIMER_STEPS_MS  = 25
    currentPlayTime = 0
    source          = null
    audio           = null
    processSlider   = null
    timerInterval   = null
    
    constructor(audioPlayerId, songSliderId, allSources){
        this.audio = document.getElementById(audioPlayerId)
        this.audio.addEventListener('ended', this.songEnd.bind(this))
        this.processSlider = document.getElementById(songSliderId)
        this.processSlider.addEventListener('input', this.changePlaytime.bind(this))
        this.processSlider.value = 0
        this.ALL_SONGS = allSources
    }

    changeSource(src, name, duration){
        this.source = src
        this.audio.source = src
        this.currentPlayTime = 0
        
        document.getElementById('songName').innerHTML = name
        document.getElementById('songDurationTime').innerHTML = duration
    }

    play(){
        if(this.source == null){
            return
        }

        // Update icon
        document.getElementById('buttonPlay').classList.toggle('button-play-playing')
        
        if(this.audio.paused){
            if(this.currentPlayTime == 0){
                this.audio.src = this.source
            }

            this.audio.play()
            
            // Update time bar
            this.timerInterval = window.setInterval(() => {
                this.currentPlayTime += this.TIMER_STEPS_MS
                this.updateProcessBar()
            }, this.TIMER_STEPS_MS)
        }else{
            clearInterval(this.timerInterval)
            this.audio.pause()
        }
    }

    songEnd(){
        clearInterval(this.timerInterval)
        this.currentPlayTime = 0
        document.getElementById('buttonPlay').classList.toggle('button-play-playing')
    }

    changePlaytime(){
        if(this.source == null){
            return
        }

        // Convert the selected time into a multiple of the current timer step
        let selectedTimeInMs = (this.audio.duration * (parseInt(this.processSlider.value) / 100)) * 1000
        let correctStepTime  = parseInt(selectedTimeInMs / this.TIMER_STEPS_MS) * this.TIMER_STEPS_MS

        // Update audio player and playtime string
        this.audio.currentTime = correctStepTime / 1000
        this.currentPlayTime   = correctStepTime
        document.getElementById('songCurrentTime').innerHTML = this.toTimeString(correctStepTime)
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

        // Calculate the current percentage of the songs playing time
        let secondsPassed        = this.currentPlayTime / 1000
        this.processSlider.value = parseInt((secondsPassed / this.audio.duration) * 100)

        document.getElementById('songCurrentTime').innerHTML = this.toTimeString(this.currentPlayTime)
    }

    toTimeString(timeInMs){
        let time    = Math.round(timeInMs / 1000)
        let minutes = parseInt(time / 60)
        let seconds = parseInt(time - minutes * 60)
        seconds     = ('0' + seconds).slice(-2)

        return minutes + ':' + seconds
    }
}