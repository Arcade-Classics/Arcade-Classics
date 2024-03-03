#!/bin/sh
set -e

# Scipt to build Arcade Classics


# Set the platform and version
if [ "$1" = "dev" ] || [ "$1" = "release" ] || [ "$1" = "firefox" ] || [ "$1" = "chromium" ]; then
  echo "Building: $1"
  PLATFORM=$1
else
  echo "Missing or invalid platform argument"
  echo "Usage: build.sh <platform> <version>"
  exit 1
fi

if [ "$npm_package_version" ]; then
  VERSION=$npm_package_version
  echo "Version: $VERSION (from package.json)"
elif [ -z $2 ]; then
  echo "Missing version argument"
  echo "Usage: build.sh <platform> <version>"
  exit 1
else
  VERSION=$2
  echo "Version: $VERSION"
fi

echo ""



# Pre Build jobs
clean() {
  echo "Cleaning old builds"
  rm -rf dist
  rm -rf build
}


# Formatting
prettier() {
  echo "Running prettier"
  npx prettier --write .
}
lint() {
  echo "Running ESLint"
  npx eslint --fix .
}


# Building
build_css() {
  echo "Building SCSS"
  npx sass --charset --no-source-map --style=compressed ./src/assets/main.scss ./src/assets/main.css
}
build_tsx() {
  echo "Building TSX with Vite"
  npx tsc
  npx vite build
}


# Post build jobs
set_platform() {
  if [ "$1" = "firefox" ]; then
    echo "Setting platform to: Firefox"
    cp -r ./dist/manifest-firefox.json ./dist/manifest.json
  elif [ "$1" = "chromium" ]; then
    echo "Setting platform to: Chromium"
    cp -r ./dist/manifest-chromium.json ./dist/manifest.json
  fi
}
set_version() {
  echo "Setting version to: $1"
  sed -i 's/{{VERSION}}/'$1'/g' ./dist/manifest.json
}



# Main build script
build() {
  echo "Starting build"
  echo ""
  clean

  if [ "$1" = "dev" ]; then
    echo "Creating development build"
    build_css
    build_tsx
    set_platform "chromium"
    set_version $2

  elif [ "$1" = "release" ]; then
    echo "Creating release build"
    prettier
    lint
    build_css
    build_tsx

    mkdir build
    echo "Building Chromium release build"
    set_platform "chromium"
    set_version $2
    zip -r ./build/arcade-classics-$2-chromium.zip ./dist/* -x "manifest-firefox.json"

    echo "Building Firefox release build"
    set_platform "firefox"
    set_version $2
    zip -r ./build/arcade-classics-$2-firefox.zip ./dist/* -x "manifest-chromium.json"

  else
    echo "Creating $1 build"
    prettier
    lint
    build_css
    build_tsx
    set_platform $1
    set_version $2
  fi

  echo ""
  echo "Done!"
}


build $PLATFORM $VERSION
