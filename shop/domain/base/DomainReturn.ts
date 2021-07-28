import { DomainError } from './DomainError';

export type DomainReturn<T, E extends DomainError = DomainError> = E | T
