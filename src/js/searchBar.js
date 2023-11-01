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
                this.createSongListElement(file, file.path, index)
                index++
            }
        })
    }

    startSearch(){
        // Get content
        let allFiles = []
        let allFilesRaw = this.httpFileRequest()

        for(var i=0; i<allFilesRaw.length; i++){
            allFilesRaw[i].forEach(file => {
                allFiles.push(file)
            })
        }

        this.#allFiles = allFiles

        // Sort content !TODO!

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

    createSongListElement(file, path, index){
        favouritesPaths   = Object.keys(JSON.parse(httpGet('get-favourite-list')))
        let activeIconSrc = favouritesPaths.includes(path) ? '-active' : ''
    
        document.getElementById('fileList').innerHTML += `
            <div class="file-list-item border-hover-secondary" onclick="selectSong('` + path + `', '` + file.name + `', '` + file.duration + `',` + index + `)">
                <div>
                    <p>` + file.name + `</p>
                    <p>` + file.duration + `</p>
                </div>
                <div class="file-list-item-fav">
                    <img onclick="toggleFavourite('` + path + `', this)" class="like-icon" src="/src/assets/icons/like-icon` + activeIconSrc + `.svg">
                </div>
            </div>`
    }
}