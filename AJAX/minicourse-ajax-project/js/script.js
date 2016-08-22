
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    var street = $.trim($("#street").val());
    var city = $.trim($("#city").val());
    var src = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + street + ", " + city;
    var imgContent = '<img class="bgimg" src="%src%"></img>';
    var $img = $(".bgimg");
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    if($img.length){
        $img.attr("src", src);
    }else{
        $body.append(imgContent.replace("%src%", src));
    }
    // send request to nytimes
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    var temp = '<li class="article"><a href="%link%">%title%</a><p>%content%</p></li>';
    var fragment = "";
    url += '?' + $.param({
        'q': city,
        'sort': "newest",
    });
    $.getJSON(url, function(data){
        console.log(data.response.docs);
        $.each(data.response.docs,function(index, val){
            if(val.snippet){
                fragment += temp.replace("%link%", val.web_url).replace("%title%", val.headline.main)
                            .replace("%content%", val.snippet);
            }else{
                fragment += temp.replace("%link%", val.web_url).replace("%title%", val.headline.main)
                            .replace("%content%", "");
            }
            
        });
        fragment = "<ul>" + fragment + "</ul>";
        $body.append(fragment);
    });
    return false;
};

$('#form-container').submit(loadData);
