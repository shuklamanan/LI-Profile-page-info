export interface Location {
  raw?: string;
  city?: string;
  region?: string;
  country?: string;
}

export interface ProfileImage {
  url?: string;
}

export interface Experience {
  title?: string;
  company?: string;
  companyUrl?: string;
  location?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export interface Education {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  name?: string;
  issuer?: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
}

export interface Language {
  name?: string;
  proficiency?: string;
}

export interface ProfileData {
  id?: string;
  url?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  headline?: string;
  location?: Location;
  about?: string;
  profileImage?: ProfileImage;
  experience?: Experience[];
  education?: Education[];
  skills?: string[];
  certifications?: Certification[];
  languages?: Language[];
}

export interface ResponseMeta {
  partial: boolean;
  missingSections: string[];
  retrievedAt: string;
}

export interface ProfileResponse {
  success: boolean;
  data: ProfileData | null;
  meta: ResponseMeta | null;
}

export interface HealthResponse {
  status: string;
}

export interface ApiError {
  code?: string;
  message: string;
}
