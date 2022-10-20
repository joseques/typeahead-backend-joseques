const envPort = process.env.PORT || 12345;
const currentEnvironment =
  process.env.ENV || process.env.NODE_ENV || 'development';
const Constants = {
  MAX_TYPEAHEAD_RESULTS: 10,
  SOURCE_JSON_FILE: 'names.json',
  DEFAULT_PORT: envPort,
  ENVIRONMENT: currentEnvironment,
};

export default Constants;
