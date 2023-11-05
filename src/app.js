const express = require('express')
const path    = require('path')
const fs      = require('fs')
const { exec } = require('child_process')
const FileSystem = require('./js/fileSystem.js')

let app                  = express()
const PORT               = 8080
const FILE_PATH          = './files'
const FAVOURITES_PATH    = path.join(process.cwd(), '/src/favourites.json')
const ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a']
const FILE_SYSTEM        = new FileSystem(FILE_PATH, ALLOWED_EXTENSIONS, FAVOURITES_PATH)

app.use(express.static(process.cwd()))
console.clear()

// Get favourites
app.get('/get-favourite-songs', (req, res) => {
    FILE_SYSTEM.getFavourites().then(files => { res.send(files) })
})

// Get favourites (json)
app.get('/get-favourite-list', (req, res) => {
    res.send(JSON.parse(fs.readFileSync(FAVOURITES_PATH)))
})

// Open Directory in Explorer
app.get('/open-explorer', (req, res) => {
    let mainDirPath = process.cwd() + '\\files'
    exec('start "" "' + mainDirPath + '"')
    
    res.sendStatus(200)
})

// Get all files
app.get('/get-all-files', (req, res) => {
    let folders = ['']

    fs.readdirSync(FILE_PATH).forEach(file => {
        let stats = fs.statSync(FILE_PATH + '/' + file)

        if(stats.isDirectory()){
            folders.push(file)
        }
    })
    
    getAllFiles(folders).then(files => { res.send(files)})
})

// Get directory
app.get('/get-directory', (req, res) => {
    let files = {}

    files['-'] = readDirectory(FILE_PATH)

    fs.readdirSync(FILE_PATH).forEach(file => {
        let filePath = FILE_PATH + '/' + file
        let fileStats = fs.statSync(filePath)

        if(fileStats.isDirectory()){
            files[file] = readDirectory(filePath)
        }
    })

    res.send(files)
})

function readDirectory(path){
    let files = []

    fs.readdirSync(path).forEach(file => {
        let filePath = path + '/' + file
        let fileStats = fs.statSync(filePath)

        if(!fileStats.isDirectory()){
            files.push({'name': file, 'path': filePath})
        }
    })

    return files
}

async function getAllFiles(folders){
    let allFiles = []

    for await (const folder of folders){
        let currentFile = await FILE_SYSTEM.getAudioFiles(folder)
        allFiles.push(currentFile[0])
    }

    return allFiles
}

// Remove audio file
app.get(new RegExp('(remove-file).*'), (req, res) => {
    let filePath = FILE_PATH + '/' + (req.originalUrl).split('/').slice(3).join('/')

    fs.unlinkSync(filePath)

    res.sendStatus(200)
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
app.get(new RegExp('(favourite-song/).*'), (req, res) => {
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