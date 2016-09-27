/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function () {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function () {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function () {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it("should have url for each feed", function () {
            allFeeds.forEach(function (feed) {
                expect(feed.url).toBeDefined();
                expect(feed.url).not.toBe("");
            });
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it("should have name for each feed", function () {
            allFeeds.forEach(function (feed) {
                expect(feed.name).toBeDefined();
                expect(feed.name).not.toBe("");
            });
        });
    });


    /* TODO: Write a new test suite named "The menu" */
    describe("The menu", function () {
        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it("should hide menu by default", function () {
            var body = document.getElementsByTagName("body");
            expect(body).toBeDefined();
            expect(body.length).toBe(1);
            expect(body[0].classList.contains("menu-hidden")).toBe(true);
        });

        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it("should toggle show/hide menu when the menu icon is clicked", function () {
            var icon = document.getElementsByTagName("i"),
                body = document.getElementsByTagName("body");
            expect(icon).toBeDefined();
            expect(icon.length).toBe(1);
            for (var i = 0; i < 10; i++) {
                icon[0].click();
                if (i % 2) {
                    expect(body[0].classList.contains("menu-hidden")).toBe(true);
                } else {
                    expect(body[0].classList.contains("menu-hidden")).toBe(false);
                }
            }
        });
    });

    /* TODO: Write a new test suite named "Initial Entries" */
    describe("Initial Entries", function () {
        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */
        id = 0;
        beforeEach(function (done) {
            loadFeed(id, done);
        });
        afterEach(function(done){
            id++;
            done();
        });
        it("should have entries in feed container afterting loading feed 0", function (done) {
            var feedContainer = document.getElementsByClassName("feed");
            expect(feedContainer).toBeDefined();
            expect(feedContainer.length).toBe(1);
            var entries = feedContainer[0].getElementsByClassName("entry");
            expect(entries).toBeDefined();
            expect(entries.length).toBeDefined();
            expect(entries.length).toBeGreaterThan(0);
            done();
        });

        it("should have entries in feed container afterting loading feed 1", function (done) {
            var feedContainer = document.getElementsByClassName("feed");
            expect(feedContainer).toBeDefined();
            expect(feedContainer.length).toBe(1);
            var entries = feedContainer[0].getElementsByClassName("entry");
            expect(entries).toBeDefined();
            expect(entries.length).toBeDefined();
            expect(entries.length).toBeGreaterThan(0);
            done();
        });

        it("should have entries in feed container afterting loading feed 2", function (done) {
            var feedContainer = document.getElementsByClassName("feed");
            expect(feedContainer).toBeDefined();
            expect(feedContainer.length).toBe(1);
            var entries = feedContainer[0].getElementsByClassName("entry");
            expect(entries).toBeDefined();
            expect(entries.length).toBeDefined();
            expect(entries.length).toBeGreaterThan(0);
            done();
        });

        it("should have entries in feed container afterting loading feed 3", function (done) {
            var feedContainer = document.getElementsByClassName("feed");
            expect(feedContainer).toBeDefined();
            expect(feedContainer.length).toBe(1);
            var entries = feedContainer[0].getElementsByClassName("entry");
            expect(entries).toBeDefined();
            expect(entries.length).toBeDefined();
            expect(entries.length).toBeGreaterThan(0);
            done();
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection"*/
    describe("New Feed Selection", function () {
        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        var id = 1,
            oldEntries, oldEntriesLength, oldEntryContents = [],
            newEntries, newEntriesLength, newEntryContents = [];

        beforeEach(function (done) {
            loadFeed(id, done);
        });

        afterEach(function(done){
            id++;
            done();
        });

        it("should have contents in the entries afterting loading feed 1", function (done) {
            var feedContainer = document.getElementsByClassName("feed");
            oldEntries = feedContainer[0].getElementsByClassName("entry");
            oldEntriesLength = oldEntries.length;
            for(var i=0; i<oldEntriesLength; i++){
                oldEntryContents.push(oldEntries[i].getElementsByTagName("h2")[0].textContent);
                expect(oldEntryContents[i]).toBeTruthy();
            }
            done();
        });

        it("should have different contents afterting loading feed 2", function (done) {
            var feedContainer = document.getElementsByClassName("feed");
            newEntries = feedContainer[0].getElementsByClassName("entry");
            newEntriesLength = newEntries.length;
            for(var i=0; i<oldEntriesLength; i++){
                newEntryContents.push(newEntries[i].getElementsByTagName("h2")[0].textContent);
                expect(newEntryContents[i]).toBeTruthy();
            }

            //compare contents
            var length = oldEntriesLength > newEntriesLength ? oldEntriesLength : newEntriesLength;
            for(var j=0; j<length; j++){
                if(!newEntryContents[j] || !oldEntryContents[j]){ break; }
                expect(newEntryContents[j] === oldEntryContents[j]).toBe(false);
            }
            done();
        });

    });
} ());
