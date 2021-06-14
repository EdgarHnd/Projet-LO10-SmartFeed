var subs = [{}];

async function getContent() {
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
            sub = document.createElement('div');
            $(sub).addClass("sub")
                .html(e.sub)
                .appendTo($('#reddit'))
            if ($(e.posts).length) {
                console.log("Exists!");
                e.posts.forEach(e => {
                    post = document.createElement('div');
                    console.log(e.content);
                    $(post).addClass("post")
                        .html(e.content)
                        .appendTo($(sub))
                })
            }

        });
    })
}

getContent();