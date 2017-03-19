var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = {

    writeFile: function(filePath, content) {
        var directoryPath = path.dirname(filePath);
        mkdirp(directoryPath, (err) => {
            if (err) {
                console.log(`Error: Could not create directory ${directoryPath}. Error: ${err}`);
                return;
            }

            fs.writeFile(filePath, content, err => {
                if (err) {
                    console.log(`Error: Could not create file ${filePath}. Error: ${err}`);
                    return;
                }
                
                console.log(`Success: Created file ${filePath}`);
            });
        });
    }

};