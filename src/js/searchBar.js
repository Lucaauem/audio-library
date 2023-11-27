/**
 * Adds functionality to the searchbar.
 * When updating the input, the class will search for files with the
 * input value in their name and return those.
 * 
 * @version 1.0.0
 * @author Luca Aussem
 */
class SearchBar{
    /**@access private */
    #SEARCH_BAR = null
    /**@access private */
    #HTTP_REQUEST = 'get-all-files'
    /**@access private */
    #allFiles = {}
    /**@access private */
    #content = {}

    /**
     * Initializes the searchbar and adds the event listeners.
     */
    constructor(){
        this.#SEARCH_BAR = document.getElementById('searchBar')

        this.#SEARCH_BAR.addEventListener('input', this.updateSearch.bind(this, null))
        this.#SEARCH_BAR.addEventListener('focus', this.startSearch.bind(this))
    }

    /**
     * Updates the list with search results after every keypress.
     * 
     * @param {String} value Current user input
     */
    updateSearch(value){
        let index     = 0
        let input     = value ? value : this.#SEARCH_BAR.value
        this.#content = []

        document.getElementById('fileList').innerHTML = ''

        this.#allFiles.forEach(file => {
            if(file.name.includes(input)){
                this.#content.push(file)
                this.createSongListElement(file, file.path, index)
                index++
            }
        })
    }

    /**
     * Gets all audios in the directory and stores them thus the user
     * can search one of them.
     */
    startSearch(){
        let allFiles = []
        let allFilesRaw = this.httpFileRequest()

        for(var i=0; i<allFilesRaw.length; i++){
            allFilesRaw[i].forEach(file => {
                allFiles.push(file)
            })
        }

        this.#allFiles = allFiles
        
        // Add to content
        this.#content = {}
        Object.keys(this.#allFiles).forEach(filePath => {
            this.#content[filePath] = this.#allFiles[filePath]
        })
    }

    /**
     * Sends a request to the server to get an array with every
     * audio in the directory.
     * 
     * @returns {Array} Array with every audio file in the directory
     */
    httpFileRequest(){
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open("GET", this.#HTTP_REQUEST, false)
        xmlHttp.send(null)
        return JSON.parse(xmlHttp.responseText)
    }

    /**
     * Adds an audio element to the list thus the user can select it.
     * 
     * @param {Object} file  Object with data about the audio
     * @param {String} path  Path to the audio
     * @param {int}    index Index of the audio
     */
    createSongListElement(file, path, index){
        favouritesPaths   = Object.keys(JSON.parse(httpRequest('get-favourite-list')))
        let activeIconSrc = favouritesPaths.includes(path) ? '-active' : ''
        let mainDiv       = document.createElement('div')
        let childDiv      = document.createElement('div')
        let paragraph     = document.createElement('p')
        let image         = document.createElement('img')
    
        mainDiv.classList.add('file-list-item')
        mainDiv.classList.add('border-hover-secondary')
        mainDiv.setAttribute('onclick', 'selectSong("'+path.replaceAll('\\','\\\\')+'","'+ file.name+'","'+ file.duration+'","'+ index+'","'+ file.type+'","'+ file.size+'")')

        // Paragraph with the name
        paragraph.classList = 'text-overflow-dots'
        paragraph.innerHTML = file.name

        childDiv.appendChild(paragraph)

        // Paragraph with the duration
        paragraph = document.createElement('p')
        paragraph.classList = ''
        paragraph.innerHTML = file.duration

        childDiv.append(paragraph)
        mainDiv.appendChild(childDiv)
    
        // Span with the 'favourite' icon
        childDiv = document.createElement('div')
        childDiv.classList = 'file-list-item-fav'
        image.onclick = () => { toggleFavourite(path, image) }
        image.classList = 'like-icon'
        image.src = '/src/assets/icons/like-icon' + activeIconSrc + '.svg'

        childDiv.append(image)
        mainDiv.appendChild(childDiv)
    
        document.getElementById('fileList').appendChild(mainDiv)
    }
}