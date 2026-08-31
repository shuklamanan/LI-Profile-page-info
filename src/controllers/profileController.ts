import { Request, Response } from 'express';
import { ProfileService } from '../services/profileService';

const profileService = new ProfileService();

export class ProfileController {
  /**
   * Endpoint handler for fetching profile details
   * HTTP GET /api/profile?url=https://www.linkedin.com/in/...
   * Query: url
   */
  public async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const url = req.query.url as string;

      if (!url) {
        res.status(400).json({ error: 'LinkedIn profile URL is required.' });
        return;
      }

      // Basic regex check for linkedin profile URLs
      const linkedInUrlRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?$/;
      if (!linkedInUrlRegex.test(url)) {
        res.status(400).json({ error: 'Invalid LinkedIn profile URL format.' });
        return;
      }

      const profile = await profileService.getProfile(url);
      res.status(200).json(profile);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Internal server error occurred while retrieving profile.' });
    }
  }
}
