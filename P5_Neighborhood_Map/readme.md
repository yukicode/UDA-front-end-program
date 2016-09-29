# Neighborhood-map

UDA-front-end-developer prgoram Project 5.

An application that helps you find apartments near Seattle, WA.

This app uses Google Map API and Yelp API.

The source files are in src folder, the minified files are in the dist folder.

### How to Use the Application
1. Make sure that you have node.js in the system. You can download the newest version [here](https://nodejs.org/en/).
2. Download and unzip this repo.
3. In command line, go to the directory of the downloaded file and type `npm install --production`. This will install all the dependencies needed to successfully run the app.
4. Type `node app` to run the local server. It will server the minified webpage at port 3000.
5. In browser, go to `localhost:3000` to use to application.

### How to Build From Source Files
1. In command line, go to the directory of the downloaded file.
2. Type `npm install`. This will install all the dependencies for production and developments.
3. Type `gulp build` to build the application from source files.

### Features
* Displays all the apartments near Seattle area by default.
* Display apartment names, phone numbers, websites, price ranges, yelp reviews, google reviews and thumbnail images.
* Search apartments by name.
* Search apartments near by desired locations.
* Sort apartments by name or price.

### Todo
- [ ] Link with database.
- [ ] Add favorite button.
- [ ] Add favorite menu that displays all the favorite apartments's details.
- [ ] Add local storage of favorites or add user sign up/login.

### License
MIT License.

