const express = require('express')
const fs      = require('fs')
const path    = require('path')

let app    = express()
let audioFiles = []
const PORT = 8080
const FILE_PATH = './files'

app.use(express.static(process.cwd()))

// Read audio files
function readAudioFiles(){
    // !TODO! filter out non audio files
    return fs.readdirSync(FILE_PATH)
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