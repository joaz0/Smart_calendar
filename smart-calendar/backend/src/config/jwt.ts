import fs from 'fs';
import path from 'path';

const getPrivateKey = (): string => {
  try {
    const keyPath = process.env.JWT_PRIVATE_KEY_PATH || './private_key.pem';
    return fs.readFileSync(path.resolve(keyPath), 'utf8');
  } catch (error) {
    // Fallback to JWT_SECRET for production
    return process.env.JWT_SECRET || 'fallback-secret-key';
  }
};

const getPublicKey = (): string => {
  try {
    const keyPath = process.env.JWT_PUBLIC_KEY_PATH || './public_key.pem';
    return fs.readFileSync(path.resolve(keyPath), 'utf8');
  } catch (error) {
    // Fallback to JWT_SECRET for production
    return process.env.JWT_SECRET || 'fallback-secret-key';
  }
};

const useRSA = () => {
  try {
    const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH || './private_key.pem';
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || './public_key.pem';
    return fs.existsSync(path.resolve(privateKeyPath)) && fs.existsSync(path.resolve(publicKeyPath));
  } catch {
    return false;
  }
};

const isRSA = useRSA();

export const jwtConfig = {
  privateKey: getPrivateKey(),
  publicKey: getPublicKey(),
  signOptions: {
    algorithm: isRSA ? 'RS256' as const : 'HS256' as const,
    expiresIn: '10d'
  } as any,
  verifyOptions: {
    algorithms: isRSA ? ['RS256' as const] : ['HS256' as const]
  }
};