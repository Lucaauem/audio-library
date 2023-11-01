class AudioPlayer{
    TIMER_STEPS_MS    = 25
    PREV_THRESHOLD_MS = 500
    currentPlayTime   = 0
    songIndex         = 0
    source            = null
    audio             = null
    processSlider     = null
    timerInterval     = null
    
    constructor(audioPlayerId, songSliderId){
        this.audio = document.getElementById(audioPlayerId)
        this.audio.addEventListener('ended', this.songEnd.bind(this))
        this.processSlider = document.getElementById(songSliderId)
        this.processSlider.addEventListener('input', this.selectPlaytime.bind(this))
        this.processSlider.value = 0
    }

    changeSource(src, name, duration, index){
        this.source          = src
        this.audio.source    = src
        this.currentPlayTime = 0
        this.songIndex       = index
        
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

    selectPlaytime(){
        if(this.source == null){
            return
        }

        this.changePlaytime(this.processSlider.value)
    }

    changePlaytime(value){
        // Convert the selected time into a multiple of the current timer step
        let selectedTimeInMs = (this.audio.duration * (parseInt(value) / 100)) * 1000
        let correctStepTime  = parseInt(selectedTimeInMs / this.TIMER_STEPS_MS) * this.TIMER_STEPS_MS

        // Update audio player and playtime string
        this.audio.currentTime = correctStepTime / 1000
        this.currentPlayTime   = correctStepTime
        document.getElementById('songCurrentTime').innerHTML = this.toTimeString(correctStepTime)
    }

    next(){
        if(this.source == null){
            return
        }

        // Get all songs and select the next
        let currentSongsDOM = Array.from(document.getElementById('fileList').childNodes).filter(file => file.tagName == 'DIV')
        this.songIndex      = (this.songIndex + 1) % currentSongsDOM.length

        let nextSongDOM    = currentSongsDOM[this.songIndex]
        let nextSongParams = nextSongDOM.getAttribute('onclick').split('\'')

        this.changeSource(nextSongParams[1], nextSongParams[3], nextSongParams[5], this.songIndex)
        
        // Start the next song
        this.play()
        this.play()
    }

    previous(){
        if(this.source == null){
            return
        }

        // Skip to start of the next if playtime > PREV_THRESHOLD
        if(this.currentPlayTime > this.PREV_THRESHOLD_MS){
            this.changePlaytime(0)
            return
        }

        // Get all songs and select the previous
        let currentSongsDOM = Array.from(document.getElementById('fileList').childNodes).filter(file => file.tagName == 'DIV')
        let previousIndex   = this.songIndex - 1
        this.songIndex      = previousIndex < 0 ? currentSongsDOM.length - 1 : previousIndex

        let nextSongDOM    = currentSongsDOM[this.songIndex]
        let nextSongParams = nextSongDOM.getAttribute('onclick').split('\'')

        this.changeSource(nextSongParams[1], nextSongParams[3], nextSongParams[5], this.songIndex)

        // Start the next song
        this.play()
        this.play()
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