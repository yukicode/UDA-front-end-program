#Website Optimization
--------------------------------------------------------
* App folder is for development css and js are not inlined nor minified.
* Public folder contains the inlined and minified build.

## SpeedTestResult

--------------------------------------------------------
* Strategy:  desktop
* Speed:     98
* Strategy:  mobile
* Speed:     98
* Stability: 100

--------------------------------------------------------

## Gulp Task
In the command line go to the public folder and type:
* `gulp` Serve index.html locally.
* `gulp build` Build webpage in the public repo. All the resources are inlined and minified.
* `gulp pageSpeedTest` Test page speed use page speed insights. Results are shown in the console.

##Changes to index.html
### Optimize critical render path
* Add media to print.css
* Use web font loader to load google font
* Move scripts to the end of body, load google analysis, perfmatter.js and web font loader asynchronously
* Minify and inline style.css
* Minify scripts and html

### Merge html content and change image source
* Serve all the images from the local file
* Merge the contents of the three projects (project-2048.html, project-mobile.html and project-webperf.html) into index.html. Add an event listener  to show/hide contents.
* Add a go back button to each project detail so that user could go back to the main content.

## Changes to pizza.html
### Optimize critical render path
* Inline style.css, bootstrap-grid.css and main.js
* Minify css, scripts and html

### Change of html content
* add meta information to pizza.html
```
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
```

## Change of main.js
### Pizza Resize
* Run `document.querySelector("#pizzaSize")` and `document.querySelectorAll(".randomPizzaContainer")` once and store them in variables
* delete function determineDx and simplify the calculation of new width. Avoid using offsetWidth.

### Generate Random Pizza
* Move the query selector outside of the for loop to avoid expensive DOM operation.
* Tried using web workers but it takes a long time to get response from web worker. Increasing the number of web workers will further delay the response.

### Generate pizza background
* Move variable declarition out of for loops. Move all the variables before the function `logAverageFrame()` and declare at once.
* Move the assignment of queryselector and scrollTop out of the for loop
* Use `requestAnimationFrame(updatePositions)` to optimize the scroll event
* Composition takes extra long time due to useless background pizzas outside of the visiable window. In `DOMContentLoaded`, reduce the number of for loop from 200 to 40.
* Calling `updatePositions()` in `DOMContentLoaded` will cause forecd synchronous layout. Use a simplified for loop instead.

## Style.css
* Add `will-change: left;` for `.mover` , indicate that they need to be in separated layers.