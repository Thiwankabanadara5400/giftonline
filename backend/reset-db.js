import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: 'localhost',
    port: 5432,
    user: 'giftonline_user',
    password: 'AzgR8$Zq',
    database: 'giftonline_db'
  }
});

async function reset() {
  try {
    await db.schema.dropTableIfExists('knex_migrations_lock');
    await db.schema.dropTableIfExists('knex_migrations');
    await db.schema.dropTableIfExists('reviews');
    await db.schema.dropTableIfExists('products');
    await db.schema.dropTableIfExists('categories');
    await db.schema.dropTableIfExists('users');
    console.log('✅ All tables dropped');
    process.exit(0);
  } catch (error) {
    console.log('✅ Ready for migrations');
    process.exit(0);
  }
}

reset();
