import { ProfileResponse, ResponseMeta } from '../models/profile';
import { LinkedInClient } from '../integrations/linkedinClient';
import { parseProfile } from '../parsers/profileParser';

export class ProfileService {
  private provider = new LinkedInClient();

  public async getProfile(profileUrl: string): Promise<ProfileResponse> {
    const identity = await this.provider.resolveProfile(profileUrl);
    const rawData = await this.provider.getProfileData(identity);
    const profileData = parseProfile(rawData, profileUrl);

    const meta: ResponseMeta = {
      partial: false,
      missingSections: [],
      retrievedAt: new Date().toISOString(),
    };

    const response: ProfileResponse = {
      success: true,
      data: profileData,
      meta: meta,
    };

    return response;
  }
}

export const profileService = new ProfileService();
