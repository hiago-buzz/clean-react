import { HttpPostParams } from '@/data/protocols/http'
import axios from 'axios'
import faker from 'faker'
import { AxiosHttpClient } from './axios-http-client'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
const mockeAxiosResult = {
  data: faker.random.objectElement(),
  status: faker.random.number()
}
mockedAxios.post.mockResolvedValue(mockeAxiosResult)

const makeSut = (): AxiosHttpClient => {
  return new AxiosHttpClient()
}

const mockPostRequest = (): HttpPostParams<any> => ({
  url: faker.internet.url(),
  body: faker.random.objectElement()
})

describe('AxiosHttpClient', () => {
  it('should call axios with correct values', async () => {
    const request = mockPostRequest()
    const sut = makeSut()
    await sut.post(request)

    expect(mockedAxios.post).toHaveBeenCalledWith(request.url, request.body)
  })
  it('should return corret statusCode and body', async () => {
    const sut = makeSut()
    const httpResponse = await sut.post(mockPostRequest())

    expect(httpResponse).toEqual({
      body: mockeAxiosResult.data,
      statusCode: mockeAxiosResult.status
    })
  })
})
