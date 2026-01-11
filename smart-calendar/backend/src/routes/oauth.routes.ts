import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { jwtConfig } from '../config/jwt';

const router = Router();

// Google OAuth callback
router.post('/google', async (req: Request, res: Response) => {
  try {
    const { email, name, googleId } = req.body;

    if (!email || !name || !googleId) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados do Google incompletos' 
      });
    }

    // Check if user exists
    let result = await pool.query('SELECT id, email, name FROM users WHERE email = $1', [email]);
    
    let user;
    if (result.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, name, 'oauth_google']
      );
      user = insertResult.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign({ userId: user.id }, jwtConfig.privateKey, jwtConfig.signOptions);

    res.json({ 
      success: true,
      data: { token, user }
    });
  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Microsoft OAuth callback
router.post('/microsoft', async (req: Request, res: Response) => {
  try {
    const { email, name, microsoftId } = req.body;

    if (!email || !name || !microsoftId) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados do Microsoft incompletos' 
      });
    }

    // Check if user exists
    let result = await pool.query('SELECT id, email, name FROM users WHERE email = $1', [email]);
    
    let user;
    if (result.rows.length === 0) {
      // Create new user
      const insertResult = await pool.query(
        'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name',
        [email, name, 'oauth_microsoft']
      );
      user = insertResult.rows[0];
    } else {
      user = result.rows[0];
    }

    const token = jwt.sign({ userId: user.id }, jwtConfig.privateKey, jwtConfig.signOptions);

    res.json({ 
      success: true,
      data: { token, user }
    });
  } catch (error) {
    console.error('Microsoft OAuth error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

export default router;