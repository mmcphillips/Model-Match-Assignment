const { donkeyKong } = require('../db/dk.js');

const mainMenuPrompts = {
  type: 'list',
  name: 'main',
  message: '==== Book Manager ====',
  choices: ['1) view all books', '2) add a book', '3) edit a book', '4) search for a book', '5) save and exit'],
};

const viewAllPrompt1 = (books) => {
  let message = '==== Results ==== \n\n';
  for (let i = 0; i < books.length; i += 1) {
    message += `${i + 1}) ${books[i].title} \n`;
  }
  message += '\nTo view a book\'s details, enter the book ID, or enter to return.\nEnter Book ID:';
  return {
    type: 'input',
    name: 'viewAll1',
    message,
    validate(input) {
      if (input.trim() === '') {
        return true;
      }
      if (input >= 1 && input <= books.length) {
        return true;
      }
      return 'Sorry, the ID you\'ve provided doesn\'t exist. Please try again.';
    },
  };
};

const viewAllPrompt2 = (book, length) => {
  let message = 'Results: \n';
  message += `ID: ${book.id} \nTitle: ${book.title} \nAuthor: ${book.author}\nDescription: ${book.description} \nTo view details enter the book ID, to return press enter`;
  return {
    name: 'viewAll2',
    type: 'input',
    message,
    validate(input) {
      if (input.trim() === '') {
        return true;
      }
      if (input >= 1 && input <= length) {
        return true;
      }
      return 'Sorry, the ID you\'ve provided doesn\'t exist. Please try again.';
    },
  };
};


const addBookPrompt1 = {
  type: 'input',
  name: 'addBook1',
  message: 'Whats the title of our new addition?\nEnter Title:',
  validate(input){
    if (input.trim()){
      return true;
    }
    return "Please enter a title."
  }
};
const addBookPrompt2 = {
  type: 'input',
  name: 'addBook2',
  message: 'Who\'s the author?\nEnter Author:',
  validate(input){
    if (input.trim()){
      return true;
    }
      return 'Please enter an Author.'
  }
};
const addBookPrompt3 = {
  type: 'input',
  name: 'addBook3',
  message: 'What\'s the book about?\nEnter Description:',
  validate(input){
    if (input.trim()){
      return true;
    }
      return 'Please enter a description.'
  }
};

const editBookNone = {
  message: 'There are no books to edit. Press enter to return.',
  type: 'input',
  name: 'editNone',
};

const editBookPrompt1 = (books) => {
  let message = '==== Edit a Book ====\n';
  for (let i = 0; i < books.length; i += 1) {
    message += `${i + 1}) ${books[i].title} \n`;
  }
  message += 'Enter the book ID you want to edit, or press enter to return.';
  return {
    type: 'input',
    name: 'editBook1',
    message,
    validate(input) {
      if (!input.trim()) {
        return true;
      }
      if (input >= 1 && input <= books.length) {
        return true;
      }
      return 'Please a book by id or press enter to return.';
    },
  };
};

const editBookPrompt2 = (book) => {
  let message = 'Edit the following information. To keep as is, hit enter\n';
  message += `\nTitle [${book.title}]:`;
  return {
    type: 'input',
    name: 'editBook2',
    message,
  };
};

const editBookPrompt3 = (book) => {
  const message = `Author [${book.author}]:`;
  return {
    type: 'input',
    name: 'editBook3',
    message,
  };
};

const editBookPrompt4 = (book) => {
  const message = `Description [${book.description}]:`;
  return {
    type: 'input',
    name: 'editBook4',
    message,
  };
};

const searchPrompt1 = {
  type: 'input',
  name: 'search',
  message: '==== Search ====\n\nType in one or more keywords to search for and we\'ll check against our list of book titles.\nSearch:',
};

const searchPrompt2 = (books) => {
  let message = '==== Results ==== \n\n';
  const idList = {};
  for (const book of books) {
    idList[book.id] = true;
    message += `[${book.id}] ${book.title} \n`;
  }
  message += 'To view book details, enter ID. To return press enter';
  return {
    name: 'search2',
    type: 'input',
    message,
    validate(input) {
      if (input.trim() === '') {
        return true;
      }
      if (idList[input]) {
        return true;
      }
      return 'I\'m afraid we don\'t have a book with that ID.\nCould you try entering a different id?';
    },
  };
};

const searchPrompt3 = (book, results) => {
  let message = 'Results: \n';
  message += `ID: ${book.id} \nTitle: ${book.title} \nAuthor: ${book.author}\nDescription: ${book.description} \nTo view details enter the book ID, to return press enter`;
  return {
    name: 'search3',
    type: 'input',
    message,
    validate(input) {
      if (!input.trim()) {
        return true;
      }
      if (results[input]) {
        return true;
      }
      return 'Please select an id from the list';
    },
  };
};

const errorSearchPrompt1 = {
  type: 'boolean',
  name: 'donkeykong',
  message: 'We couldn\'t find the book you were looking for \nDid you mean donkey Kong? (y/n)',
  validate(input) {
    input = input.trim();
    if (input === 'y' || input === 'yes' || input === 'n' || input === 'no') {
      return true;
    }
    return 'Please answer with yes or no';
  },
};

const errorSearchPrompt2 = {
  name: 'donkeyKong',
  message: donkeyKong,
};

const saveAndExitPrompts = {
  name: 'goodbye',
  message: 'The library has been saved, goodbye :)',
};

module.exports = {
  mainMenuPrompts,
  viewAllPrompt1,
  viewAllPrompt2,
  editBookNone,
  editBookPrompt1,
  editBookPrompt2,
  editBookPrompt3,
  editBookPrompt4,
  searchPrompt1,
  searchPrompt2,
  searchPrompt3,
  errorSearchPrompt1,
  errorSearchPrompt2,
  saveAndExitPrompts,
  addBookPrompt1,
  addBookPrompt2,
  addBookPrompt3,
};
