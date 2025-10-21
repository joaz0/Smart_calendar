import fs from 'fs';
import path from 'path';

const getPrivateKey = (): string => {
  const keyPath = process.env.JWT_PRIVATE_KEY_PATH || './private_key.pem';
  return fs.readFileSync(path.resolve(keyPath), 'utf8');
};

const getPublicKey = (): string => {
  const keyPath = process.env.JWT_PUBLIC_KEY_PATH || './public_key.pem';
  return fs.readFileSync(path.resolve(keyPath), 'utf8');
};

export const jwtConfig = {
  privateKey: getPrivateKey(),
  publicKey: getPublicKey(),
  signOptions: {
    algorithm: 'RS256' as const,
    expiresIn: '7d'
  } as any,
  verifyOptions: {
    algorithms: ['RS256' as const]
  }
};