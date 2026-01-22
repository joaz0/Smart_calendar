import { pool } from '../config/database';
import bcrypt from 'bcryptjs';

const DEMO_EMAIL = 'demo@smartcalendar.app';
const DEMO_PASS = 'demo123';

type SeedEvent = {
  title: string;
  description: string;
  start: Date;
  end: Date;
  category: string;
};

type SeedTask = {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  isCompleted: boolean;
  category: string;
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const atTime = (date: Date, hours: number, minutes = 0) => {
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

const columnExists = async (client: import('pg').PoolClient, tableName: string, columnName: string) => {
  const result = await client.query(
    `SELECT 1
     FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = $1
       AND column_name = $2`,
    [tableName, columnName]
  );
  return result.rows.length > 0;
};

const safeDeleteByColumn = async (
  client: import('pg').PoolClient,
  tableName: string,
  columnName: string,
  value: number
) => {
  if (await columnExists(client, tableName, columnName)) {
    await client.query(`DELETE FROM ${tableName} WHERE ${columnName} = $1`, [value]);
  }
};

const safeNullifyColumn = async (
  client: import('pg').PoolClient,
  tableName: string,
  columnName: string,
  value: number
) => {
  if (await columnExists(client, tableName, columnName)) {
    await client.query(`UPDATE ${tableName} SET ${columnName} = NULL WHERE ${columnName} = $1`, [value]);
  }
};

async function seedPortfolio() {
  const client = await pool.connect();

  try {
    console.log('Starting portfolio seed...');
    await client.query('BEGIN');

    console.log('Cleaning previous demo data...');
    const checkUser = await client.query('SELECT id FROM users WHERE email = $1', [DEMO_EMAIL]);

    if (checkUser.rows.length > 0) {
      const userId = checkUser.rows[0].id as number;

      await safeDeleteByColumn(client, 'poll_votes', 'user_id', userId);
      await safeDeleteByColumn(client, 'scheduling_polls', 'organizer_id', userId);
      await safeDeleteByColumn(client, 'meeting_notes', 'created_by', userId);
      await safeDeleteByColumn(client, 'calendar_shares', 'owner_id', userId);
      await safeDeleteByColumn(client, 'user_contacts', 'contact_id', userId);

      await safeNullifyColumn(client, 'tasks', 'delegated_from', userId);
      await safeNullifyColumn(client, 'tasks', 'delegated_to', userId);

      const userTables = [
        'ai_commands',
        'ai_parsing_log',
        'ai_suggestions',
        'attachments',
        'behavior_patterns',
        'break_preferences',
        'burnout_analysis',
        'categories',
        'daily_summaries',
        'energy_logs',
        'event_participants',
        'event_templates',
        'events',
        'exercise_schedules',
        'focus_sessions',
        'goals',
        'habits',
        'health_data',
        'integrations',
        'optimization_suggestions',
        'privacy_settings',
        'productivity_scores',
        'reminders',
        'schedule_conflicts',
        'scheduling_preferences',
        'smart_notifications',
        'tasks',
        'time_blocks',
        'time_tracking',
        'user_availability',
        'user_stats',
        'user_status',
        'wind_down_settings',
        'work_contexts'
      ];

      for (const tableName of userTables) {
        await safeDeleteByColumn(client, tableName, 'user_id', userId);
      }

      await client.query('DELETE FROM users WHERE id = $1', [userId]);
    }

    console.log('Creating demo user...');
    const hashedPassword = await bcrypt.hash(DEMO_PASS, 10);
    const userRes = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ['Visitante Portfolio', DEMO_EMAIL, hashedPassword]
    );
    const userId = userRes.rows[0].id as number;

    console.log('Creating categories...');
    const categoriesData = [
      { name: 'Trabalho', color: '#3B82F6' },
      { name: 'Projetos', color: '#8B5CF6' },
      { name: 'Saude', color: '#10B981' },
      { name: 'Pessoal', color: '#F59E0B' }
    ];

    const categoryMap: Record<string, number> = {};

    for (const category of categoriesData) {
      const categoryRes = await client.query(
        `INSERT INTO categories (name, color, user_id)
         VALUES ($1, $2, $3)
         RETURNING id, name`,
        [category.name, category.color, userId]
      );
      categoryMap[categoryRes.rows[0].name] = categoryRes.rows[0].id;
    }

    console.log('Creating events...');
    const today = new Date();

    const events: SeedEvent[] = [
      {
        title: 'Reuniao de Alinhamento',
        description: 'Definicao de metas e prioridades',
        start: atTime(addDays(today, -1), 10),
        end: atTime(addDays(today, -1), 11),
        category: 'Trabalho'
      },
      {
        title: 'Academia',
        description: 'Treino de forca',
        start: atTime(today, 7),
        end: atTime(today, 8),
        category: 'Saude'
      },
      {
        title: 'Foco no Codigo (Deep Work)',
        description: 'Finalizar modulo de autenticacao',
        start: atTime(today, 14),
        end: atTime(today, 16),
        category: 'Projetos'
      },
      {
        title: 'Dentista',
        description: 'Limpeza semestral',
        start: atTime(addDays(today, 1), 9),
        end: atTime(addDays(today, 1), 10),
        category: 'Saude'
      },
      {
        title: 'Call com Cliente',
        description: 'Apresentacao do MVP',
        start: atTime(addDays(today, 1), 15),
        end: atTime(addDays(today, 1), 16),
        category: 'Trabalho'
      },
      {
        title: 'Aniversario da Ana',
        description: 'Comprar presente antes',
        start: atTime(addDays(today, 5), 19),
        end: atTime(addDays(today, 5), 23),
        category: 'Pessoal'
      }
    ];

    for (const event of events) {
      await client.query(
        `INSERT INTO events (title, description, start_time, end_time, category_id, user_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [event.title, event.description, event.start, event.end, categoryMap[event.category], userId]
      );
    }

    console.log('Creating tasks...');
    const tasks: SeedTask[] = [
      {
        title: 'Revisar backlog da semana',
        description: 'Organizar prioridades do sprint',
        dueDate: atTime(today, 18),
        priority: 'high',
        status: 'in-progress',
        isCompleted: false,
        category: 'Trabalho'
      },
      {
        title: 'Preparar apresentacao do MVP',
        description: 'Revisar slides e demo',
        dueDate: atTime(addDays(today, 1), 11),
        priority: 'high',
        status: 'pending',
        isCompleted: false,
        category: 'Projetos'
      },
      {
        title: 'Comprar suplementos',
        description: 'Reposicao para a semana',
        dueDate: atTime(addDays(today, 2), 10),
        priority: 'medium',
        status: 'pending',
        isCompleted: false,
        category: 'Saude'
      },
      {
        title: 'Ler 20 paginas',
        description: 'Livro sobre produtividade',
        dueDate: atTime(addDays(today, 3), 20),
        priority: 'low',
        status: 'pending',
        isCompleted: false,
        category: 'Pessoal'
      },
      {
        title: 'Fechar pendencias financeiras',
        description: 'Conferir assinaturas e despesas',
        dueDate: atTime(addDays(today, -1), 17),
        priority: 'medium',
        status: 'completed',
        isCompleted: true,
        category: 'Pessoal'
      }
    ];

    for (const task of tasks) {
      await client.query(
        `INSERT INTO tasks (title, description, category_id, priority, status, due_date, is_completed, user_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          task.title,
          task.description,
          categoryMap[task.category],
          task.priority,
          task.status,
          task.dueDate,
          task.isCompleted,
          userId
        ]
      );
    }

    await client.query('COMMIT');
    console.log('Seed completed successfully.');
    console.log(`Demo login: ${DEMO_EMAIL} / ${DEMO_PASS}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedPortfolio()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
