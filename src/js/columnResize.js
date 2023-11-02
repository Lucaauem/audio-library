const LEFT_COL_MIN_WIDTH     = 5
const MID_COL_MIN_WIDTH      = 25
const RIGHT_COL_MIN_WIDTH    = 10

let resizeBarLeft  = document.getElementById('resizeBar-left')
let resizeBarRight = document.getElementById('resizeBar-right')
let columnWidth    = [22.5, 55, 22.5]

let columnLeft = document.getElementById('folderColumn')
let columnRight = null

window.addEventListener('mouseup', endResize)
resizeBarRight.addEventListener('mousedown', setResize)
resizeBarRight.addEventListener('mouseup', endResize)
resizeBarLeft.addEventListener('mousedown', setResize)
resizeBarLeft.addEventListener('mouseup', endResize)

let mouseInitialPos = -1
let onResize = false

// Check for styling
window.addEventListener('resize', () => { updateStylingLeft() })
updateStylingLeft()

function setResize(event){
    mouseInitialPos = event.x

    if(event.srcElement.id == 'resizeBar-left'){
        window.addEventListener('mousemove', resizeLeft)
    }else{
        window.addEventListener('mousemove', resizeRight)
    }   
}

function endResize(event){
    window.removeEventListener('mousemove', resizeLeft)
    window.removeEventListener('mousemove', resizeRight)
}

function resizeLeft(event){
    let mousePos = (event.x / window.innerWidth) * 100
    if((mousePos < LEFT_COL_MIN_WIDTH) || ((100 - mousePos - columnWidth[2]) < MID_COL_MIN_WIDTH)){
        return
    }
    
    // Change size
    columnWidth = [mousePos, 100 - mousePos - columnWidth[2], columnWidth[2]]
    document.getElementById('mainContainer').style.gridTemplateColumns = columnWidth[0] + '% ' + columnWidth[1] +'% ' + columnWidth[2] + '%'
    
    // Change styling
    updateStylingLeft()
}

function resizeRight(event){
    let mousePos = (event.x / window.innerWidth) * 100

    if((mousePos > (100 - RIGHT_COL_MIN_WIDTH)) || ((mousePos - columnWidth[0]) < MID_COL_MIN_WIDTH)){
        return
    }

    // Change size
    columnWidth = [columnWidth[0], mousePos - columnWidth[0], 100 - mousePos]
    document.getElementById('mainContainer').style.gridTemplateColumns = columnWidth[0] + '% ' + columnWidth[1] +'% ' + columnWidth[2] + '%'
}

function updateStylingLeft(){
    // Large
    document.getElementById('searchIcon').removeAttribute('onclick')
    document.getElementById('searchBarWrapper').classList.remove('search-bar-medium')
    document.getElementById('homeButton').classList.remove('home-button-small')
    document.getElementById('homeBar').classList.remove('home-bar-small')
    if(columnLeft.offsetWidth > 175){ return }

    // Medium
    document.getElementById('searchIcon').setAttribute('onclick', 'showSearchPopup()')
    document.getElementById('searchBarWrapper').classList.add('search-bar-medium')
    document.getElementById('homeButton').classList.add('home-button-small')
    document.getElementById('homeBar').classList.remove('home-bar-small')        
    if(columnLeft.offsetWidth > 100){ return }
    
    document.getElementById('homeBar').classList.add('home-bar-small')
}