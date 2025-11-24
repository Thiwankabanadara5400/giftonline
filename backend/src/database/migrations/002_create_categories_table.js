export async function up(knex) {
  return knex.schema.createTable('categories', function (table) {
    table.increments('id').primary();
    table.string('name').unique().notNullable();
    table.text('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('categories');
}
