let directory        = null
let directoryFolders = null

function toggleAddFile(){
    let folderSelect = document.getElementById('addFileSelectFolder')
    directory = JSON.parse(httpRequest('get-directory'))
    directoryFolders = Object.keys(directory)

    folderSelect.innerHTML = ''

    directoryFolders.forEach(folder => {
        folderSelect.innerHTML += `<option>` + folder + `</option>`
    })
    document.getElementById('popupAddFile').classList.toggle('window-popup-show-center')
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

    document.getElementById('popupRemoveFile').classList.toggle('window-popup-show-center')
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
    document.getElementById('popupAddFolder').classList.toggle('window-popup-show-center')
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

    document.getElementById('popupRemoveFolder').classList.toggle('window-popup-show-center')
}

function removeFolder(){
    let name = document.getElementById('removeFolderSelect').value

    httpRequest('remove-folder/' + name)
    toggleRemoveFolder()
    refreshList() // !FIXME! Folder stays in list
}

function openFileDirectory(){
    httpRequest('/open-explorer')
}