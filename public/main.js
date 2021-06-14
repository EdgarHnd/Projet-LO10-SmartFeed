var subs = [{}];
var stocks = [];

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
    }).then(async() => {
        i = 0;
        await $("#reddit > .sub").each(function() {
            $(this).html(subs[i].sub);
            i++;
            stocks.push(this);
        });
    }).then(() => {
        console.log(stocks);
        stocks.forEach(element => {
            j = 0;
            $(element).children('.element').each(function() {
                $(this).html('subs[i].posts[j].content')
                j++
            })
        });
    })
}

getContent();