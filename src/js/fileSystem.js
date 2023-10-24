const fs = require('fs')
const { getAudioDurationInSeconds } = require('get-audio-duration')
const path = require('path')

class FileSystem{
    #ALLOWED_EXTENSIONS = []
    #FILE_PATH          = ''
    #FAVOURITES_PATH    = ''
    #source             = ''

    constructor(filePath, allowedExtensions, favouritesPath){
        this.#ALLOWED_EXTENSIONS = allowedExtensions
        this.#FILE_PATH          = filePath
        this.#FAVOURITES_PATH    = favouritesPath
    }

    async getAudioFiles(folder){
        this.#source = folder == '' ?  this.#FILE_PATH : this.#FILE_PATH + '/' + folder
        let files = fs.readdirSync(this.#FILE_PATH + '/' + folder)
    
        return await this.#readFile([], files, 0, [])
    }

    async #readFile(fileObjects, files, index, folders){
        if(index == files.length){
            return new Promise((resolve) => resolve([fileObjects, folders]))
        }
    
        let filePath      = this.#source + '/' + files[index]
        let fileNameSplit = files[index].split('.')
        let extension     = fileNameSplit.pop()
        let fileStats     = fs.statSync(filePath)
        let obj = {
            'name' : '',
            'name_full' : '',
            'type' : '',
            'duration' : '',
            'size' : -1
        }
    
        // Check if folder
        if(!fileStats.isFile()){
            folders.push(files[index])
            return this.#readFile(fileObjects, files, index + 1, folders)
        }
    
        // Skip non audio files
        if(!this.#ALLOWED_EXTENSIONS.includes(extension)){
            return this.#readFile(fileObjects, files, index + 1, folders)
        }
    
        let duration = await getAudioDurationInSeconds(filePath).then((time) => {
            time = Math.round(time)
    
            let minutes = parseInt(time / 60)
            let seconds = parseInt(time - minutes * 60)
            seconds     = ('0' + seconds).slice(-2)
    
            return new Promise((resolve) => resolve(minutes + ':' + seconds))
        })
    
        obj.type      = extension
        obj.name      = fileNameSplit.join('.')
        obj.name_full = files[index]
        obj.duration  = duration
        obj.size      = (fileStats.size / 1000000).toFixed(2) // byte -> Mbyte
    
        fileObjects.push(obj)
    
        return this.#readFile(fileObjects, files, index + 1, folders)
    }

    async getFavourites(){
        return this.#readFavourite([], Object.keys(JSON.parse(fs.readFileSync(this.#FAVOURITES_PATH))), 0)
    }

    async #readFavourite(fileObjects, paths, index){
        if(index == paths.length){
            return new Promise((resolve) => resolve(fileObjects))
        }
    
        let filePath      = paths[index]
        let fileName      = filePath.split('/')[filePath.split('/').length - 1]
        let fileNameSplit = fileName.split('.')
        let extension     = fileNameSplit.pop()
        let fileStats     = fs.statSync(filePath)
        let obj = {
            'name' : '',
            'name_full' : '',
            'type' : '',
            'duration' : '',
            'size' : -1
        }
    
        let duration = await getAudioDurationInSeconds(filePath).then((time) => {
            time = Math.round(time)
    
            let minutes = parseInt(time / 60)
            let seconds = parseInt(time - minutes * 60)
            seconds     = ('0' + seconds).slice(-2)
    
            return new Promise((resolve) => resolve(minutes + ':' + seconds))
        })
    
        obj.type      = extension
        obj.name      = fileNameSplit.join('.')
        obj.name_full = fileName
        obj.duration  = duration
        obj.size      = (fileStats.size / 1000000).toFixed(2) // byte -> Mbyte
    
        fileObjects.push(obj)
    
        return this.#readFavourite(fileObjects, paths, index + 1)
    }
}

module.exports = FileSystem