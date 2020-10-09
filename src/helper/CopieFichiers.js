const path = require('path');
const fs = require('fs');
const copyFile = require("./copyFile");
//todo : enlever les repertoires inutile de parcourir ex : release
getDirectories = source => {
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
}

getFile = source => {
    const regex = /wiki.md$/;
    return fs.readdirSync(source, { withFileTypes: true })
        .filter(file => !file.isDirectory() && regex.test(file.name))
        .map(file => file.name);

}

class CopieFichiers {
    constructor(destinationDirectory) {
        this._destinationDirectory = destinationDirectory;
    }

    start(origineDirectory) {
        console.log("origineDirectory :", origineDirectory);
        const directories = getDirectories(origineDirectory)
        const files = getFile(origineDirectory)

        if (files && files.length > 0) {
            this.copieListFile(files, origineDirectory, this._destinationDirectory);
        }

        if (!directories || directories.length == 0) {
            return;
        }

        directories.forEach(element => {
            const nextPath = path.join(origineDirectory, element);
            this.start(nextPath)
        });
    }
    /**
     * Construit le sous chemin du repertoire d'arrivé 
     * @param {*} destinationDirectory 
     * @param {*} SubPath 
     */
    buildSubPath(origineDirectory, destinationDirectory) {

        // Y:\main\PSVL (Macoweb)\WCRS\CS.NET\csNETsWCRS301\toto_wiki.md
        // deviens  "C:\Users\dhuyet-at\Desktop\WikiPOC\content\en\main\PSVL\WCRS\CS.NET\csNETsWCRS301\_index.md"
        let directoryName = path.parse(origineDirectory).name;
        let directoryPath = path.parse(origineDirectory).dir;
        let relativeDirectoryPath = path.relative(path.parse(origineDirectory).root, directoryPath)

        let destinationFinal = path.resolve(destinationDirectory, relativeDirectoryPath)
        return path.resolve(destinationFinal, directoryName)
    }
    copieListFile(files, origineDirectory, destinationDirectory) {

        files.forEach(element => {
            console.log("Copie : ", element, " depuis :", origineDirectory, " vers :", destinationDirectory);
            try {
                let subpath = this.buildSubPath(origineDirectory, destinationDirectory)
                console.log("path final", subpath)
                copyFile(origineDirectory, subpath, element);
            } catch (e) {
                console.error("probleme ecriture fichier", e);
            }

        });
    }
}

module.exports = CopieFichiers
