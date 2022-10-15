const fs = require('fs');

let kartei;
let karray = [];
let cards = [];
let card = {"question": String, "answer": []};
let nl = false;

function read(file) {
  
  fs.readFile(file, 'utf-8', (err, data) => {   
    kartei = data.split('\n');

    kartei.forEach((line, i) => {
      if (nl && line ==='') return;
      karray.push(line);
      nl = line==='' ? true : false;
    })
    nl = false;
    karray.forEach((line, i) => {
      if (!nl) {
        if (line === '') {
          nl = !nl;
          return;
        }
        card.question = line;
      } else {
        if (line === '') {
          nl = !nl;
          cards.push(card);
          card = {"question": [], "answer": [] }
          return;
        }
        card.answer.push(line);
      }
    });
  });  
}

read('karteikarten.txt')


module.exports = cards;

