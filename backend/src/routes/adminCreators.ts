import { Router } from 'express';
import * as controller from '../controllers/adminCreatorsController';
import { requirePermission } from '../middleware/rbac';
import { singleUpload } from '../middleware/upload';

export const adminCreatorsRouter = Router();

// Reading
adminCreatorsRouter.get('/applications', requirePermission('creators:read'), controller.listApplications);
adminCreatorsRouter.get('/applications/:id', requirePermission('creators:read'), controller.getApplication);
adminCreatorsRouter.get('/profiles', requirePermission('creators:read'), controller.listProfiles);
adminCreatorsRouter.get('/profiles/:id', requirePermission('creators:read'), controller.getProfile);

// Reviewing
adminCreatorsRouter.post('/applications/:id/review', requirePermission('creators:review'), controller.reviewApplication);
adminCreatorsRouter.post('/applications/:id/notes', requirePermission('creators:review'), controller.addApplicationNote);

// Editing
adminCreatorsRouter.patch('/profiles/:id', requirePermission('creators:edit'), controller.updateProfile);
adminCreatorsRouter.post(
  '/profiles/:id/photo',
  requirePermission('creators:edit'),
  ...singleUpload('photo', 'image'),
  controller.uploadPhoto,
);
adminCreatorsRouter.post('/profiles/:id/social', requirePermission('creators:edit'), controller.addSocial);
adminCreatorsRouter.patch('/profiles/:id/social/:socialId', requirePermission('creators:edit'), controller.updateSocial);
adminCreatorsRouter.delete('/profiles/:id/social/:socialId', requirePermission('creators:edit'), controller.deleteSocial);

// Publishing and suspension
adminCreatorsRouter.post('/profiles/:id/publish', requirePermission('creators:publish'), controller.publishProfile);
adminCreatorsRouter.post('/profiles/:id/suspend', requirePermission('creators:suspend'), controller.suspendProfile);