import { Entity } from './common-interfaces';

export interface Category extends Entity {
  name: string;
  color: string;
  icon?: string;
  description?: string;
  isDefault?: boolean;
  createdBy?: string;
  updatedBy?: string;
}
