
let fileList     = document.getElementById('fileList')
let audioFileObj = JSON.parse(httpGet('audio-files'))
let filePath     = audioFileObj.path
let audioFiles   = audioFileObj.files
let sources      = []

audioFiles.forEach(file => {
    sources.push(filePath + '/' + file.name_full)
    createSongListElement(file)
})

const AUDIO_PLAYER = new AudioPlayer('audioPlayer', sources)

function createSongListElement(file){
    // Create div
    document.getElementById('fileList').innerHTML += `
        <div class="file-list-item" onclick="selectSong('` + file.name_full + `')">
            <p>` + file.name + `</p>
            <p>` + file.duration + `</p>
        </div>`
}

function selectSong(name){
    // Set new source
    let source = filePath + '/' + name
    
    // Update info UI
    AUDIO_PLAYER.changeSource(source)
}