const InvariantError = require('./InvariantError');
const AuthenticationError = require('./AuthenticationError');
// const AuthorizationError = require('./AuthorizationError');
const NotFoundError = require('./NotFoundError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'NEW_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
  ),
  'NEW_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat user baru karena tipe data tidak sesuai'
  ),
  'NEW_USER.USERNAME_LIMIT_CHAR': new InvariantError(
    'tidak dapat membuat user baru karena karakter username melebihi batas limit'
  ),
  'NEW_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError(
    'tidak dapat membuat user baru karena username mengandung karakter terlarang'
  ),
  'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'harus mengirimkan username dan password'
  ),
  'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'username dan password harus string'
  ),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN':
    new InvariantError('harus mengirimkan token refresh'),
  'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
  ),
  'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat thread baru karena tipe data tidak sesuai'
  ),
  'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
  ),
  'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat comment baru karena tipe data tidak sesuai'
  ),
  'NEW_REPLIE.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError(
    'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
  ),
  'NEW_REPLIE.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError(
    'tidak dapat membuat comment baru karena tipe data tidak sesuai'
  ),

  'Missing authentication': new AuthenticationError('Missing authentication'),
  'Not Found': new NotFoundError('Not Found'),
};

module.exports = DomainErrorTranslator;
