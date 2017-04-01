var os = require('os');
var path = require('path');
var utilities = require.main.require('./src/common/utilities');
var data = require('../data/sample.json');
var outputDirectory = path.join('dist', 'sample');

module.exports = function () {

    data.Entities.forEach(entity => {
        entity.Types.forEach(entityType => {
            var output = render(data, entity, entityType);
            var filePath = path.join(outputDirectory, entityType.Name + '.cs');
            utilities.writeFile(filePath, output);
        });
    });

    function render(data, entity, entityType) {

        var childRelationships = data.Relationships.filter(x => x.ParentEntityType === entityType.FullName);
        var childrenMetadata = childRelationships.map(childRelationship => {
            var childEntityType = utilities.selectMany(data.Entities, x => x.Types).find(x => x.FullName === childRelationship.ChildEntityType);
            return {
                relationship: childRelationship,
                entityType: childEntityType
            };
        });

        var output = `
using System;
using System.Collections;

namespace ${entity.Namespace}
{
    public partial class ${entityType.Name}
    {
        ${
            //Enumerates a collection and maps into an array of template literals which is later on joined into one string
            entityType.Properties.map(property => `public ${property.Type} ${property.Name} { get; set; }`).join('\n        \n        ')

        }

        ${
            //This code block to allows for more complicated operations, variable declarations, and transformations before returning a string.
            //utilities.renderOptional() is used whenever a section can be empty and must not take up any lines or whitespace when it is empty. An optional suffix can be provided when the content is not empty.
            utilities.renderOptional(() => {
                var parentRelationships = data.Relationships.filter(x => x.ChildEntityType === entityType.FullName);
                
                return parentRelationships.map(parentRelationship => {
                    var parentEntityType = utilities.selectMany(data.Entities, x => x.Types).find(x => x.FullName === parentRelationship.ParentEntityType);

                    return `public ${parentEntityType.Name} ${parentRelationship.ParentReferenceProperty} { get; set; }`;
                }).join('\n        \n        ')
            }, '\n\n        ')
            
        }${
            //If following an optional section, the next string or expression segment must start right after the previous one ended to avoid rendering unnecessary whitespace and line breaks.

            utilities.renderOptional(() => {

                return childrenMetadata.map(x => `public IEnumerable<${x.entityType.Name}> ${x.relationship.ParentChildrenProperty} { get; set; }`).join('\n        \n        ')

            }, '\n\n        ')

        }public ${entityType.Name}()
        {
            ${childrenMetadata.length > 0 //This is an example of a conditional block.
            ?
                childrenMetadata.map(x => {
                    return `this.${x.relationship.ParentChildrenProperty} = new List<${x.entityType.Name}>();`;
                }).join('\n            ')
            :
                '//TODO: Initialize children'
            }
        }
    }
}`;

        output = utilities.cleanContent(output);

        return output;
    }
};