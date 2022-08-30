const express = require('express');
const morgan = require('morgan');
const routes = require('./routes');

const app = express();


app.use(express.json());
app.use(morgan('tiny'));

routes(app);

const {PROTOCOL, HOST, PORT} = process.env;
app.listen(PORT, (err) => {
    if (err) console.error(err);
    console.log(`Listening on ${PROTOCOL}://${HOST}:${PORT}`);
});
