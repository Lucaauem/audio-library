let favouritesPaths = Object.keys(JSON.parse(httpRequest('get-favourite-list')))
let activeElement = null
let fileList     = document.getElementById('fileList')
let audioFileObj = JSON.parse(httpRequest('audio-files'))
let filePath     = audioFileObj.path
let audioFiles   = audioFileObj.files
let folders      = audioFileObj.folders
let sources      = []

updateFilesShown(audioFiles)
addFolders()

const AUDIO_PLAYER = new AudioPlayer('audioPlayer', 'songProcessSlider', sources)
const SEARCH_BAR   = new SearchBar('searchBar', 'get-all-files')

function refreshList(){
    audioFileObj = JSON.parse(httpRequest('audio-files'))
    filePath     = audioFileObj.path
    audioFiles   = audioFileObj.files
    folders      = audioFileObj.folders

    updateFilesShown(audioFiles)

    let folderDoms = document.getElementsByClassName('folder-element')

    for(var i=1; i<folderDoms.length; i++){
        folderDoms[i].parentNode.removeChild(folderDoms[i])
    }
    addFolders()
}

function createSongListElement(file, path, index){
    favouritesPaths   = Object.keys(JSON.parse(httpRequest('get-favourite-list')))
    let activeIconSrc = favouritesPaths.includes(path) ? '-active' : ''

    document.getElementById('fileList').innerHTML += `
        <div class="file-list-item border-hover-secondary" onclick="selectSong('` + path + `','` + file.name + `','` + file.duration + `',` + index + `,'` + file.type + `','` + file.size + `')">
            <div>
                <p>` + file.name + `</p>
                <p>` + file.duration + `</p>
            </div>
            <div class="file-list-item-fav">
                <img onclick="toggleFavourite('` + path + `', this)" class="like-icon" src="/src/assets/icons/like-icon` + activeIconSrc + `.svg">
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
    audioFileObj = JSON.parse(httpRequest('audio-files/' + folder))
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

function selectSong(path, nameNoExtension, duration, index, extension, size){
    AUDIO_PLAYER.changeSource(path, nameNoExtension, duration, index, extension, size)
}

function toggleFavourite(path, dom){
    httpRequest('favourite-song/' + path) // Update .json
    
    // Update icon
    if(dom.getAttribute('src').includes('active')){
        dom.setAttribute('src', '/src/assets/icons/like-icon.svg')
    }else{
        dom.setAttribute('src', '/src/assets/icons/like-icon-active.svg')
    }
}

function openFavourites(folderDOM){
    audioFileObj = JSON.parse(httpRequest('get-favourite-songs'))
    filePath     = null
    audioFiles   = null
    folders      = null

    // Highlight folder
    if(activeElement != null){
        activeElement.classList.remove('active-element')
    }
    activeElement = folderDOM
    activeElement.classList.add('active-element')

    updateFavouriteFilesShown(audioFileObj)
}

function updateFavouriteFilesShown(audioFiles){
    // Reset variables
    sources = []
    document.getElementById('fileList').innerHTML = ''

    // Update UI
    index = 0
    audioFiles.forEach(file => {
        sources.push(filePath + '/' + file.name_full)
        createSongListElement(file, file.path, index)
        index++
    })
}

function homeButton(){
    audioFileObj = JSON.parse(httpRequest('audio-files'))
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

function showSearchPopup(){
    document.getElementById('lowlightFrame').style.display = 'block'
    document.getElementById('searchPopup').classList.add('window-popup-show-top')

    document.body.addEventListener('keydown', keypressEvents)
    SEARCH_BAR.startSearch()
}

function hideSearchPopup(){
    document.getElementById('lowlightFrame').style.display = 'none'
    document.getElementById('searchPopup').classList.remove('window-popup-show-top')

    document.body.removeEventListener('keydown', keypressEvents)
}

function keypressEvents(event){
    if(event.key == 'Enter'){
        hideSearchPopup()
        SEARCH_BAR.updateSearch(document.getElementById('searchPopupInput').value)
    }else if(event.key == 'Escape'){
        hideSearchPopup()
    }
}