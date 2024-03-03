# Arcade-Classics

The source code of the Arcade Classics chrome extension

## Info

This extension is written in React Tpescript and uses a Firebase Realtime Database to manage leaderboards.

## Install

Go to [Arcade Classics](https://arcade-classics.github.io/install), to be automatically taken to the install page for your browser.

Direct Links:

- [Chromium](https://chromewebstore.google.com/detail/arcade-classics/gokcmhknbfbkchaljcbjloaebnoblcnd)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/arcade-classics/)

## Building

### Requirements

- A UNIX system (Linux or Max)
- Node JS 20 or newer
- NPM 10 or newer

Install dependencies with `npm i` before building.

### Building for Development

Use `npm run build-dev` or `./build.sh dev <version>` to quickly create a Chromium version. The built extension can be loaded from `/dist`.

### Building for a specific Platform

#### Chromium

Use `npm run build-chromium` or `./build.sh chromium <version>` to create a build for Chromium browsers. The built extension can be loaded from `/dist`.

#### Firefox

Use `npm run build-firefox` or `./build.sh firefox <version>` to create a build for Firefox. The built extension can be loaded from `/dist`.

### Creating Release Files

Use `npm run build` or `./build.sh release` to create final build files. Zipped files can be found in `/build`.
