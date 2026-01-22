export interface ProductivityScore {
  date: string; // ISO date
  score: number; // 0-100
  components?: {
    focus?: number;
    completion?: number;
    balance?: number;
  };
  insights?: string[];
}

export default ProductivityScore;
