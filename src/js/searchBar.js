class SearchBar{
    #SEARCH_BAR   = null
    #HTTP_REQUEST = null
    #allFiles     = {}
    #content      = {}

    constructor(id, httpFileRequest){
        this.#SEARCH_BAR   = document.getElementById(id)
        this.#HTTP_REQUEST = httpFileRequest

        this.#SEARCH_BAR.addEventListener('input', this.updateSearch.bind(this, null))
        this.#SEARCH_BAR.addEventListener('focus', this.startSearch.bind(this))
    }

    updateSearch(value){
        let index     = 0
        let input     = value ? value : this.#SEARCH_BAR.value
        this.#content = []

        document.getElementById('fileList').innerHTML = ''

        // Only show content with correct name
        this.#allFiles.forEach(file => {
            if(file.name.includes(input)){
                this.#content.push(file)
                this.createSongListElement(file, file.path, index, file.type, file.size)
                index++
            }
        })
    }

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

    httpFileRequest(){
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open("GET", this.#HTTP_REQUEST, false)
        xmlHttp.send(null)
        return JSON.parse(xmlHttp.responseText)
    }

    createSongListElement(file, path, index, extension, size){
        favouritesPaths   = Object.keys(JSON.parse(httpRequest('get-favourite-list')))
        let activeIconSrc = favouritesPaths.includes(path) ? '-active' : ''
        let mainDiv       = document.createElement('div')
        let childDiv      = document.createElement('div')
        let paragraph     = document.createElement('p')
        let image         = document.createElement('img')
    
        mainDiv.classList.add('file-list-item')
        mainDiv.classList.add('border-hover-secondary')
        mainDiv.setAttribute('onclick', 'selectSong("'+path.replaceAll('\\','\\\\')+'","'+ file.name+'","'+ file.duration+'","'+ index+'","'+ file.type+'","'+ file.size+'")')
    
        paragraph.classList = 'text-overflow-dots'
        paragraph.innerHTML = file.name
        childDiv.appendChild(paragraph)
        paragraph = document.createElement('p')
        paragraph.classList = ''
        paragraph.innerHTML = file.duration
        childDiv.append(paragraph)
        mainDiv.appendChild(childDiv)
    
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