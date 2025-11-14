import { pool } from '../config/database';

async function addAdvancedFeaturesPart2() {
  try {
    console.log('\n🚀 Adicionando funcionalidades avançadas (Parte 2)...\n');

    // 11. Enquetes de agendamento
    console.log('🗳️ Criando sistema de enquetes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scheduling_polls (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        organizer_id INTEGER REFERENCES users(id),
        time_slots JSONB NOT NULL,
        duration_minutes INTEGER,
        final_event_id INTEGER REFERENCES events(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS poll_votes (
        id SERIAL PRIMARY KEY,
        poll_id INTEGER REFERENCES scheduling_polls(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id),
        preferred_slots JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(poll_id, user_id)
      );
      CREATE INDEX IF NOT EXISTS idx_polls_organizer ON scheduling_polls(organizer_id);
    `);

    // 12. Delegação de tarefas
    console.log('👥 Adicionando delegação de tarefas...');
    await pool.query(`
      ALTER TABLE tasks ADD COLUMN IF NOT EXISTS delegated_from INTEGER REFERENCES users(id);
      ALTER TABLE tasks ADD COLUMN IF NOT EXISTS delegated_to INTEGER REFERENCES users(id);
      ALTER TABLE tasks ADD COLUMN IF NOT EXISTS delegation_message TEXT;
      CREATE INDEX IF NOT EXISTS idx_tasks_delegated ON tasks(delegated_to);
    `);

    // 13. Status de disponibilidade
    console.log('🟢 Criando status em tempo real...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_status (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        status VARCHAR(20) DEFAULT 'available',
        custom_message VARCHAR(200),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );

      CREATE TABLE IF NOT EXISTS user_contacts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        contact_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, contact_id)
      );
    `);

    // 14. Links rápidos em eventos
    console.log('🔗 Adicionando links rápidos...');
    await pool.query(`
      ALTER TABLE events ADD COLUMN IF NOT EXISTS video_call_link VARCHAR(500);
      ALTER TABLE events ADD COLUMN IF NOT EXISTS document_links JSONB;
      ALTER TABLE events ADD COLUMN IF NOT EXISTS related_resources JSONB;
    `);

    // 15. Agenda de equipe
    console.log('👨‍💼 Criando sistema de equipes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE users ADD COLUMN IF NOT EXISTS team_id INTEGER REFERENCES teams(id);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50);
      ALTER TABLE events ADD COLUMN IF NOT EXISTS is_private BOOLEAN DEFAULT FALSE;
    `);

    // 16. Detector de burnout
    console.log('🚨 Criando detector de burnout...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS burnout_analysis (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        analysis_date DATE NOT NULL,
        risk_score DECIMAL(3,2),
        risk_level VARCHAR(20),
        factors JSONB,
        recommendations JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, analysis_date)
      );
      CREATE INDEX IF NOT EXISTS idx_burnout_user ON burnout_analysis(user_id);
    `);

    // 17. Pausas ativas
    console.log('💧 Criando sistema de pausas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS break_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        break_interval INTEGER DEFAULT 90,
        break_duration INTEGER DEFAULT 15,
        auto_schedule BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );

      ALTER TABLE events ADD COLUMN IF NOT EXISTS is_break BOOLEAN DEFAULT FALSE;
      ALTER TABLE events ADD COLUMN IF NOT EXISTS break_type VARCHAR(20);
    `);

    // 18. Integração com health apps
    console.log('🏃 Criando integrações de saúde...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS health_data (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        data_date DATE NOT NULL,
        exercise_minutes INTEGER,
        sleep_hours DECIMAL(3,1),
        steps INTEGER,
        data_source VARCHAR(50),
        raw_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, data_date, data_source)
      );

      CREATE TABLE IF NOT EXISTS exercise_schedules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        exercise_type VARCHAR(50),
        preferred_time TIME,
        duration_minutes INTEGER,
        frequency VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 19. Horário de desacelerar
    console.log('🌙 Criando wind-down rules...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wind_down_settings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        sleep_time TIME NOT NULL,
        wind_down_duration INTEGER DEFAULT 120,
        blocked_categories JSONB,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `);

    // 20. Tempo protegido
    console.log('🛡️ Criando proteção de tempo...');
    await pool.query(`
      ALTER TABLE events ADD COLUMN IF NOT EXISTS is_protected_time BOOLEAN DEFAULT FALSE;
      ALTER TABLE events ADD COLUMN IF NOT EXISTS protection_level VARCHAR(20) DEFAULT 'none';
      CREATE INDEX IF NOT EXISTS idx_events_protected ON events(is_protected_time) WHERE is_protected_time = true;
    `);

    console.log('\n✅ Funcionalidades avançadas (Parte 2) adicionadas!\n');
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

addAdvancedFeaturesPart2()
  .then(() => {
    console.log('✅ Setup concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup falhou:', error);
    process.exit(1);
  });
