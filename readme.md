# Helmut

Helmut is a Node.js script which uses the [Puppeteer API](https://developers.google.com/web/tools/puppeteer/) to take automated fullpage screenshots of a site at multiple viewport sizes.

## Installation

```shell
npm install -g helmut
```

Please note that a version of the Chromium browser will be downloaded, so the download size could be over 300 MB.

Node.js *v7.6.0 or greater* is required.

## Usage

The script revolves around the idea of a *photo session* JavaScript object which describes what to shoot and in which way. 

Let's say we are developing a portfolio site, and that we want to 'portrait' a bunch of its pages to inspect how they look when displayed on a variety of browser viewport sizes. 

We create a JSON file called `photo-session.json` in the location where we want the screenshots to be saved in. This file has a format like this: 

```javascript
{
  "baseURL": "http://localhost",
  "pages": [
    "/",
    "/about",
    "/contact",
    "/portfolio/",
    "/portfolio/item1/",
    "/portfolio/item2/",
    "/portfolio/item3/",
  ],
  "viewports": [
    [320, 480],
    [375, 812],
    [768, 1024],
    [1024, 768],
    [1280, 800],
    [1440, 900],
    [1920, 1080],
    [2560, 1440]
  ]
}
```

After having specified the base URL of the site, we list the relative URLs of the pages to shoot, and finally the viewport sizes at which these shots have to be taken.

Having configured the shooting session, the script can be launched from the command line as usual:

```shell
node helmut
```

The script outputs some information to the console and starts saving the screenshots into a  timestamped folder named after the session name, something like `photo-session@2018-12-01T12-29-44-358Z`.

The screenshots generally have the same height as the page. But if the page is shorter than the browser viewport, then they have the same height as the viewport.

Let's define another session, this time to test the home page. We create another JSON file, let's call it `home.json`:

```javascript
{
  "pages": [
    "http://localhost/"
  ],
  "viewports": [
    [320, 480],
    [375, 812],
    [768, 1024],
    [1024, 768],
    [1280, 800],
    [1440, 900],
    [1920, 1080],
    [2560, 1440]
  ]
}
```

There's only one page here, so the baseURL property was omitted.

To launch the script with this configuration,  just pass it the session name on the command line:

```shell
node helmut home
```

This time the shots are stored in `home@some-timestamp-here`. If no session name is passed to the script, a default `photo-session` name is used, as in the first example.
