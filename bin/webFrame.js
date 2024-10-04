
const {program} = require('commander');

program.command('dev').description('Run development Server').action(() => {
        require('../lib/server.js').startDevServer();
    });


program.parse(process.argv);