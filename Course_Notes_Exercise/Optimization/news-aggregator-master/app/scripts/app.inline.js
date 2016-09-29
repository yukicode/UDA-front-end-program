/**
 *
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
APP.Main = (function() {

    var LAZY_LOAD_THRESHOLD = 300;
    var $ = document.querySelector.bind(document);

    var stories = null;
    var storyStart = 0;
    var count = 50;
    var main = $('main');
    var inDetails = false;
    var storyLoadCount = 0;
    var localeData = {
        data: {
            intl: {
                locales: 'en-US'
            }
        }
    };

    var tmplStory = $('#tmpl-story').textContent;
    var tmplStoryDetails = $('#tmpl-story-details').textContent;
    var tmplStoryDetailsComment = $('#tmpl-story-details-comment').textContent;
    var $storyDetails = $('.story-details');

    if (typeof HandlebarsIntl !== 'undefined') {
        HandlebarsIntl.registerWith(Handlebars);
    } else {

        // Remove references to formatRelative, because Intl isn't supported.
        var intlRelative = /, {{ formatRelative time }}/;
        tmplStory = tmplStory.replace(intlRelative, '');
        tmplStoryDetails = tmplStoryDetails.replace(intlRelative, '');
        tmplStoryDetailsComment = tmplStoryDetailsComment.replace(intlRelative, '');
    }

    var storyTemplate =
        Handlebars.compile(tmplStory);
    var storyDetailsTemplate =
        Handlebars.compile(tmplStoryDetails);
    var storyDetailsCommentTemplate =
        Handlebars.compile(tmplStoryDetailsComment);

    /**
     * As every single story arrives in shove its
     * content in at that exact moment. Feels like something
     * that should really be handled more delicately, and
     * probably in a requestAnimationFrame callback.
     */
    function onStoryData(key, details) {

        // This seems odd. Surely we could just select the story
        // directly rather than looping through all of them.
        var story = document.getElementById('s-' + key);
        details.time *= 1000;
        var html = storyTemplate(details);
        story.innerHTML = html;
        story.addEventListener('click', onStoryClick.bind(this, details));
        story.classList.add('clickable');

        // Tick down. When zero we can batch in the next load.
        storyLoadCount--;
    }

    function onStoryClick(details) {

       

        // Create and append the story. A visual change...
        // perhaps that should be in a requestAnimationFrame?
        // And maybe, since they're all the same, I don't
        // need to make a new element every single time? I mean,
        // it inflates the DOM and I can only see one at once.
            if (details.url)
                details.urlobj = new URL(details.url);

            var comment;
            var commentsElement;
            var storyHeader;
            var storyContent;

            var storyDetailsHtml = storyDetailsTemplate(details);
            var kids = details.kids;
            var commentHtml = storyDetailsCommentTemplate({
                by: '',
                text: 'Loading comment...'
            });

            $storyDetails.setAttribute('id', 'sd-' + details.id);
            requestAnimationFrame(showStory.bind(this, details.id));
            $storyDetails.innerHTML = storyDetailsHtml;

            commentsElement = $storyDetails.querySelector('.js-comments');
            storyHeader = $storyDetails.querySelector('.js-header');
            storyContent = $storyDetails.querySelector('.js-content');

            var closeButton = $storyDetails.querySelector('.js-close');
            closeButton.addEventListener('click', hideStory.bind(this, details.id));

            if (typeof kids === 'undefined')
                return;

            for (var k = 0; k < kids.length; k++) {

                comment = document.createElement('aside');
                comment.setAttribute('id', 'sdc-' + kids[k]);
                comment.classList.add('story-details__comment');
                comment.innerHTML = commentHtml;
                commentsElement.appendChild(comment);

                // Update the comment with the live data.
                APP.Data.getStoryComment(kids[k], function(commentDetails) {

                    commentDetails.time *= 1000;

                    var comment = commentsElement.querySelector(
                        '#sdc-' + commentDetails.id);
                    comment.innerHTML = storyDetailsCommentTemplate(
                        commentDetails,
                        localeData);
                });
            }
    }

    function showStory(id) {
        if (inDetails)
            return;

        inDetails = true;

        var storyDetails = $('#sd-' + id);
        var left = null;

        if (!storyDetails)
            return;
        document.body.classList.add('details-active');
        storyDetails.classList.add('story-details-active');
    }

    function hideStory(id) {

        if (!inDetails)
            return;

        var storyDetails = $('#sd-' + id);
        var left = 0;
        inDetails = false;
        document.body.classList.remove('details-active');
        storyDetails.classList.remove('story-details-active');
    }

    main.addEventListener('touchstart', function(evt) {

        // I just wanted to test what happens if touchstart
        // gets canceled. Hope it doesn't block scrolling on mobiles...
        if (Math.random() > 0.97) {
            evt.preventDefault();
        }

    });

    main.addEventListener('scroll', function() {

        var header = $('header');
        var headerTitles = header.querySelector('.header__title-wrapper');
        var scrollTop = main.scrollTop;
        var totalHeight = main.scrollHeight;
        var offsetHeight = main.offsetHeight;
        var scrollTopCapped = Math.min(70, scrollTop);

        // Check if we need to load the next batch of stories.
        var loadThreshold = (totalHeight - offsetHeight - LAZY_LOAD_THRESHOLD);
        if (scrollTop > loadThreshold)
            setTimeout(loadStoryBatch(), 4);
        //apply style after changing inner html
        if (scrollTopCapped === 70){
            document.body.classList.add('raised');
            headerTitles.classList.add('decrease-size');
        }else{
            document.body.classList.remove('raised');
            headerTitles.classList.remove('decrease-size');
        }
    });

    function loadStoryBatch() {

        if (storyLoadCount > 0)
            return;

        storyLoadCount = count;

        var end = storyStart + count;
        for (var i = storyStart; i < end; i++) {

            if (i >= stories.length)
                return;

            var key = String(stories[i]);
            var story = document.createElement('div');
            story.setAttribute('id', 's-' + key);
            story.classList.add('story');
            story.innerHTML = storyTemplate({
                title: '...',
                score: '-',
                by: '...',
                time: 0
            });
            main.appendChild(story);

            APP.Data.getStoryById(stories[i], onStoryData.bind(this, key));
        }

        storyStart += count;

    }

    // Bootstrap in the stories.
    APP.Data.getTopStories(function(data) {
        stories = data;
        loadStoryBatch();
        main.classList.remove('loading');
    });

})();