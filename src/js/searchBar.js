class SearchBar{
    #SEARCH_BAR   = null
    #HTTP_REQUEST = null
    #allFiles     = {}
    #content      = []

    constructor(id, httpFileRequest){
        this.#SEARCH_BAR   = document.getElementById(id)
        this.#HTTP_REQUEST = httpFileRequest

        this.#SEARCH_BAR.addEventListener('input', this.updateSearch.bind(this))
        this.#SEARCH_BAR.addEventListener('focus', this.startSearch.bind(this))
        this.#SEARCH_BAR.addEventListener('blur',  this.stopSearch.bind(this))
    }

    updateSearch(){
        this.#content = []
        // Remove content with different name
        Object.keys(this.#allFiles).forEach(filePath => {
            let fileName = this.#allFiles[filePath]
            
            if(fileName.includes(this.#SEARCH_BAR.value)){
                this.#content.push(fileName)
            }
        })

        // Show content in file list !TODO!
    }

    startSearch(){
        // Get content
        this.#allFiles = this.httpFileRequest()

        // Sort content !TODO!

        // Add to content
        this.#content = []
        Object.keys(this.#allFiles).forEach(filePath => {
            this.#content.push(this.#allFiles[filePath])
        })
    }

    stopSearch(){
    }

    httpFileRequest(){
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open("GET", this.#HTTP_REQUEST, false)
        xmlHttp.send(null)
        return JSON.parse(xmlHttp.responseText)
    }
}