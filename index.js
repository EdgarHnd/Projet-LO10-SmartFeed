require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch');
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// séparer les subreddit par des virgule dans le paramètre sub dans la requete GET
app.get("/reddit/posts", (req, res) => {
    //méthod async afin d'utiliser await pour le fetch
    (async() => {
        try {
            my_json = { media: "reddit", subscribe: [] };
            let subs = req.query.sub;
            arr_subs = subs.split(',');

            for (let sub of arr_subs) {
                var posts = [];

                var request = await fetch('https://www.reddit.com/r/' + sub + '/hot.json').then(response => response.json());
                var sub_name = request["data"]["children"][0]["data"]["subreddit_name_prefixed"];

                for (let post of request["data"]["children"]) {
                    let content = post["data"]["title"];
                    let url = post["data"]["url"];
                    let author = "u/".concat(post["data"]["author"]);
                    let thumbnail = post["data"]["thumbnail"];
                    let my_post = { content: content, url: url, author: author, thumbnail: thumbnail };

                    posts.push(my_post);
                }
                my_json["subscribe"].push({ name: sub_name, posts: posts })
            }
            res.send(my_json);
        } catch (error) {
            console.log(error);
        }

    })();
})


app.get("/youtube/videos", (req, res) => {
    (async() => {
        try {
            my_json = { media: "youtube", subscribe: [] };
            let subs = req.query.sub;
            arr_subs = subs.split(',');

            for (let sub of arr_subs) {
                var posts = [];

                var request = await fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=' + sub + '&maxResults=2&order=date&key=AIzaSyACECAgOBGMjiQ46_Sp2UnJMim0s878LCw').then(response => response.json());
                var sub_name = request["items"][0]["snippet"]["channelTitle"];

                for (let post of request["items"]) {
                    let content = post["snippet"]["title"];
                    let url = 'https://www.youtube.com/watch?v=' + post["id"]["videoId"];
                    let author = sub_name;
                    let thumbnail = post["snippet"]["thumbnails"]["medium"]["url"];
                    let publishTime = post["snippet"]["publishTime"];
                    let my_post = { content: content, url: url, author: author, thumbnail: thumbnail, publishTime: publishTime };

                    posts.push(my_post);
                }
                my_json["subscribe"].push({ name: sub_name, posts: posts })
            }
            res.send(my_json);
        } catch (error) {
            console.log(error);
        }

    })();
})

app.get("/twitter/tweets", (req, res) => {
    (async() => {
        try {
            my_json = { media: "twitter", subscribe: [] };
            let subs = req.query.sub;
            arr_subs = subs.split(',');
            const token = 'Bearer ' + process.env.TWITTER_BEARER_TOKEN;
            const options = {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization: token,
                },
            };

            for (let sub of arr_subs) {
                var posts = [];

                var request = await fetch(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${sub}&count=2&exclude_replies=true&include_rts=false`, options).then(response => response.json());
                var sub_name = request[0]["user"]["name"];

                for (let post of request) {
                    let content = post["text"];
                    let url = "https://twitter.com/" + post["user"]["screen_name"] + "/status/" + post['id_str'];
                    let author = post["user"]["name"];
                    let thumbnail = post["user"]["profile_image_url_https"];
                    let publishTime = post["created_at"];
                    let my_post = { content: content, url: url, author: author, thumbnail: thumbnail, publishTime: publishTime };

                    posts.push(my_post);
                }
                my_json["subscribe"].push({ name: sub_name, posts: posts })
            }
            res.send(my_json);
        } catch (error) {
            console.log(error);
        }

    })();
})


app.get("/twitch/streams", (req, res) => {
    (async() => {
        try{
            my_json = {media : "twitch", subscribe: []};
            let subs = req.query.sub;
            arr_subs = subs.split(',');

            for (let sub of arr_subs) {
                var posts = [];

                var request = await fetch('https://api.twitch.tv/kraken/streams/?game=' + sub + '&limit=2&language=fr&client_id=7fs70y1e116f302zot5p170bpqleyz', {
                  method: 'GET',
                  headers: {'Accept': 'application/vnd.twitchtv.v5+json',
                            'Client-ID': '7fs70y1e116f302zot5p170bpqleyz'},
                }).then(response => response.json());

                var sub_name = request["streams"][0]["game"];

                for(let post of request["streams"]){
                    let content = post["channel"]["status"];
                    let url = post["channel"]["url"];
                    let author = post["channel"]["name"];
                    let thumbnail = post["preview"]["small"];
                    let publishTime = post["created_at"]["publishTime"];
                    let my_post = {content: content, url: url, author: author, thumbnail: thumbnail, publishTime: publishTime};

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