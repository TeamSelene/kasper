let app = require('./server');

const port = process.env.PORT || '4200';
app.set('port', port);

app.listen(port, () => console.log(`API running on localhost:${port}`));
