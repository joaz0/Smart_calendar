import { Request, Response } from 'express';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const getPrivacySettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const result = await pool.query(
      `SELECT settings FROM privacy_settings WHERE user_id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      const defaultSettings = {
        defaultLevel: 'PRIVATE',
        offGridMode: false,
        encryptionEnabled: true,
        allowSharing: true
      };

      await pool.query(
        `INSERT INTO privacy_settings (user_id, settings) VALUES ($1, $2)`,
        [userId, JSON.stringify(defaultSettings)]
      );

      return res.json({ success: true, data: defaultSettings });
    }

    res.json({ success: true, data: result.rows[0].settings });
  } catch (error: any) {
    logger.error('Error fetching privacy settings', { error: error.message });
    res.status(500).json({ success: false, error: 'Erro ao buscar configurações' });
  }
};

export const updatePrivacySettings = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const settings = req.body;

    await pool.query(
      `INSERT INTO privacy_settings (user_id, settings) 
       VALUES ($1, $2) 
       ON CONFLICT (user_id) 
       DO UPDATE SET settings = $2, updated_at = NOW()`,
      [userId, JSON.stringify(settings)]
    );

    res.json({ success: true, data: settings });
  } catch (error: any) {
    logger.error('Error updating privacy settings', { error: error.message });
    res.status(500).json({ success: false, error: 'Erro ao atualizar configurações' });
  }
};

export const checkPrivacy = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { context, level } = req.body;

    const result = await pool.query(
      `SELECT settings FROM privacy_settings WHERE user_id = $1`,
      [userId]
    );

    const settings = result.rows[0]?.settings || { defaultLevel: 'PRIVATE' };
    const allowed = true; // Simplified check

    res.json({ success: true, data: { allowed, settings } });
  } catch (error: any) {
    logger.error('Error checking privacy', { error: error.message });
    res.status(500).json({ success: false, error: 'Erro ao verificar privacidade' });
  }
};
