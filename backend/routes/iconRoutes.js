import express from 'express';
import { generateIcons, generateHighQualityIcon, downloadIcon } from '../controllers/iconController.js';

const router = express.Router();

// POST /api/icons/generate - Generate 4 icon variations
router.post('/generate', generateIcons);

// POST /api/icons/generate-high-quality - Generate high-quality version of selected icon
router.post('/generate-high-quality', generateHighQualityIcon);

// GET /api/icons/download/:iconId - Download the final icon
router.get('/download/:iconId', downloadIcon);

export default router;