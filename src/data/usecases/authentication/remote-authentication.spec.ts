import { HttpStatusCode } from '@/data/protocols/http'
import { HttpPostClientSpy } from '@/data/test'
import { InvalidCredentialsError, UnexpectedError } from '@/domain/errors'
import { AccountModel } from '@/domain/models'
import { mockAccountModel, mockAuthentication } from '@/domain/test'
import { AuthenticationParams } from '@/domain/usecases'
import faker from 'faker'
import { RemoteAuthentication } from './remote-authentication'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClient: HttpPostClientSpy<AuthenticationParams, AccountModel>
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClient = new HttpPostClientSpy<AuthenticationParams, AccountModel>()
  const sut = new RemoteAuthentication(url, httpPostClient)

  return {
    sut,
    httpPostClient
  }
}

describe('RemoteAuthentication', () => {
  it('should call HttpPostClient with correct URL', async () => {
    const url = faker.internet.url()
    const { sut, httpPostClient } = makeSut(url)
    await sut.auth(mockAuthentication())
    expect(httpPostClient.url).toBe(url)
  })
  it('should call HttpPostClient with correct body', async () => {
    const { sut, httpPostClient } = makeSut()
    const authenticationParams = mockAuthentication()
    await sut.auth(authenticationParams)
    expect(httpPostClient.body).toEqual(authenticationParams)
  })
  it('should throw InvalidCredentialsError if HttpPostClient response 401', async () => {
    const { sut, httpPostClient } = makeSut()
    httpPostClient.response = {
      statusCode: HttpStatusCode.unauthorized
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new InvalidCredentialsError())
  })
  it('should throw UnexpectedError if HttpPostClient response 400', async () => {
    const { sut, httpPostClient } = makeSut()
    httpPostClient.response = {
      statusCode: HttpStatusCode.badRequest
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  it('should throw UnexpectedError if HttpPostClient response 404', async () => {
    const { sut, httpPostClient } = makeSut()
    httpPostClient.response = {
      statusCode: HttpStatusCode.notFound
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  it('should throw UnexpectedError if HttpPostClient response 500', async () => {
    const { sut, httpPostClient } = makeSut()
    httpPostClient.response = {
      statusCode: HttpStatusCode.serverError
    }
    const promise = sut.auth(mockAuthentication())
    await expect(promise).rejects.toThrow(new UnexpectedError())
  })
  it('should return an AccountModel if HttpPostClient response 200', async () => {
    const { sut, httpPostClient } = makeSut()
    const httpResult = mockAccountModel()
    httpPostClient.response = {
      statusCode: HttpStatusCode.ok,
      body: httpResult
    }
    const account = await sut.auth(mockAuthentication())
    expect(account).toEqual(httpResult)
  })
})
