const express = require('express')
const fs      = require('fs')
const path    = require('path')
const { getAudioDurationInSeconds } = require('get-audio-duration')

let app                  = express()
const PORT               = 8080
const FILE_PATH          = './files'
const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a'] // !TODO! Automatic recognition

app.use(express.static(process.cwd()))

// Read audio files and create objects with the needed info
var currentPath = ''// !WIP!
async function readAudioFiles(folder){
    currentPath = folder == '' ?  FILE_PATH : FILE_PATH + '/' + folder
    let files = fs.readdirSync(FILE_PATH + '/' + folder)

    return await readAudioFile([], files, 0, [])
}

async function readAudioFile(useFiles, files, index, folders){
    if(index == files.length){
        return new Promise((resolve) => resolve([useFiles, folders]))
    }

    let obj = {
        'name' : '',
        'name_full' : '',
        'type' : '',
        'duration' : '',
        'size' : -1
    }

    let filePath = currentPath + '/' + files[index]
    let fileNameSplit = files[index].split('.')
    let extension = fileNameSplit.pop()
    let fileStats = fs.statSync(filePath)

    // Check if folder
    if(!fileStats.isFile()){
        folders.push(files[index])
    }

    // Skip non audio files
    if(!ALLOWED_EXTENSIONS.includes(extension)){
        return readAudioFile(useFiles, files, index + 1, folders)
    }

    let duration = await getAudioDurationInSeconds(filePath).then((time) => {
        time = Math.round(time)

        let minutes = parseInt(time / 60)
        let seconds = parseInt(time - minutes * 60)
        seconds = ('0' + seconds).slice(-2)

        return new Promise((resolve) => resolve(minutes + ':' + seconds))
    })

    obj.type = extension
    obj.name = fileNameSplit.join('.')
    obj.name_full = files[index]
    obj.duration = duration
    obj.size = (fileStats.size / 1000000).toFixed(2) // byte -> Mbyte

    useFiles.push(obj)

    return readAudioFile(useFiles, files, index + 1, folders)
}

// Get audio files
app.get(new RegExp('(audio-files).*'), (req, res) => {
    let url = (req.originalUrl).split('/')

    // !TODO! Folder inside of folder
    if(url.length == 2){ // No folder
        readAudioFiles('').then(files => { res.send({'path': FILE_PATH, 'files': files[0], 'folders': files[1]}) })
    }else{ // 1 folder
        let folder = url.pop()
        readAudioFiles(folder).then(files => { res.send({'path': FILE_PATH + '/' + folder, 'files': files[0], 'folders': files[1]})})
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/src/index.html'))
})

app.listen(PORT, '0.0.0.0', (err) => {
    if(err){
        console.log(err)
    }
    console.log('Server up on PORT', PORT)
})