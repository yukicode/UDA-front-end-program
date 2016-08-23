
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
        $.each(data.response.docs,function(index, val){
            if(val.snippet){
                fragment += temp.replace("%link%", val.web_url).replace("%title%", val.headline.main)
                            .replace("%content%", val.snippet);
            }else{
                fragment += temp.replace("%link%", val.web_url).replace("%title%", val.headline.main)
                            .replace("%content%", "");
            }
            
        });
        $nytElem.append(fragment);
    }).error(function() {
        console.log( "error getting json from ny times" );
    });

    //get content from wikipedia
    var wikiUrl =  "https://en.wikipedia.org/w/api.php";
    wikiUrl += '?' + $.param({
        action: "opensearch",
        search: city,
        format: "json",
        callback: "wikiCallback",
    });
    var names = [], abrs = [], links = [];
    var tempWiki = '<li><a href="%link%">%name%</a></li>';
    $.ajax({
        "url": wikiUrl,
        "dataType": "jsonp",
    })
    .done(function(data){
        names = data[1];
        abrs = data[2];
        links = data[3];
        for (var i=0; i<10; i++){
            $wikiElem.append(tempWiki.replace("%link%", links[i]).replace("%name%", names[i]));
        }
    })
    .fail(function(){
        console.log("error getting jsonp from wikipedia" );
    });
    return false;
}

$('#form-container').submit(loadData);
