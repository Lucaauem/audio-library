let directory = null
let directoryFolders = null

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

    if(fileSelection == '' || fileSelection == '-'){
        return
    }

    // Remove file and update ui
    httpRequest('remove-file/' + fileSelection)
    toggleRemoveFile()
    
    // Update ui
    refreshList()
}

function toggleRemoveFolder(){
    document.getElementById('popupAddFolder').classList.toggle('window-popup-show-center')
}

function openFileDirectory(){
    httpRequest('/open-explorer')
}