
// const { Router } = require("express");
const express = require("express");
const app     = express();



app.get('/api',   (req, res) => {
    //res.status(200).send('app gets!!!');
    console.log('app.getに遷移');
    //res.set({ 'Access-Control-Allow-Origin': 'http://localhost:56976' });
    const mysql = require('mysql')
    const connection = mysql.createConnection({
        host : 'localhost',
        user:  'root',
        database: 'albumapp',
        password: '******',
    })
    let ret=[];
    connection.connect((err) => {
        if (err) throw err;
        console.log('connected to mysql');
    });
    let sql = 'select * from albumapp.user'
    connection.query(sql, function(error, rows, fields) {
        if (error) res.status(500).send(error);
        let date = [];
        for (let i = 0; i < rows.length; i++) {
            console.log(rows[i]);
            date.push({
                id: rows[i].id,
                Account: rows[i].Account
            })
        }
        ret = JSON.stringify(date);
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.write(ret);
    })
    //res.status(200).send(ret);
    connection.end();
});

app.listen(3010, () => {
    console.log('api');
});
