const express = require('express');
const uuid = require('uuid/v4');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const path = require('path');
const multer = require('multer');
const zerorpc = require('zerorpc');

// Mongo INIT

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017/';

const users = [{ id: '2f24vvg', email: 'test@test.com', password: 'password' }];

const app = express();

passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      console.log('Connected');
      const db = client.db('Hackabit');
      db
        .collection('users')
        .find({ email, password })
        .toArray((err, res) => {
          console.log('Connected and Searched--------------------');
          if (err) {
            client.close();
            return done(err);
          }
          client.close();
          console.log(res[0]._id);
          return done(null, {
            id: res[0]._id,
            email: res[0].email,
            password: res[0].password
          });
        });
    });
    /* console.log("Inside local strategy");

    const user = users[0];
    if (email == user.email && password == user.password)
      return done(null, user); */
  })
);

passport.serializeUser((user, done) => {
  console.log(
    'Inside serializeUser.User id is saved to session file store here'
  );
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  console.log('Inside deserializeUser callback');
  console.log(`The user id passport saved in the session file store is: ${id}`);

  const ObjectId = require('mongodb').ObjectId;
  const o_id = new ObjectId(id);

  // const user = users[0].id === id ? users[0] : false;
  MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    const db = client.db('Hackabit');
    db
      .collection('users')
      .find(o_id)
      .toArray((err, res) => {
        if (err) return done(err, false);

        return done(null, res[0]);
      });
  });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    genid: (req) => {
      // console.log("Inside session middleware");
      console.log(req.sessionID);
      return uuid();
    },
    store: new FileStore(),
    secret: 'Daipayan',
    resave: false,
    saveUninitialized: true
  })
);
app.set('views', path.join(__dirname, '../views'));
// template engine
app.set('view engine', 'ejs');

// passport init
app.use(passport.initialize());
app.use(passport.session());

// static store init
app.use('/public', express.static('public'));
app.use('/dist', express.static('dist'));
app.use('/index', express.static('index'));


// Multer File Store Initialization
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    console.log('Successful !');

    callback(null, './dist/public/uploads');
  },
  filename: (req, file, callback) => {
    console.log('Successful !');
    callback(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  }
});

const upload = multer({ storage });

/*---------------------------------------------------*/

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/login', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.render('login');
    res.end();
  } else {
    // console.log(res.isAuthenticated);
    console.log('PASSPORT------');
    console.log(req.user);
    res.redirect('/authrequired');
  }
});
app.get('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.redirect('/login');
});
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    req.login(user, err => res.send(JSON.stringify({ url: '/create' })));
  })(req, res, next);
});

app.get('/authrequired', (req, res, next) => {
  console.log(`User authenticated? ${req.isAuthenticated()}`);
  if (req.isAuthenticated()) {
    res.send('you hit the authentication endpoint\n');
  } else {
    res.redirect('/');
  }
});
app.get('/create', (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log('NotAuth,redirecting');
    res.redirect('/login');
  } else res.render('createCampaign');
});

app.post('/api/create', upload.array('files', 10), (req, res, next) => {
  console.log('SOMETHING');
  const imgArr = [];

  console.log('------------');
  console.log(req.files.length);
  req.files.forEach((element) => {
    const filename = `${req.protocol}:\\${element.path}`;
    const fileez = `dist/public/uploads/${element.filename}`;
    console.log(fileez);
    imgArr.push(`${fileez}`);
    console.log(element);
  }, this);
  const type = req.body.type;
  console.log(req.body.email);
  console.log(req.body.password);

  const obj = {
    imgArr,
    createdBy: req.body.email,
    description: req.body.desc,
    createdOn: new Date(Date.now()).toLocaleString(),
    approved: false,
    type,
    location: req.body.location
  };

  try {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      const db = client.db('Hackabit');
      db.collection('disasters').insertOne(obj, (err, result) => {
        if (err) {
          client.close();
          throw new Error('Mongo Error');
        } else {
          client.close();
          res.redirect('/view');
        }
      });
    });
  } catch (err) {
    next(err);
  }
});

app.get('/campaign', (req, res, next) => {
  const id = req.query.id;

  const ObjectId = require('mongodb').ObjectId;
  const o_id = new ObjectId(id);

  try {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      const db = client.db('Hackabit');
      db
        .collection('disasters')
        .find(o_id)
        .toArray((err, result) => {
          if (err) {
            client.close();
            throw new Error('Mongo Error');
          } else {
            client.close();
            res.status(200).send(result[0]);
          }
        });
    });
  } catch (err) {
    next(err);
  }
});
app.get('/event', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    res.render('event');
  }
});
app.get('/approve', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.render('approve');
  } else {
    res.redirect('/login');
  }
});
app.get('/api/recents', (req, res, next) => {
  // const { id } = req.query;

  // const { ObjectId } = require('mongodb');
  //  const o_id = new ObjectId(id);

  try {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      const db = client.db('Hackabit');
      db
        .collection('disasters')
        .find({ approved: { $eq: false } })
        .limit(15)
        .toArray((err, result) => {
          if (err) {
            throw new Error('Mongo Update Error');
          } else {
            res.send(result);
          }
        });
    });
  } catch (err) {
    next(err);
  }
});

app.get('/api/recentAll', (req, res, next) => {
  try {
    MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
      const db = client.db('Hackabit');
      db
        .collection('disasters')
        .find({ approved: { $eq: false } })
        .toArray((err, result) => {
          if (err) {
            throw new Error('Mongo Update Error');
          } else {
            res.send(result);
          }
        });
    });
  } catch (err) {
    next(err);
  }
});
app.get('/view', (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    res.render('recents');
  }
});
app.post('/api/approve', (req, res, next) => {
  if (false) {
    res.status(401).send();
  } else {
    const id = req.body.id;
    const ObjectId = require('mongodb').ObjectId;
    const o_id = new ObjectId(id);

    try {
      MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
        const db = client.db('Hackabit');
        db
          .collection('disasters')
          .updateOne(
            { _id: o_id },
            { $set: { approved: true } },
            (err, result) => {
              if (err) {
                throw new Error('Mongo Update Error');
              } else {
                console.log('Updated');
                try {
                  const zeroClient = new zerorpc.Client();
                  zeroClient.connect('tcp://127.0.0.1:4242');
                  const reqObj = {
                    name: 'Daipayan',
                    age: '21',
                    insti: 'Jadavpur University'
                  };
                  zeroClient.invoke(
                    'start_reddit_campaign',
                    'high',
                    'www.example.com',
                    'Donate',
                    '5',
                    (error, response, more) => {
                      console.log(response);
                    }
                  );
                  res.status(200).json(
                    JSON.stringify({
                      success: true
                    })
                  );
                } catch (err) {
                  next(err);
                }
              }
            }
          );
      });
    } catch (err) {
      next(err);
    }
  }
});
app.listen(4444, () => {
  console.log('Listening on localhost 4444');
});
