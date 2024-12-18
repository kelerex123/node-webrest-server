import fs from 'fs';
import http from 'http';

console.log(process.cwd());

const server = http.createServer((req, res) => {
    console.log(req.url);

    // res.writeHead(200, {
    //     'Content-Type': 'text/html'
    // });
    // res.write(`<h1>Hola Mundo desde URL: ${req.url}</h1>`)
    // res.end();

    // const data = {name: 'Jason Kent', age: 30, city: 'Lima'};
    // res.writeHead(200, {
    //     'Content-Type': 'application/json'
    // })
    // res.end(JSON.stringify(data));


    if(req.url === '/') {
        const htmlFile = fs.readFileSync('./public/index.html', 'utf-8');
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(htmlFile);
        return;
    }

    if(req.url?.endsWith('.js')) {
        res.writeHead(200, {'Content-Type': 'text/javascript'});
    }else if(req.url?.endsWith('.css')){
        res.writeHead(200, {'Content-Type': 'text/css'});
    }

    const responseContent = fs.readFileSync(`./public${req.url}`, 'utf-8');
    res.end(responseContent);
    


});


server.listen(8080, () => {
    console.log('Server running on port 8080');
});