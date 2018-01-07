/* eslint-disable newline-per-chained-call */

// prettier-ignore
exports.up = async db => {
  // Add user table
  await db.schema.createTable('users', table => {
    table.increments('id');
    table.string('name', 100).notNullable();
    table.string('email', 100).notNullable().unique();
    table.boolean('is_admin').notNullable().defaultTo(false);
    table.boolean('is_active').notNullable().defaultTo(true);

    // This actually stores the hashed password, not the plaintext
    table.string('password', 72).notNullable();
    table.dateTime('deleted_at');
    table.timestamps(true, true);
  });
};

// prettier-ignore
exports.down = async db => {
  // drop tables
  await db.schema.dropTableIfExists('users');
};
