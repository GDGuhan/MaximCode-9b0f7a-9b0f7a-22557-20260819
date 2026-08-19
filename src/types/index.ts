export interface InternshipFormData {
  name: string;
  domain: string;
  role: string;
  internship: string;
  startDate: string;
  endDate: string;
}

export interface GeneratedDocumentData extends InternshipFormData {
  certificateId: string;
  issueDate: string;
  skills: string[];
  verificationUrl: string;
  duration: string;
}

export type DocumentType = 'certificate' | 'offer-letter';
