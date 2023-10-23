
let fileList     = document.getElementById('fileList')
let audioFileObj = JSON.parse(httpGet('audio-files'))
let filePath     = audioFileObj.path
let audioFiles   = audioFileObj.files
let folders      = audioFileObj.folders
let sources      = []

updateFilesShown(audioFiles)
addFolders()

const AUDIO_PLAYER = new AudioPlayer('audioPlayer', sources)

function createSongListElement(file){
    // Create div
    document.getElementById('fileList').innerHTML += `
        <div class="file-list-item border-hover-tertiary" onclick="selectSong('` + file.name_full + `', '` + file.name + `', '` + file.duration + `')">
            <p>` + file.name + `</p>
            <p>` + file.duration + `</p>
        </div>`
}

function addFolders(){
    let folderColumn = document.getElementById('folderColumn')

    folders.forEach(folder => {
        folderColumn.innerHTML += `
        <div onclick="openFolder('` + folder + `')" class="folder-element border-hover-tertiary">
            <img src="/src/assets/icons/icon-folder.svg" alt="">
            <p>` + folder + `</p>
        </div>`
    })
}

function updateFilesShown(audioFiles){
    // Reset variables
    sources = []
    document.getElementById('fileList').innerHTML = ''

    // Update UI
    audioFiles.forEach(file => {
        sources.push(filePath + '/' + file.name_full)
        createSongListElement(file)
    })
}

function openFolder(folder){
    audioFileObj = JSON.parse(httpGet('audio-files/' + folder))
    filePath     = audioFileObj.path
    audioFiles   = audioFileObj.files
    folders      = audioFileObj.folders

    console.log(audioFileObj)

    updateFilesShown(audioFiles)
}

function selectSong(name, nameNoExtension, duration){
    // Set new source
    let source = filePath + '/' + name
    // Update info UI
    AUDIO_PLAYER.changeSource(source, nameNoExtension, duration)
}