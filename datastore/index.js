const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////
// var id = counter.getNextUniqueId();
// items[id] = text;
// callback(null, { id, text });


exports.create = (text, callback) => {
  //call get next unique id with anonymous callback
  counter.getNextUniqueId((err, id) => {
    //within callback create file called id and put text in it
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw ('error writing to file');
      } else {
        //call top provided callback with object that has id and text
        callback(null, { id, text });
      }
    });
  });
};

// var data = _.map(items, (text, id) => {
//   return { id, text };
// });
// callback(null, data);

exports.readAll = (callback) => {
  //read through directory
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading dir in readAll');
    } else {
      var a = [];
      files.forEach(file => {
        a.push({ id: file.slice(0, 5), text: file.slice(0, 5) });
      });
      callback(err, a);
    }
  });
  //on success, iterate over items and read each file
  //push contents of each file to an array
  //call callback with err and the array
};

exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
