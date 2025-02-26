const pool = require('./db');

class BaseModel {
    constructor(table) {
        this.table = table;
    }

    async findAll() {
        const [rows] = await pool.query(`SELECT * FROM ${this.table}`);
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.query(`SELECT * FROM ${this.table} WHERE id = ?`, [id]);
        return rows[0];
    }

    async create(data) {
        const [result] = await pool.query(`INSERT INTO ${this.table} SET ?`, data);
        return result.insertId;
    }

    async update(id, data) {
        await pool.query(`UPDATE ${this.table} SET ? WHERE id = ?`, [data, id]);
    }

    async delete(id) {
        await pool.query(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    }
}

module.exports = BaseModel;