const express = require('express');
const fs = require('fs');
const path = require('path');
const routerUser = express.Router();
routerUser.get('/logout', (req, res) => {
    const username = req.query.username;
    res.send(`<b>${username} successfully logout.</b>`);
});
const readUsers = () => {
    const data = fs.readFileSync(
        path.join(__dirname, '../user.json'),
        'utf8'
    );

    return JSON.parse(data);
};

// Return all details from user.json
routerUser.get('/profile', (req, res, next) => {
    fs.readFile(
        path.join(__dirname, '../user.json'),
        'utf8',
        (err, data) => {
            if (err) return next(err);

            try {
                res.json(JSON.parse(data));
            } catch (error) {
                next(error);
            }
        }
    );
});

// Login using username and password from the JSON body
routerUser.post('/login', (req, res, next) => {
    try {
        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({
                status: false,
                message: 'Username and password are required'
            });
        }

        const users = readUsers();
        const userList = Array.isArray(users) ? users : [users];

        const user = userList.find(
            item => item.username === username
        );

        if (!user) {
            return res.json({
                status: false,
                message: 'User Name is invalid'
            });
        }

        if (user.password !== password) {
            return res.json({
                status: false,
                message: 'Password is invalid'
            });
        }

        return res.json({
            status: true,
            message: 'User Is valid'
        });
    } catch (error) {
        next(error);
    }
});

// Logout using a username parameter
routerUser.get('/logout', (req, res) => {
    const username = req.query.username;
    res.send(`<b>${username} successfully logout.</b>`);
});
module.exports = routerUser;