let resizeBarLeft  = document.getElementById('resizeBar-left')
let resizeBarRight = document.getElementById('resizeBar-right')
let columnWidth    = [20, 55, 25]

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
    if(event.srcElement.id == 'resizeBar-left'){
        window.removeEventListener('mousemove', resizeLeft)
    }else{
        window.removeEventListener('mousemove', resizeRight)
    }
}

function resizeLeft(event){
    let mousePos = (event.x / window.innerWidth) * 100
    if(mousePos < 2){
        return
    }

    columnWidth = [mousePos, 100 - mousePos - columnWidth[2], columnWidth[2]]

    document.getElementById('mainContainer').style.gridTemplateColumns = columnWidth[0] + '% ' + columnWidth[1] +'% ' + columnWidth[2] + '%'
}

function resizeRight(event){
    let mousePos = (event.x / window.innerWidth) * 100

    if(mousePos > 98){
        return
    }

    columnWidth = [columnWidth[0], mousePos - columnWidth[0], 100 - mousePos]

    document.getElementById('mainContainer').style.gridTemplateColumns = columnWidth[0] + '% ' + columnWidth[1] +'% ' + columnWidth[2] + '%'
}