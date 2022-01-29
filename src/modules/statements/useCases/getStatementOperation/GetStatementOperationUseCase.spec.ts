import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { GetStatementOperationError } from './GetStatementOperationError'
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let getStatementOperationUseCase: GetStatementOperationUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let userId: string
let statementId: string

describe('Get Statement Operation', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    const user = await inMemoryUsersRepository.create({
      name: 'name',
      email: 'test@mail.com',
      password: 'password'
    })
    userId = user.id || ''
    const statement = await inMemoryStatementsRepository.create({
      user_id: userId,
      amount: 100,
      type: OperationType.DEPOSIT,
      description: 'description'
    })
    statementId = statement.id || ''
  })

  it('should not be able to get statement operation with incorrect user id', async () => {
    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: 'incorrectId',
        statement_id: statementId
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('should not be able to get statement operation with incorrect statement id', async () => {
    await expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: userId,
        statement_id: 'incorrectId'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })

  it('should be able to get statement operation', async () => {
    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: userId,
      statement_id: statementId
    })
    expect(statementOperation.id).toBe(statementId)
    expect(statementOperation.user_id).toBe(userId)
    expect(statementOperation).toHaveProperty('amount')
    expect(statementOperation).toHaveProperty('type')
    expect(statementOperation).toHaveProperty('description')
  })
})