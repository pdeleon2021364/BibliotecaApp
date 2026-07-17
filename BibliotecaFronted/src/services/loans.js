import { loansApi } from "./api"

export function createLoan(data) {
  return loansApi.create(data)
}

export function returnBook(data) {
  return loansApi.returnBook(data)
}
