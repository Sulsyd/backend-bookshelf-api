const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);
  const isSuccess = books.some((note) => note.id === id);
  const response = isSuccess
    ? {
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      }
    : {
        status: 'fail',
        message: 'Buku gagal ditambahkan',
      };

  return h.response(response).code(isSuccess ? 201 : 500);
};

const getAllBooksHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks;
  
    if (!name && !reading && !finished) {
      filteredBooks = books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    } else if (name) {
      const nameRegex = new RegExp(name, 'gi');
      filteredBooks = books.filter((book) => nameRegex.test(book.name));
    } else if (reading !== undefined) {
      filteredBooks = books.filter((book) => Number(book.reading) === Number(reading));
    } else {
      filteredBooks = books.filter((book) => Number(book.finished) === Number(finished));
    }

    return h
      .response({
        status: 'success',
        data: {
          books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      })
      .code(200);
};
  

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((n) => n.id === bookId)[0]; // find book by id

  if (book) {
    return h
      .response({
        status: 'success',
        data: {
          book,
        },
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
  }

  const finished = pageCount === readPage;
  const updatedAt = new Date().toISOString();
  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt,
    };

    return h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    })
    .code(404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((note) => note.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
  }

  return h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
