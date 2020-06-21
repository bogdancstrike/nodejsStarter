const fs = require('fs'); //modulul fs(fs = file system)
const http = require('http'); //modulul http
const url = require('url'); //modulul url
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

//SERVER

const data = fs.readFileSync('starter/dev-data/data.json', 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync('starter/templates/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('starter/templates/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('starter/templates/template-product.html', 'utf-8');

const slugs = dataObj.map(el => slugify(el.productName,  {lower: true}));
console.log(slugs[1]);

const server = http.createServer((req, res) =>{ //request, response

    const {query, pathname} = url.parse(req.url, true);

    const patthname = req.url;

    //Overview page
    if (pathname === '/' || pathname === '/overview'){

        res.writeHead(200, { 'Content-type': 'text/html' }); 
        //'Content-type': 'text/html  PT HTML; 'Content-type': 'application/json' PT JSON
        
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join(''); // el = current object; join('') ca sa le "uneasca" intr-un String

        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml); //modifica HTML-ul initial (temp-overview) cu card-urile create (temp-card)

        res.end(output); //  res trimite catre client, req trimite catre server

    //Product page
    } else if (pathname === '/product'){

        const product = dataObj[query.id]; //produsul de la id-ul din query (de ex product?id=0)
        res.writeHead(200, { 'Content-type': 'text/html' }); 
        const output = replaceTemplate(tempProduct, product);

        res.end(output);

    //API
    } else if (pathname === '/api') {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);

    //Not found
    } else{
        res.writeHead(404, {
            'Content-type': 'text/html', 
            'my-own-header': 'hello-world'
        });
        res.end('<h1>This page could not be found!</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {  //localhost = 127.0.0.1
    console.log('Listening to requests on port 8000');
}); 
