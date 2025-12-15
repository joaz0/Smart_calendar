import { pool } from '../config/database';

async function setupDatabase() {
  try {
    console.log('\n🔧 ========================================');
    console.log('   Configurando banco de dados completo...');
    console.log('   ========================================\n');

    // 1. Tabela de Usuários
    console.log('👤 Criando tabela de usuários...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar VARCHAR(500),
        theme VARCHAR(10) DEFAULT 'light',
        language VARCHAR(10) DEFAULT 'pt-BR',
        timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
        calendar_view VARCHAR(10) DEFAULT 'month',
        notifications_enabled BOOLEAN DEFAULT true,
        email_notifications BOOLEAN DEFAULT true,
        push_notifications BOOLEAN DEFAULT true,
        share_calendar BOOLEAN DEFAULT false,
        share_availability BOOLEAN DEFAULT false,
        show_real_names BOOLEAN DEFAULT true,
        allow_data_collection BOOLEAN DEFAULT false,
        allow_ai_features BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela users criada');

    // Adicionar colunas de preferências se não existirem
    console.log('⚙️ Adicionando colunas de preferências...');
    await pool.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';
    `);
    console.log('✅ Colunas de preferências adicionadas');

    // Tabela de estatísticas do usuário
    console.log('📊 Criando tabela de estatísticas do usuário...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        events_today INTEGER DEFAULT 0,
        pending_tasks INTEGER DEFAULT 0,
        completed_tasks INTEGER DEFAULT 0,
        productivity_score INTEGER DEFAULT 0,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `);
    console.log('✅ Tabela user_stats criada');

    // Função para atualizar estatísticas automaticamente
    console.log('🔄 Criando função de atualização de stats...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_user_stats(user_id_param INTEGER)
      RETURNS VOID AS $$
      BEGIN
        INSERT INTO user_stats (user_id, events_today, pending_tasks, completed_tasks, productivity_score)
        VALUES (
          user_id_param,
          (SELECT COUNT(*) FROM events WHERE user_id = user_id_param AND DATE(start_time) = CURRENT_DATE),
          (SELECT COUNT(*) FROM tasks WHERE user_id = user_id_param AND is_completed = false),
          (SELECT COUNT(*) FROM tasks WHERE user_id = user_id_param AND is_completed = true),
          (SELECT CASE 
            WHEN COUNT(*) = 0 THEN 0 
            ELSE ROUND((COUNT(*) FILTER (WHERE is_completed = true) * 100.0) / COUNT(*))
           END FROM tasks WHERE user_id = user_id_param)
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET
          events_today = EXCLUDED.events_today,
          pending_tasks = EXCLUDED.pending_tasks,
          completed_tasks = EXCLUDED.completed_tasks,
          productivity_score = EXCLUDED.productivity_score,
          last_updated = CURRENT_TIMESTAMP;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log('✅ Função update_user_stats criada');

    // 2. Tabela de Categorias
    console.log('📂 Criando tabela de categorias...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        color VARCHAR(7) NOT NULL,
        description TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela categories criada');

    // 3. Tabela de Eventos
    console.log('📅 Criando tabela de eventos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        is_all_day BOOLEAN DEFAULT false,
        location VARCHAR(500),
        url VARCHAR(500),
        color VARCHAR(7),
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        recurrence_frequency VARCHAR(20),
        recurrence_interval INTEGER,
        recurrence_days_of_week INTEGER[],
        recurrence_day_of_month INTEGER,
        recurrence_month_of_year INTEGER,
        recurrence_end_date TIMESTAMP,
        recurrence_occurrences INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela events criada');

    // 4. Tabela de Tarefas
    console.log('📝 Criando tabela de tarefas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
        due_date TIMESTAMP,
        is_completed BOOLEAN DEFAULT false,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela tasks criada');

    // 5. Tabela de Lembretes
    console.log('⏰ Criando tabela de lembretes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reminders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        reminder_time TIMESTAMP NOT NULL,
        method VARCHAR(20) DEFAULT 'push' CHECK (method IN ('push', 'email', 'sms')),
        is_sent BOOLEAN DEFAULT FALSE,
        sent_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela reminders criada');

    // 6. Tabela de Participantes
    console.log('👥 Criando tabela de participantes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_participants (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        email VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        response_status VARCHAR(20) DEFAULT 'pending' CHECK (response_status IN ('accepted', 'declined', 'tentative', 'pending')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, email)
      );
    `);
    console.log('✅ Tabela event_participants criada');

    // 7. Tabela de Anexos
    console.log('📎 Criando tabela de anexos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attachments (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        file_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        file_size INTEGER,
        mime_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabela attachments criada');

    // Índices para performance
    console.log('📊 Criando índices...');
    await pool.query(`
      -- Índices para eventos
      CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
      CREATE INDEX IF NOT EXISTS idx_events_start_time ON events(start_time);
      CREATE INDEX IF NOT EXISTS idx_events_category_id ON events(category_id);
      CREATE INDEX IF NOT EXISTS idx_events_recurrence ON events(recurrence_frequency) WHERE recurrence_frequency IS NOT NULL;

      -- Índices para tarefas
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
      CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(is_completed) WHERE is_completed = false;

      -- Índices para lembretes
      CREATE INDEX IF NOT EXISTS idx_reminders_user_time ON reminders(user_id, reminder_time) WHERE is_sent = false;
      CREATE INDEX IF NOT EXISTS idx_reminders_event_id ON reminders(event_id);
      CREATE INDEX IF NOT EXISTS idx_reminders_task_id ON reminders(task_id);

      -- Índices para participantes
      CREATE INDEX IF NOT EXISTS idx_participants_event_id ON event_participants(event_id);
      CREATE INDEX IF NOT EXISTS idx_participants_email ON event_participants(email);

      -- Índices para buscas textuais
      CREATE INDEX IF NOT EXISTS idx_events_title_search ON events USING gin(to_tsvector('portuguese', title));
      CREATE INDEX IF NOT EXISTS idx_events_desc_search ON events USING gin(to_tsvector('portuguese', description));
      CREATE INDEX IF NOT EXISTS idx_tasks_title_search ON tasks USING gin(to_tsvector('portuguese', title));
    `);
    console.log('✅ Índices criados');

    // Triggers para updated_at
    console.log('⚡ Criando triggers...');
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';

      -- Aplicar triggers nas tabelas
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_events_updated_at ON events;
      CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
      CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

      -- Trigger para atualizar stats quando tarefas ou eventos mudarem
      CREATE OR REPLACE FUNCTION trigger_update_user_stats()
      RETURNS TRIGGER AS $$
      BEGIN
        IF TG_OP = 'DELETE' THEN
          PERFORM update_user_stats(OLD.user_id);
          RETURN OLD;
        ELSE
          PERFORM update_user_stats(NEW.user_id);
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql;

      -- Aplicar triggers para stats
      DROP TRIGGER IF EXISTS update_stats_on_task_change ON tasks;
      CREATE TRIGGER update_stats_on_task_change
        AFTER INSERT OR UPDATE OR DELETE ON tasks
        FOR EACH ROW EXECUTE FUNCTION trigger_update_user_stats();

      DROP TRIGGER IF EXISTS update_stats_on_event_change ON events;  
      CREATE TRIGGER update_stats_on_event_change
        AFTER INSERT OR UPDATE OR DELETE ON events
        FOR EACH ROW EXECUTE FUNCTION trigger_update_user_stats();
    `);
    console.log('✅ Triggers criados');

    // 8. Tabelas para AI training data
    console.log('🤖 Criando tabelas para AI training data...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_training_datasets (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_training_examples (
        id SERIAL PRIMARY KEY,
        dataset_id INTEGER REFERENCES ai_training_datasets(id) ON DELETE CASCADE,
        input TEXT NOT NULL,
        output TEXT NOT NULL,
        label VARCHAR(100),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_ai_examples_dataset_id ON ai_training_examples(dataset_id);
      CREATE INDEX IF NOT EXISTS idx_ai_examples_input_search ON ai_training_examples USING gin(to_tsvector('portuguese', input));
    `);
    console.log('✅ Tabelas ai_training_datasets e ai_training_examples criadas');

    // Seed inicial para AI training (apenas se não houver datasets)
    console.log('🌱 Inserindo seed inicial para AI training data (se necessário)...');
    const { rows: existingDatasets } = await pool.query(
      'SELECT id FROM ai_training_datasets LIMIT 1'
    );
    if (existingDatasets.length === 0) {
      const ds = await pool.query(
        `INSERT INTO ai_training_datasets (name, description) VALUES ($1, $2) RETURNING *`,
        ['Default Dataset', 'Dataset inicial gerado pelo setup']
      );
      const datasetId = ds.rows[0].id;

      await pool.query(
        `INSERT INTO ai_training_examples (dataset_id, input, output, label, metadata)
         VALUES
         ($1, $2, $3, $4, $5),
         ($1, $6, $7, $8, $9)
        `,
        [
          datasetId,
          'Marcar reunião com o time amanhã às 10h',
          'CREATE_EVENT|title=Reunião de time;date=tomorrow;time=10:00',
          'create_event',
          JSON.stringify({ source: 'seed' }),
          'Enviar relatório semanal na sexta',
          'CREATE_TASK|title=Enviar relatório;due=next_friday',
          'create_task',
          JSON.stringify({ source: 'seed' }),
        ]
      );
      console.log('✅ Seed AI training inserido');
    } else {
      console.log('ℹ️ Já existe dataset AI training, seed pulado');
    }

    // 9. Tabelas opcionais para histórico e persistência de AI
    console.log('🧠 Criando tabelas opcionais para AI (suggestions, productivity, commands)...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_suggestions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        payload JSONB NOT NULL,
        score NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS productivity_scores (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        score NUMERIC NOT NULL,
        components JSONB,
        insights JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(date, user_id)
      );

      CREATE TABLE IF NOT EXISTS ai_commands (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        raw_text TEXT NOT NULL,
        intent VARCHAR(200),
        entities JSONB,
        confidence NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_ai_suggestions_user_id ON ai_suggestions(user_id);
      CREATE INDEX IF NOT EXISTS idx_productivity_scores_user_date ON productivity_scores(user_id, date);
      CREATE INDEX IF NOT EXISTS idx_ai_commands_user_id ON ai_commands(user_id);
    `);
    console.log(
      '✅ Tabelas opcionais de AI criadas (ai_suggestions, productivity_scores, ai_commands)'
    );

    console.log('\n🎉 ========================================');
    console.log('   Banco de dados configurado com sucesso!');
    console.log('   ========================================\n');
  } catch (error) {
    console.error('\n❌ Erro ao configurar banco de dados:', error);
    throw error;
  }
}

// Executar setup
setupDatabase()
  .then(async () => {
    console.log('✅ Setup concluído');
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Setup falhou:', error);
    await pool.end();
    process.exit(1);
  });
