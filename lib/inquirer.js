// require dependency for terminal prompting
const inquirer = require('inquirer');
const Library = require('./library.js');
// require dependency for writing to disk
const Configstore = require('configstore');
const config = new Configstore('library');
config.path = `${__dirname}/library.json`;
// require prompts for terminal
const {
  mainMenuPrompts, viewAllPrompt1, viewAllPrompt2,
  addBookPrompt1, addBookPrompt2, addBookPrompt3,
  editBookNone, editBookPrompt1, editBookPrompt2, editBookPrompt3, editBookPrompt4,
  searchPrompt1, searchPrompt2, searchPrompt3,
  errorSearchPrompt1, errorSearchPrompt2, saveAndExitPrompts,
} = require('../db/prompts.js');

let library;

const buildLibrary = () => {
  if (config.get('library')) {
    return (config.get('library'));
  }
  return ([]);
};

const mainMenu = () => {
  library = new Library(buildLibrary());
  mainSelections();
};

const mainSelections = () => {
  inquirer.prompt(mainMenuPrompts).then((answer) => {
    switch (answer.main) {
      case '1) view all books':
        return viewAllBooks();
      case '2) add a book':
        return addBooks();
      case '3) edit a book':
        return editBook();
      case '4) search for a book':
        return searchForBook();
      case '5) save and exit':
        return saveAndExit();
    }
  });
};

const viewErrorMessage = () => inquirer.prompt(errorSearchPrompt1)
  .then(({ donkeykong }) => {
    if (donkeykong.trim() === 'y' || donkeykong.trim() === 'yes') {
      inquirer.prompt(errorSearchPrompt2)
        .then(() => mainSelections());
    } else {
      mainSelections();
    }
  });

const viewAllBooks = () => {
  let allBooks;
  library.searchAllBooks(library.centralLibrary)
    .then((records) => {
      allBooks = records;
      inquirer.prompt(viewAllPrompt1(records, allBooks.length)).then(({ viewAll1 }) => {
        const viewAllBooksLoop = (input) => {
          inquirer.prompt(viewAllPrompt2(allBooks[input - 1], allBooks.length)).then(({ viewAll2 }) => {
            if (!viewAll2) {
              mainSelections();
            } else {
              viewAllBooksLoop(viewAll2);
            }
          });
        };
        if (!viewAll1.trim()) {
          mainSelections();
        } else {
          viewAllBooksLoop(viewAll1);
        }
      });
    });
};

const addBooks = () => {
  const newBook = {};
  inquirer.prompt(addBookPrompt1).then(({ addBook1 }) => {
    newBook.title = addBook1;
  }).then(() => inquirer.prompt(addBookPrompt2)).then(({ addBook2 }) => {
    newBook.author = addBook2;
  })
    .then(() => inquirer.prompt(addBookPrompt3))
    .then(({ addBook3 }) => {
      newBook.description = addBook3;
    })
    .then(() => library.addBook(newBook))
    .then((id) => {
      console.log(`\nBook [${id}] has been saved.`);
      mainSelections();
    });
};

const editBook = () => {
  const editBookLoop = () => {
    let targetBook = {};
    const currentLibrary = library.centralLibrary;
    if (currentLibrary.length === 0) {
      inquirer.prompt(editBookNone)
        .then(() => mainSelections());
    } else {
      inquirer.prompt(editBookPrompt1(currentLibrary))
        .then(({ editBook1 }) => {
          targetBook = currentLibrary[editBook1 - 1];
          if (!editBook1.trim()) {
            mainSelections();
          } else {
            inquirer.prompt(editBookPrompt2(targetBook))
              .then(({ editBook2 }) => {
                if (editBook2.trim()) {
                  targetBook.title = editBook2;
                }
              })
              .then(() => inquirer.prompt(editBookPrompt3(targetBook)))
              .then(({ editBook3 }) => {
                if (editBook3.trim()) {
                  targetBook.author = editBook3;
                }
              })
              .then(() => inquirer.prompt(editBookPrompt4(targetBook)))
              .then(({ editBook4 }) => {
                if (editBook4.trim()) {
                  targetBook.description = editBook4;
                }
              })
              .then(() => library.editBook(targetBook))
              .then((selectedBook) => {
                console.log(`book [${selectedBook.id}] has been saved.`);
                mainSelections();
              });
          }
        });
    }
  };
  editBookLoop();
};

const searchForBook = () => {
  const results = {};
  const listResults = [];
  inquirer.prompt(searchPrompt1)
    .then(({ search }) => library.searchBook(search))
    .then((matches) => {
      for (const match of matches) {
        results[match.id] = match;
        listResults.push(match);
      }
      if (!listResults.length) {
        viewErrorMessage();
      } else {
        inquirer.prompt(searchPrompt2(listResults))
          .then(({ search2 }) => {
            if (!search2.trim()) {
              mainSelections();
            } else {
              const loop = (input) => {
                inquirer.prompt(searchPrompt3(results[input], results))
                  .then(({ search3 }) => {
                    if (!search3.trim()) {
                      mainSelections();
                    } else {
                      loop(search3);
                    }
                  });
              };
              inquirer.prompt(searchPrompt3(results[search2], results)).then(({ search3 }) => {
                if (!search3.trim()) {
                  mainSelections();
                } else {
                  loop(search3);
                }
              });
            }
          });
      }
    });
};

const saveAndExit = () => {
  library.saveBooks();
  inquirer.prompt(saveAndExitPrompts).then(() => process.exit(0));
};

module.exports = {
  mainMenu,
};
