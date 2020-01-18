import { UALError, UALErrorType } from 'universal-authenticator-library'

export class UALSimpleWalletError extends UALError {
  constructor(message: string, type: UALErrorType, cause: Error | null) {
    super(message, type, cause, "SimpleWallet")
  }
}
