export class DomainError extends Error {
  constructor(message: string, public errorsDetail?: DomainError[]) {
    super(message);
  }
}
