const fs = require('fs');




fs.readFile('/home/eb/BBQ/karteikarten.txt', 'utf8', (err, data) => {
  if (err) {
    console.log(err);
  } else {
    console.log(data);
  }
});