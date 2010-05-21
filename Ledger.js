Date.prototype.time_ago_in_words = function() {
  return "1";
};
var kiwi= require('kiwi')
var url = require('url');
var mongodb = kiwi.require('mongodb');
DStore = mongodb.Db;
Server = mongodb.Server;

Ledger = function(){};

Ledger.prototype.collection = function(callback) {
  var client = new DStore('experiment',new Server("127.0.0.1", 27017, {}));
  client.open(function(p_client) {
    client.createCollection('ledger', function(err, collection) {
      client.collection('ledger', function(err, collection) {
        callback.apply(this,[err,collection]);
      });
    });
  });
};

Ledger.prototype.up = function(item, callback) {
  this.collection(function(err, collection) {
    inner_callback = function(err, doc) {
      callback.apply(this,[err,Array.isArray(doc)? doc[0] : doc]); 
    };
    if (item._id == undefined) {
      collection.insert(item, inner_callback)
    }else {
      collection.update({'_id':item.id},item,{},inner_callback);
    };
  });
};

Ledger.prototype.up_array = function(items, callback) {
  for(var i = 0; i < items.length; i++){
    el = items[i];
    this.up(el,callback); 
  };
};

Ledger.prototype.append = function(items, callback) {
  return this.up_array(Array.isArray(items) ? items : [items], callback);
};

Ledger.prototype.update = function(items,callback) {
  return this.up_array(Array.isArray(items) ? items : [items], callback);
};

Ledger.prototype.item_posted = function(items,callback) {
  return this.update(items,callback);
};

Ledger.prototype.find_all = function(callback) {
  this.collection(function(err, collection) {
    collection.find(function(err, cursor) {
      cursor.toArray(function(err, docs) {
        callback.apply(this,[err,docs]);
      });                   
    });
  });
};
Ledger.prototype.server = undefined;
Ledger.prototype.halt_service = function() {
 this.server.removeAllListeners('request');
 this.server.removeAllListeners('listening');
 this.server.close(); 
};
Ledger.prototype.service = function() {
  var self = this;
  var http = require('http');
  var sys = require('sys');
  self.server = http.createServer(function(request,response) {
    var req = request;
    var resp = response;
    self.find_all(function(err,items){
      var callback = undefined;
      var query = url.parse(request.url,true).query
      if (query != undefined)
        callback = query['callback'];
      if (callback != undefined){
        var body = ";"+callback+"("+JSON.stringify(items)+");";
        resp.writeHead(200, {
          'Content-Length': body.length,
          'Content-Type': 'application/json;charset=utf-8'
        });
        sys.puts(body);
        resp.write(body,'utf8')
        resp.end();
      }
    });
  });
  self.server.addListener('close',function(errno) {
    sys.puts('close ' + errno);
  });
  self.server.listen(8001);
};

exports.Ledger = Ledger;
