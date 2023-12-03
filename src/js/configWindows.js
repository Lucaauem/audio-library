/**
 * Script which handles the different popups for configuration.
 * 
 * @author Luca Aussem
 * @version 1.0.0
 */

const LOWLIGHT_FRAME = document.getElementById('lowlightFrame')
let directory        = null
let directoryFolders = null

/**
 * Toggles a given popup and adds a dark tint to the background {@link LOWLIGHT_FRAME}.
 * 
 * @param {String} id Id of the popup 
 */
function togglePopup(id){
    LOWLIGHT_FRAME.onclick = () => { togglePopup(id) }
    LOWLIGHT_FRAME.classList.toggle('lowlight-frame-show')
    document.getElementById(id).classList.toggle('window-popup-show-center')
}

/**
 * Gets all folders to which a file could be added and adds them to
 * the options for the select in the popup.
 */
function toggleAddFile(){
    let folderSelect = document.getElementById('addFileSelectFolder')
    let options      = []
    directory        = JSON.parse(httpRequest('get-directory'))
    directoryFolders = Object.keys(directory)

    folderSelect.innerHTML = ''

    directoryFolders.forEach(folder => {
        options.push(`<option>${folder}</option>`)
    })
    folderSelect.innerHTML += options.join('')

    togglePopup('popupAddFile')
}

function toggleRemoveFile(){
    // Get directory
    let folderSelect = document.getElementById('removeFileSelectFolder')
    directory = JSON.parse(httpRequest('get-directory'))
    directoryFolders = Object.keys(directory)

    folderSelect.innerHTML = ''

    directoryFolders.forEach(folder => {
        folderSelect.innerHTML += `<option onclick="updateSelectFiles('removeFileSelectFile', '` + folder + `')">` + folder + `</option>`
    })
    updateSelectFiles('removeFileSelectFile', '-')

    togglePopup('popupRemoveFile')
}

function updateSelectFiles(selectId, folder){
    let selectDom = document.getElementById(selectId)
    selectDom.innerHTML = ''

    directory[folder].forEach(file => {
        selectDom.innerHTML += '<option value="' + file.path + '">' + file.name + '</option>'
    })
}

function removeFile(){
    let fileSelection = document.getElementById('removeFileSelectFile').value

    if((fileSelection == '') || (fileSelection == '-')){
        return
    }

    // Remove file and update ui
    httpRequest('remove-file/' + fileSelection)
    toggleRemoveFile()
    refreshList()
}

function toggleAddFolder(){
    togglePopup('popupAddFolder')
}

function createFolder(){
    let name = document.getElementById('createFolderInput').value

    if(name == ''){
        return
    }

    httpRequest('create-folder/' + name)
    toggleAddFolder()
    refreshList()
}

function toggleRemoveFolder(){
    // Get all folders
    let folderSelect = document.getElementById('removeFolderSelect')
    directory = JSON.parse(httpRequest('get-directory'))
    directoryFolders = (Object.keys(directory)).slice(1)

    folderSelect.innerHTML = ''

    directoryFolders.forEach(folder => {
        folderSelect.innerHTML += `<option>` + folder + `</option>`
    })

    togglePopup('popupRemoveFolder')
}

function removeFolder(){
    let name = document.getElementById('removeFolderSelect').value

    httpRequest('remove-folder/' + name)
    toggleRemoveFolder()
    refreshList() // !FIXME! Folder stays in list
}

/**
 * Opens the current directory in the file explorer.
 */
function openFileDirectory(){
    httpRequest('/open-explorer')
}

function toggleChangeDir(){
    document.getElementById('wrongDirWarning').classList.remove('warning-text-show')
    document.getElementById('newDirInput').classList.remove('wrong-input')
    togglePopup('popupChangeDir')
}

/**
 * Changes the file directory to the input which was entery by the user.
 */
function changeDirectory(){
    let dir = encodeURI(document.getElementById('newDirInput').value)

    if(dir == ''){
        return
    }

    let request = httpRequest('change-dir/' + dir)
    if(request == 'false'){
        document.getElementById('wrongDirWarning').classList.add('warning-text-show')
        document.getElementById('newDirInput').classList.add('wrong-input')
    }else{
        togglePopup('popupChangeDir')
    }
}