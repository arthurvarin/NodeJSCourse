import { UserHandler, User } from './user'
import { MetricsHandler, Metric } from './metrics'
const express = require('express')
const bodyparser = require('body-parser')
const session = require('express-session')
const levelSession = require('level-session-store')
const moment = require('moment');

const path = require('path')
const morgan = require('morgan')

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')
const dbUser: UserHandler = new UserHandler('./db/users')

const app = express()
const port: string = process.env.PORT || '8080'

const LevelStore = levelSession(session)


app.use(bodyparser.json())
app.use(bodyparser.urlencoded())
app.use(morgan('dev'))

app.use(session({
  secret: 'my very secret phrase',
  store: new LevelStore('./db/sessions'),
  resave: true,
  saveUninitialized: true
}))

app.set('views', __dirname + '/../views')
app.set('view engine', 'ejs')

app.use('/', express.static(path.join(__dirname, '/../node_modules/jquery/dist')))
app.use('/', express.static(path.join(__dirname, '/../node_modules/bootstrap/dist')))

// Section de l'Authentification

const authRouter = express.Router()

authRouter.get('/login', (req: any, res: any) => {
  res.render('login')
})

authRouter.get('/signup', (req: any, res: any) => {
  dbUser.delete("test",(err: Error | null) => {})
  res.render('signup')
})

authRouter.get('/logout', (req: any, res: any) => {
  delete req.session.loggedIn
  delete req.session.user
  res.redirect('/login')
})

authRouter.post('/login', (req: any, res: any, next: any) => {
if(req.body.username !== "" && req.body.password !== "")
  dbUser.get(req.body.username, (err: Error | null, result?: User) => {
    if (result === undefined || !result.validatePassword(req.body.password)) {
      res.redirect('/login')
    } else {
      req.session.loggedIn = true
      req.session.user = result
      res.redirect('/')
    }
  })
  else res.redirect('/login')
})

authRouter.post('/signup', (req: any, res: any, next: any) => {

    if (req.body.username === undefined || req.body.email === undefined ||  req.body.password === undefined ||  req.body.passwordconfirmation === undefined || !dbUser.confirmPassword(req.body.password,req.body.passwordconfirmation)) {

      res.redirect('/signup')
    } else {
      let newuser =  new User(req.body.username,req.body.email,req.body.password);
      dbUser.save(newuser,(err: Error | null) => {})

      res.redirect('/login')
    }
  })


app.use(authRouter)

const authMiddleware = function (req: any, res: any, next: any) {
  if (req.session.loggedIn) next()
  else res.redirect('/login')
}

app.get('/', authMiddleware, (req: any, res: any) => {
  res.render('index', { name: req.session.username })
})


// Section Users

const userRouter = express.Router()

userRouter.delete('/:username', function (req: any, res: any, next: any) {
  dbUser.get(req.params.username, function (err: Error | null) {
    if (err) next(err)
    res.status(200).send()
  })
})


  userRouter.post('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: User) {
      if (!err || result !== undefined) {
       res.status(409).send("user already exists")
      } else {
        dbUser.save(req.body, function (err: Error | null) {

if (err) next(err)

else res.status(201).send("user persisted")
        })
      }
    })
  })

  userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: User) {
      if (err || result === undefined) {
        res.status(404).send("user not found")
      } else res.status(200).json(result)
    })
  })

  userRouter.delete('/:username', function (req: any, res: any, next: any) {
    dbUser.get(req.params.username, function (err: Error | null) {
      if (err) next(err)
      res.status(200).send()
    })
  })

  app.use('/user', userRouter)

  // Section Metrics

  const metricsRouter = express.Router()
  metricsRouter.use(function (req: any, res: any, next: any) {
    console.log("called metrics router")
    next()
  })

  metricsRouter.post('/', (req: any, res: any, next: any) => {

  req.body.timestamp = moment(req.body.timestamp).format("X");
    dbMet.save(req.session.user.username, req.body, (err: Error | null) => {
      if (err) next(err)
         res.redirect('/')
    })
  })

  metricsRouter.get('/', (req: any, res: any, next: any) => {
    dbMet.get(req.session.user.username, (err: Error | null, result?: Metric[]) => {
      if (err) next(err)
      if (result === undefined) {
        res.write('no result')
        res.send()
      } else res.json(result)
    })
  })

  app.use('/metrics', authMiddleware, metricsRouter)

  // Section de gestion des erreurs

  app.use(function (err: Error, req: any, res: any, next: any) {
    console.log('got an error')
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

  app.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`server is listening on port ${port}`)
  })
