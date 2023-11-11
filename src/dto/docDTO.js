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
    this.document_id = document_id;
    this.application_id = application_id;
    this.document_name = document_name;
    this.document_type = this.validateDoc(document_type);
  }

  validateDoc(doc) {
    try {
      return DocSchema.parse(doc);
    } catch (e) {
      throw new Error('Invalid document type');
    }
  }
}
