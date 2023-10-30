let favouritesPaths = Object.keys(JSON.parse(httpGet('get-favourite-list')))
let activeElement = null
let fileList     = document.getElementById('fileList')
let audioFileObj = JSON.parse(httpGet('audio-files'))
let filePath     = audioFileObj.path
let audioFiles   = audioFileObj.files
let folders      = audioFileObj.folders
let sources      = []

updateFilesShown(audioFiles)
addFolders()

const AUDIO_PLAYER = new AudioPlayer('audioPlayer', 'songProcessSlider', sources)
const SEARCH_BAR   = new SearchBar('searchBar', 'get-all-files')

function createSongListElement(file, path, index){
    favouritesPaths = Object.keys(JSON.parse(httpGet('get-favourite-list')))
    let isFavourite = favouritesPaths.includes(path) ? 'active-text' : ''
    document.getElementById('fileList').innerHTML += `
        <div class="file-list-item border-hover-secondary" onclick="selectSong('` + file.name_full + `', '` + file.name + `', '` + file.duration + `',` + index + `)">
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

    folders.forEach(folder => {
        let div = document.createElement('div')
        let img = document.createElement('img')
        let p   = document.createElement('p')
        div.setAttribute('onclick', 'openFolder("' + folder + '", this)')
        div.classList.add('folder-element')
        div.classList.add('border-hover-secondary')
        img.alt = ''
        img.src = '/src/assets/icons/icon-folder.svg'
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
    index = 0
    audioFiles.forEach(file => {
        sources.push(filePath + '/' + file.name_full)
        createSongListElement(file, filePath + '/' + file.name_full, index)
        index++
    })
}

function openFolder(folder, folderDOM){
    audioFileObj = JSON.parse(httpGet('audio-files/' + folder))
    filePath     = audioFileObj.path
    audioFiles   = audioFileObj.files
    folders      = audioFileObj.folders

    // Highlight folder
    if(activeElement != null){
        activeElement.classList.remove('active-element')
    }
    activeElement = folderDOM
    activeElement.classList.add('active-element')

    updateFilesShown(audioFiles)
}

function selectSong(name, nameNoExtension, duration, index){
    let source = filePath + '/' + name

    AUDIO_PLAYER.changeSource(source, nameNoExtension, duration, index)
}

function toggleFavourite(path, dom){
    httpGet('favourite-song/' + path) // Update .json
    dom.classList.toggle('active-text')
}

function openFavourites(folderDOM){
    audioFileObj = JSON.parse(httpGet('get-favourite-songs'))
    filePath     = null
    audioFiles   = audioFileObj.files
    folders      = null

    // Highlight folder
    if(activeElement != null){
        activeElement.classList.remove('active-element')
    }
    activeElement = folderDOM
    activeElement.classList.add('active-element')

    updateFilesShown(audioFileObj)
}

function homeButton(){
    audioFileObj = JSON.parse(httpGet('audio-files'))
    filePath     = audioFileObj.path
    audioFiles   = audioFileObj.files
    folders      = audioFileObj.folders

    // Remove highlight from folder
    if(activeElement != null){
        activeElement.classList.remove('active-element')
    }
    activeElement = null

    updateFilesShown(audioFiles)
}