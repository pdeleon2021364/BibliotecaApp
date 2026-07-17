import { loansApi } from "./api"

export function getAllLoans(params) {
  return loansApi.getAll(params)
}

export function getMyLoans(params) {
  return loansApi.getMyLoans(params)
}

export function createLoan(data) {
  return loansApi.create(data)
}

export function returnBook(data) {
  return loansApi.returnBook(data)
}
