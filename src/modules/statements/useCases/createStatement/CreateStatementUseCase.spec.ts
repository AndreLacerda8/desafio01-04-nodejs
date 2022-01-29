import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { CreateStatementError } from './CreateStatementError'
import { CreateStatementUseCase } from './CreateStatementUseCase'

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let createStatementUseCase: CreateStatementUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let userId: string

describe('Create Statement', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository)
    const user = await inMemoryUsersRepository.create({
      name: 'Name',
      email: 'test@mail.com',
      password: 'password'
    })
    userId = user.id || ''
  })

  it('should not be able to create statment with incorrect user id', async () => {
    await expect(async () => {
      await createStatementUseCase.execute({ user_id: 'incorrectId', type: OperationType.DEPOSIT, amount: 0, description: ''  })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
  })

  it('should not be able to create statement when type is withdraw and balance < amount', async () => {
    await expect(async () => {
      await createStatementUseCase.execute({ user_id: userId, type: OperationType.WITHDRAW, amount: 100, description: ''  })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  })

  it('should be able to create statement', async () => {
    const statementDeposit = await createStatementUseCase.execute({ user_id: userId, type: OperationType.DEPOSIT, amount: 100, description: 'Description'  })
    const statementWithDraw = await createStatementUseCase.execute({ user_id: userId, type: OperationType.WITHDRAW, amount: 50, description: 'Description'  })

    expect(statementDeposit).toHaveProperty('id')
    expect(statementWithDraw).toHaveProperty('id')
    expect(statementDeposit.type).toBe('deposit')
    expect(statementWithDraw.type).toBe('withdraw')
    expect(statementDeposit.amount).toBe(100)
    expect(statementWithDraw.amount).toBe(50)
  })
})