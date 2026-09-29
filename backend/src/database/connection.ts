import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "AI_AUTOMATION",
    password: "1234",
    port: 5000
});

export default pool;