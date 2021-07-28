import { CompleteName } from '@shop/domain/base/valueObjects/CompleteName';
import { DomainError } from '@shop/domain/base/DomainError';

describe('Unit test for valueObject CompleteName', () => {
  it('should be return a CompleteName Value Object when input a valid complete name', () => {
    const name = CompleteName.create('joao da silva');
    expect(name).toBeInstanceOf(CompleteName);
    expect((name as CompleteName).value).toEqual('Joao da Silva');
  });

  it('should be return a DomainError when input a invalid complete name', () => {
    const name = CompleteName.create('joao');
    expect(name).toBeInstanceOf(DomainError);
  });

  it('should be return true when comparing identical complete names', () => {
    const name1 = CompleteName.create('joao da silva');
    const name2 = CompleteName.create('joao da silva');
    expect((name1 as CompleteName).equals(name2 as CompleteName)).toBeTruthy();
  });

  it('should be return true when comparing different complete names', () => {
    const name1 = CompleteName.create('joao da silva');
    const name2 = CompleteName.create('joao da silva santos');
    expect((name1 as CompleteName).equals(name2 as CompleteName)).toBeFalsy();
  });
});
