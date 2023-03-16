# electron-todo-app

### Install for development
- 1- Download the zip file and unzip it to the folder
- 2- Run the `npm install` command in the terminal located in the folder where the files are located.
- 3- Create a database on your Mysql server and import the db/vtetodo.sql file.
- 4- Fill in the database information in the lib/connection.js file with your own.
- 5- Start the project by running the `npm start` command from the terminal.

### Build App for Windows
Run the following command line in terminal. Thus, the application compiled for windows will be created in the release-builds folder.

```npx electron-packager . electron-todo-app --overwrite --asar --platform=win32 --arch=x64 --icon=assets/icons/win/app.ico --prune=true --out=release-builds --version- string.CompanyName=CE --version-string.FileDescription=CE --version-string.ProductName="Electron.js TODO App"```

[![Electron TODO App](https://github.com/barisertugrul/electron-todo-app/blob/master/assets/screenshot.png "Electron TODO App")](# "Electron TODO App")
