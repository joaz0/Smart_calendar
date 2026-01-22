// backend/src/types/express/index.d.ts

import { User as SharedUser } from '@shared/types/dto';

// Estende a interface User do Express (usada pelo Passport) para garantir o id.
declare global {
  namespace Express {
    export interface User extends Partial<SharedUser> {
      id: number;
    }
  }
}
