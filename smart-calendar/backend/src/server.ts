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
import n8nRoutes from './routes/n8n.routes';
import { pool } from './config/database';
import { logger } from './utils/logger';
import { errorHandler, requestLogger } from './middleware/error-middleware';
import { RATE_LIMITS } from './config/constants';

dotenv.config();

async function initDatabase() {
  try {
    const client = await pool.connect();
    logger.info('✅ Banco de dados conectado');
    client.release();
  } catch (error: any) {
    logger.error('Erro ao conectar ao banco', { error: error.message });
  }
}

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ============================================
// Middleware de Segurança
// ============================================
app.use(helmet());
app.use(compression());

// Rate limiting para autenticação (mais restritivo)
const authLimiter = rateLimit({
  windowMs: RATE_LIMITS.AUTH_REQUESTS.windowMs,
  max: RATE_LIMITS.AUTH_REQUESTS.max,
  message: 'Muitas tentativas de acesso. Tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting geral
const apiLimiter = rateLimit({
  windowMs: RATE_LIMITS.API_REQUESTS.windowMs,
  max: RATE_LIMITS.API_REQUESTS.max,
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// CORS
// ============================================
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:4200';
const allowedOrigins = corsOrigin.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn('CORS bloqueado', { origin });
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ============================================
// Body Parsing
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// Logging
// ============================================
app.use(requestLogger);

// ============================================
// Rate Limiting (aplicado globalmente)
// ============================================
app.use('/api/', apiLimiter);

// ============================================
// Routes
// ============================================

// Rotas de autenticação (com rate limit mais restritivo)
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/auth/oauth', oauthRoutes);

// Rotas de dados
app.use('/api/events', eventRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

// Rotas de IA
app.use('/api/ai-training', aiTrainingRoutes);
app.use('/api/ai-suggestions', aiSuggestionsRoutes);
app.use('/api/ai-commands', aiCommandsRoutes);

// Rotas de produtividade e bem-estar
app.use('/api/productivity', productivityRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/focus-mode', focusModeRoutes);
app.use('/api/smart-scheduler', smartSchedulerRoutes);
app.use('/api/daily-summary', dailySummaryRoutes);
app.use('/api/polls', schedulingPollsRoutes);
app.use('/api/task-delegation', taskDelegationRoutes);
app.use('/api/burnout', burnoutRoutes);
app.use('/api/breaks', breaksRoutes);
app.use('/api/wind-down', windDownRoutes);

// Rotas de configuração
app.use('/api/setup', setupRoutes);

// Rotas de integração
app.use('/api/n8n', n8nRoutes);

// ============================================
// Health Check & Info
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: 'connected',
    environment: NODE_ENV,
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Calendar API',
    version: '1.0.0',
    environment: NODE_ENV,
    endpoints: {
      auth: '/api/auth',
      events: '/api/events',
      tasks: '/api/tasks',
      health: '/health',
    },
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  logger.warn('Rota não encontrada', { method: req.method, path: req.path });
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada',
  });
});

// ============================================
// Error Handler (deve ser o último middleware)
// ============================================
app.use(errorHandler);

// ============================================
// Inicialização
// ============================================
async function startServer() {
  await initDatabase();

  const server = app.listen(PORT, () => {
    logger.info('🚀 Smart Calendar API iniciado', {
      port: PORT,
      environment: NODE_ENV,
      corsOrigins: allowedOrigins,
    });
  });

  // Graceful shutdown
  const gracefulShutdown = async () => {
    logger.info('⏳ Desligando servidor gracefully...');

    server.close(async () => {
      await pool.end();
      logger.info('✅ Conexão com banco encerrada');
      process.exit(0);
    });

    // Force shutdown após 10s
    setTimeout(() => {
      logger.error('❌ Forçando shutdown após timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

startServer().catch((error) => {
  logger.error('Erro ao iniciar servidor', {}, error);
  process.exit(1);
});
