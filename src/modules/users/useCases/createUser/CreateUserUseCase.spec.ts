import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserError } from './CreateUserError'
import { CreateUserUseCase } from './CreateUserUseCase'

let createUserUseCase: CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe('Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'Name',
      email: 'test@mail.com',
      password: 'password'
    })
    expect(user).toHaveProperty('id')
    expect(user.password).not.toBe('password')
  })

  it('should not be able to create an already exits user', async () => {
    await createUserUseCase.execute({
      name: 'Name',
      email: 'test@mail.com',
      password: 'password'
    })
    await expect(async () => {
      await createUserUseCase.execute({
        name: 'OtherName',
        email: 'test@mail.com',
        password: 'password'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})