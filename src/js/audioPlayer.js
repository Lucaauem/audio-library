/**
 * Class which handles the custom audio player.
 * It changes the audio source, jumps to the next audio and the
 * volume. It also can jump to a given position of the audio.
 * 
 * !FIXME! Songs will not play
 * 
 * @author Luca Aussem
 * @version 1.0.0
 */
class AudioPlayer{
    /**@access private */
    #TIMER_STEP_MS = 25
    /**@access private */
    #PREV_THRESHOLD_MS = 500
    /**@access private */
    #FILE_DIRECTORY = ''
    /**@access private */
    #process_slider = document.getElementById('songProcessSlider')
    /**@access private */
    #audio = document.getElementById('audioPlayer')
    /**@access private */
    #currentPlayTime = 0
    /**@access private */
    #songIndex = 0
    /**@access private */
    #source = null
    /**@access private */
    #timerInterval = null
    
    constructor(fileDirectoryPath){
        this.#FILE_DIRECTORY = fileDirectoryPath.replaceAll('\\\\', '\\')
        this.#audio.addEventListener('ended', this.songEnd.bind(this))
        this.#process_slider.addEventListener('input', this.selectPlaytime.bind(this))
        this.#process_slider.value = 0
    }

    /**
     * Changes the source of the audio file and updates the
     * data in the frontend.
     * 
     * @param {String} src       Path of the file
     * @param {String} name      Name of the files (without extension)
     * @param {String} duration  Duration of the song (mm:ss)
     * @param {int}    index     Index of the audio in the current list of shown files
     * @param {String} extension Extension of the file
     * @param {int}    size      Filesize in MB
     */
    changeSource(src, name, duration, index, extension, size){
        this.#source          = src.replace(this.#FILE_DIRECTORY, '')
        this.#audio.source    = this.#source
        this.#currentPlayTime = 0
        this.#songIndex       = index
        
        this.updateSongCurrentSongData([name, name, src, extension, duration, size])
        
        document.getElementById('songName').innerHTML = name
        document.getElementById('songDurationTime').innerHTML = duration
    }

    /**
     * Triggered when clicked on the "play" button.
     * Starts/stops the audio and updates the frontend correnspondingly.
     */
    play(){
        if(this.#source == null){
            return
        }

        // Update icon
        document.getElementById('buttonPlay').classList.toggle('button-play-playing')
        
        if(this.#audio.paused){
            if(this.#currentPlayTime == 0){
                this.#audio.src = this.#source
            }

            this.#audio.play()
            
            // Update time bar
            this.#timerInterval = window.setInterval(() => {
                this.#currentPlayTime += this.#TIMER_STEP_MS
                this.updateProcessBar()
            }, this.#TIMER_STEP_MS)
        }else{
            clearInterval(this.#timerInterval)
            this.#audio.pause()
        }
    }

    /**
     * Updates the front-/backend when a song has ended.
     */
    songEnd(){
        clearInterval(this.#timerInterval)
        this.#currentPlayTime = 0
        document.getElementById('buttonPlay').classList.toggle('button-play-playing')
    }

    selectPlaytime(){
        if(this.#source == null){
            return
        }

        this.changePlaytime(this.#process_slider.value)
    }

    changePlaytime(value){
        // Convert the selected time into a multiple of the current timer step
        let selectedTimeInMs = (this.#audio.duration * (parseInt(value) / 100)) * 1000
        let correctStepTime  = parseInt(selectedTimeInMs / this.#TIMER_STEP_MS) * this.#TIMER_STEP_MS

        // Update audio player and playtime string
        this.#audio.currentTime = correctStepTime / 1000
        this.#currentPlayTime   = correctStepTime
        document.getElementById('songCurrentTime').innerHTML = this.toTimeString(correctStepTime)
    }

    /**
     * Skips the current audio and jumps to the next audio in the list.
     */
    next(){
        if(this.#source == null){
            return
        }

        // Get all songs and select the next
        let currentSongsDOM = Array.from(document.getElementById('fileList').childNodes).filter(file => file.tagName == 'DIV')
        this.#songIndex      = (this.#songIndex + 1) % currentSongsDOM.length

        let nextSongDOM    = currentSongsDOM[this.#songIndex]
        let nextSongParams = nextSongDOM.getAttribute('onclick').split('\"')
        nextSongParams[1] = nextSongParams[1].replaceAll('\\\\', '\\')

        this.changeSource(nextSongParams[1], nextSongParams[3], nextSongParams[5], this.#songIndex, nextSongParams[9], nextSongParams[11])
        
        // Start the next song
        this.play()
        this.play()
    }

    /**
     * If the song is playing longer than a given threshold {@link #PREV_THRESHOLD_MS}, it will restart the song.
     * Otherwise it will jump to the previous song in the list.
     */
    previous(){
        if(this.#source == null){
            return
        }

        // Skip to start of the next if playtime > PREV_THRESHOLD
        if(this.#currentPlayTime > this.#PREV_THRESHOLD_MS){
            this.changePlaytime(0)
            return
        }

        // Get all songs and select the previous
        let currentSongsDOM = Array.from(document.getElementById('fileList').childNodes).filter(file => file.tagName == 'DIV')
        let previousIndex   = this.#songIndex - 1
        this.#songIndex      = previousIndex < 0 ? currentSongsDOM.length - 1 : previousIndex

        let nextSongDOM    = currentSongsDOM[this.#songIndex]
        let nextSongParams = nextSongDOM.getAttribute('onclick').split('\"')
        nextSongParams[1] = nextSongParams[1].replaceAll('\\\\', '\\')

        this.changeSource(nextSongParams[1], nextSongParams[3], nextSongParams[5], this.#songIndex, nextSongParams[9], nextSongParams[11])

        // Start the next song
        this.play()
        this.play()
    }

    mute(){

    }

    changeVolume(){
        
    }

    /**
     * Updates the value of the slider thus it is synced with the current process of the audio.
     */
    updateProcessBar(){
        if(this.#audio.paused){
            clearInterval(this.#timerInterval)
            return
        }

        // Calculate the current percentage of the songs playing time
        let secondsPassed          = this.#currentPlayTime / 1000
        this.#process_slider.value = parseInt((secondsPassed / this.#audio.duration) * 100)

        document.getElementById('songCurrentTime').innerHTML = this.toTimeString(this.#currentPlayTime)
    }

    /**
     * Formats a given time into a String with the format mm:ss
     * 
     * @param   {int} timeInMs Time in milliseconds 
     * @returns {String} Time in the format mm:ss
     */
    toTimeString(timeInMs){
        let time    = Math.round(timeInMs / 1000)
        let minutes = parseInt(time / 60)
        let seconds = parseInt(time - minutes * 60)
        seconds     = ('0' + seconds).slice(-2)

        return minutes + ':' + seconds
    }

    /**
     * Updates the information in the column which shows informations about the song.
     * 
     * @param {Array} data Informations about the song
     */
    updateSongCurrentSongData(data){
        // Text adjustments
        data[3] = data[3] != null & data[3] != undefined ? '.' + data[3] : data[3]
        data[5] = data[5] != null & data[5] != undefined ? data[5] + ' MB' : data[5]

        // Adding the text
        for(var i=0; i<6; i++){
            let stat    = data[i]
            let dataRow = document.getElementById('fileInfo-' + i)

            if((stat == null) || (stat == undefined)){
                dataRow.innerHTML = 'unknown'
                dataRow.classList.add('text-deactivated')
            }else{
                dataRow.innerHTML = stat
                dataRow.classList.remove('text-deactivated')
            }
        }
    }
}