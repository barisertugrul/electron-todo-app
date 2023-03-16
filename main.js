const electron = require("electron");
const url = require("url");
const path = require("path");
const db = require("./lib/connection").db;

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow, addWindow;
let todoList = []

app.on("ready", () => {

    mainWindow = new BrowserWindow({
        center: true,
        //TODO: Güvenlik düzeltmelerini yap
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        }
    });

    mainWindow.setResizable(false);

    // Pencerenin oluşturulması
    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/mainWindow.html"),
            protocol: "file:",
            slashes: true
        })
    );

    // Menünün oluşturulması
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);

    // Ana ekranın kapatılması ile progranmın sonlanması
    mainWindow.on('close', () => {
        app.quit();
    })

    ipcMain.on("todo:close", () => {
        app.quit();
    })

    //NewTODO Penceresi Eventleri
    ipcMain.on("newTodo:close", () => {
        addWindow.close()
        addWindow = null
    })

    ipcMain.on("newTodo:save", (err, data) => {
        if(data && data.todoValue){
            
            db.query("INSERT INTO todos SET text = ?", data.todoValue, (err, res, fields) => {
                if(res.insertId > 0){
                    let todo = {
                        id: res.insertId,
                        text: data.todoValue
                    }
                    todoList.push(todo)

                    mainWindow.webContents.send("todo:addItem", {
                        id: res.insertId,
                        text: data.todoValue
                    })
                }
            })

            if(data.ref == "newForm"){
                addWindow.close()
                addWindow = null
            }
        }
    })

    mainWindow.webContents.once("dom-ready", () => {
        db.query("SELECT * FROM todos", (error, results, fields) => {
            mainWindow.webContents.send("initApp", results)
        })
    })

    ipcMain.on("todo:remove", (err, id) => {
        db.query("DELETE FROM todos WHERE id = ?", id, (err, res, fields) => {
            
            if(res.affectedRows > 0){
                mainWindow.webContents.send("todo:delSuccess", true)
            }
        })
    })

})


// Menü template yapısı
const mainMenuTemplate = [
    {
        label: "Dosya",
        submenu: [
            {
                label: "Yeni TODO Ekle",
                accelerator: process.platform == "darwin" ? "Command+N" : "Ctrl+N",
                click(){
                    createWindow();
                }
            },
            {
                label: "Tümünü Sil"
            },
            {
                label: "Çıkış",
                accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                role: "quit"
            }
        ]
    },
    
]

if(process.platform == "darwin"){
    mainMenuTemplate.unshift({
        label: app.getName(),
        role: "TODO"
    })
}

if(process.env.MODE_ENV !== "production"){
    mainMenuTemplate.push(
        {
            label: "Geliştirici Araçları",
            submenu: [
                {
                    label: "Geliştirici Araçları",
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    label: "Yenile",
                    role: "reload"
                }
            ]
        }
    )
}

function createWindow(){
    addWindow = new BrowserWindow({
        width: 479,
        height: 176,
        title: "Yeni Bir Pencere",
        frame: false,
        modal: true,
        parent: mainWindow,
        //TODO: Güvenlik düzeltmelerini yap
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    addWindow.setResizable(false);

    addWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "pages/newTodo.html"),
            protocol: "file:",
            slashes: true
        })
    )

    addWindow.on('close', () => {
        addWindow = null;
    })

}

function getTodoList(){
    return todoList
}