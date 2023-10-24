class SearchBar{
    #SEARCH_BAR   = null
    #HTTP_REQUEST = null
    #content      = []

    constructor(id, httpFileRequest){
        this.#SEARCH_BAR   = document.getElementById(id)
        this.#HTTP_REQUEST = httpFileRequest

        this.#SEARCH_BAR.addEventListener('input', this.updateSearch)
        this.#SEARCH_BAR.addEventListener('focus', this.startSearch)
        this.#SEARCH_BAR.addEventListener('blur', this.stopSearch)
    }

    updateSearch(){
        console.log(1)
    }
    startSearch(){
        // Get content
        let content = this.updateSearch()

        // Sort content
    }
    stopSearch(){
        console.log(3)
    }

    re(){
        var xmlHttp = new XMLHttpRequest()
        xmlHttp.open(this.HTTP_REQUEST, url, false)
        xmlHttp.send(null)
        return xmlHttp.responseText
    }
}