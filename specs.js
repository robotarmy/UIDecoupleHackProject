var kiwi = require('kiwi')
var jasmine = kiwi.require('jasmine');
var sys = require('sys');
require(__dirname+'/Ledger');

// this is needed for asyncSpecWait and asyncSpecDone
for(var key in jasmine) {
  global[key] = jasmine[key];
}

jasmine.run(__dirname);
