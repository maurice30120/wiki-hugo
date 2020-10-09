const fs = require('fs');
const path = require('path');
const liner = require('./linerStream');

module.exports = function copyFile(origineDirectory, destinationDirectory, filename) {
    const src = path.join(origineDirectory, filename);

    let folderName = filename.replace(".md", '')

    destinationDirectory = path.join(destinationDirectory, folderName)
    // Remplacer les caractere non valide dans une url ex : (ExpressDrive)
    const re = /(\(([^)]*)\))/;
    destinationDirectory = destinationDirectory.replace(re, "");
    destinationDirectory = destinationDirectory.replace(" ", "");
    destinationDirectory = destinationDirectory.toLowerCase();
    let dest = path.join(destinationDirectory, "_index.md");
    fs.mkdirSync(destinationDirectory, { recursive: true });

    // This line opens the file as a readable stream
    var source = fs.createReadStream(src)
    var writeStream = fs.createWriteStream(dest)
    source.pipe(liner)//.pipe(writeStream);

    liner.on('readable', function () {
        var line
        while (null !== (line = liner.read())) {
            // do something with line
            if (line.includes("```mermaid") || line.includes("~~~ mermaid") || line.includes("``` mermaid")) {
                line = "{{<mermaid>}}\n"
            }
            if (line.includes("```") || line.includes("~~~")) {
                line = "{{</mermaid>}}\n"
            }
            const regex = /List<.*>/g;
            line = replaceListMD(line, regex, (text) => {
                text = text.replace("List<", "List:")
                text = text.replace(">", "")
                return text
            })
            const regex2 = /list<.*>/g;
            line = replaceListMD(line, regex2, (text) => {
                text = text.replace("list<", "List:")
                text = text.replace(">", "")
                return text
            })

            // todo: Renvoyer le flux avec la ligne modifier ...
            //   this.push(line)
            writeStream.write(line)

        }
        // source.end()
        //  liner.emit("end");
    })

    source.on('end', function () {
        //todo: ne pas mettre en dur
        writeStream.write(`
        ---
        title: "${folderName}"
        aliases: [${path.relative("C:\\Users\\dhuyet-at\\Desktop\\WikiPOC\\content\\en", destinationDirectory)}]
        ---`);
    });

    writeStream.on('error', function (err) {
        console.error("Probleme ecriture : ", err);

    });
    // This catches any errors that happen while creating the readable stream (usually invalid names)
    source.on('error', function (err) {
        console.error("Probleme lecture : ", err);
    });
}


function replaceListMD(str, regex, fnReplace) {
    let m;

    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }


        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            let text = match
            console.log(`Found match, group ${groupIndex}: ${match}`);
            //transforme le match 
            //todo: implementer une liste de regles de changement 
            text = fnReplace(text)
            // text = text.replace("List<", "List:")
            // text = text.replace(">", "")
            str = str.replace(match, text)
        });
    }
    return str
}