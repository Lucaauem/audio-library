let fileList     = document.getElementById('fileList')
let audioFileObj = JSON.parse(httpGet('audio-files'))
let filePath     = audioFileObj.path
let audioFiles   = audioFileObj.files
const AUDIO_PLAYER = document.getElementById('audioPlayer')

audioFiles.forEach(file => {createSongListElement(file)})

function createSongListElement(file){
    // Remove extension
    let songName = ((file.split('.')).slice(0, -1)).join('.')

    document.getElementById('fileList').innerHTML += `
        <div class="file-list-item" onclick="selectSong('` + file + `')">
            <p>` + songName + `</p>
        </div>`
}

function selectSong(name){
    // Set new source
    let source = filePath + '/' + name
    AUDIO_PLAYER.src = source
}