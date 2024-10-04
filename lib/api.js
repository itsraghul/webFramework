const fs = require('fs');
const path = require('path');

function generateAPIRoutes(dir){
    const files = fs.readdirSync(dir);
    const routes = files.map((file)=>{
        const route = file.replace('.js','');
        return {
            path : `/api/${route}`,
            handler : require(path.join(dir, file))
        }
    });
    
    return routes;
}


function matchAPIRoute(req, routes){
    const { match } = require('./route.js');

    return match(req.url, routes);
}

module.exports = { matchAPIRoute, generateAPIRoutes };