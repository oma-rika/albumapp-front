// const { Router } = require("express");
const express = require('express');
const app = express();

// const { Nuxt, Builder } = require('nuxt')

// async function start() {

//     const isDev = !(process.env.NODE_ENV !== 'production')
//     const port = process.env.PORT || 3000

//     const app = express();

//     // Nuxt インスタンスを取得
//     const nuxt = await loadNuxt(config.dev ? 'dev' : 'start')

//     // すべてのルートを Nuxt でレンダリング
//     app.use(nuxt.render)

//     // ホットリローディングつきの開発モードの場合のみビルド
//     if (isDev) {
//         builder(nuxt)
//     } else {
//         await next.ready()
//     }
//     // サーバーをリッスン
//     app.listen(port, () => {
//         console.log(`Listening on port ${port}`)
//     })
// }

// start();



const cors    = require('cors');
app.use(cors());
//const uuid = require('uuid');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'albumapp',
    password: 'oRe0948mj8tPw#rtmy_*!',
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connected to mysql');
});

// app.get('/api',   (req, res) => {
//     //res.status(200).send('app gets!!!');
//     console.log('app.getに遷移');
//     //res.set({ 'Access-Control-Allow-Origin': 'http://localhost:56976' });
//     let ret=[];
//     connection.connect((err) => {
//         if (err) throw err;
//         console.log('connected to mysql');
//     });
//     let sql = 'SELECT * FROM albumapp.user'
//     connection.query(sql, function(error, rows, fields) {
//         //if (error) res.status(500).send(error);
//         let date = [];
//         for (let i = 0; i < rows.length; i++) {
//             console.log(rows[i]);
//             date.push({
//                 id: rows[i].id,
//                 Account: rows[i].Account,
//                 NickName: rows[i].NickName
//             })
//         }
//         ret = JSON.stringify(date);
//         res.setHeader('Content-Type', 'application/json; charset=utf-8');
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.status(200).send(ret);
//     })
//     connection.end();
// });

app.listen(3010, () => {
    console.log('api');
});


//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

//app.get('/test', (req, res) => {
//    res.render('signup');
//});

app.post('/login', cors(), (req, res) => {
    console.log('signinアクション');
    //post値受け取れるか確認
    //console.log(req.body.UserName);
    console.log(req.body.emailAddress);
    console.log(req.body.passWord);
    connection.connect((err) => {
        if (err) throw err;
        console.log('connected to mysql');
    });
    let resMessage;
    let sql = 'SELECT * FROM albumapp.user WHERE MailAddress = ? AND Password = ?';
    connection.query(
        sql,
        [req.body.emailAddress, req.body.passWord],
        (error, resuls) => {
            if (resuls.length > 0) {
                console.log('該当するユーザーがおりました');
                resMessage = 'ok';
            } else {
                console.log('該当するユーザーはいない');
                resMessage = 'notAccount';
            }
            res.status(200).send(resMessage);
        }
    );
    connection.end();
});

app.post('/api', cors(), (req, res) => {
    console.log('post受け取り');
    //post値受け取れるか確認
    console.log(req.body.UserName);
    console.log(req.body.email);
    console.log(req.body.password);
    // connection.connect((err) => {
    //     if (err) throw err;
    //     console.log('connected to mysql');
    // });
    let sql = 'INSERT INTO albumapp.user (Account, MailAddress, Password) VALUES (?, ?, ?)'
    connection.query(
        sql,
        [req.body.UserName, req.body.email, req.body.password],
        (error, resuls) => {
            res.status(200).send('新規登録完了！');
        }
    );
    connection.end();
});

app.post('/fileUpload', cors(), (req, res) => {
    console.log('画像送信');
    //post値受け取れるか確認
    // console.log('id:', req.body.userId);
    // console.log('imageId:', req.body.imageId);
    // console.log('path:', req.body.imagePath);

    let sql = 'INSERT INTO albumapp.image_db (Userid, ImageId, Path) VALUES (?, ?, ?)';
    connection.query(
        sql,
        [req.body.userId, req.body.imageId, req.body.imagePath],
        (error, resuls) => {
            res.status(200).send('登録完了！');
        }
    );
    //connection.end();
});

