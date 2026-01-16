export interface AiTrainingExample {
  id?: string;
  input: string;
  output: string;
  label?: string;
  metadata?: Record<string, unknown>;
}

export interface AiTrainingDataset {
  id?: string;
  name: string;
  examples: AiTrainingExample[];
  description?: string;
  createdAt?: string;
}

export default AiTrainingDataset;
