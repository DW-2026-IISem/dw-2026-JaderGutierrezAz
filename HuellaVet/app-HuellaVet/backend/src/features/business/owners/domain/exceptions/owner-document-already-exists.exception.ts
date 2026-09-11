import { DomainException } from '../../../../../common/exceptions/domain.exception.js';

export class OwnerDocumentAlreadyExistsException extends DomainException {
  constructor(documentNumber: string) {
    super(`El documento '${documentNumber}' ya está registrado`);
  }
}
