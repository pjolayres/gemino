var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp');
var dynamicModules = require('../data/dynamic-modules.json');
var outputDirectory = path.join('output', 'models');

module.exports = function () {

    dynamicModules.forEach(module => {
        module.ContentTypes.forEach(contentType => {
            var content = render(module, contentType);
            var filePath = path.join(outputDirectory, contentType.Name + 'Model.cs');
            writeFile(filePath, content);
        });
    });

    function writeFile(filePath, content) {
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

    function render(module, contentType) {
        var contents = `using System;
        using System.Collections;

        public class ${contentType.Name}Model
        {
            ${contentType.Fields.map(field => `public ${field.Type} ${field.Name} { get; set; }
            `).join('')}
            public ${contentType.Name}Model()
            {
            }
        }`;

        return contents.replace(/^ {8}/gm, '');
    }
};