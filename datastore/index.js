const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////


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


exports.readAll = (callback) => {
  //read through directory
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('error reading dir in readAll');
    } else {
      var promises = [];
      //on success, iterate over items and read each file
      files.forEach(file => {
        //create a new promise for each async reading of file
        var newPromise = new Promise((resolve, reject) => {
          fs.readFile(`${exports.dataDir}/${file}`, 'utf8', (err, fileData) => {
            if (err) {
              reject(err);
            } else {
              //on resolve, pass in file data
              resolve({id: file.slice(0, 5), text: fileData});
            }
          });
        });
        //push the promise to an array
        promises.push(newPromise);
      });
      //check that all promises in array have evaluated, and when they have, call callback on the values
      Promise.all(promises).then((values) => {
        callback(err, values);
      });
    }
  });
};


exports.readOne = (id, callback) => {
  //fs readfile
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      var result = { 'id': id, text: fileData };
      callback(err, result);
    }
  });
};

//call readOne then on success writeFile, on error call callback
exports.update = (id, text, callback) => {
  exports.readOne(id, (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, text);
        }
      });
    }
  });
};


exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback();
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
