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

  // Normalize ID fields across legacy and current table schemas
  const pk = copy.id !== undefined && copy.id !== null
    ? copy.id
    : (copy.blog_id || copy.destination_id || copy.package_id || copy.testimonial_id);
  if (copy.id === undefined && pk !== undefined) copy.id = pk;
  if (table === 'blogs' && copy.blog_id === undefined && pk !== undefined) copy.blog_id = pk;

  return copy;
}

function formatForDb(table, doc) {
  const clean = { ...doc };
  delete clean.id; // Don't overwrite auto-increment primary key on insert/update
  delete clean.blog_id;
  delete clean.destination_id;
  delete clean.package_id;
  delete clean.testimonial_id;
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
    try {
      const sql = `SELECT * FROM \`${table}\` ${whereSql} ${orderBy}`;
      const rows = await query(sql, params);
      return rows.map(r => formatFromDb(table, r));
    } catch (err) {
      if (err.message && err.message.includes("Unknown column 'id'") && orderBy.includes('id')) {
        const altPk = table === 'blogs' ? 'blog_id' : (table.endsWith('s') ? table.slice(0, -1) + '_id' : table + '_id');
        const fallbackOrder = `ORDER BY \`${altPk}\` DESC`;
        const sql = `SELECT * FROM \`${table}\` ${whereSql} ${fallbackOrder}`;
        const rows = await query(sql, params);
        return rows.map(r => formatFromDb(table, r));
      }
      throw err;
    }
  },

  /**
   * Fetch a single record by primary key id
   */
  async getById(table, id) {
    const numId = Number(id);
    if (isNaN(numId)) return null;

    try {
      const rows = await query(`SELECT * FROM \`${table}\` WHERE id = ? LIMIT 1`, [numId]);
      if (rows && rows.length > 0) return formatFromDb(table, rows[0]);
    } catch (err) {
      if (!err.message || !err.message.includes("Unknown column 'id'")) throw err;
    }

    // Fallback if legacy table uses blog_id, destination_id, etc.
    const altPk = table === 'blogs' ? 'blog_id' : (table.endsWith('s') ? table.slice(0, -1) + '_id' : table + '_id');
    try {
      const rows = await query(`SELECT * FROM \`${table}\` WHERE \`${altPk}\` = ? LIMIT 1`, [numId]);
      if (rows && rows.length > 0) return formatFromDb(table, rows[0]);
    } catch (err) {
      console.warn(`[Store] getById fallback failed for ${table}:`, err.message);
    }
    return null;
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
    let targetId = Number(id);
    if (isNaN(targetId)) {
      const existing = await this.getOne(table, 'WHERE slug_url = ?', [id]);
      if (existing) {
        targetId = Number(existing.id || existing.blog_id);
      }
    }
    if (isNaN(targetId)) return null;

    const data = formatForDb(table, updates);
    const keys = Object.keys(data).filter(k => data[k] !== undefined);
    if (keys.length === 0) return await this.getById(table, targetId);

    const setClauses = keys.map(k => `\`${k}\` = ?`).join(', ');
    const values = keys.map(k => data[k]);
    values.push(targetId);

    try {
      const sql = `UPDATE \`${table}\` SET ${setClauses} WHERE id = ?`;
      await query(sql, values);
    } catch (err) {
      if (err.message && err.message.includes("Unknown column 'id'")) {
        const altPk = table === 'blogs' ? 'blog_id' : (table.endsWith('s') ? table.slice(0, -1) + '_id' : table + '_id');
        const sql = `UPDATE \`${table}\` SET ${setClauses} WHERE \`${altPk}\` = ?`;
        await query(sql, values);
      } else {
        throw err;
      }
    }

    return await this.getById(table, targetId);
  },

  /**
   * Delete a record by id
   */
  async remove(table, id) {
    const numId = Number(id);
    if (isNaN(numId)) return false;

    try {
      await query(`DELETE FROM \`${table}\` WHERE id = ?`, [numId]);
      return true;
    } catch (err) {
      if (err.message && err.message.includes("Unknown column 'id'")) {
        const altPk = table === 'blogs' ? 'blog_id' : (table.endsWith('s') ? table.slice(0, -1) + '_id' : table + '_id');
        await query(`DELETE FROM \`${table}\` WHERE \`${altPk}\` = ?`, [numId]);
        return true;
      }
      throw err;
    }
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
