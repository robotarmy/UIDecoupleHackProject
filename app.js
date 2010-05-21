var kiwi= require('kiwi')
var exp = kiwi.require('express');
var sys = require('sys');
require('express/plugins')

var Ledger = require('./Ledger').Ledger;
new Ledger().service();


configure(function(){
  use(MethodOverride);
  use(ContentLength);
  use(Static);
  use(Logger);
  set('root', __dirname);
})

get('/*.css', function(file){
  this.render(file + '.css.sass', { layout: false });
});

get('/', function(){
 var self = this;
  self.render('ledger.html.haml', {
    locals: {
      title: 'Ledger My Eggo',
    }
  });
});

run();
