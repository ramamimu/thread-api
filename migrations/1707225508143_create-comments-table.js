/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("comments", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    thread_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    content: {
      type: "VARCHAR(1000)",
      notNull: true,
    },
    owner: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    date: {
      type: "TIMESTAMP WITH TIME ZONE",
      notNull: true,
      default: pgm.func("(now() at time zone 'utc')"),
    },
    is_delete: {
      type: "BOOLEAN",
      notNull: true,
      default: false,
    },
  });
  pgm.addConstraint(
    "comments",
    "fk_comments.owner_users.id",
    "FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "comments",
    "fk_comments.thread_id_threads.id",
    "FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint("comments", "fk_comments.owner_users.id");
  pgm.dropConstraint("comments", "fk_comments.thread_id_threads.id");
  pgm.dropTable("comments");
};
