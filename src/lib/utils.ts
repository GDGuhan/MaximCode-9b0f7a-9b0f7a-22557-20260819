import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getSkillsForDomain } from "@/constants";
import type { GeneratedDocumentData, InternshipFormData } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `MC-${year}-${randomNum}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function calculateDuration(startDate: string, endDate: string): string {
  if (!startDate || !endDate) return '';
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths >= 1) {
    return diffMonths === 1 ? '1 Month' : `${diffMonths} Months`;
  } else if (diffWeeks >= 1) {
    return diffWeeks === 1 ? '1 Week' : `${diffWeeks} Weeks`;
  } else {
    return diffDays === 1 ? '1 Day' : `${diffDays} Days`;
  }
}

export function generateDocumentData(formData: InternshipFormData): GeneratedDocumentData {
  const certId = generateCertificateId();
  const docData: GeneratedDocumentData = {
    ...formData,
    certificateId: certId,
    issueDate: getCurrentDate(),
    skills: getSkillsForDomain(formData.domain),
    verificationUrl: `https://maximcode.app/verify/${certId}`,
    duration: calculateDuration(formData.startDate, formData.endDate),
  };
  // Persist to localStorage by certId for verification page lookup
  try {
    localStorage.setItem(`mc_cert_${certId}`, JSON.stringify(docData));
  } catch { /* ignore storage errors */ }
  return docData;
}

export function generateCertificateDescription(data: GeneratedDocumentData): string {
  return `This certificate is proudly awarded to ${data.name} for successfully completing the ${data.internship} internship in the domain of ${data.domain} at Maxim Code, from ${formatDate(data.startDate)} to ${formatDate(data.endDate)}. During this period, the candidate demonstrated exceptional dedication, professionalism, technical excellence, and a strong commitment to learning. Their hard work and passion for growth have been an asset to our team, and we commend their significant contributions during this internship journey.`;
}
