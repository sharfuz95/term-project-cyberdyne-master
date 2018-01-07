const path = require('path');

const root = path.join(__dirname, '..');

module.exports = {
  // The root of the project
  root,

  // Path to the API root containing all models, schema, etc.
  api: path.join(root, 'src', 'api'),

  // Path to the database configuration files
  db: path.join(root, 'db'),

  // Model classes
  models: path.join(root, 'src', 'api', 'models'),

  // GraphQL schema and resolvers
  schema: path.join(root, 'src', 'api', 'schema'),

  // The source folder for our server application
  src: path.join(root, 'src'),

  // Utilities used by various areas of the application
  utils: path.join(root, 'src', 'utils'),
};
