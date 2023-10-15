const express = require('express')
const fs      = require('fs')
const path    = require('path')
const { getAudioDurationInSeconds } = require('get-audio-duration')

let app    = express()
let audioFiles = []
const PORT = 8080
const FILE_PATH = './files'
const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a'] // !TODO! Automatic recognition

app.use(express.static(process.cwd()))

// Read audio files and create objects with the needed info
function readAudioFiles(){
    let files = fs.readdirSync(FILE_PATH)
    let useFiles = []

    files.forEach(file => {
        let obj = {
            'name' : '',
            'name_full' : '',
            'type' : '',
            'duration' : '',
            'size' : -1
        }

        let fileNameSplit = file.split('.')
        let extension = fileNameSplit.pop()

        // Skip non audio files
        if(!ALLOWED_EXTENSIONS.includes(extension)){
            return
        }

        let filePath = FILE_PATH + '/' + file
        let duration = getDuration(filePath) // !FIXME!

        obj.type = extension
        obj.name = fileNameSplit.join('.')
        obj.name_full = file
        obj.size = ((fs.statSync(filePath).size) / 1000000).toFixed(2) // byte -> Mbyte

        useFiles.push(obj)
    })

    return useFiles
}

function getDuration(path){
    getAudioDurationInSeconds(path).then((time) => {
        time = Math.round(time)

        let minutes = parseInt(time / 60)
        let seconds = parseInt(time - minutes * 60)
        seconds = ('0' + seconds).slice(-2)

        return minutes + ':' + seconds
    })
}

app.get('/audio-files', (req, res) => {
    res.send({'path': FILE_PATH, 'files': audioFiles})
})

app.get('/', (req, res) => {
    audioFiles = readAudioFiles()
    res.sendFile(path.join(process.cwd(), '/src/index.html'))
})

app.listen(PORT, '0.0.0.0', (err) => {
    if(err){
        console.log(err)
    }
    console.log('Server up on PORT', PORT)
})