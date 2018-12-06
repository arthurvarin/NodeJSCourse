express = require('express')
app = express()
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs')
app.set('port', 1337)

module.exports = {
  get: (callback) => {
    callback(null, [
      { timestamp: new Date('2013-11-04 14:00 UTC').getTime(), value:12}
    , { timestamp: new Date('2013-11-04 14:30 UTC').getTime(), value:15}
    ])
  }
}

path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/metrics.json', (req, res) => {
  metrics.get((err, data) => {
    if(err) throw err
      res.status(200).json(data)
  })
})

app
  .get('/', function (req, res) {
  	 res.writeHead(200, {'Content-Type': 'text/plain'});
  	 res.write('Welcome !\n\nTo make this program work you shoud add hello?name=*your name here* to the url and see what happens !\n\nEnter the name of the developper to get a suprise (His name is Arthur)');
  	 res.end();
  })
  .get('/hello/:name', (req, res) => res.render('hello.ejs', {name: req.params.name}))

app.listen(
  app.get('port'),
  () => console.log(`server listening on ${app.get('port')}`)
)
