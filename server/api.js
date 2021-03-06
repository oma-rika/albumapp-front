const express = require('express');
const app = express();

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
const bcrypt = require('bcrypt');
const { rejects } = require('assert');

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

const pool = mysql.createPool({
    connectionLimit : 2,
    host: 'localhost',
    port: 3306,
    user: 'root',
    database: 'albumapp',
    password: '*****',
    timezone: 'jst'
})

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

connection.connect((err) => {
    if (err) throw err;
    console.log('connected to mysql');
});

app.get('/api', (req, res) => {
    if (req.headers) {
        const bearToken = req.headers['authorization'];
        const bearer = bearToken.split(' ');
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

//お気に入り登録更新
app.post('/favorite', cors(),
    (req, res, next) => {
        console.log('Favoriteへ遷移');
        //値が送られてきたかのチェック
        console.log('req.body.fileId', req.body.fileId);
        //console.log('req.body.userId', req.body.userId);
        req.session.fileId = req.body.fileId;
        //const userId = req.body.userId;
        if (req.session.fileId === '') {
            res.status(400).send('値がありません');
        } else {
            next();
        }
    },
    (req, res) => {
        //ヘッダー情報チェック
        if (req.headers) {
            //console.log('req.headers:', req.headers);
            const bearToken = req.headers['authorization'];
            //console.log('bearToken:', bearToken);
            const bearer = bearToken.split(' ');
            //console.log('bearere');
            const token = bearer[1];
            //console.log('token:', token);
            jwt.verify(token, 'secret_key', (error, user) => {
                if (error) {
                    return res.status(403).send('Forbidden');
                } else {
                    //console.log('user:', user);
                    //console.log('user.payload.id:', user.payload.id);
                    req.session.userId = user.payload.id;
                    pool.getConnection((pool_error, connection) => {
                        if(pool_error) throw pool_error;
                        let sql = 'SELECT EXISTS(SELECT * FROM albumapp.posts_like WHERE FileId = ? AND UserId = ?) AS Favorite';
                        connection.query(
                            sql,
                            [req.session.fileId, req.session.userId],
                            (error, results) => {
                                if (error) throw error;
                                if (results[0].Favorite === 0) {
                                    //console.log('INSERT');
                                    const insert_query = 'INSERT INTO albumapp.posts_like (FileID, UserId) VALUES (?, ?)';
                                    connection.query(
                                        insert_query,
                                        [req.session.fileId, req.session.userId],
                                        (err, rows) => {
                                            if(err) throw err;
                                            console.log('rows:', rows);
                                            connection.release();
                                        }
                                    );
                                } else {
                                    //console.log('DELETE');
                                    const delete_query = 'DELETE FROM albumapp.posts_like WHERE FileID = ? AND UserId = ?';
                                    connection.query(
                                        delete_query,
                                        [req.session.fileId, req.session.userId],
                                        (err, rows) => {
                                            if(err) throw err;
                                            console.log('rows:', rows);
                                            connection.release();
                                        }
                                    );
                                }
                            }
                        );
                    });
                    res.status(200).send('送信完了');
                }
            })
        }
    }
);

//アイテムをゴミ箱に移動する
app.post('/DeleteSelectItem', cors(), (req, res) => {
    if (req.headers) {
        const bearToken = req.headers['authorization'];
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            } else {
                let remove = req.body.delete ? 1 : 0;
                let sql = 'UPDATE albumapp.imagefiles SET DeleteFlag=? WHERE ID=? AND UserId=?';
                connection.query(
                    sql,
                    [remove, req.body.id, user.payload.id],
                    (error, results) => {
                        if (error) throw error;
                        res.status(200).send('送信完了');
                    }
                );
            }
        })
    }
});

//ゴミ箱に移動したアイテムを復元する
app.post('/restoreSelectItem', cors(), (req, res) => {
    if (req.headers) {
        const bearToken = req.headers['authorization'];
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            } else {
                console.log('成功');
                console.log('req.body.id', req.body.id);
                const restore = req.body.delete ? 1 : 0;
                const fileId = req.body.id;
                const userId = user.payload.id;
                console.log('restore', restore);
                let sql = 'UPDATE albumapp.imagefiles SET DeleteFlag=? WHERE ID=? AND UserId=?';
                let resMessage;
                connection.query(
                    sql,
                    [restore, fileId, userId],
                    (error, results) => {
                        if (error) throw error;

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
});

app.post('/shareItem', cors(), (req, res) => {
    console.log('req.body.id', req.body.id);
    const bearToken = req.headers['authorization'];
    if (!bearToken) {
        res.status(500).send('Internal Error.');
        res.end();
    } else {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            }
            let publicItem = req.body.public ? 1 : 0;
            let sql = 'UPDATE albumapp.imagefiles SET PublicFlag=? WHERE ID=? AND UserId=?';
            connection.query(
                sql,
                [publicItem, req.body.id, user.payload.id],
                (error, results) => {
                    //後で確認
                    if (error) throw error;
                    res.status(200).send('送信完了');
                }
            );
        });
    }
});

app.get('/shareAllItem', cors(), (req, res) => {
    console.log('公開する画像を全て出力');
    const bearToken = req.headers['authorization'];
    if (!bearToken) {
        res.status(500).send('Internal Error.');
        res.end();
    } else {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            } else {
                console.log('成功');
                console.log('user.payload.Id:', user.payload.id);
                let sql = 'SELECT * FROM albumapp.imagefiles WHERE PublicFlag=1';
                connection.query(
                    sql,
                    (error, results) => {
                        if (error) throw error;
                        if (results.length > 0) {
                            resMessage = 'ok';
                        } else {
                            resMessage = 'NotFound';
                        }
                        res.status(200).json({status: resMessage, items: results});
                    }
                );
            }
        });
    }
});

//新規登録
app.post('/signup', cors(),
    (req, res, next) => {
        //入力値が入っているかのチェック
        const username = req.body.UserName;
        const email = req.body.email;
        const password = req.body.password;

        if (username === '' || email === '' || password === '') {
            res.status(400).send('値が入力されていません');
        } else {
            next();
        }
    },
    (req, res, next) => {
        //メールアドレスの重複チェック
        const email = req.body.email;
        const sql = 'SELECT * FROM albumapp.users WHERE MailAddress = ?';
        connection.query(
            sql,
            [email],
            (error, results) => {
                if (results.length > 0) {
                    res.status(409).send('ユーザー登録に失敗しました');
                } else {
                    next();
                }
            }
        );
    },
    (req, res) => {
        const sql = 'INSERT INTO albumapp.users (Account, MailAddress, Password) VALUES (?, ?, ?)';
        const username = req.body.UserName;
        const email = req.body.email;
        const password = req.body.password;
        bcrypt.hash(password, 10, (error, hash) => {
            connection.query(
                sql,
                [username, email, hash],
                (error, resuls) => {
                    if (error) throw error;
                    res.status(200).send('新規登録完了！');
                }
            );
        });
    }
);

//ログイン
app.post('/login', cors(),
    (req, res, next) => {
        //入力値が入っているかのチェック
        const email = req.body.emailAddress;
        const password = req.body.password;

        if (email === '' || password === '') {
            res.status(400).send('値が入力されていません');
        } else {
            next();
        }
    },
    (req, res) => {
    //console.log(req.body.emailAddress);
    //console.log(req.body.passWord);
    const email = req.body.emailAddress;
    let resMessage;
    let sql = 'SELECT * FROM albumapp.users WHERE MailAddress = ?';
    connection.query(
        sql,
        [email],
        (error, results) => {
            if (results.length > 0) {
                const password = req.body.passWord;
                const hash = results[0].Password;
                let token;
                new Promise((resolve, reject) => {
                    bcrypt.compare(password, hash, (error, isEqual) => {
                        if (isEqual) {
                            req.session.userId = results[0].ID;
                            const payload = {
                                id: results[0].ID,
                                name: results[0].Account,
                                email: results[0].MailAddress,
                                password: results[0].Password,
                                NickName: results[0].NickName
                            };
                            token = jwt.sign({
                                expiresIn: '1d', // Expires after date
                                payload
                            }, 'secret_key');
                            if (token) {
                                results[0].Token = token;
                            }
                            resolve(results);
                            console.log('Token:', token);
                        } else {
                            reject();
                        }
                    });
                }).then((value) => {
                    resMessage = 'ok';
                    res.status(200).json({status: resMessage, items: value});
                    res.end();
                    return;
                }).catch(() => {
                    console.log('パスワードが一致しない');
                    res.status(400).send('入力値エラー');
                    res.end();
                    return;
                });
            } else {
                console.log('該当するユーザーはいない');
                res.status(400).send('入力値エラー');
                res.end();
                return;
            }
        }
    );
});

app.post('/fileUpload', cors(), (req, res) => {
    console.log('画像送信');
    let sql = 'INSERT INTO albumapp.image_db (Userid, ImageId, Path) VALUES (?, ?, ?)';
    connection.query(
        sql,
        [req.body.userId, req.body.imageId, req.body.imagePath],
        (error, results) => {
            res.status(200).send('登録完了！');
        }
    );
});

app.post('/avatarUpload/:userId', multer({ storage: storage }).single('file'), (req, res) => {
    const userId = req.params.userId;
    console.log(req.file.filename, ':filename');
    console.log(req.file, ':file');
    console.log('userId', userId);

    let reqFilepath = req.file.path;
    let filepath = reqFilepath.substr(reqFilepath.indexOf('updir'));
    console.log('filepath:', filepath);

    let sql = 'UPDATE albumapp.users SET AvatarFilePath=? WHERE ID = ?';
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
                    let sql = 'SELECT AvatarFilePath, ShowAvatarFlag From albumapp.users WHERE ID=?;';
                    connection.query(
                        sql,
                        [user.payload.id],
                        (error, results) => {
                            if (error) throw error;
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

//アルバムを表示
app.get('/MyData', cors(), (req, res) => {
    const bearToken = req.headers['authorization'];
    if (bearToken) {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            } else {
                console.log('user.payload.Id:', user.payload.id);
                //後で修正
                const sql = 'SELECT ID, FilePath, PublicFlag, Favorite, DeleteFlag FROM albumapp.imagefiles WHERE UserId = ?';
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
});

/* File Upload */
app.post('/imagefileUpload', cors(), (req, res) => {
    const bearToken = req.headers['authorization'];
    if (!bearToken) {
        res.status(500).send('Internal Error.');
        res.end();
    } else {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (user) {
                req.session.userId = user.payload.id;
            }
            const upload = multer({ storage: storage }).single('file');
            upload(req, res, function(error) {
                if (error) {
                    res.status(500).send('Internal Error.');
                    res.end();
                } else {
                    if (req.file) {
                        const reqFilepath = req.file.path;
                        const filePath = reqFilepath.substr(reqFilepath.indexOf('assets'));
                        let sql = 'INSERT INTO albumapp.imagefiles (UserId, FilePath) VALUES (?, ?)';
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
});
//お気に入り一覧
app.get('/favoriteSelectData', cors(), (req, res) => {
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
                const userId = user.payload.id;
                //const sql = 'SELECT * FROM albumapp.imagefiles WHERE UserId = ? AND favorite = 1';
                const sql = 'SELECT imagefiles.ID, posts_like.UserId, imagefiles.FilePath, imagefiles.UpdateTime \
                FROM albumapp.imagefiles \
                INNER JOIN albumapp.posts_like ON albumapp.imagefiles.UserId = albumapp.posts_like.UserId \
                WHERE posts_like.UserId = ?';
                let resMessage;
                connection.query(
                    sql,
                    [userId],
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
});

//ゴミ箱に移動したアイテムを表示
app.get('/TrashData', cors(), (req, res) => {
    const bearToken = req.headers['authorization'];
    if (bearToken) {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            } else {
                const sql = 'SELECT * FROM albumapp.imagefiles WHERE UserId = ? AND DeleteFlag = 1';
                let resMessage;
                connection.query(
                    sql,
                    [user.payload.id],
                    (error, results) => {
                        if (error) throw error;
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
});

app.get('/allShareData/:offset', cors(), (req, res) => {
    console.log('allShareDataに遷移');
    const offsetNum = parseInt(req.params.offset);
    const bearToken = req.headers['authorization'];
    if (!bearToken) {
        res.status(500).send('Internal Error.');
        res.end();
    } else {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                res.status(500).send('Internal Error.');
                res.end();
            } else {
                //const sql = 'SELECT *, (SELECT COUNT(*) FROM albumapp.imagefiles_public_view) AS COUNT FROM albumapp.imagefiles_public_view';
                const sql = 'SELECT imagefiles.ID, imagefiles.UserId, imagefiles.FilePath, imagefiles.PublicFlag, imagefiles.UpdateTime, posts_like.UserId AS PostLikeUser, COUNT(posts_like.UserId) AS likes \
                            FROM albumapp.imagefiles LEFT OUTER JOIN albumapp.posts_like ON albumapp.imagefiles.ID = albumapp.posts_like.FileId \
                            GROUP BY imagefiles.UserId';
                let resMessage;
                connection.query(
                    sql,
                    [offsetNum],
                    (error, results) => {
                        if (error) {
                            res.status(500).send('Internal Error.');
                            res.end();
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
        });
    }
});
//パスワードの変更
app.post('/passwordChange', cors(), (req, res) => {
    const bearToken = req.headers['authorization'];
    if (!bearToken) {
        res.status(500).send('Internal Error.');
        res.end();
    } else {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                return res.status(403).send('Forbidden');
            }
            if (user) {
                new Promise((resolve, reject) => {
                    const currentPassword = req.body.currentPassword;
                    //console.log('currentPassword:', currentPassword);
                    req.session.currentPassword = user.payload.password;
                    //console.log('req.session.currentPassword:', req.session.currentPassword);
                    bcrypt.compare(currentPassword, req.session.currentPassword, (error, isEqual) => {
                        if (isEqual) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }).then(() => {
                    const newPassword = req.body.newPassword;
                    return new Promise((resolve, reject) => {
                        bcrypt.hash(newPassword, 10, (error, hash) => {
                            if (error) {
                                reject();
                            }
                            resolve(hash);
                        });
                    });
                }).then((value) => {
                    const userId = user.payload.id;
                    const newPassword = value;
                    //console.log('req.session.currentPassword:', req.session.currentPassword);
                    //console.log('userId:', userId);
                    //console.log('newPassword:', newPassword);
                    const sql = 'UPDATE albumapp.users SET Password=? WHERE id=? AND Password=?';
                    connection.query(
                        sql,
                        [newPassword, userId, req.session.currentPassword],
                        (error, results) => {
                            if (error) {
                                throw error;
                            }
                            res.status(200).send('送信完了');
                            res.end();
                            return;
                        }
                    );
                }).catch(() => {
                    console.log('3番目の処理を実行');
                    res.status(403).send('Forbidden');
                    res.end();
                    return 
                }); 
            }
        });
    }
});

//ダウンロード機能
app.get('/download', cors(), (req, res) => {
    console.log('downloadに遷移');
    let filepath = req.query.filepath;
    let filetype = filepath.split('.').pop();
    //末尾だけ
    let imgfilename = filepath.split('/').pop();
    let filename = encodeURI(imgfilename);

    res.setHeader('Content-disposition', `attachment; filename=${filename}`);

    try {
        let image = fs.readFileSync(filepath);
        console.log('image:')
        let contentType = `image/${filetype}`;
        res.writeHead(200, {'Content-Type':`${contentType}`});
        res.end(image);
        return;
    } catch (error) {
        console.log('error:', error.code);
    } 
});

//アクティビティを取得
app.get('/messagelog', cors(), (req, res) => {
    console.log('messagelogに遷移');
    const bearToken = req.headers['authorization'];
    if (!bearToken) {
        res.status(500).send('Internal Error.');
        res.end();
    } else {
        const bearer = bearToken.split(' ');
        const token = bearer[1];
        jwt.verify(token, 'secret_key', (error, user) => {
            if (error) {
                res.status(500).send('Internal Error.');
                res.end();
            }
            if (user) {
                const sql = 'SELECT id, message, updateTime FROM albumapp.activity_log WHERE userId=? ORDER BY updateTime DESC';
                connection.query(
                    sql,
                    [user.payload.id],
                    (error, results) => {
                        if (error) {
                            res.status(500).send('Internal Error.');
                            res.end();
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
        });
    }
});



app.listen(3010, () => {
    console.log('api');
});