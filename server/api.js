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


// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
const cors    = require('cors');
app.use(cors());
const uuid = require('uuid');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const mysql = require('mysql');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require("fs");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {

        console.log('dirname:', __dirname);

        let destination = path.join(__dirname, '../assets'); // ./assets/
    
            if (req.session && req.session.userId) {
                userId = String(req.session.userId);
                destination = path.join(destination, 'updir', 'users', userId, uuid.v1()); // ./updir/users/1/generated-uuid/
                try {
                    fs.mkdirSync(destination, {recursive: true});
                } catch {
                    //uuidを使用して動的に生成しているが一応try-catchで確認する
                    console.log(`${destination} は既に存在する.`);   
                }

            } else {
                console.log('req.session.userIdが存在しない');
                destination = path.join(destination, 'updir', 'tmp'); // ./assets/updir/tmp
            }

            cb(null, destination);

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'albumapp',
    password: '*****', //2021-11-18 PassWordChange
});

//express-session
app.use(
    session({
        secret: 'my_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            domain: 'localhost',
            httpOnly: true,
            secure: false, //開発環境ではfalseにする
            maxAge: 60 * 1000 * 30
        }
    })
);


// if (app.get('env') === 'production') {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = true // serve secure cookies
//   }

// app.use(
//     cookieSession({
//         name: "session",
//         keys: ["key1", "key2"],
//         maxAge: 60 * 1000 * 30
//     })
// )


app.use((req, res, next) => {
    if (req.session.userId == undefined) {
        console.log('ログインしていません');
        //res.redirect('/signin');
    } else {
        console.log('ログインしています');
    }
    next();
});

connection.connect((err) => {
    if (err) throw err;
    console.log('connected to mysql');
});

app.get('/api', (req, res) => {
    //ブラウザから送られてくるTokenのチェック
    //console.log('req.headers:', req.headers);
    if (req.headers) {
        const bearToken = req.headers['authorization'];
        const bearer = bearToken.split(' ');
        console.log('bearere');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            } else {
                res.setHeader('Set-Cookie', 'My seacret token');
                res.end('Hello world');
            }
        })
    }
})

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

//app.set('views', __dirname + '/views');
//app.set('view engine', 'ejs');

//app.get('/test', (req, res) => {
//    res.render('signup');
//});

app.post('/login', cors(), (req, res) => {
    console.log('signinアクション');
    console.log(req.body.emailAddress);
    console.log(req.body.passWord);
    let resMessage;
    let sql = 'SELECT * FROM albumapp.user WHERE MailAddress = ? AND Password = ?';
    connection.query(
        sql,
        [req.body.emailAddress, req.body.passWord],
        (error, results) => {
            let token;
            if (results.length > 0) {
                console.log('該当するユーザーがいました');
                if (req.body.passWord === results[0].Password) {
                    req.session.userId = results[0].ID;
                    const payload = {
                        id: results[0].ID,
                        name: results[0].Account,
                        email: results[0].MailAddress,
                        password: results[0].Password,
                        NickName: results[0].NickName
                    };
                    //console.log('payload', payload);
                    token = jwt.sign({
                        expiresIn: '1d', // Expires after date
                        payload
                    }, 'secret_key');
                    if (token) {
                        results[0].Token = token;
                    }
                } else {
                    console.log('パスワードが一致しない');
                }
                resMessage = 'ok';
                res.status(200).json({status: resMessage, items: results});
            } else {
                console.log('該当するユーザーはいない');
                resMessage = 'NotFound';
                //2022-02-16 itemsのレスポンスは必要か検討
                res.status(404).send({status: resMessage, items: results});
            }
            res.end();
        }
    );
});

app.get('/albums/:userId/:limit', cors(), (req, res) => {
    console.log('画像一覧を取得');
    const userId = req.params.userId;
    console.log('userId:', userId);
    const limit = req.params.limit * 10;
    const sql = 'SELECT id, UserId, Path, UpdateTime, favorite FROM albumapp.image_db WHERE UserId = ? LIMIT ?;';
    let resMessage;
    connection.query(
        sql,
        [userId, limit],
        (error, results) => {
            console.log('results:', results);
            if (error) {
                res.status(500).send('Internal Error.');
            }
            if (results.length > 0) {
                resMessage = 'ok';
            } else {
                resMessage = 'NotFound';
            }
            res.status(200).json({status: resMessage, items: results});
        }
    );
});

app.post('/favorite', cors(), (req, res) => {
    console.log('お気に入り登録');
    //console.log('tokenを確認');
    console.log('req.body.id', req.body.id);
    if (req.headers) {
        console.log('req.headers:', req.headers);
        const bearToken = req.headers['authorization'];
        console.log('bearToken:', bearToken);
        const bearer = bearToken.split(' ');
        console.log('bearere');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            } else {
                console.log('成功');
                console.log('user:', user);
                console.log('user.payload.Id:', user.payload.id);
                let like = req.body.favorite ? 1 : 0;
                console.log('like', like);
                let sql = 'UPDATE albumapp.image_db SET favorite=? WHERE id=? AND UserId=?';
                connection.query(
                    sql,
                    [like, req.body.id, user.payload.id],
                    (error, results) => {
                        if (error) throw error;
                        res.status(200).send('送信完了');
                    }
                );
            }
        })
    }
});

app.post('/signup', cors(), (req, res) => {
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
            if (error) throw error;
            res.status(200).send('新規登録完了！');
        }
    );
    //connection.end();
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
        (error, results) => {
            res.status(200).send('登録完了！');
        }
    );
    //connection.end();
});

// app.post('/avatarUpload', multer({ dest: 'updir/' }).single('file'), (req, res) => {
//    console.log('req.file:', req.file.filename);
//    res.status(200).send('ファイルのアップロードが完了しました。');
// });

app.post('/avatarUpload/:userId', multer({ storage: storage }).single('file'), (req, res) => {
    const userId = req.params.userId;
    console.log(req.file.filename, ':filename');
    console.log(req.file, ':file');
    console.log('userId', userId);

    let reqFilepath = req.file.path;
    let filepath = reqFilepath.substr(reqFilepath.indexOf('updir'));
    console.log('filepath:', filepath);

    let sql = 'UPDATE albumapp.user SET AvatarFilePath=? WHERE ID = ?';
    connection.query(
        sql,
        [filepath, userId],
        (error, resuls) => {
            if (error) throw error;
            res.status(200).send('ファイルのアップロードが完了しました。');
        }
    )
});

app.get('/userInfo', cors(), (req, res) => {
    if (req.headers) {
        console.log('req.headers:', req.headers);
        const bearToken = req.headers['authorization'];
        if (bearToken) {
            console.log('bearToken:', bearToken);
            const bearer = bearToken.split(' ');
            console.log('bearere');
            const token = bearer[1];
            jwt.verify(token, 'secret_key', (error, user) => {
                if (error) {
                    return res.status(403).send('Forbidden');
                } else {
                    console.log('成功');
                    console.log('user:', user);
                    console.log('user.payload.Id:', user.payload.id);
                    let sql = 'SELECT AvatarFilePath, ShowAvatarFlag From albumapp.user WHERE ID=?;';
                    connection.query(
                        sql,
                        [user.payload.id],
                        (error, results) => {
                            if (error) throw error;
                            if (results.length > 0) {

                            }
                            if (results.length > 0) {
                                resMessage = 'ok';
                            } else {
                                resMessage = 'NotFound';
                            }
                            res.status(200).json({status: resMessage, items: results});
                        }
                    );
                }
            })
        } else {
            //後で確認
            return res.status(403).send('取得できない');
        }
    }
});
/* multer Test */
app.get('/albums2', cors(), (req, res) => {
    if (req.headers) {
        console.log('req.headers:', req.headers);
        const bearToken = req.headers['authorization'];
        if (bearToken) {
            console.log('bearToken:', bearToken);
            const bearer = bearToken.split(' ');
            console.log('bearere:', bearer);
            const token = bearer[1];
            jwt.verify(token, 'secret_key', (error, user) => {
                if (error) {
                    return res.status(403).send('Forbidden');
                } else {
                    console.log('成功');
                    console.log('user.payload.Id:', user.payload.id);
                    //後で修正
                    const sql = 'SELECT id, UserId, Path, UpdateTime, favorite FROM albumapp.image_db WHERE UserId = ?';
                    connection.query(
                        sql,
                        [user.payload.id],
                        (error, results) => {
                            if (results.length > 0) {
                                resMessage = 'ok';
                            } else {
                                resMessage = 'NotFound';
                            }
                            res.status(200).json({status: resMessage, items: results});
                        }
                    );
                }
            })
        }
    }
});

/* File Upload */
app.post('/imagefileUpload', cors(), (req, res) => {
    console.log('ポストされてきた');
    let reqFilepath = req.file;
    //let filepath = reqFilepath.substr(reqFilepath.indexOf('updir'));
    console.log('reqFilepath:', reqFilepath);
    if (req.headers) {
        console.log('req.headers:', req.headers);
        const bearToken = req.headers['authorization'];
        if (bearToken) {
            console.log('bearToken:', bearToken);
            const bearer = bearToken.split(' ');
            console.log('bearere');
            const token = bearer[1];
            jwt.verify(token, 'secret_key', (error, user) => {
                if (user) {
                    req.session.userId = user.payload.id;
                    console.log('imagefileUploadのuser.payload.Id:', user.payload.id);
                }
                const upload = multer({ storage: storage }).single('file');
                upload(req, res, function(error) {
                    if (error) {
                        console.log('error', error);
                    } else {
                        console.log('成功');
                        console.log(req.file);
                        if (req.file) {
                            const reqFilepath = req.file.path;
                            const filePath = reqFilepath.substr(reqFilepath.indexOf('assets'));
                            let sql = 'INSERT INTO albumapp.imagefile_db (UserId, FilePath) VALUES (?, ?)';
                            connection.query(
                                sql,
                                [req.session.userId, filePath],
                                (error, results) => {
                                    if (error) {
                                        res.status(500).send('Internal Error.');
                                    }
                                    res.status(200).send('ファイルのアップロードが完了しました。');
                                }
                            );
                        }
                    }
                });
            })
        }
    }
});

app.listen(3010, () => {
    console.log('api');
});

