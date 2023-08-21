const { isValidId } = require('./isValidId');

const { validateBody, validateFavoriteBody } = require('./validateBody');

const authenticate = require('./authenticate');

module.exports = { isValidId, validateBody, validateFavoriteBody, authenticate };
