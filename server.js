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
    db.select('name', 'pass')
        .from('creds')
        .where('id', '=', id)
        .then(
            data => {
                if(data[0] !== undefined) {
                    if (pass === data[0].pass)
                        res.json({flag: 'Success', name: data[0].name});
                } else
                    res.json('Failure');
            }
        );
});

app.post('/load', (req, res) => {
    const { id } = req.body;
    db.select('source', 'destination', 'message')
        .from('mail')
        .where('source', '=', id)
        .orWhere('destination', '=', id)
        .then(
            mailData => {
                db.select('id', 'name')
                    .from('creds')
                    .then(
                        credData => {
                            mailData.map((listItem) => {
                                r1 = credData.filter((value) => value.id === listItem.source);
                                listItem.source = r1[0].name;
                                r2 = credData.filter((value) => value.id === listItem.destination);
                                listItem.destination = r2[0].name;
                                return listItem;
                            });
                            res.json(mailData);
                        }
                    );
            }
        );
    }
);

app.post('/register', (req, res) => {
    const { pass, name } = req.body;
    db.insert({ name, pass })
        .into('creds')
        .returning('id')
        .then((result) => {
            res.json(result);
        });
});

app.post('/send', (req, res) => {
    const { id, to, text } = req.body;
    db.insert({ source: id, destination: to, message: text })
        .into('mail')
        .returning('source')
        .then((result) => {
            res.json('Done');
        });
});

app.listen(3003, () => {
    console.log(`Server is online.`);
});