const express = require('express')
const fs      = require('fs')
const path    = require('path')
const { getAudioDurationInSeconds } = require('get-audio-duration')

let app    = express()
const PORT = 8080
const FILE_PATH = './files'
const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a'] // !TODO! Automatic recognition

app.use(express.static(process.cwd()))

// Read audio files and create objects with the needed info
async function readAudioFiles(){
    let files = fs.readdirSync(FILE_PATH)

    return await readAudioFile([], files, 0)
}

async function readAudioFile(useFiles, files, index){
    if(index == files.length){
        return new Promise((resolve) => resolve(useFiles))
    }

    let obj = {
        'name' : '',
        'name_full' : '',
        'type' : '',
        'duration' : '',
        'size' : -1
    }

    let fileNameSplit = files[index].split('.')
    let extension = fileNameSplit.pop()

    // Skip non audio files
    if(!ALLOWED_EXTENSIONS.includes(extension)){
        return
    }

    let filePath = FILE_PATH + '/' + files[index]
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
    obj.size = ((fs.statSync(filePath).size) / 1000000).toFixed(2) // byte -> Mbyte

    useFiles.push(obj)

    return readAudioFile(useFiles, files, index + 1)
}

app.get('/audio-files', (req, res) => {
    readAudioFiles().then(audioFiles => { res.send({'path': FILE_PATH, 'files': audioFiles}) })
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