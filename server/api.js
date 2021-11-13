
// const { Router } = require("express");
const express = require('express');
const app     = express();
const cors    = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'albumapp',
    password: '*****',
});

app.get('/api',   (req, res) => {
    //res.status(200).send('app gets!!!');
    console.log('app.getに遷移');
    //res.set({ 'Access-Control-Allow-Origin': 'http://localhost:56976' });
    let ret=[];
    connection.connect((err) => {
        if (err) throw err;
        console.log('connected to mysql');
    });
    let sql = 'select * from albumapp.user'
    connection.query(sql, function(error, rows, fields) {
        //if (error) res.status(500).send(error);
        let date = [];
        for (let i = 0; i < rows.length; i++) {
            console.log(rows[i]);
            date.push({
                id: rows[i].id,
                Account: rows[i].Account,
                NickName: rows[i].NickName
            })
        }
        ret = JSON.stringify(date);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(200).send(ret);
    })
    connection.end();
});

app.listen(3010, () => {
    console.log('api');
});


//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

//app.get('/test', (req, res) => {
//    res.render('signup');
//});

app.post('/api', cors(), (req, res) => {
    console.log('post受け取り');
    //post値受け取れるか確認
    console.log(req.body.UserName);
    console.log(req.body.email);
    console.log(req.body.password);
    connection.connect((err) => {
        if (err) throw err;
        console.log('connected to mysql');
    });
    let sql = 'INSERT INTO albumapp.user (Account, MailAddress, Password) VALUES (?, ?, ?)';
    connection.query(
        sql,
        [req.body.UserName, req.body.email, req.body.password],
        (error, resuls) => {
            res.status(200).send('新規登録完了！');
        }
    );
    connection.end();
});
