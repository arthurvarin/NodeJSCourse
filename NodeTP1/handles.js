const url = require('url')
const qs = require('querystring')

module.exports = {
  serverHandle: function (req, res) {

  const route = url.parse(req.url);
  const path = route.pathname;
  const params = qs.parse(route.query);

  res.writeHead(200, {'Content-Type': 'text/plain'});

  if(path === '/' || (path === '/hello' && 'name' in params)){
  
  if (path === '/') {
    res.write('Welcome !\n\nTo make this program work you shoud add hello?name=*your name here* to the url and see what happens !\n\nEnter the name of the developper to get a suprise (His name is Arthur)')
  }

  if (path === '/hello' && 'name' in params) {
    if(params['name'] === 'Arthur'){
      res.write('Hello my name is Arthur,\n\nI live in Paris and I can see the eiffel tower from my window')
    }
    else{
      res.write('Hello ' + params['name'])
    }
  }
  }
  else{
    res.write('Error 404')
  }

  res.end();

  } 
}