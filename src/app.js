/* ==================== NODE MODULES ==================== */
const express = require('express')
const path    = require('path')
const fs      = require('fs')
const fileUpload = require('express-fileupload');
const { exec }   = require('child_process')
const FileSystem = require('./js/fileSystem.js')

let app               = express()
let FILE_PATH         = JSON.parse(fs.readFileSync('./config.json'))['directory']
const PORT            = 8080
const FAVOURITES_PATH = path.join(process.cwd(), '/src/favourites.json')
const FILE_SYSTEM     = new FileSystem(FILE_PATH, FAVOURITES_PATH)

if(FILE_PATH == ''){
    FILE_PATH = process.cwd()
    setDirectory(process.cwd())
}

app.use(express.static(process.cwd()))
app.use(express.static(FILE_PATH))
app.use(fileUpload());
console.clear()

/* ==================== API ====================*/
/* ========== GET-REQUESTS ========== */
// Create new Folder
app.get('/create-folder/:name', (req, res) => {
    try{
        fs.mkdirSync(FILE_PATH + '/' + req.params.name)
        res.sendStatus(200)
    }catch(err){
        res.sendStatus(401)        
    }
})

// Remove audio file !FIXME!
app.get('/remove-file/:path', (req, res) => {
    try{
        fs.unlinkSync(req.params.path)
        res.sendStatus(200)
    }catch(err){
        res.sendStatus(401)
    }
})

// Remove Folder
app.get('/remove-folder/:folder', (req, res) => {
    try{
        fs.rmdirSync(FILE_PATH + '/' + req.params.folder)
        res.sendStatus(201)
    }catch(err){
        res.sendStatus(401)
    }
})

// Get audio files
app.get('/audio-files', (req, res) => {
    FILE_SYSTEM.getAudioFiles('').then(files => { res.send({'path': FILE_PATH, 'files': files[0], 'folders': files[1]}) })
})

// Get audio files within a folder
app.get('/audio-files/:folder', (req, res) => {
    let { folder } = req.params

    FILE_SYSTEM.getAudioFiles(folder).then(files => { res.send({'path': FILE_PATH + '/' + folder, 'files': files[0], 'folders': files[1]})})
})

// Change in "favourite songs"
app.get(new RegExp('(favourite-song/).*'), (req, res) => {
    let favourites  = JSON.parse(fs.readFileSync(FAVOURITES_PATH))
    let path        = decodeURI(req.originalUrl).split('/')
    path.shift()
    path.shift()
    path = path.join('\\')

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

app.get('/get-file-directory', (req, res) => {
    res.status(200).send(FILE_PATH.replaceAll('\\', '\\\\'))
})

app.get('/get-dir', (req, res) => {
    res.status(200).send(FILE_PATH)
})

// Change Directory
app.get(new RegExp('(change-dir).*'), (req, res) => {
    let newDir = decodeURI(req.originalUrl).split('/')
    newDir.shift()
    newDir.shift()
    newDir = newDir.join('\\')

    if(fs.existsSync(newDir)){
        setDirectory(decodeURI(newDir))
        res.status(200).send(true)
    }else{
        res.status(404).send(false)
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

// Get favourites
app.get('/get-favourite-songs', (req, res) => {
    FILE_SYSTEM.getFavourites().then(files => { res.send(files) })
})

// Get favourites (json)
app.get('/get-favourite-list', (req, res) => {
    let json = JSON.parse(fs.readFileSync(FAVOURITES_PATH))

    // Remove entries with invalid path
    Object.keys(json).forEach(favPath => {
        if(favPath.indexOf(FILE_PATH) == -1){
            delete json[favPath]
        }
    })
    fs.writeFileSync(FAVOURITES_PATH, JSON.stringify(json))

    res.send(json)
})

// Open Directory in Explorer
app.get('/open-explorer', (req, res) => {
    exec('start "" "' + FILE_PATH + '"')
    
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

/* ========== POST-REQUESTS ========== */
app.post('/upload-file', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).sendFile(path.join(process.cwd(), '/src/index.html'))
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files['sampleFile']
    let uploadFolder = req.body['uploadFolder']
    uploadFolder = uploadFolder == '-' ? '' : uploadFolder + '\\'
    let uploadPath = FILE_PATH + '\\' + uploadFolder + sampleFile.name

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(uploadPath, function(err) {
        if (err){
            return res.status(500).sendFile(path.join(process.cwd(), '/src/index.html'))
        }

        res.status(200).sendFile(path.join(process.cwd(), '/src/index.html'))
    })
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

function setDirectory(dir){
    let config = JSON.parse(fs.readFileSync('./config.json'))
    config['directory'] = dir

    fs.writeFileSync('./config.json', JSON.stringify(config))
    return true
}