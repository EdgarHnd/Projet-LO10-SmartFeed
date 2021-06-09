const express = require('express')
const fetch = require('node-fetch');
const app = express()
const port = 3000
const fetch = require('node-fetch');

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get("/reddit/posts/", (req, res) => {
    fetch('https://www.reddit.com/r/' + req.query.sub + '/hot.json')
        .then(res => res.json())
        .then(json => {
            var posts = {sub: json["data"]["children"][0]["data"]["subreddit_name_prefixed"]};
            var i = 0;
            for(let post of json["data"]["children"]){
                let title = post["data"]["title"];
                let url = post["data"]["url"];
                let author = "u/".concat(post["data"]["author"]);
                let thumbnail = post["data"]["thumbnail"];
                let my_post = {title: title, url: url, author: author, thumbnail: thumbnail};
                posts[i] = my_post;
                i++;
            }
            res.send(posts);
        });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet%2Cid&channelId=UCjWRi2qaGtKjQyoQLc4OGkw&maxResults=3&order=date&key=AIzaSyACECAgOBGMjiQ46_Sp2UnJMim0s878LCw')
  .then(res => res.json())
  .then(json => console.log(json));
