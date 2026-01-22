import dotenv from 'dotenv';
dotenv.config();

export const AppConfig = {
  isDemo: process.env.DEMO_MODE === 'true',
  // Aqui você colocará as chaves do Claude/Anthropic depois
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
};
