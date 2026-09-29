// CRIT-4: fail-fast if JWT_SECRET is missing — prevents token forgery with
// a default secret. The middleware/auth.ts module also throws at import time,
// but the explicit check here gives a clearer error message.
//
// dotenv.config() must run BEFORE any import that reads process.env. Since
// ESM hoists all `import` statements above top-level code, we use a
// dynamic import for `app` so dotenv can load .env first.
import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
    console.error("FATAL: JWT_SECRET is not set. Refusing to start.");
    console.error("Generate one with: openssl rand -hex 32");
    process.exit(1);
}

const { app } = await import("./app.js");

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
