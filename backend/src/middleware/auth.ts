import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    // Fail-fast: refuse to start the process if the secret is missing.
    // CRIT-4: a literal default here would make tokens forgeable.
    throw new Error(
        "JWT_SECRET is not set. Set it in backend/.env before starting the server."
    );
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token" });
    }

    try {
        const decoded = jwt.verify(
            token,
            JWT_SECRET,
            { algorithms: ["HS256"] }
        );
        (req as any).user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
};
