import { InMemoryUsersRepository } from '../../repositories/in-memory/InMemoryUsersRepository'
import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ShowUserProfileError } from './ShowUserProfileError'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let showUserProfileUseCase: ShowUserProfileUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let userId: string

describe('Show User Profile', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    const user = await createUserUseCase.execute({
      name: 'Name',
      email: 'test@mail.com',
      password: 'password'
    })
    userId = user.id || ''
  })

  it('should be able to show user profile', async () => {
    const user = await showUserProfileUseCase.execute(userId)
    expect(user.name).toBe('Name')
    expect(user.email).toBe('test@mail.com')
  })

  it('should not be able to show user profile with incorrect id', async () => {
    await expect(async () => {
      await showUserProfileUseCase.execute('incorrectId')
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })
})