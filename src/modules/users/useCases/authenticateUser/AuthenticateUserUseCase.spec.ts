import { User } from '../../entities/User'
import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'
import { IncorrectEmailOrPasswordError } from './IncorrectEmailOrPasswordError'

let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let fakeUser: User

describe('Authenticate User', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    fakeUser = await createUserUseCase.execute({
      name: 'Name',
      email: 'test@mail.com',
      password: 'password'
    })
  })

  it('should be able to authenticate user', async () => {
    const user = await authenticateUserUseCase.execute({
      email: 'test@mail.com',
      password: 'password'
    })
    expect(user).toHaveProperty('user')
    expect(user.user.name).toBe('Name')
    expect(user.user.email).toBe('test@mail.com')
    expect(user).toHaveProperty('token')
  })

  it('should not be able to authenticate with incorrect email', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'incorrect@mail.com',
        password: 'password'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not be able to authenticate with incorrect password', async () => {
    await expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'test@mail.com',
        password: 'incorrectpassword'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})