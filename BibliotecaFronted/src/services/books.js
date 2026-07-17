import { booksApi } from "./api"

export function getBooks(search) {
  return booksApi.getAll(search)
}

export function getBook(id) {
  return booksApi.getById(id)
}

export function createBook(data) {
  return booksApi.create(data)
}

export function updateBook(id, data) {
  return booksApi.update(id, data)
}

export function deleteBook(id) {
  return booksApi.delete(id)
}
