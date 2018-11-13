express = require('express')
app = express()

app.set('port', 1337)

app
  .get('/', function (req, res) {
  	 res.writeHead(200, {'Content-Type': 'text/plain'});
  	 res.write('Welcome !\n\nTo make this program work you shoud add hello?name=*your name here* to the url and see what happens !\n\nEnter the name of the developper to get a suprise (His name is Arthur)');
  	 res.end();
  })
  .get('/hello/:name', function (req, res) {
  	res.writeHead(200, {'Content-Type': 'text/plain'});
  	if(req.params.name === 'Arthur'){
      res.write('Hello my name is Arthur,\n\nI live in Paris and I can see the eiffel tower from my window')
    }
    else{
      res.write('Hello ' + req.params.name)
    } 
    res.end();
  })




app.listen(
  app.get('port'),
  () => console.log(`server listening on ${app.get('port')}`)
)
 
