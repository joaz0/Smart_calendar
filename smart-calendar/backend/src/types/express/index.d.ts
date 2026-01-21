// backend/src/types/express/index.d.ts

import { User } from '../../../../shared/types/dto';

// Estende a interface Request do Express para adicionar a propriedade 'user'.
// Isso permite que o middleware de autenticação anexe o usuário à requisição
// de forma tipada.
declare global {
  namespace Express {
    export interface Request {
      /**
       * O objeto do usuário autenticado, adicionado pelo middleware `authenticateToken`.
       * Contém um conjunto mínimo de propriedades do usuário para evitar
       * expor dados sensíveis desnecessariamente.
       */
      user?: Partial<User> & { id: number };
    }
  }
}