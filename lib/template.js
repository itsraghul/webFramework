const ejs = require('ejs');
const path = require('path');


function renderTemplate(templateName, data, res) {
    const templatePath = path.join(__dirname,'../templates', `${templateName}.ejs`);
    ejs.renderFile(templatePath, data, (err, str) => {
        if(err){
            res.statusCode = 500;
            res.end('Internal Server Error');
            return;
        }
        res.end(str);
    })
}

module.exports = { renderTemplate} ;