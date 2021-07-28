import { Email } from '@shop/domain/base/valueObjects/Email';
import { DomainError } from '@shop/domain/base/DomainError';

describe('Validate valueObject Email', () => {
  it('should be return a Email Value Object when input a valid e-mail', () => {
    const email = Email.create('validemail@domain.com');
    expect(email).toBeInstanceOf(Email);
    expect((email as Email).value).toEqual('validemail@domain.com');
  });

  it('should be return a DomainError when input a invalid e-mail', () => {
    const email = Email.create('email@gmail');
    expect(email).toBeInstanceOf(DomainError);
  });

  it('should be return true when comparing identical emails', () => {
    const email1 = Email.create('validemail@domain.com');
    const email2 = Email.create('validemail@domain.com');
    expect((email1 as Email).equals(email2 as Email)).toBeTruthy();
  });

  it('should be return true when comparing different emails', () => {
    const email1 = Email.create('validemail@domain.com');
    const email2 = Email.create('othervalidemail@domain.com');
    expect((email1 as Email).equals(email2 as Email)).toBeFalsy();
  });
});
