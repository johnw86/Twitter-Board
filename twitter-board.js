// JScript source code

(function($) {

    jQuery.fn.exists = function() { return jQuery(this).length > 0; }

    $.twitterboard = function(q, n, r) {
        // encode the hash if the search contains a hash tag
        var query = q.replace("#", "%23");

        // if not doing a update clear all children of ul
        if (r != "update") {
            $('#twitter-board *').remove();
        }

        var tweetsAdded = 0;

        // get the twitter feed based on query and no results requested - create an li containing tweet and append to ul
        $.getJSON('http://search.twitter.com/search.json?callback=?&q=' + query + '&rpp=' + n, function(data) {
            $.each(data.results, function(i, item) {
                var tweet = '<li id="' + item.id_str + '">';
                tweet += '<img src=' + item.profile_image_url + '></img>';
                tweet += '<a href="http://twitter.com/' + item.from_user + '" class="user">' + item.from_user + '</a><span>Says</span>';
                tweet += '<p class="tweet">' + $.Linkify(item.text) + '</p>';
                tweet += '<abbr class="timeago" title=\'' + $.ISODateString(new Date(item.created_at)) + '\'>' + new Date(item.created_at) + '</abbr>';
                tweet += '</li>';

                // check to see whether the request is an update or initial load
                // if it's not an update append but if its update prepend and remove last item.
                if (r != "update") {
                    $('#twitter-board').append(tweet);
                }
                else if (!$('li#' + item.id_str).exists()) {
                    $('#twitter-board li').last().fadeOut("slow").remove();
                    $(tweet).hide().prependTo("#twitter-board").fadeIn("slow");
                    tweetsAdded++;
                }
            });

            if (tweetsAdded) {

            }

            // test to see if IE then if greater than version 6 run timeago
            if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) { //test for MSIE x.x;
                var ieversion = new Number(RegExp.$1) // capture x.x portion and store as a number
                if (ieversion > 6)
                    $("abbr.timeago").timeago();
            }
            else {
                $("abbr.timeago").timeago();
            }

            if (r != "update" || tweetsAdded) {
                $('#twitter-board').sameHeights(10);
            }


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
            $(this).children().css({ 'height': tallest + pad + 'px' });
        });
        return this;
    };

    /* updates tweet text to make hashtags, user and url links */
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


    /* call this function on every onkeyup event . */
    $.charactorCount = function twitter_type_count(input_selector, max_chars, update_container_selector) {
        var text = $(input_selector).val() + "";
        var curr_num_chars = text.length;

        if (curr_num_chars > max_chars) {
            $(update_container_selector).addClass('error');
            $('#tweetSubmit').attr("disabled", true);
            $('#tweetSubmit').addClass('disabled');
        }
        else {
            $(update_container_selector).removeClass('error');
            $('#tweetSubmit').attr("disabled", false);
            $('#tweetSubmit').removeClass('disabled');
        }

        var leftOver = max_chars - curr_num_chars;
        $(update_container_selector).html(leftOver);
        return leftOver;
    };

})(jQuery);

