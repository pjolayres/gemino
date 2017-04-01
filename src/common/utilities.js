var fs = require('fs');
var os = require('os');
var path = require('path');
var mkdirp = require('mkdirp');

module.exports = {

    /**
     * Utility function to create or overwrite an existing file. Also creates all directories in the filepath.
     */
    writeFile: function (filePath, content) {
        var directoryPath = path.dirname(filePath);
        mkdirp(directoryPath, (err) => {
            if (err) {
                console.log(`ERROR: Could not create directory ${directoryPath}. Error: ${err}`);
                return;
            }

            fs.writeFile(filePath, content, err => {
                if (err) {
                    console.log(`ERROR: Could not create file ${filePath}. Error: ${err}`);
                    return;
                }

                console.log(`SUCCESS: Created file ${filePath}`);
            });
        });
    },

    /**
     * Used inside embedded expressions in template literals that adds a suffix when the content is not empty.
     */
    renderOptional: function (content, suffix = '') {
        if (!content) {
            return '';
        }

        var result = '';

        if (typeof content == 'function') {
            result = content();
        }
        else if (typeof content == 'string') {
            result = content;
        }
        
        if (typeof result === 'string' && result.trim().length > 0) {
            result += suffix;
        }

        return result;
    },

    /**
     * Used to clean template literal output to remove preceding indentations and to normalize the output using the OS-specific line endings
     */
    cleanContent: function (content, indentationsToRemove = 0) {
        var pattern = '^' + new Array(indentationsToRemove).fill(' ').join('');
        var output = content.split('\n')
                            .map(line => line.replace('\r', ''))
                            .map(line => line.replace(new RegExp(pattern), ''))
                            .join(os.EOL)
                            .trim();

        return output;
    },

    /**
     * Creates a flattened array by combining the arrays returned when executing the selector over each item in the items array
     */
    selectMany: function (items, selector) {
        return [].concat(...items.map(selector));
    }

};