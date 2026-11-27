import * as service from '../services/creatorReview';
import { asyncHandler } from '../utils/asyncHandler';
import { HttpError } from '../utils/httpError';
import {
  applicationListQuery,
  noteSchema,
  profileListQuery,
  profileUpdateSchema,
  publishSchema,
  reviewSchema,
  socialAddSchema,
  socialUpdateSchema,
  suspendSchema,
} from '../validators/adminCreators';

const param = (value: unknown) => String(value);

export const listApplications = asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(await service.listApplications(applicationListQuery.parse(req.query)));
});

export const getApplication = asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(await service.getApplication(param(req.params.id)));
});

export const reviewApplication = asyncHandler(async (req, res) => {
  const { action, message } = reviewSchema.parse(req.body);
  res.json(await service.reviewApplication(req, param(req.params.id), action, message));
});

export const addApplicationNote = asyncHandler(async (req, res) => {
  const { body } = noteSchema.parse(req.body);
  res.status(201).json(await service.addApplicationNote(req, param(req.params.id), body));
});

export const listProfiles = asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(await service.listProfiles(profileListQuery.parse(req.query)));
});

export const getProfile = asyncHandler(async (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json(await service.getProfile(param(req.params.id)));
});

export const updateProfile = asyncHandler(async (req, res) => {
  await service.updateProfile(req, param(req.params.id), profileUpdateSchema.parse(req.body));
  res.json({ ok: true });
});

export const publishProfile = asyncHandler(async (req, res) => {
  const { publish } = publishSchema.parse(req.body);
  await service.setPublished(req, param(req.params.id), publish);
  res.json({ ok: true });
});

export const suspendProfile = asyncHandler(async (req, res) => {
  const { suspend } = suspendSchema.parse(req.body);
  await service.setSuspended(req, param(req.params.id), suspend);
  res.json({ ok: true });
});

export const addSocial = asyncHandler(async (req, res) => {
  res.status(201).json(await service.addSocial(req, param(req.params.id), socialAddSchema.parse(req.body)));
});

export const updateSocial = asyncHandler(async (req, res) => {
  await service.updateSocial(req, param(req.params.id), param(req.params.socialId), socialUpdateSchema.parse(req.body));
  res.json({ ok: true });
});

export const deleteSocial = asyncHandler(async (req, res) => {
  await service.deleteSocial(req, param(req.params.id), param(req.params.socialId));
  res.json({ ok: true });
});

export const uploadPhoto = asyncHandler(async (req, res) => {
  if (!req.file) throw HttpError.badRequest('Please choose an image to upload.');
  res.json(await service.setProfilePhoto(req, param(req.params.id), req.file));
});