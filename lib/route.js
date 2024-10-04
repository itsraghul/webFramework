
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
    return null;
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
        const route = file.replace('.html','');
        return {
            path : route === 'index' ? '/' : `/${route}`,
            handler : (req,res) => {
               const pagePath =  path.join(dir, file);
               const page = fs.readFileSync(pagePath, 'utf-8');
               res.writeHead(200, { 'Content-Type': 'text/html' });
               res.end(page);
            }
        }
    });

    return routes;
}


module.exports = { match, generateRoutes }