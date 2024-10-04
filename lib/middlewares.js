const middlewares = [];

function use (middleware) { middlewares.push(middleware); }

function applyMiddleware(req, res, done) {
    let index = -1;

    function next(err){
        index++;
        if(err || index >= middlewares.length){
            done(err);
            return;
        }

        const currentMiddleware = middlewares[index];
        if(currentMiddleware){
            currentMiddleware(req, res, done);
        }
        
    };

    next();
}


module.exports = { use, applyMiddleware}


