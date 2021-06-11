require('dotenv').config()

var Twitter = require('twitter');

var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    bearer_token: process.env.TWITTER_BEARER_TOKEN
});

function getTwitterUserTimeLine(user) {
    var params = {
        screen_name: user,
        count: 2,
        result_type: 'recent',
        lang: 'en',
        trim_user: 'fasle',
        exclude_replies: 'true',
        include_rts: 'false'
    }
    client.get('statuses/user_timeline', params, function(err, data, response) {
        var tweets = [];
        if (!err) {
            data.forEach(element => {
                tweet = {
                    "content": element.text,
                    "url": "https://twitter.com/" + element.user.screen_name + "/status/" + element.id_str,
                    "author": element.user.name,
                    "thumbnail": element.user.profile_image_url_https,
                }
                tweets.push(tweet);
            });
            console.log(tweets)
        } else {
            console.log(err);
        }
    })
}
/* 
const getUsersTweets = (userName) => {
    return new Promise((resolve, reject) => {
        let params = { screen_name: userName, count: 1 };
        try {
            client.get('search/tweets', params, function(err, data, response) {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        } catch (err) {
            console.log(err);
        }
    })
}

const printTweets = async() => {
    try {
        const tweets = await getUsersTweet(userName);
        console.log(tweets);

    } catch (err) {
        console.log(err);
    }
}

printTweets(); */

getTwitterUserTimeLine("elonmusk");