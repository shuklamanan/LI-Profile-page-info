import { settings } from '../core/config';
import {
  InvalidProfileUrlError,
  UpstreamAuthenticationError,
  ProfileNotFoundError,
  UpstreamRateLimitError,
  UpstreamUnavailableError
} from '../core/exceptions';

export interface ProfileIdentity {
  rawUrl: string;
  slug: string;
}

export class LinkedInClient {
  private getHeaders(): Record<string, string> {
    const rawCookie = (settings.linkedinSessionCookie || '').replace(/^"""|"""$/g, '').trim();
    const rawCsrf = (settings.linkedinCsrfToken || '').replace(/^"|"$/g, '').trim();

    let fullCookie = rawCookie;
    if (fullCookie) {
      if (!fullCookie.includes('li_at=')) {
        fullCookie = `li_at=${fullCookie}`;
      }
      if (rawCsrf && !fullCookie.includes('JSESSIONID=')) {
        fullCookie += `; JSESSIONID="${rawCsrf}"`;
      }
    }

    return {
      'User-Agent': settings.linkedinUserAgent,
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': fullCookie,
      'Csrf-Token': rawCsrf,
      'X-RestLi-Protocol-Version': '2.0.0',
    };
  }

  public async resolveProfile(profileUrl: string): Promise<ProfileIdentity> {
    const pattern = /^https?:\/\/(www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_%]+)\/?$/i;
    const match = profileUrl.match(pattern);
    if (!match) {
      throw new InvalidProfileUrlError();
    }
    const slug = match[2];
    return { rawUrl: profileUrl, slug };
  }

  public async getProfileData(identity: ProfileIdentity): Promise<any> {
    const url = `https://www.linkedin.com/voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=${identity.slug}`;

    if (!settings.linkedinSessionCookie || !settings.linkedinCsrfToken) {
      throw new UpstreamAuthenticationError(
        'LinkedIn credentials (COOKIE and CSRF_TOKEN) are missing in backend .env. Please configure a valid li_at session cookie and JSESSIONID token.'
      );
    }

    const headers = this.getHeaders();
    console.log(`Initiating direct GET request to LinkedIn Dash API: ${url}`);
    console.log(`Headers: Cookie present: ${Boolean(headers.Cookie)}, Csrf-Token present: ${Boolean(headers['Csrf-Token'])}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        redirect: 'manual'
      });

      if (response.status === 302 || response.status === 301) {
        throw new UpstreamAuthenticationError(`LinkedIn redirected the request. Your session cookie (li_at/JSESSIONID) is likely invalid or expired. Response status: ${response.status}`);
      }

      if (response.status === 401 || response.status === 403) {
        throw new UpstreamAuthenticationError("LinkedIn session authentication expired or invalid.");
      }

      if (response.status === 404) {
        throw new ProfileNotFoundError(`LinkedIn profile with identifier '${identity.slug}' not found.`);
      }

      if (response.status === 429) {
        throw new UpstreamRateLimitError("LinkedIn rate limits reached.");
      }

      if (!response.ok) {
        throw new UpstreamUnavailableError(`LinkedIn request failed with status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error?.code && error.code.startsWith('UPSTREAM_') || error.code === 'PROFILE_NOT_FOUND') {
        throw error;
      }
      console.error(`HTTP communication error: ${error?.message || error}`);
      throw new UpstreamUnavailableError(`Network error communicating with LinkedIn: ${error?.message || error}`);
    }
  }
}
