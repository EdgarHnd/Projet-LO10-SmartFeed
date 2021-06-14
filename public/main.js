var subs = [{}];

async function getRedditContent() {
    await $.ajax({
        url: "/myfeed",
        success: function(result) {
            console.log(result);
            result.feed[0].subscribe.forEach(element => {
                subs.push({ sub: element.name, posts: [{ content: element.posts[2].content, thumbnail: element.posts[2].thumbnail }, { content: element.posts[1].content, thumbnail: element.posts[0].thumbnail }] })
            })
        }
    });
}

getRedditContent().then(() => {
    console.log(subs);
    subs.forEach(e => {
        if (e.sub != null) {
            sub = document.createElement('div');
            $(sub).addClass("sub")
                .html(e.sub)
                .appendTo($('#reddit'))
            posts = document.createElement('div');
            $(posts).addClass("posts")
                .appendTo($(sub))
            if ($(e.posts).length) {
                e.posts.forEach(e => {
                    post = document.createElement('div');
                    $(post).addClass("post")
                        .appendTo($(posts));
                    content = document.createElement('div');
                    img = $('<img id="dynamic">');
                    if (e.thumbnail.startsWith('http')) {
                        $(img).attr('src', e.thumbnail)
                            .appendTo($(post));
                    } else {
                        $(img).attr('src', 'https://cdn.worldvectorlogo.com/logos/reddit-4.svg')
                            .appendTo($(post));
                    }
                    $(content).addClass("content")
                        .html(e.content)
                        .appendTo($(post));
                })
            }
        }
    });
})