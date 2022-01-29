import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'
import { GetBalanceError } from './GetBalanceError'
import { GetBalanceUseCase } from './GetBalanceUseCase'

let getBalanceUsecase: GetBalanceUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let userId: string

describe('Get Balance', () => {
  beforeEach(async () => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    getBalanceUsecase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository)
    const user = await inMemoryUsersRepository.create({
      name: 'Name',
      email: 'test@mail.com',
      password: 'password'
    })
    userId = user.id || ''
  })

  it('should be able to get balance', async () => {
    const balance = await getBalanceUsecase.execute({ user_id: userId })
    expect(balance).toHaveProperty('statement')
    expect(balance).toHaveProperty('balance')
  })

  it('should not be able to get balance with incorrect user id', async () => {
    await expect(async () => {
      await getBalanceUsecase.execute({ user_id: 'incorrectId' })
    }).rejects.toBeInstanceOf(GetBalanceError)
  })
})