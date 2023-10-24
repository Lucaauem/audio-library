const FAVOURITES_PATH_SAVED = Object.keys(JSON.parse(httpGet('get-favourite-list')))

let fileList     = document.getElementById('fileList')
let audioFileObj = JSON.parse(httpGet('audio-files'))
let filePath     = audioFileObj.path
let audioFiles   = audioFileObj.files
let folders      = audioFileObj.folders
let sources      = []

updateFilesShown(audioFiles)
addFolders()

const AUDIO_PLAYER = new AudioPlayer('audioPlayer', sources)

function createSongListElement(file, path){
    let isFavourite = FAVOURITES_PATH_SAVED.includes(path) ? 'active' : ''
    document.getElementById('fileList').innerHTML += `
        <div class="file-list-item border-hover-tertiary" onclick="selectSong('` + file.name_full + `', '` + file.name + `', '` + file.duration + `')">
            <div>
                <p>` + file.name + `</p>
                <p>` + file.duration + `</p>
            </div>
            <div class="file-list-item-fav">
                <p onclick="toggleFavourite('` + path + `', this)" class="` + isFavourite + `">Fav</p>
            </div>
        </div>`
}

function addFolders(){
    let folderColumn = document.getElementById('folderColumn')
    let div = document.createElement('div')
    let img = document.createElement('img')
    let p = document.createElement('p')
    div.classList.add('folder-element')
    div.classList.add('border-hover-tertiary')
    img.alt = ''
    img.src = '/src/assets/icons/icon-folder.svg'

    folders.forEach(folder => {
        div.setAttribute('onclick', 'openFolder("' + folder + '")')
        p.textContent = folder
        folderColumn.appendChild(div)

        div.appendChild(img)
        div.appendChild(p)
    })
}

function updateFilesShown(audioFiles){
    // Reset variables
    sources = []
    document.getElementById('fileList').innerHTML = ''

    // Update UI
    audioFiles.forEach(file => {
        sources.push(filePath + '/' + file.name_full)
        createSongListElement(file, filePath + '/' + file.name_full)
    })
}

function openFolder(folder){
    audioFileObj = JSON.parse(httpGet('audio-files/' + folder))
    filePath     = audioFileObj.path
    audioFiles   = audioFileObj.files
    folders      = audioFileObj.folders

    updateFilesShown(audioFiles)
}

function selectSong(name, nameNoExtension, duration){
    // Set new source
    // !TODO! Favourite Songs
    let source = filePath + '/' + name
    // Update info UI
    AUDIO_PLAYER.changeSource(source, nameNoExtension, duration)
}

function toggleFavourite(path, dom){
    httpGet('favourite-song/' + path) // Update .json
    dom.classList.toggle('active')
}

function openFavourites(){
    audioFileObj = JSON.parse(httpGet('get-favourite-songs'))
    filePath     = null
    audioFiles   = audioFileObj.files
    folders      = null

    updateFilesShown(audioFileObj)
}

function homeButton(){
    audioFileObj = JSON.parse(httpGet('audio-files'))
    filePath     = audioFileObj.path
    audioFiles   = audioFileObj.files
    folders      = audioFileObj.folders

    updateFilesShown(audioFiles)
}