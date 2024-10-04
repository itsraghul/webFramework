const http = require('http');
const path = require('path');
const fs = require('fs');
const router = require('./route');
const { applyMiddleware } = require('./middlewares');
const { generateApiRoutes, matchApiRoute } = require('./api');

function serverStatic(req, res) {
    const staticPath = path.join(__dirname,'../static',req.url);
    fs.readFile(staticPath, (err, content) => {
        if (err) {
            notFoundMiddleware(req,res);
        }else{
            res.end(content);
        }
    })
}


function staticMiddleware(req, res, next) {
    if(req.url.startsWith('/static')){
        serverStatic(req,res);
    }else{
        next();
    }
}

function notFoundMiddleware(req,res){
    res.statusCode = 404;
    res.end('Page not Found');
}

function internalServerErrorMiddleware(req,res){
    res.statusCode = 500;
    res.end('Internal Server Error');
}


function startDevServer(){
    const routes = router.generateRoutes(path.join(__dirname, '../src/pages'));
    const apiRoutes = generateApiRoutes(path.join(__dirname, '../src/api'));

    const server = http.createServer((req,res)=>{
        applyMiddleware(req,res, (err)=> {
            if(err){
                internalServerErrorMiddleware(req,res);
                return;
            }

            const matchedAPIRoute = matchApiRoute(req, apiRoutes);
            if(matchedAPIRoute){
                return matchedAPIRoute.handler(req,res);
            }else{
                notFoundMiddleware(req,res);
            }

            const matchedRoute = router.match(req.url, routes);
            if(matchedRoute){
                matchedRoute.handler(req, res, matchedRoute.params);
            }else{
                notFoundMiddleware(req,res);
            }
        })
    });

    server.listen(3000,()=>{
            console.log("Development Server listening on port http://localhost:3000/");
    })
}


function startProdServer(){
    const routes = router.generateRoutes(path.join(__dirname, '../dist/pages'));
    const apiRoutes = generateApiRoutes(path.join(__dirname, '../dist/api'));

    const server = http.createServer((req,res)=>{
        applyMiddleware(req,res, (err)=> {
            if(err){
                internalServerErrorMiddleware(req,res);
                return;
            }

            const matchedAPIRoute = matchApiRoute(req, apiRoutes);
            if(matchedAPIRoute){
                return matchedAPIRoute.handler(req,res);
            }else{
                notFoundMiddleware(req,res);
            }


            const matchedRoute = router.match(req.url, routes);
            if(matchedRoute){
                matchedRoute.handler(req, res, matchedRoute.params);
            }else{
                notFoundMiddleware(req,res);
            }
        })
    });

    server.listen(3000,()=>{
            console.log("Production Server listening on port http://localhost:3000/");
    })
}