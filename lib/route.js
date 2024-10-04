
//Matching the url 
function match(path, routes) {
    const url = require('url');
    const parsedUrl  = url.parse(path, true).pathname;

    for(route of routes) {
        const routeRegex = new RegExp(`^${route.path.replace(/:\w+/g, '\\w+')}$`);
        if (routeRegex.test(parsedUrl)) {
            const params = extractParams(route.path, parsedUrl);
            return { handler: route.handler, params };
        }
    }
}

function extractParams(routePath, actualUrl){
    const routeParts = routePath.split('/');
    const actualParts = actualUrl.split('/');

    const params = {};

    routeParts.forEach((part,i)=> {
        if(part.startsWith(':')){
            const param = part.slice(1);
            params[param] = actualParts[i];
        }
    })
}


function generateRoutes(dir){
    const fs = require('fs');
    const path = require('path');

    const files = fs.readdirSync(dir);
    const routes = files.map(file => {
        const route = file.replace('.js','');
        return {
            path : route === 'index' ? '/' : `/${route}`,
            handler : require(path.join(dir, file))
        }
    });

    return routes;
}


module.exports = { match, generateRoutes }