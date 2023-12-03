/* ======================= REQUIRED NODE MODULES ======================= */
const fs                            = require('fs')
const { getAudioDurationInSeconds } = require('get-audio-duration')

/**
 * Class which reads the files and their details (e.g. name, length, ...)
 * in the current directory.
 * 
 * !TODO! Could merge "getAudioFiles()" {@link this.getAudioFiles()}
 *        with "getFavourites()" {@link this.getFavourites()}
 * 
 * @author Luca Aussem
 * @version 1.0.0
 */
class FileSystem{
    /**@access private */
    #ALLOWED_EXTENSIONS = ['mp3', 'wav', 'm4a']
    /**@access private */
    #FILE_PATH = ''
    /**@access private */
    #FAVOURITES_PATH = ''
    /**@access private */
    #source = ''

    /**
     * Sets the initial file paths.
     * 
     * @param {String} filePath       Path to the folder, which contains the audio files
     * @param {String} favouritesPath Path to the "favourites.json" file
     */
    constructor(filePath, favouritesPath){
        this.#FILE_PATH          = decodeURI(filePath)
        this.#FAVOURITES_PATH    = favouritesPath
    }

    async getAudioFiles(folder){
        let folderDecode = decodeURI(folder)
        this.#source = folder == '' ?  this.#FILE_PATH : this.#FILE_PATH + '\\' + folderDecode
        try{
            let files    = fs.readdirSync(this.#FILE_PATH + '\\' + folderDecode)
            return await this.#readFile([], files, 0, [])
        }catch(err){ // Missing permission
            return new Promise((resolve) => resolve([[]], []))
        }
    }

    async #readFile(fileObjects, files, index, folders){
        if(index == files.length){
            return new Promise((resolve) => resolve([fileObjects, folders]))
        }
    
        let filePath      = this.#source + '\\' + files[index]
        let fileNameSplit = files[index].split('.')
        let extension     = fileNameSplit.pop()
        let fileStats     = null
        try{
            fileStats = fs.statSync(filePath)
        }catch(err){
            return this.#readFile(fileObjects, files, index + 1, folders)
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
            let seconds = ('0' + parseInt(time - minutes * 60)).slice(-2)
    
            return new Promise((resolve) => resolve(minutes + ':' + seconds))
        })
    
        let newFileObject = {
            'name'      : fileNameSplit.join('.'),
            'name_full' : files[index],
            'type'      : extension,
            'duration'  : duration,
            'size'      : (fileStats.size / 1000000).toFixed(2), // byte -> Mbyte
            'path'      : filePath
        }
    
        fileObjects.push(newFileObject)
    
        return this.#readFile(fileObjects, files, index + 1, folders)
    }

    /**
     * Wrapper function for getting details about the favourite songs.
     * @async
     * 
     * @returns {Promise} Array containing objects with information about the favourite files
     */
    async getFavourites(){
        return this.#readFavourite([], Object.keys(JSON.parse(fs.readFileSync(this.#FAVOURITES_PATH))), 0)
    }

    /**
     * Iterates through every file in the "favourites.json" and collects them as an object with
     * their information in an array.
     * @async
     * 
     * @param {Array} fileObjects Array containing objects with information about the files
     * @param {Array} paths       Arrays containing the absolute paths of the files
     * @param {int}   index       Current index in the array
     * @returns {Promise} Promise which resolves "fileObjects" {@link fileObjects}
     */
    async #readFavourite(fileObjects, paths, index){
        if(index == paths.length){
            return new Promise((resolve) => resolve(fileObjects))
        }
    
        let filePath      = paths[index]
        let fileName      = filePath.split('\\')[filePath.split('\\').length - 1]
        let fileNameSplit = fileName.split('.')
        let extension     = fileNameSplit.pop()
        let fileStats     = null
        try{
            fileStats = fs.statSync(filePath)
        }catch(err){
            return this.#readFavourite(fileObjects, paths, index + 1)
        }
    
        let duration = await getAudioDurationInSeconds(filePath).then((time) => {
            time = Math.round(time)
    
            let minutes = parseInt(time / 60)
            let seconds = parseInt(time - minutes * 60)
            seconds     = ('0' + seconds).slice(-2)
    
            return new Promise((resolve) => resolve(minutes + ':' + seconds))
        })

        let newFileObject = {
            'name'      : fileNameSplit.join('.'),
            'name_full' : fileName,
            'type'      : extension,
            'duration'  : duration,
            'size'      : (fileStats.size / 1000000).toFixed(2), // byte -> Mbyte
            'path'      : filePath
        }
    
        fileObjects.push(newFileObject)
    
        return this.#readFavourite(fileObjects, paths, index + 1)
    }
}

module.exports = FileSystem