const express = require('express')
const app = express()
const port = 3000
const fetch = require('node-fetch');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet%2Cid&channelId=UCjWRi2qaGtKjQyoQLc4OGkw&maxResults=3&order=date&key=AIzaSyACECAgOBGMjiQ46_Sp2UnJMim0s878LCw')
  .then(res => res.json())
  .then(json => console.log(json));
