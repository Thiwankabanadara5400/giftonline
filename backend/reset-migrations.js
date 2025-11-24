import knex from 'knex';
import config from './knexfile.js';

const db = knex(config.development);

async function resetMigrations() {
  try {
    // Check if table exists and drop it
    const hasTable = await db.schema.hasTable('knex_migrations');
    if (hasTable) {
      console.log('Dropping existing knex_migrations table...');
      await db.schema.dropTable('knex_migrations');
      console.log('✅ knex_migrations table dropped');
    } else {
      console.log('No knex_migrations table found');
    }

    // Also drop locks table if it exists
    const hasLocksTable = await db.schema.hasTable('knex_migrations_lock');
    if (hasLocksTable) {
      console.log('Dropping existing knex_migrations_lock table...');
      await db.schema.dropTable('knex_migrations_lock');
      console.log('✅ knex_migrations_lock table dropped');
    }

    console.log('\n🔄 Now running migrations...');
    await db.migrate.latest();
    console.log('✅ All migrations completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await db.destroy();
  }
}

resetMigrations();
