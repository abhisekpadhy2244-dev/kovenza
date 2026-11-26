import { Router } from 'express';
import {
  getFormOptions,
  submitBrandEnquiry,
  submitCreatorApplication,
} from '../controllers/publicController';
import { formLimiter } from '../middleware/rateLimit';
import { singleUpload } from '../middleware/upload';

export const publicRouter = Router();

publicRouter.get('/form-options', getFormOptions);

publicRouter.post('/brand-enquiries', formLimiter, submitBrandEnquiry);

// multipart/form-data: the optional media kit arrives in the "mediaKit" field.
publicRouter.post(
  '/creator-applications',
  formLimiter,
  ...singleUpload('mediaKit', 'document'),
  submitCreatorApplication,
);