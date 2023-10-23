const express = require('express')
const path    = require('path')
const fs      = require('fs')
const FileSystem = require('./js/fileSystem.js')

let app                  = express()
const PORT               = 8080
const FILE_PATH          = './files'
const FAVOURITES_PATH    = path.join(process.cwd(), '/src/favourites.json')
const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a']
const FILE_SYSTEM        = new FileSystem(FILE_PATH, ALLOWED_EXTENSIONS, FAVOURITES_PATH)

app.use(express.static(process.cwd()))


// Get favourites !FIXME!
app.get('get-favourite-songs', (req, res) => {
    FILE_SYSTEM.getFavourites().then(files => { res.send({'path': FILE_PATH + '/' + folder, 'files': files[0], 'folders': files[1]})})
})

// Get audio files
app.get(new RegExp('(audio-files).*'), (req, res) => {
    let url = (req.originalUrl).split('/')

    if(url.length == 2){ // No folder
        FILE_SYSTEM.getAudioFiles('').then(files => { res.send({'path': FILE_PATH, 'files': files[0], 'folders': files[1]}) })
    }else{ // 1 folder
        let folder = url.pop()
        FILE_SYSTEM.getAudioFiles(folder).then(files => { res.send({'path': FILE_PATH + '/' + folder, 'files': files[0], 'folders': files[1]})})
    }
})

// Change in "favourite songs"
app.get(new RegExp('(favourite-song).*'), (req, res) => {
    let favourites  = JSON.parse(fs.readFileSync(FAVOURITES_PATH))
    let path        = req.originalUrl.split('/')
    path.shift()
    path.shift()
    path = './' + path.join('/')

    if((Object.keys(favourites)).includes(path)){
        delete favourites[path]
        fs.writeFileSync(FAVOURITES_PATH, JSON.stringify(favourites))
        res.send(true)
        return
    }
    favourites[path] = 1
    fs.writeFileSync(FAVOURITES_PATH, JSON.stringify(favourites))
    res.send(false)
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