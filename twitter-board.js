// JScript source code

(function($) {

    $.twitterboard = function(q, n) {
        // encode the hash if the search contains a hash tag
        var query = q.replace("#", "%23");

        //Get the twitter feed based on query and no results requested - create an li containing tweet and append to ul
        $.getJSON('http://search.twitter.com/search.json?callback=?&q=' + query + '&rpp=' + n, function(data) {
            $.each(data.results, function(i, item) {
                var tweet = '<li class=tweet' + i + '>';
                tweet += '<img src=' + item.profile_image_url + '></img>';
                tweet += '<a href="http://twitter.com/' + item.from_user + '" class="user">' + item.from_user + '</a><span>Says</span>';
                tweet += '<p class="tweet">' + $.Linkify(item.text) + '</p>';
                tweet += '<abbr class="timeago" title=\'' + $.ISODateString(new Date(item.created_at)) + '\'>' + new Date(item.created_at) + '</abbr>';
                tweet += '</li>';
                $('ul#twitter-board').append(tweet);
            });

            $("abbr.timeago").timeago();

            $('#twitter-board').sameHeights(10);

        });
    };


    /* use a function for the exact format desired... */
    $.ISODateString = function(d) {
        function pad(n) { return n < 10 ? '0' + n : n }
        return d.getUTCFullYear() + '-'
      + pad(d.getUTCMonth() + 1) + '-'
      + pad(d.getUTCDate()) + 'T'
      + pad(d.getUTCHours()) + ':'
      + pad(d.getUTCMinutes()) + ':'
      + pad(d.getUTCSeconds()) + 'Z'
    };


    /* Plugin to make variable height divs equal heights */
    $.fn.sameHeights = function(pad) {

        $(this).each(function() {
            var tallest = 0;

            $(this).children().each(function(i) {
                if (tallest < $(this).height()) { tallest = $(this).height(); }
            });
            $(this).children().css({ 'height': tallest + pad });
        });
        return this;
    };

    /* Updates tweet text to make hashtags, user and url links */
    $.Linkify = function Linkify(text) {
        text = text.replace(/(https?:\/\/\S+)/gi, function(s) {
            return '<a href="' + s + '" target="_blank">' + s + '</a>';
        });

        text = text.replace(/(^|)@(\w+)/gi, function(s) {
            return '<a href="http://twitter.com/' + s + '" target="_blank">' + s + '</a>';
        });

        text = text.replace(/(^|)#(\w+)/gi, function(s) {
            return '<a href="http://search.twitter.com/search?q=' + s.replace(/#/, '%23') + '" target="_blank">' + s + '</a>';
        });
        return text;
    };



})(jQuery);