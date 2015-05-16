## Play Explorer

An API explorer for Play Applications.

### Warning

This is a work in progress. This project is not ready for consumption yet. 

### Development Notes

#### Getting started with the Front end.

The front-end for the explorer project uses Browserify, React and Gulp.
There is a `package.json` file in the `public` Play assets folder. Do the following to get your development environment setup.

Install the latest version of iojs (Node.js) from [here](https://iojs.org/en/index.html).

```
npm install -g browserify
npm install -g gulp

npm install --dev
npm install

```

Now you should be all set to write JavaScript and build it. All you need to do is to `cd <yourWorkSpace>/public` and `gulp js`. This sets up a gulp watcher that incrementally rebuilds your JavaScript code.

### What the interface looks like

Here is what the interface looks like currently.

![Explorer Preview](https://raw.githubusercontent.com/tikurahul/play-explorer/master/public/images/interface.png)
