
// const { Router } = require("express");
const express = require("express");
const app     = express();



app.get('/api',   (req, res) => {
    //res.status(200).send('app gets!!!');
    console.log('app.getに遷移');
    res.set({'Access-Control-Allow-Origin': '*'});
    const mysql = require('mysql')
    const connection = mysql.createConnection({
        host : 'localhost',
        user:  '****',
        database: 'albumapp',
        password: '******',
    })
    let ret=[];
    connection.connect()
    let sql = 'select * from albumapp.user'
    connection.query(sql, function(error, row, fields) {
        if (error) res.status(500).send(error);
        let date = [];
        for (let i = 0; i < row.length; i++) {
            console.log(rows[i]);
            date.push({
                id: row[i].id,
                Account: row[i].Account
            })
        }
        ret = JSON.stringify(date);
        res.header('Content-Type', 'application/json; charset=utf-8')
        res.send(ret);
    })
    res.status(200).send(ret);
    connection.end(ret);
})

app.listen(5000, () => {
    console.log('api');
})
