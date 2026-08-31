import { ProfileData, Experience, Education, Certification, Language } from '../models/profile';
import { normalizeDate, deduplicateSkills } from './normalizer';

function getLocalized(fieldName: string, block: any): string | undefined {
  const val = block[fieldName];
  if (typeof val === 'string' && val.trim()) {
    return val;
  }

  const multiKey = `multiLocale${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}`;
  const multiVal = block[multiKey];

  if (multiVal && typeof multiVal === 'object') {
    for (const locale of ['en_US', 'en']) {
      if (typeof multiVal[locale] === 'string' && multiVal[locale].trim()) {
        return multiVal[locale];
      }
    }
    for (const key of Object.keys(multiVal)) {
      if (typeof multiVal[key] === 'string' && multiVal[key].trim()) {
        return multiVal[key];
      }
    }
  }

  return undefined;
}

export function parseProfile(rawData: any, url: string): ProfileData {
  const elements = rawData.elements || [];
  const profileBlock = Array.isArray(elements) && elements.length > 0 ? elements[0] : rawData;

  const urlParts = url.replace(/\/$/, '').split('/');
  const publicId = urlParts[urlParts.length - 1] || 'user';

  const firstName = getLocalized('firstName', profileBlock) || '';
  const lastName = getLocalized('lastName', profileBlock) || '';
  let fullName = `${firstName} ${lastName}`.trim();
  
  if (!fullName) {
    fullName = profileBlock.name || profileBlock.fullName || publicId;
  }

  const headline = getLocalized('headline', profileBlock);
  const about = getLocalized('summary', profileBlock) || profileBlock.about;

  const locName = getLocalized('geoLocationName', profileBlock) || getLocalized('locationName', profileBlock);
  let location = undefined;
  if (locName) {
    const parts = locName.split(',').map((p: string) => p.trim());
    location = {
      raw: locName,
      city: parts[0] || undefined,
      region: parts[1] || undefined,
      country: parts[parts.length - 1] || undefined,
    };
  }

  const included = rawData.included || [];

  const experiences: Experience[] = [];
  const expSource = included.filter((item: any) => typeof item.$type === 'string' && item.$type.includes('Position'));
  for (const exp of expSource) {
    let companyName = exp.companyName;
    if (!companyName && exp.company && typeof exp.company === 'object') {
      companyName = exp.company.name || exp.company.companyName;
    }

    const timePeriod = exp.timePeriod || {};
    const startDate = normalizeDate(timePeriod.startDate);
    const endDate = normalizeDate(timePeriod.endDate);

    experiences.push({
      title: exp.title || undefined,
      company: companyName || undefined,
      companyUrl: exp.companyUrl || undefined,
      location: exp.locationName || exp.location || undefined,
      employmentType: exp.employmentType || undefined,
      startDate: startDate,
      endDate: endDate,
      description: exp.description || undefined,
    });
  }

  const educations: Education[] = [];
  const eduSource = included.filter((item: any) => typeof item.$type === 'string' && item.$type.includes('Education'));
  for (const edu of eduSource) {
    let schoolName = edu.schoolName;
    if (!schoolName && edu.school && typeof edu.school === 'object') {
      schoolName = edu.school.name || edu.school.schoolName;
    }

    const timePeriod = edu.timePeriod || {};
    const startDate = normalizeDate(timePeriod.startDate);
    const endDate = normalizeDate(timePeriod.endDate);

    educations.push({
      institution: schoolName || undefined,
      degree: edu.degreeName || edu.degree || undefined,
      fieldOfStudy: edu.fieldOfStudy || undefined,
      startDate: startDate,
      endDate: endDate,
    });
  }

  const skillSource = included.filter((item: any) => typeof item.$type === 'string' && item.$type.includes('Skill'));
  const rawSkills: string[] = skillSource.map((sk: any) => sk.name || '');
  const skills = deduplicateSkills(rawSkills);

  const certifications: Certification[] = [];
  const certSource = included.filter((item: any) => typeof item.$type === 'string' && item.$type.includes('Certification'));
  for (const cert of certSource) {
    const timePeriod = cert.timePeriod || {};
    const issueDate = normalizeDate(timePeriod.startDate);
    const expirationDate = normalizeDate(timePeriod.endDate);

    certifications.push({
      name: cert.name || undefined,
      issuer: cert.authority || undefined,
      issueDate: issueDate,
      expirationDate: expirationDate,
      credentialId: cert.licenseNumber || undefined,
    });
  }

  const languages: Language[] = [];
  const langSource = included.filter((item: any) => typeof item.$type === 'string' && item.$type.includes('Language'));
  for (const lang of langSource) {
    languages.push({
      name: lang.name || lang.language || undefined,
      proficiency: lang.proficiency || undefined,
    });
  }

  return {
    id: profileBlock.slug || publicId,
    url: url,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    name: fullName || undefined,
    headline: headline || undefined,
    location: location,
    about: about || undefined,
    experience: experiences,
    education: educations,
    skills: skills,
    certifications: certifications.length > 0 ? certifications : undefined,
    languages: languages.length > 0 ? languages : undefined,
  };
}
