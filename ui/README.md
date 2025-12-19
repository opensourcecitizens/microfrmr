## UI 

Use the examples in ../mock_ui/appData/ApiCaller.js and ../mock_ui/components/ImageHandler.js
 to create a API call to update and retrieve data.

### ../remote_services
This directory contains implementations of backend services that connect to the 
persistence layer.  Go to -> [../remote_services](../remote_services/README.md)

#### Fetch data using ../mock_ui/appData/ApiCaller.js

This file provides example methods for calling a backend API which
is implemented here -> [../remote_services/api](../remote_services/api/README.md)

Note: you should start the api beforehand by following instructions there.

#### Handle image fetching and persistence using ../mock_ui/components/ImageHandler.js

This is a UI component that can help with dynamic loading of images by connecting to your local ipfs server
using WebSockets.
IPFS service should be running locally if you successfully followed this instructions in -> [../remote_services/docker](../remote_services/docker/README.md).

#### Compiling and running the app

There are two options: expo or vanilla reactnative.

### Vanilla React-native

##### NPM/YARN
YARN / npm is a package manager. This is used as bare reactnative and can ship out binary artifacts for android or ios.

Create an application for the first time, with android or ios directories.
```npx @react-native-community/cli init <project-name>```
Framework specific init
```npx @react-native-community/cli init <project-name> --platform android```

Regenerate an android or ios directory.
 - initialize a temporary project 
 - copy ios and android dirs to parent project
 - delete the temporary project dir

Build
```npx react-native build android```

Or build and run on device or emulator

```npx react-native build-android```
```npx react-native run-android```

```npx react-native build-ios```
```npx react-native run-ios```

#### Verify requirements
Use react-native doctor to check high level requirements are met.
```npx react-native doctor```
or use yarn for package deprecation or conflict check
```yarn install```


TODO: using web https://github.com/necolas/react-native-web 
for react native web. 

To add web:
``` 
yarn add react-native-web react-dom
yarn add -D webpack webpack-cli webpack-dev-server html-webpack-plugin babel-loader babel-plugin-react-native-web
```

### EXPO
Expo is a framework. Use expo for managed deployment to web, ios or android.

#### Emulator start

```emulator -avd Pixel_4_API_34```
