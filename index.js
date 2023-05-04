const http = require('http');
const path = require('path');
const fs = require('fs');


const server = http.createServer((req, res) => {

    console.log(req.url);

    if (req.url === '/') {

        fs.readFile(path.join(__dirname, 'public', 'index.html'),
            (err, content) => {

                if (err) throw err;
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.writeHead(200, { 'Content-type': 'text/html' });
                res.end(content);
            });
    }
    else if (req.url.startsWith('/images/')) {
        const imagePath = path.join(__dirname, 'public', req.url);
        const imageStream = fs.createReadStream(imagePath);

        res.setHeader("Access-Control-Allow-Origin", "*");

        if (req.url.match(/.*\.jpg$/i)) {
            res.writeHead(200, { 'Content-Type': 'image/jpeg' });
        } else if (req.url.match(/.*\.webp$/i)) {
            res.writeHead(200, { 'Content-Type': 'image/webp' });
        } else if (req.url.match(/.*\.png$/i)) {
            res.writeHead(200, { 'Content-Type': 'image/png' });
        }

        imageStream.pipe(res);

        imageStream.on('error', () => {
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.end("<h1> 404 Not Found </h1>");
        });
    }
    else if (req.url === '/style.css') {
        fs.readFile(path.join(__dirname, 'public', 'style.css'), (err, content) => {
            if (err) throw err;
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { 'Content-type': 'text/css' });
            res.end(content);
        });
    }

     else if (req.url === '/api') {

        var input;

        const { MongoClient } = require('mongodb');

        main(processData);
        async function main(callback) {

            const uri = 'mongodb+srv://Harsha:Harsha@cluster0.l3zibvl.mongodb.net/final?retryWrites=true&w=majority';
            const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
         await client.connect();
                console.log('Connected to MongoDB Atlas cluster');

                const USA_presidents = client.db('final').collection('final');


              
                const presidents = await USA_presidents.find().toArray();
                console.log(presidents);


                input = presidents;
                console.log('input data Harsha:');
                console.log(input);
                 callback(input);

            } catch (err) {
                console.error(err);
            } finally {
                await client.close();
                console.log('Disconnected from MongoDB Atlas cluster');
            }
        }

        function processData(data) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.writeHead(200, { 'Content-type': 'application/json' })
            res.end(JSON.stringify(data));
        }
    }
    else {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.writeHead(404, { 'Content-type': 'text/html' })
        res.end("<h1> 404 Nothing is Here </h1>")
    }

});
server.listen(7909, () => console.log(" great our server is runnning"));