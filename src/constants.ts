const Constants = {
  MAX_TYPEAHEAD_RESULTS: 10,
  SOURCE_JSON_FILE: 'names.json',
  ALLOWED_ORIGIN: `http://${process.env.HOST || 'localhost'}:${
    process.env.PORT || 3000
  }/`,
  PORT: process.env.PORT || 3000,
};

export default Constants;
