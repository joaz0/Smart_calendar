import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/event.routes';
import taskRoutes from './routes/task.routes';
import aiTrainingRoutes from './routes/ai-training.routes';
import aiSuggestionsRoutes from './routes/ai-suggestions.routes';
import productivityRoutes from './routes/productivity.routes';
import aiCommandsRoutes from './routes/ai-commands.routes';
import { pool } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(
  cors({
    origin: 'http://localhost:4200', // URL do Angular
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai-training', aiTrainingRoutes);
app.use('/api/ai-suggestions', aiSuggestionsRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/ai-commands', aiCommandsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'connected',
  });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Calendar API',
    version: '1.0.0',
    endpoints: {
      events: '/api/events',
      tasks: '/api/tasks',
      health: '/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   Smart Calendar API está rodando!`);
  console.log('   ========================================');
  console.log(`   📍 Server: http://localhost:${PORT}`);
  console.log(`   📊 API: http://localhost:${PORT}/api`);
  console.log(`   ❤️  Health: http://localhost:${PORT}/health`);
  console.log('   ========================================\n');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n⏳ Desligando servidor...');
  await pool.end();
  console.log('✅ Conexão com banco encerrada');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n⏳ Desligando servidor...');
  await pool.end();
  console.log('✅ Conexão com banco encerrada');
  process.exit(0);
});
