"use strict";

var dbm;
var type;
var seed;

var async = require("async");

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  async.series(
    [
      db.createTable.bind(db, "project", {
        project_id: {
          type: "int",
          autoIncrement: true,
          primaryKey: true,
          notNull: true
        },
        name: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "version", {
        version_id: {
          type: "int",
          autoIncrement: true,
          primaryKey: true,
          notNull: true
        },
        project_id: { type: "int", notNull: true },
        version_number: { type: "string", notNull: true }
      }),
      db.createTable.bind(db, "markup", {
        markup_id: {
          type: "string",
          unique: true,
          primaryKey: true,
          notNull: true
        },
        version_id: { type: "int", notNull: true },
        type: { type: "string", notNull: true },
        data: { type: "string", notNull: true },
        location: { type: "string", notNull: true },
        status: { type: "string", notNull: true },
        creator: { type: "string", notNull: true },
        assigned: { type: "string" },
        created_at: { type: "timestamp", notNull: true },
        updated_at: { type: "timestamp", notNull: true }
      })
    ],
    callback
  );
};

exports.down = function(db, callback) {
  async.series(
    [
      db.dropTable.bind(db, "project"),
      db.dropTable.bind(db, "version"),
      db.dropTable.bind(db, "markup")
    ],
    callback
  );
};

exports._meta = {
  version: 1
};
