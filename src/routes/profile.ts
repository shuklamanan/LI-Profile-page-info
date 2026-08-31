import { Router, Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profileService';

const router = Router();
router.post(
  '/',
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const profileUrl = req.body.profileUrl || req.body.profile_url;

      if (!profileUrl) {
        res.status(400).json({
          error: {
            code: 'INVALID_PROFILE_URL',
            message: 'LinkedIn profile URL is required.',
          },
        });
        return;
      }

      const response = await profileService.getProfile(profileUrl);
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
