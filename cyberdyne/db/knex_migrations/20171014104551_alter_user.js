/* eslint-disable newline-per-chained-call */

// prettier-ignore
exports.up = async db => {
  await db.schema.table('users', table => {
    table.string('display_name', 100);
    table.string('location');
    table.text('bio');
  });
};

exports.down = async db => {
  await db.schema.table('users', table => {
    table.dropColumns(['display_name', 'location', 'bio']);
  });
};
