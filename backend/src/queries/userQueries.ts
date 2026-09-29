import pool from "../database/connection.js";

export const findUserByEmailQuery = async (email: string) => {
    const result = await pool.query(
        `SELECT id, email, password
           FROM users
          WHERE email = $1`,
        [email]
    );
    return result.rows[0] ?? null;
};

export const createUserQuery = async (email: string, hash: string) => {
    const result = await pool.query(
        `INSERT INTO users (email, password)
         VALUES ($1, $2)
         RETURNING id, email`,
        [email, hash]
    );
    return result.rows[0];
};
