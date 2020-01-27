const Configstore = require('configstore');
// assign data write location to lib/library.json
const config = new Configstore('library');
config.path = `${__dirname}/library.json`;


class Library {
  constructor(library) {
    this.centralLibrary = library;
    this.addBook = this.addBook.bind(this);
    this.searchAllBooks = this.searchAllBooks.bind(this);
    this.editBook = this.editBook.bind(this);
    this.searchBook = this.searchBook.bind(this);
    this.saveBooks = this.saveBooks.bind(this);
  }

  addBook(newBook) {
    const that = this;
    return new Promise(((resolve) => {
      const id = that.centralLibrary.length + 1;
      newBook.id = id;
      that.centralLibrary.push(newBook);
      resolve(id);
    }));
  }

  searchAllBooks() {
    const that = this;
    return new Promise(((resolve) => {
      resolve(that.centralLibrary);
    }));
  }

  editBook(book) {
    const that = this;
    let target = that.centralLibrary[book.id - 1];
    target = book;
    return new Promise(((resolve) => {
      resolve(target);
    }));
  }

  searchBook(query) {
    const matches = [];
    query = query.toLowerCase();
    const that = this;
    return new Promise(((resolve) => {
      for (const book of that.centralLibrary) {
        if (book.title.toLowerCase().includes(query)) {
          matches.push(book);
        }
      }
      resolve(matches);
    }));
  }

  saveBooks() {
    const that = this;
    config.set('library', that.centralLibrary);
  }
}

module.exports = Library;
