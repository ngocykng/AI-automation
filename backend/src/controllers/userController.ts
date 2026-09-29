import { type Request, type Response } from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    createUserQuery,
    findUserByEmailQuery,
} from "../queries/userQueries.js";

const JWT_SECRET = process.env.JWT_SECRET;
// Guarded at startup in middleware/auth.ts; the non-null assertion is safe here.
const SECRET: string = JWT_SECRET!;

// Pre-computed bcrypt hash used only to keep login timing constant for
// non-existent users (anti-enumeration, HIGH-10). Same cost factor as
// the real hash so bcrypt.compare takes the same time in both branches.
const DUMMY_HASH = bcrypt.hashSync("dummy", 12);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 12;

export async function register(
    req: Request,
    res: Response
) {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        !EMAIL_RE.test(email.trim())
    ) {
        return res.status(400).json({
            error: "Invalid email"
        });
    }

    if (
        typeof password !== "string" ||
        password.length < MIN_PASSWORD_LENGTH
    ) {
        return res.status(400).json({
            error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
        });
    }

    try {
        const hash = await bcrypt.hash(password, 12);
        const user = await createUserQuery(
            email.toLowerCase().trim(),
            hash
        );
        return res.status(201).json({ user });
    } catch (err: any) {
        // PostgreSQL unique-violation
        if (err && err.code === "23505") {
            return res.status(409).json({
                error: "Email already registered"
            });
        }
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function login(
    req: Request,
    res: Response
) {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        typeof password !== "string"
    ) {
        return res.status(400).json({
            error: "Email and password are required"
        });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await findUserByEmailQuery(normalizedEmail);

        // Always run bcrypt.compare so the timing is the same whether
        // the user exists or not — prevents email enumeration.
        const hashToCheck = user?.password ?? DUMMY_HASH;
        const isValid = await bcrypt.compare(password, hashToCheck);

        if (!user || !isValid) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            SECRET,
            { expiresIn: "7d", algorithm: "HS256" }
        );

        return res.json({
            token,
            user: { id: user.id, email: user.email }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: "Internal server error"
        });
    }
}
