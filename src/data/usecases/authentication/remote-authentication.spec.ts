import faker from 'faker'
import { mockAuthentication } from '../../../domain/test/mock-authentication'
import { HttpPostClientSpy } from '../../test/mock-http-client'
import { RemoteAuthentication } from './remote-authentication'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClient: HttpPostClientSpy
}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
  const httpPostClient = new HttpPostClientSpy()
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
})
