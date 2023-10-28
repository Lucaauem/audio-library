const LEFT_COL_MIN_WIDTH  = 5
const MID_COL_MIN_WIDTH   = 25
const RIGHT_COL_MIN_WIDTH = 10

let resizeBarLeft  = document.getElementById('resizeBar-left')
let resizeBarRight = document.getElementById('resizeBar-right')
let columnWidth    = [20, 55, 25]

window.addEventListener('mouseup', endResize)
resizeBarRight.addEventListener('mousedown', setResize)
resizeBarRight.addEventListener('mouseup', endResize)
resizeBarLeft.addEventListener('mousedown', setResize)
resizeBarLeft.addEventListener('mouseup', endResize)

let mouseInitialPos = -1
let onResize = false
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

    columnWidth = [mousePos, 100 - mousePos - columnWidth[2], columnWidth[2]]

    document.getElementById('mainContainer').style.gridTemplateColumns = columnWidth[0] + '% ' + columnWidth[1] +'% ' + columnWidth[2] + '%'
}

function resizeRight(event){
    let mousePos = (event.x / window.innerWidth) * 100

    if((mousePos > (100 - RIGHT_COL_MIN_WIDTH)) || ((mousePos - columnWidth[0]) < MID_COL_MIN_WIDTH)){
        return
    }

    columnWidth = [columnWidth[0], mousePos - columnWidth[0], 100 - mousePos]

    document.getElementById('mainContainer').style.gridTemplateColumns = columnWidth[0] + '% ' + columnWidth[1] +'% ' + columnWidth[2] + '%'
}