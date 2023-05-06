const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;
const pathToFile = path.join(__dirname, 'card-numbers.txt');

createFile();

stdout.write('Enter your credit card number and CVV code. Be sure, it is absolutely safe!\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit()
  };
  writeNewInput(data);
  stdout.write('Thank you! The text was written!\n');
});

process.on('exit', () => stdout.write('Come back with new cards soon, please!'));
process.on('SIGINT', process.exit);


function writeNewInput(inputText) {
  fs.appendFile(pathToFile, inputText, (error) => {
    if (error) return console.error(error.message);
  });
}

function createFile() {
  fs.writeFile(
    path.join(__dirname, 'card-numbers.txt'),
    '',
    (err) => {
      if (err) throw err;
    }
  );
}