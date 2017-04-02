
const express       =   require("express");
const path          =   require("path");
const app           =   express();
const http          =   require("http");
const bodyParser    =   require("body-parser");
const api           =   require('./server/routes/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended":false }));

app.use(express.static('public'));

app.use('/api', api);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const port = process.env.PORT || '4200';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on localhost:${port}`));
