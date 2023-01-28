# Arcade-Classics

The source code of the Arcade Classics chrome extension

## Info

This extension is written in React Tpescript and uses a Firebase Realtime Database to manage leaderboards. Please make sure you are familiar with these technologies before contributing.

## Building

1. Download and uncompress the source code.
2. Check you have Node JS 16 or greater.
3. Run `npm i` in the source directory.
4. If you are on Windows go to the `package.json` file and on lines 26 and 27 change `mv` to `move`.
5. When building for Frefox run `npm run build-firefox`.
6. When building for a chromium based browser (eg: chrome, edge) run `npm run build-chromium`.
7. The built code can be found in `/build`.
8. Load the build into your browser of choice.
