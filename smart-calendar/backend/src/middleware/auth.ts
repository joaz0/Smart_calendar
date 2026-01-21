import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { jwtConfig } from '../config/jwt';

interface JwtPayload {
  userId: number;
  // Adicione outras propriedades do payload do JWT se houver
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.publicKey, jwtConfig.verifyOptions) as JwtPayload;
    
    // Otimização: Não bater no banco de dados a cada requisição.
    // O userId do payload do JWT é suficiente.
    req.user = { id: decoded.userId };
    
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido ou expirado' });
  }
};
