const express = require('express')
const fs      = require('fs')
const path    = require('path')

let app    = express()
const PORT = 8080

app.use(express.static(process.cwd()))

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), '/src/index.html'))
})

app.listen(PORT, '0.0.0.0', (err) => {
    if(err){
        console.log(err)
    }
    console.log('Server up on PORT', PORT)
})