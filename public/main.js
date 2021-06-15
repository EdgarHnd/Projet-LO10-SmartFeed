var feeds;

/*async function getFeed() {
    await $.ajax({
        url: "/myfeed",
        success: function(result) {
            console.log(result.feed);
            feeds = result.feed;
        }
    });
}*/

async function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

    await $.ajax({
        url: "/user",
        type: "GET",
        data: {id : profile.getId()},
        success: async function(result) {
            await getCustomFeed(result).then(() => {
                console.log(feeds[0].subscribe);
                feeds[0].subscribe.forEach(e => {
                    console.log(e);
                    if (e.name != null) {
                        sub = document.createElement('div');
                        $(sub).addClass("sub")
                            .html(e.name)
                            .appendTo($('#reddit'))
                        posts = document.createElement('div');
                        $(posts).addClass("posts")
                            .appendTo($(sub))
                        if ($(e.posts).length) {
                            e.posts.slice(0, 3).forEach(e => {
                                link = document.createElement('a');
                                $(link).attr('href', e.url)
                                    .appendTo(posts);
                                post = document.createElement('div');
                                $(post).addClass("post")
                                    .appendTo($(link));
                                img = $('<img id="dynamic">');
                                if (e.thumbnail.startsWith('http')) {
                                    $(img).attr('src', e.thumbnail)
                                        .appendTo($(post));
                                } else {
                                    $(img).attr('src', 'https://cdn.worldvectorlogo.com/logos/reddit-4.svg')
                                        .appendTo($(post));
                                }
                                content = document.createElement('div');
                                $(content).addClass("content")
                                    .html(e.content.slice(0, 100))
                                    .appendTo($(post));
                                author = document.createElement('div');
                                $(author).addClass("author")
                                    .html(e.author)
                                    .appendTo($(post));
                            })
                        }
                    }
                });
            })
        }
    })
}

async function getCustomFeed(result){
    var res = JSON.parse(result)
    console.log(res)
    var user = {name: res.Items[0].name, user_id: res.Items["0"].user_id, media_subs: {reddit: [], youtube:[], twitter:[], twitch:[]}}
    res.Items.forEach( element => {
        switch(element.media){
            case "reddit":
                user.media_subs.reddit.push(element.sub)
                break
            case "youtube":
                user.media_subs.youtube.push(element.sub)
                break
            case "twitter":
                user.media_subs.twitter.push(element.sub)
                break
            case "twitch":
                user.media_subs.twitch.push(element.sub)
                break
        }
    });
    await $.ajax({
        url: "/myfeed",
        type: 'GET',
        data: {user: user},
        success: function(result) {
            console.log(result.feed);
            feeds = result.feed
        }
    });
}