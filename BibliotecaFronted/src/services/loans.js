import { loansApi, returnsApi } from "./api"

export function getLoans(params) {
  return loansApi.getAll(params)
}

export function getMyLoans(params) {
  return loansApi.getMyLoans(params)
}

export function createLoan(data) {
  return loansApi.create(data)
}

export function returnBook(data) {
  return returnsApi.create(data)
}
