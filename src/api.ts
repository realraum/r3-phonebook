import express from 'express';
import Axios from 'axios';
import bodyParser from 'body-parser';
const api = express.Router();

import * as config from './config.js';

api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

const host = '192.168.127.138';

async function call(phone_number: string) {
    const url = `http://${host}/cgi-bin/webcm`;
    const params = new URLSearchParams();

    params.append('telcfg:command/Dial', phone_number);

    const response = await Axios.post(url, params, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        }
    });
    return response.data;
}

// deprecated
api.post('/call', async (req, res) => {
    const { phone_number } = req.params;

    const response = await call(phone_number);

    try {
        const foo = JSON.parse(response);
        res.json(foo);
    } catch (e) {
        res.json({ message: 'cannot parse response' });
    }
});

api.get('/call/:id', async (req, res) => {
    const { id } = req.params;

    await call(id);

    res.redirect('/');
});

api.get('/call', async (req, res) => {
    const { phone_number } = req.query;

    await call(phone_number);

    res.redirect('/');
});

api.get('/phone_list', (req, res) => {
    const phone_list = config.getPhoneList();
    res.json(phone_list);
});

api.post('/add_phone', (req, res) => {
    const { phone_number, name } = req.body;

    config.addPhone(phone_number, name);
    res.redirect('/');
});

api.post('/remove_phone', (req, res) => {
    const { phone_number } = req.body;

    config.removePhone(phone_number);
    res.redirect('/');
});

api.get('/remove_phone', (req, res) => {
    const { phone_number } = req.query;

    config.removePhone(phone_number);
    res.redirect('/');
});

api.get('/phone_name', (req, res) => {
    const { phone_number } = req.query;

    const name = config.getPhoneName(phone_number);
    res.json({ name });
});

api.get('/phone_number', (req, res) => {
    const { name } = req.query;

    const phone_number = config.getPhoneNumber(name);
    res.json({ phone_number });
});

export default api;