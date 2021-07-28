import { CPF } from '@shop/domain/base/valueObjects/CPF';
import { DomainError } from '@shop/domain/base/DomainError';

describe('Unit tests for valueObject CPF', () => {
  it('should be return a valid CPF', () => {
    let cpf = CPF.create('993.650.270-12');
    expect(cpf).toBeInstanceOf(CPF);
    cpf = CPF.create('99365027012');
    expect(cpf).toBeInstanceOf(CPF);
  });

  it('should be return a DomainError', () => {
    let cpf = CPF.create('test');
    expect(cpf).toBeInstanceOf(DomainError);
    expect((cpf as DomainError).message).toEqual('CPF inválido');
    cpf = CPF.create('31289378922');
    expect(cpf).toBeInstanceOf(DomainError);
    expect((cpf as DomainError).message).toEqual('CPF inválido');
  });

  it('should be return a clear cpf', () => {
    const cpf = CPF.create('993.650.270-12');
    expect((cpf as CPF).value).toEqual('99365027012');
  });
});
