export interface ContextPattern {
  id?: string;
  name: string;
  description?: string;
  pattern: string; // simplified pattern representation (regex or keyword set)
  priority?: number;
}

export default ContextPattern;
