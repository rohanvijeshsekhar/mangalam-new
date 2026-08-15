/**
 * db/store.js — Asynchronous MySQL Persistence Store for Mangalam Travel & Tours
 * Replaces JSON flat files with Hostinger MySQL Database queries.
 */
const { query } = require('./mysql');

// JSON columns that require serialization when saving and parsing when fetching
const JSON_COLUMNS = {
  destinations: ['places_to_visit'],
  packages: ['banner_images'],
  collections: ['package_ids'],
  enquiries: ['children_ages', 'places_to_visit']
};

function formatFromDb(table, row) {
  if (!row) return null;
  const copy = { ...row };
  const jsonCols = JSON_COLUMNS[table] || [];

  for (const col of jsonCols) {
    if (copy[col] !== undefined && copy[col] !== null) {
      if (typeof copy[col] === 'string') {
        try {
          copy[col] = JSON.parse(copy[col]);
        } catch {
          copy[col] = [];
        }
      }
    }
  }
  return copy;
}

function formatForDb(table, doc) {
  const clean = { ...doc };
  delete clean.id; // Don't overwrite auto-increment primary key on insert/update
  const jsonCols = JSON_COLUMNS[table] || [];

  for (const col of jsonCols) {
    if (clean[col] !== undefined && clean[col] !== null) {
      if (typeof clean[col] !== 'string') {
        clean[col] = JSON.stringify(clean[col]);
      }
    }
  }
  return clean;
}

const store = {
  /**
   * Fetch all records from a table
   * @param {string} table
   * @param {string} [whereSql] e.g. "WHERE destination_id = ? AND type = ?"
   * @param {Array} [params]
   * @param {string} [orderBy] e.g. "ORDER BY id DESC"
   */
  async getAll(table, whereSql = '', params = [], orderBy = 'ORDER BY id DESC') {
    const sql = `SELECT * FROM \`${table}\` ${whereSql} ${orderBy}`;
    const rows = await query(sql, params);
    return rows.map(r => formatFromDb(table, r));
  },

  /**
   * Fetch a single record by primary key id
   */
  async getById(table, id) {
    const rows = await query(`SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`, [Number(id)]);
    if (!rows || rows.length === 0) return null;
    return formatFromDb(table, rows[0]);
  },

  /**
   * Fetch a single record by custom WHERE clause
   */
  async getOne(table, whereSql = '', params = []) {
    const sql = `SELECT * FROM \`${table}\` ${whereSql} LIMIT 1`;
    const rows = await query(sql, params);
    if (!rows || rows.length === 0) return null;
    return formatFromDb(table, rows[0]);
  },

  /**
   * Insert a new record into table and return the inserted doc
   */
  async insert(table, doc) {
    const data = formatForDb(table, doc);
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    const values = keys.map(k => data[k]);
    const placeholders = keys.map(() => '?').join(', ');
    const columns = keys.map(k => `\`${k}\``).join(', ');

    const sql = `INSERT INTO \`${table}\` (${columns}) VALUES (${placeholders})`;
    const result = await query(sql, values);
    const insertedId = result.insertId;

    return await this.getById(table, insertedId);
  },

  /**
   * Update an existing record by id and return the updated doc
   */
  async update(table, id, updates) {
    const data = formatForDb(table, updates);
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    if (keys.length === 0) return await this.getById(table, id);

    const setClauses = keys.map(k => `\`${k}\` = ?`).join(', ');
    const values = keys.map(k => data[k]);
    values.push(Number(id));

    const sql = `UPDATE \`${table}\` SET ${setClauses} WHERE id = ?`;
    await query(sql, values);

    return await this.getById(table, id);
  },

  /**
   * Delete a record by id
   */
  async remove(table, id) {
    await query(`DELETE FROM \`${table}\` WHERE id = ?`, [Number(id)]);
    return true;
  },

  /**
   * Count records in table
   */
  async count(table, whereSql = '', params = []) {
    const sql = `SELECT COUNT(*) as total FROM \`${table}\` ${whereSql}`;
    const rows = await query(sql, params);
    return rows && rows[0] ? Number(rows[0].total) : 0;
  }
};

module.exports = store;
