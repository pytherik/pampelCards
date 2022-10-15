const fs = require('fs');

let kartei;
let karray = [];
let cards = [];
let card = {"id": cards.length, "owner": "Erik", "category": "PC-Grundlagen", "question": String, "answer": [], "createdAt": new Date()};
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
          card = {"id": cards.length, "owner": "Erik", "category": "PC-Grundlagen", "question": String, "answer": [], "createdAt": new Date()};
          return;
        }
        card.answer.push(line);
      }
    });
  });  
}

read('kartei_part.txt');


module.exports = cards;

