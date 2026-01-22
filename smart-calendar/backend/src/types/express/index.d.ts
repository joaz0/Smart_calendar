// backend/src/types/express/index.d.ts

import { User as SharedUser } from '../dto';

declare global {
  namespace Express {
    // Estende a interface User do Express para garantir o id
    export interface User extends Partial<SharedUser> {
      id: number;
    }
  }
}

