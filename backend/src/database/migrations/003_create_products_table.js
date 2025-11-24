export async function up(knex) {
  return knex.schema.createTable('products', function (table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.decimal('price', 10, 2).notNullable();
    table.decimal('original_price', 10, 2);
    table.integer('category_id').unsigned().nullable();
    table.foreign('category_id').references('id').inTable('categories').onDelete('SET NULL');
    table.string('image_url');
    table.json('images').defaultTo('[]');
    table.string('affiliate_link').notNullable();
    table.text('notes');
    table.boolean('is_featured').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  return knex.schema.dropTableIfExists('products');
}
