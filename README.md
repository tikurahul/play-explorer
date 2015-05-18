## Play Explorer

![Explorer](https://raw.githubusercontent.com/tikurahul/play-explorer/master/public/images/explorer.png)

#### What does this project do?

Glad you asked. This project automatically generates a nice `API explorer` for your Play project. This is especially useful writing `RESTful web services`.

#### What about Swagger et.al ?

Swagger is an awesome project. That being said, all the information necessary for generating an `API explorer` is already inside the Play `routes` file. This project uses the `Play Routes file compiler` to generate an API explorer. This means, no dependencies on external libraries and __no additional annotations__. DRY FTW.

### How to I use this ?

The Play explorer application, is itself a Play Application.

* Clone the repo from [here](https://github.com/tikurahul/play-explorer).
* You need to have the latest version of io.js / Node.js installed. This is only so you can pull in the required dependencies via `npm`. You can download it from [here](https://iojs.org/en/index.html).
* `cd` into the `public` folder. This folder should have a `package.json` file. Run `npm install` to provision all the dependencies. Now you should have all the required dependencies.
* You should now be able to run the Play application using the `activator run <port>` command.
* You should now be able to look at a test explorer page, like the once in the screen shot below.

* There is an example `routes` file under `app/resources/routes`. This file is being compiled by the Play Routes file compiler to generate the test explorer page. Now you need to replace the contents of this file with `your` real routes file. You can also `symlink` your `routes` file to this location.
* Run your Play application (i.e. the application that the Play Explorer application is going to point to). Use the same `activator run` command. Choose a different port.
* In the `application.conf` file for the Play Explorer, set the `default.explorer.endpoint` property to the base `URL` of the Play application that the Play Explorer is going to talk to (from the previous step).
* Thats it, you should now be able to use the Explorer page to test out your APIs.

#### IMPORTANT

If your application does not support `CORS`, then it will have to. This is because the explorer is a JavaScript application, and it cannot make X-Domain requests without `CORS` headers. Supporting `CORS` is really easy.

Add a Play Filter in your application that looks something like:

```scala
package filters

import play.api._
import play.api.mvc._

import play.api.libs.concurrent.Execution.Implicits._

class CorsFilter extends EssentialFilter {
  def apply(next: EssentialAction) = new EssentialAction {
    def apply(requestHeader: RequestHeader) = {
      next(requestHeader).map {
        result =>
          result.withHeaders(
            "Access-Control-Allow-Origin" -> "*",
            "Access-Control-Allow-Headers" -> "Origin, X-Requested-With, Content-Type, Accept"
          )
      }
    }
  }
}
```

You can wrap the filter in a `Play.isDev()` to only use the filter in `dev` mode if you want to. Don't forget to add this filter to your `Global` object.

So something like

```
application.global=Global
```

```scala
import play.api.GlobalSettings
import play.api.mvc.WithFilters

import filters.CorsFilter

object Global extends WithFilters(new CorsFilter) with GlobalSettings
```

### Development Notes

#### Getting started with the Front end.

The front-end for the explorer project uses `Browserify`, `React` and `Gulp`.
There is a `package.json` file in the `public` Play assets folder. Do the following to get your development environment setup.

Install the latest version of iojs (Node.js) from [here](https://iojs.org/en/index.html).

```
npm install -g browserify
npm install -g gulp

npm install --dev
npm install
```

Now you should be all set to write JavaScript and build it. All you need to do is to `cd <yourWorkSpace>/public` and `gulp js`. This sets up a gulp watcher that incrementally rebuilds your JavaScript code.

#### Contributions

Contributions are welcome. All you need to do is fork this project, and send me a pull request.

### What the interface looks like

Here is what the interface looks like currently.

![Explorer](https://raw.githubusercontent.com/tikurahul/play-explorer/master/public/images/interface.png)

### License

The MIT License (MIT)

Copyright (c) 2014 Rahul Ravikumar
