import React from 'react'
import { render, RenderResult, fireEvent, cleanup } from '@testing-library/react'
import Login from './login'
import faker from 'faker'
import { Validation } from '@/presentation/protocols/validation'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
}

class ValidationSpy implements Validation {
  errorMessage: string
  input: object

  validate(input: object): string {
    this.input = input
    return this.errorMessage
  }
}

const makesut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const sut = render(<Login validation={validationSpy} />)
  return {
    sut,
    validationSpy
  }
}
describe('Login Component', () => {
  afterEach(cleanup)
  test('Should start with initial state', () => {
    const { sut } = makesut()
    const errorWrap = sut.getByTestId('error-wrap')
    const submitButton = sut.getByTestId('submit') as HTMLButtonElement
    const emailStatus = sut.getByTestId('email-status')
    const passwordStatus = sut.getByTestId('password-status')
    expect(errorWrap.childElementCount).toBe(0)
    expect(submitButton.disabled).toBeTruthy()
    expect(emailStatus.title).toBe('Campo obrigatório')
    expect(passwordStatus.title).toBe('Campo obrigatório')
    expect(emailStatus.textContent).toBe('🔴')
    expect(passwordStatus.textContent).toBe('🔴')
  })
  test('Should call Validation with correct email value', () => {
    const { sut, validationSpy } = makesut()
    const mockedEmail = faker.internet.email()
    const emailInput = sut.getByTestId('email')
    fireEvent.input(emailInput, { target: { value: mockedEmail } })
    expect(validationSpy.input).toEqual({
      email: mockedEmail
    })
  })
  test('Should call Validation with correct password value', () => {
    const { sut, validationSpy } = makesut()
    const mockedPassword = faker.datatype.uuid()
    const passwordInput = sut.getByTestId('password')
    fireEvent.input(passwordInput, { target: { value: mockedPassword } })
    expect(validationSpy.input).toEqual({
      password: mockedPassword
    })
  })
})
