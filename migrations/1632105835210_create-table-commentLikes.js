/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('commentlikes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
    },
    comment_id: {
      type: 'VARCHAR(50)',
    },
  });

  pgm.addConstraint(
    'commentlikes',
    'fk_commentlikes.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'commentlikes',
    'fk_commentlikes.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('commentlikes');
};
