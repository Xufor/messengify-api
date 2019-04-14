const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connect = require('knex');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const db = connect({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user: 'xufor',
        password: '1920',
        database: 'messengify'
    }
});


app.post('/login', (req, res) => {
    const { id, pass } = req.body;
    db.select('pass')
        .from('creds')
        .where('id', '=', id)
        .then(
            data => {
                if(data[0] !== undefined) {
                    if (pass === data[0].pass)
                        res.json('Success');
                } else
                    res.json('Failure');
            }
        );
});

app.listen(6000, () => {
    console.log(`Server is online.`);
});