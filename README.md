[![Build][build-badge]][build-url]
[![Issues][issues-badge]][issues-url]
[![Gitter][gitter-badge]][gitter-url]

* [Intro](#azure-pcs-remote-monitoring-webui)
* [Prerequisites](#prerequisites)
* [Build, Run and Test locally](#build-run-and-test-locally)
* [Contributing to the solution](#contributing-to-the-solution)

Azure Remote Monitoring WebUI
=================================

Web app for Azure IoT Remote Monitoring Solution [dotnet](https://github.com/Azure/azure-iot-pcs-remote-monitoring-dotnet) and [java](https://github.com/Azure/azure-iot-pcs-remote-monitoring-java).

Prerequisites
=============
### 1. Deploy a Remote Monitoring Solution

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://www.azureiotsolutions.com/Accelerators#solutions/types/RM2)

The easiest way to test the Web UI is against a deployed remote monitoring solution. The solution can be deployed via the [web interface](https://docs.microsoft.com/azure/iot-suite/iot-suite-remote-monitoring-deploy) or via the [command line](https://docs.microsoft.com/azure/iot-suite/iot-suite-remote-monitoring-deploy-cli).

It is also possible to [deploy the solution locally](https://docs.microsoft.com/azure/iot-suite/iot-suite-remote-monitoring-deploy-local#deploy-the-azure-services).

### 2. Setup Dependencies
1. Install [node.js](https://nodejs.org/)
2. For development, you can use your preferred editor
   - [Visual Studio Code](https://code.visualstudio.com/)
   - [Atom](https://atom.io/)
   - [Sublime Text](https://www.sublimetext.com/)
   -  or other preferred editor

### 3. Environment variables required to run the Web UI
In order to run the Web UI, the following environment variables need to be created at least once. More information on configuring environment variables [here][envvars-howto-url].

* `REACT_APP_BASE_SERVICE_URL` = {your-remote-monitoring-endpoint}

The endpoint given above is the base url you navigate to in order to see your deployed solution.

The Web UI configuration is stored in [app.config.js](src/app.config.js). You can edit this file to update the endpoints. 

Build, run and test locally
===========================
* `cd ~\pcs-remote-monitoring-webui\`
* `npm install`
* `npm start`: Launches the project in browser - watches for code changes and refreshes the page.
* `npm run build`: Creates a production ready build.
* `npm test`: Runs test in watch mode, press `q` to quit

Project Structure
===========================
The Web UI contains the following sections under [src](src):
- `assets`: Contains assets used across the application. These include fonts,
icons, images, etc.
- `components`: Contains all the application react components. These in include
containers and presentational components.
- `services`: Contains the logic for making ajax calls as well as mapping
request/response objects to front end models.
- `store`: Contains all logic related to the redux store.
- `styles`: Contains sass used across the application mixins, theming, variables,
etc.
- `utilities`: Contains helper scripts used across the application.

Contributing to the solution
==============================
Please follow our [contribution guildelines](CONTRIBUTING.md) and the code style conventions.

### Customizing the solution
Please see our [developer walkthroughs](/docs/walkthrough/README.md) for more information on customizing and adding to the application.

References
==========
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find a guide to using it [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Core technologies overview

- [ReactJS](https://reactjs.org/)
- [React-Router v4](https://github.com/ReactTraining/react-router)
- [Redux](https://redux.js.org/)
- [Redux-Observable](https://redux-observable.js.org/)
- [RxJs](http://reactivex.io/rxjs/)
- [SASS](http://sass-lang.com/)
- [React-i18nnext](https://github.com/i18next/react-i18next)

[build-badge]: https://solutionaccelerators.visualstudio.com/RemoteMonitoring/_apis/build/status/pcs-remote-monitoring-webui
[build-url]: https://solutionaccelerators.visualstudio.com/RemoteMonitoring/_build/latest?definitionId=32
[issues-badge]: https://img.shields.io/github/issues/azure/pcs-remote-monitoring-webui.svg
[issues-url]: https://github.com/Azure/pcs-remote-monitoring-webui/issues/new
[gitter-badge]: https://img.shields.io/gitter/room/azure/iot-solutions.js.svg
[gitter-url]: https://gitter.im/azure/iot-solutions
[windows-envvars-howto-url]: https://superuser.com/questions/949560/how-do-i-set-system-environment-variables-in-windows-10
[envvars-howto-url]: https://www.schrodinger.com/kb/1842

