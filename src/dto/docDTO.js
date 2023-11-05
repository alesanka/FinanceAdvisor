import { z } from 'zod';

const DocSchema = z.enum([
  'passport',
  'student_verification',
  'business_plan',
  'purchase_agreement',
]);

export class DocDTO {
  constructor(
    document_id = null,
    application_id,
    document_name,
    document_type
  ) {
    this._document_id = document_id;
    this._application_id = application_id;
    this._document_name = document_name;
    this._document_type = this.validateDoc(document_type);
  }

  validateDoc(doc) {
    try {
      return DocSchema.parse(doc);
    } catch (e) {
      throw new Error('Invalid document type');
    }
  }

  get document_id() {
    return this._document_id;
  }

  get application_id() {
    return this._application_id;
  }

  get document_name() {
    return this._document_name;
  }

  get document_type() {
    return this._document_type;
  }

  set document_id(value) {
    this._document_id = value;
  }

  set document_name(value) {
    this._document_name = value;
  }

  set application_id(value) {
    this._application_id = value;
  }

  set document_type(value) {
    this._document_type = this.validateDoc(value);
  }
}
