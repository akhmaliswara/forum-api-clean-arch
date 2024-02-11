/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade'
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'cascade'
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    is_deleted: {
      type: 'BOOLEAN',
      notNull: true
    },
    date: {
      type: 'TIMESTAMP',
      notNull: true,
    }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('replies');
};
