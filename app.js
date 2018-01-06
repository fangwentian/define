const path = require('path');
const serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

app.use(serve(path.join(__dirname, 'demo')));

app.listen(3000);

console.log('listening on port 3000');