import { pool } from '../config/database';

async function addAdvancedFeatures() {
  try {
    console.log('\n🚀 Adicionando funcionalidades avançadas...\n');

    // 1. Tabela para parsing de linguagem natural (IA)
    console.log('🧠 Criando tabela ai_parsing_log...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ai_parsing_log (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_input TEXT NOT NULL,
        parsed_data JSONB,
        confidence_score DECIMAL(3,2),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_ai_parsing_user ON ai_parsing_log(user_id);
    `);

    // 2. Tempo de viagem automático
    console.log('🗺️ Adicionando suporte para tempo de viagem...');
    await pool.query(`
      ALTER TABLE events ADD COLUMN IF NOT EXISTS is_travel_time BOOLEAN DEFAULT FALSE;
      ALTER TABLE events ADD COLUMN IF NOT EXISTS parent_event_id INTEGER REFERENCES events(id) ON DELETE CASCADE;
      CREATE INDEX IF NOT EXISTS idx_events_travel ON events(is_travel_time) WHERE is_travel_time = true;
    `);

    // 3. Templates de checklist para eventos
    console.log('📋 Criando sistema de checklists...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS event_templates (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category VARCHAR(50),
        checklist_items JSONB NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS event_checklists (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        template_id INTEGER REFERENCES event_templates(id),
        items JSONB NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_checklists_event ON event_checklists(event_id);
    `);

    // 4. Notas com timestamp em reuniões
    console.log('⏱️ Criando sistema de notas com timestamp...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS meeting_notes (
        id SERIAL PRIMARY KEY,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        timestamp_offset INTEGER,
        created_by INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_notes_event ON meeting_notes(event_id);
    `);

    // 5. Sistema de hábitos
    console.log('📈 Criando rastreador de hábitos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS habits (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        target_frequency VARCHAR(20),
        color VARCHAR(7),
        icon VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS habit_entries (
        id SERIAL PRIMARY KEY,
        habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
        entry_date DATE NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(habit_id, entry_date)
      );
      CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
      CREATE INDEX IF NOT EXISTS idx_habit_entries_date ON habit_entries(entry_date);
    `);

    // 6. Blocos de tempo por contexto
    console.log('🎨 Criando sistema de blocos de tempo...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS time_blocks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(20) NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 3),
        focus_required INTEGER CHECK (focus_required BETWEEN 1 AND 3),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_time_blocks_user_time ON time_blocks(user_id, start_time);
    `);

    // 7. Modo foco
    console.log('🔒 Criando sistema de modo foco...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS focus_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        blocked_apps JSONB,
        blocked_websites JSONB,
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_focus_user_active ON focus_sessions(user_id, is_active);
    `);

    // 8. Disponibilidade para reuniões
    console.log('🤝 Criando sistema de disponibilidade...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_availability (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_availability_user ON user_availability(user_id);
    `);

    // 9. Análise de energia e produtividade
    console.log('⚡ Criando análise de energia...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS energy_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        timestamp TIMESTAMP NOT NULL,
        energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
        mood VARCHAR(20),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_energy_user_time ON energy_logs(user_id, timestamp);
    `);

    // 10. Metas e objetivos
    console.log('🎯 Criando sistema de metas...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS goals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_date DATE,
        progress INTEGER DEFAULT 0,
        is_completed BOOLEAN DEFAULT FALSE,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS goal_milestones (
        id SERIAL PRIMARY KEY,
        goal_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_goals_user ON goals(user_id);
    `);

    // 11. Análise de conflitos
    console.log('⚠️ Criando sistema de detecção de conflitos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedule_conflicts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event1_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        event2_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        conflict_type VARCHAR(50),
        severity VARCHAR(20),
        resolved BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_conflicts_user ON schedule_conflicts(user_id, resolved);
    `);

    // 12. Sugestões de otimização
    console.log('💡 Criando sistema de sugestões...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS optimization_suggestions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        suggestion_type VARCHAR(50),
        title VARCHAR(255),
        description TEXT,
        priority VARCHAR(20),
        is_dismissed BOOLEAN DEFAULT FALSE,
        is_applied BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_suggestions_user ON optimization_suggestions(user_id, is_dismissed);
    `);

    // 13. Histórico de padrões
    console.log('📊 Criando análise de padrões...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS behavior_patterns (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        pattern_type VARCHAR(50),
        pattern_data JSONB,
        confidence DECIMAL(3,2),
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_patterns_user ON behavior_patterns(user_id);
    `);

    // 14. Integrações externas
    console.log('🔗 Criando sistema de integrações...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS integrations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        service_name VARCHAR(50) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        token_expires_at TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        settings JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_integrations_user ON integrations(user_id);
    `);

    // 15. Compartilhamento de calendário
    console.log('👥 Criando sistema de compartilhamento...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS calendar_shares (
        id SERIAL PRIMARY KEY,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        shared_with_email VARCHAR(255) NOT NULL,
        permission_level VARCHAR(20) DEFAULT 'view',
        can_edit BOOLEAN DEFAULT FALSE,
        can_invite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(owner_id, shared_with_email)
      );
      CREATE INDEX IF NOT EXISTS idx_shares_owner ON calendar_shares(owner_id);
    `);

    // 16. Resumos diários automáticos
    console.log('📝 Criando sistema de resumos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS daily_summaries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        summary_date DATE NOT NULL,
        content TEXT,
        stats JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, summary_date)
      );
      CREATE INDEX IF NOT EXISTS idx_summaries_user_date ON daily_summaries(user_id, summary_date);
    `);

    // 17. Preferências de agendamento
    console.log('⚙️ Criando preferências de agendamento...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS scheduling_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        preferred_meeting_duration INTEGER DEFAULT 30,
        buffer_time INTEGER DEFAULT 5,
        work_start_time TIME DEFAULT '09:00',
        work_end_time TIME DEFAULT '18:00',
        lunch_start_time TIME DEFAULT '12:00',
        lunch_end_time TIME DEFAULT '13:00',
        max_meetings_per_day INTEGER DEFAULT 6,
        preferences JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `);

    // 18. Análise de tempo gasto
    console.log('⏰ Criando análise de tempo...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS time_tracking (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP,
        duration INTEGER,
        category VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_time_tracking_user ON time_tracking(user_id);
    `);

    // 19. Notificações inteligentes
    console.log('🔔 Criando sistema de notificações inteligentes...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS smart_notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        notification_type VARCHAR(50),
        title VARCHAR(255),
        message TEXT,
        priority VARCHAR(20),
        is_read BOOLEAN DEFAULT FALSE,
        action_url VARCHAR(500),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_notifications_user ON smart_notifications(user_id, is_read);
    `);

    // 20. Contexto de trabalho
    console.log('💼 Criando contextos de trabalho...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS work_contexts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        color VARCHAR(7),
        apps JSONB,
        websites JSONB,
        is_active BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_contexts_user ON work_contexts(user_id);
    `);

    console.log('\n✅ Todas as funcionalidades avançadas foram adicionadas!\n');
  } catch (error) {
    console.error('❌ Erro:', error);
    throw error;
  }
}

addAdvancedFeatures()
  .then(() => {
    console.log('✅ Setup concluído');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Setup falhou:', error);
    process.exit(1);
  });
