
config = {
  host:'localhost',
  port:'7000',
};
var sys = require('sys');

describe('Ledger', function(){
  beforeEach(function () {
    var ledger = new Ledger();
    ledger.collection(function(err,collection) {
      collection.remove();
    });
  });
  /*
  it('it serves json on port 8001', function() {
    var ledger = new Ledger();
    ledger.service();
    ledger.append([{name:'A Thing', value: "A Value"},{horse:'pony',value:'cake'}],function(err,items){
    http = require('http');
    var google = http.createClient(8001, 'localhost');
    var request = google.request('GET', '/',{'host': 'localhost'});
      request.addListener('response', function (response) {
        response.setEncoding('utf8');
        expect(response.statusCode).toEqual(200);
        expect(response.headers["content-type"]).toEqual('text/json');
        response.addListener('data', function (chunk) {
          data = JSON.parse(chunk);
          expect(data[0]['name']).toEqual('A Thing');
          expect(data[1]['horse']).toEqual('pony');
          asyncSpecDone();
        });
      });
    request.end();
    });
    asyncSpecWait(); 
  });
  */
  it('has a item_posted method - can insert on new or update otherwise', function(){
    var ledger = new Ledger();
    var count = 0;
    var post_callback = function(err,item) {
      count++;
      expect(item._id != undefined).toEqual(true);
      if (item["value"] == 'pony')
        {
          expect(item.name == 'cake').toEqual(true);
        }

        if(count == 2) {
          asyncSpecDone();
        }
    }
    saved_callback = function(err,item) {
      item["name"] = 'cake';
      ledger.item_posted([item,{horse:'pony',value:'cake'}],post_callback);
    };
    // document values are lowercase
    ledger.append({name:'cake', value: "pony"},saved_callback);

    asyncSpecWait(); 
  });

  it('can recieve an item', function(){
    var ledger = new Ledger();
    saved_callback = function(err,item) {
      expect(item._id != undefined).toEqual(true);
      expect(item.name =='A Thing').toEqual(true);
      expect(item.value == 'A Value').toEqual(true);
      asyncSpecDone();
    };
    ledger.append({name:'A Thing', value: "A Value"},saved_callback);
    asyncSpecWait(); 
  });

  it('can have many be updated after inserted', function(){
    var ledger = new Ledger();
    var returned_item = 0;
    var count = 0;
    var updated_item = function(err,item) {
      count++;
      expect(item.value == 1).toEqual(true);
      if (count == 2)
        asyncSpecDone();
    };
    var saved_callback = function(err,item) {
      item["value"] = 1;
      ledger.update(item,updated_item);
    };
    ledger.append([{name:'A Thing', value: "A Value"},{horse:'pony',value:'cake'}],saved_callback);
    asyncSpecWait(); 
  });

  it('can find all of its items', function(){
    var ledger = new Ledger();
    ledger.append([{1:2,2:3},{name:'A Thing', value: "A Value"},{horse:'pony',value:'cake'}],function(err,items) {
      ledger.find_all(function(error,items) {
        expect(items.length == 3).toEqual(true)
        asyncSpecDone();
      });
    });
    asyncSpecWait(); 
  });

});


