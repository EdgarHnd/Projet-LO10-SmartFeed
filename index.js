const express = require('express')
const fetch = require('node-fetch');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

//séparer les subreddit par des virgule dans le paramètre sub dans la requete GET
app.get("/reddit/posts", (req, res) => {
    //méthod async afin d'utiliser await pour le fetch
    (async() => {
        try{
            my_json = {media : "reddit", subscribe: []};
            let subs = req.query.sub;
            arr_subs = subs.split(',');

            for (let sub of arr_subs){
                var posts = [];

                var request = await fetch('https://www.reddit.com/r/' + sub + '/hot.json').then(response => response.json());
                var sub_name = request["data"]["children"][0]["data"]["subreddit_name_prefixed"];

                for(let post of request["data"]["children"]){
                    let content = post["data"]["title"];
                    let url = post["data"]["url"];
                    let author = "u/".concat(post["data"]["author"]);
                    let thumbnail = post["data"]["thumbnail"];
                    let my_post = {content: content, url: url, author: author, thumbnail: thumbnail};

                    posts.push(my_post);
                }
                my_json["subscribe"].push({name: sub_name, posts: posts})
            }
            res.send(my_json);
        } catch(error) {
            console.log(error);
        }
        
    })();
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})