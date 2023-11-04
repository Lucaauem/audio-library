function toggleFileConfig(status){
    document.getElementById('popupFileConfig').classList.toggle('window-popup-show-center')
}

function openFileDirectory(){
    httpGet('/open-explorer')
}