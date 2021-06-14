var feeds;

async function getFeed() {
    await $.ajax({
        url: "/myfeed",
        success: function(result) {
            console.log(result.feed);
            feeds = result.feed;
        }
    });
}

getFeed().then(() => {
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