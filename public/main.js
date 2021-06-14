var subs = [{}];

async function getRedditContent() {
    await $.ajax({
        url: "/reddit/posts/",
        data: {
            sub: "elonmusk,bitcoin"
        },
        success: function(result) {
            result.subscribe.forEach(element => {
                subs.push({ sub: element.name, posts: [{ content: element.posts[0].content }, { content: element.posts[1].content }] })
            })
        }
    }).then(() => {
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
                        console.log(e.content);
                        $(post).addClass("post")
                            .html(e.content)
                            .appendTo($(posts))
                    })
                }
            }
        });
    })
}

getRedditContent();