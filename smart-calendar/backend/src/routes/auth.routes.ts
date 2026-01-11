import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const { body, validationResult } = require('express-validator');
import { query } from '../config/database';
import { jwtConfig } from '../config/jwt';

const router = Router();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }

    const { email, password, name } = req.body;

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Email já cadastrado' 
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, name, passwordHash]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, jwtConfig.privateKey, jwtConfig.signOptions);

    res.status(201).json({ 
      success: true,
      data: { token, user } 
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }

    const { email, password } = req.body;

    const result = await query('SELECT id, email, name, password_hash FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciais inválidas' 
      });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false,
        error: 'Credenciais inválidas' 
      });
    }

    const token = jwt.sign({ userId: user.id }, jwtConfig.privateKey, jwtConfig.signOptions);

    res.json({ 
      success: true,
      data: {
        token, 
        user: { 
          id: user.id, 
          email: user.email, 
          name: user.name 
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Get current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'Token não fornecido' 
      });
    }

    const decoded = jwt.verify(token, jwtConfig.publicKey, jwtConfig.verifyOptions) as any;
    const result = await query('SELECT id, email, name, created_at FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuário não encontrado' 
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      success: false,
      error: 'Token inválido' 
    });
  }
});

// Forgot Password
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }

    const { email } = req.body;
    
    const userResult = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.json({ 
        success: true,
        data: { message: 'Se o e-mail existir, um link será enviado' }
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    await query(
      'UPDATE users SET reset_token = $1, reset_expires = $2 WHERE email = $3',
      [resetToken, resetExpires, email]
    );

    console.log(`Reset token para ${email}: ${resetToken}`);
    
    res.json({ 
      success: true,
      data: { message: 'Link de redefinição enviado para seu e-mail' }
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

// Reset Password
router.post('/reset-password', [
  body('token').exists(),
  body('newPassword').isLength({ min: 6 })
], async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        error: 'Dados inválidos',
        details: errors.array() 
      });
    }

    const { token, newPassword } = req.body;
    
    const userResult = await query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_expires > NOW()',
      [token]
    );
    
    if (userResult.rows.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Token inválido ou expirado' 
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);
    
    await query(
      'UPDATE users SET password_hash = $1, reset_token = NULL, reset_expires = NULL WHERE reset_token = $2',
      [passwordHash, token]
    );

    res.json({ 
      success: true,
      data: { message: 'Senha redefinida com sucesso' }
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Erro interno do servidor' 
    });
  }
});

export default router;