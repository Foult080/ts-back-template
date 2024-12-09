import express from 'express';
import pck from '../../package.json';
const version = pck.version;
const router = express.Router();

router.get('/health', async (req, res) => res.status(200).json({ version, msg: 'Сервис работает стабильно' }));
router.use('*', async (req, res) => res.status(404).json({ msg: 'Маршрут не распознан' }));

export default router;
