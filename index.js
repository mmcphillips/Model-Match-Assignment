const { mainMenu } = require('./lib/inquirer');

const Configstore = require('configstore');
const config = new Configstore('library');
config.path = `${__dirname}/lib/library.json`;

const populateLibrary = () => new Promise(((resolve) => {
  if (config.get('library')) {
    resolve(config.get('library'));
  } else {
    resolve([]);
  }
}));

const run = () => {
  populateLibrary().then((library) => {
    mainMenu(library);
  });
};

run();
