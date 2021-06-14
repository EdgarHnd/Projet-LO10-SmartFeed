require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch');
const app = express()
const port = 3000
const cors = require('cors');
const path = require('path');

app.use(cors());

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

var user = { name: "Josh", media_subs: { reddit: ["YUROP", "rance"], youtube: ["UCmCLlnZfSe93AoSGc03l7eA", "UCj1VqrHhDte54oLgPG4xpuQ"], twitter: ["teddyriner", "Sardoche_Lol"], twitch: ["Chess"] } }

app.get('/myfeed', (req, res) => {
    (async() => {
        let my_feed = { feed: [] };
        if (user.media_subs.reddit != undefined) {
            let reddit_subs = user.media_subs.reddit.join(',')
            my_feed.feed.push(await getRedditPosts(reddit_subs))
        }
        /* 
                if (user.media_subs.youtube != undefined) {
                    let youtube_subs = user.media_subs.youtube.join(',')
                    my_feed.feed.push(await getYoutubeVideos(youtube_subs))
                }
                if (user.media_subs.twitter != undefined) {
                    let twitter_subs = user.media_subs.twitter.join(',')
                    my_feed.feed.push(await getTwitterTweets(twitter_subs))
                }
                if (user.media_subs.twitch != undefined) {
                    let twitch_subs = user.media_subs.twitch.join(',')
                    my_feed.feed.push(await getTwitchStreams(twitch_subs))
                } */
        res.send(my_feed);
    })();
});


async function getRedditPosts(subs) {
    try {
        my_json = { media: "reddit", subscribe: [] };
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
        return my_json;
    } catch (error) {
        console.log(error);
    }
}

async function getYoutubeVideos(subs) {
    try {
        my_json = { media: "youtube", subscribe: [] };
        arr_subs = subs.split(',');

        for (let sub of arr_subs) {
            var posts = [];

            var request = await fetch('https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=' + sub + '&maxResults=2&order=date&key=' + process.env.YOUTUBE_BEARER_TOKEN).then(response => response.json());
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
        return my_json;
    } catch (error) {
        console.log(error);
    }
}


async function getTwitterTweets(subs) {
    try {
        my_json = { media: "twitter", subscribe: [] };
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
        return my_json;
    } catch (error) {
        console.log(error);
    }
}

async function getTwitchStreams(subs) {
    try {
        my_json = { media: "twitch", subscribe: [] };
        arr_subs = subs.split(',');

        for (let sub of arr_subs) {
            var posts = [];

            var request = await fetch('https://api.twitch.tv/kraken/streams/?game=' + sub + '&limit=2&language=fr&client_id=' + process.env.TWITCH_BEARER_TOKEN, {
                method: 'GET',
                headers: {
                    'Accept': 'application/vnd.twitchtv.v5+json',
                    'Client-ID': '7fs70y1e116f302zot5p170bpqleyz'
                },
            }).then(response => response.json());

            var sub_name = request["streams"][0]["game"];

            for (let post of request["streams"]) {
                let content = post["channel"]["status"];
                let url = post["channel"]["url"];
                let author = post["channel"]["name"];
                let thumbnail = post["preview"]["small"];
                let publishTime = post["created_at"]["publishTime"];
                let my_post = { content: content, url: url, author: author, thumbnail: thumbnail, publishTime: publishTime };

                posts.push(my_post);
            }
            my_json["subscribe"].push({ name: sub_name, posts: posts })
        }
        return my_json;
    } catch (error) {
        console.log(error);
    }
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})