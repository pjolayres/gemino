var os = require('os');
var path = require('path');
var utilities = require.main.require('./src/common/utilities');
var dynamicModules = require('../data/dynamic-modules.json');
var outputDirectory = path.join('dist', 'models');

module.exports = function () {

    dynamicModules.forEach(module => {
        module.ContentTypes.forEach(contentType => {
            var content = render(module, contentType);
            var filePath = path.join(outputDirectory, contentType.Name + 'Model.cs');
            utilities.writeFile(filePath, content);
        });
    });

    function render(module, contentType) {
        var contents = `
        using System;
        using System.Collections;

        public class ${contentType.Name}Model
        {
            ${contentType.Fields.map(field => `public ${field.Type} ${field.Name} { get; set; }`).join(`${os.EOL}    `)}
            ${contentType.HasChildren 
            ? 
                `public int ChildrenCount { get { return ${contentType.ChildrenCount}; } }${os.EOL}`
            : 
                ``
            }
            ${function() {
                var message = `//${contentType.Name} constructor`;
                return message;
            }()}
            public ${contentType.Name}Model()
            {
                //TODO: Initialize fields
            }
        }
        `;

        return contents.trim().replace(/^ {8}/gm, '');
    }
};