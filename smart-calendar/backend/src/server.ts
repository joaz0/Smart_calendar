import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import oauthRoutes from './routes/oauth.routes';
import eventRoutes from './routes/event.routes';
import taskRoutes from './routes/task.routes';
import categoryRoutes from './routes/category.routes';
import userRoutes from './routes/user.routes';
import aiTrainingRoutes from './routes/ai-training.routes';
import aiSuggestionsRoutes from './routes/ai-suggestions.routes';
import productivityRoutes from './routes/productivity.routes';
import aiCommandsRoutes from './routes/ai-commands.routes';
import habitsRoutes from './routes/habits.routes';
import focusModeRoutes from './routes/focus-mode.routes';
import smartSchedulerRoutes from './routes/smart-scheduler.routes';
import dailySummaryRoutes from './routes/daily-summary.routes';
import schedulingPollsRoutes from './routes/scheduling-polls.routes';
import taskDelegationRoutes from './routes/task-delegation.routes';
import burnoutRoutes from './routes/burnout.routes';
import breaksRoutes from './routes/breaks.routes';
import windDownRoutes from './routes/wind-down.routes';
import setupRoutes from './routes/setup.routes';
import { pool } from './config/database';

dotenv.config();

async function initDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Banco de dados conectado');
    client.release();
  } catch (error: any) {
    console.error('⚠️ Erro ao conectar ao banco:', error.message);
  }
}

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// CORS
const allowedOrigins = [
  'http://localhost:4200',
  'https://smartcallendar.netlify.app',
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/oauth', oauthRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai-training', aiTrainingRoutes);
app.use('/api/ai-suggestions', aiSuggestionsRoutes);
app.use('/api/productivity', productivityRoutes);
app.use('/api/ai-commands', aiCommandsRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/focus-mode', focusModeRoutes);
app.use('/api/smart-scheduler', smartSchedulerRoutes);
app.use('/api/daily-summary', dailySummaryRoutes);
app.use('/api/polls', schedulingPollsRoutes);
app.use('/api/tasks', taskDelegationRoutes);
app.use('/api/burnout', burnoutRoutes);
app.use('/api/breaks', breaksRoutes);
app.use('/api/wind-down', windDownRoutes);
app.use('/api/setup', setupRoutes);

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
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log('\n🚀 ========================================');
    console.log(`   Smart Calendar API está rodando!`);
    console.log('   ========================================');
    console.log(`   📍 Server: http://localhost:${PORT}`);
    console.log(`   📊 API: http://localhost:${PORT}/api`);
    console.log(`   ❤️  Health: http://localhost:${PORT}/health`);
    console.log('   ========================================\n');
  });
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
