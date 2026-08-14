import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

/**
 * Creates Express middleware that validates the request body with a Zod schema.
 *
 * Keeping validation in reusable middleware means controllers can focus on
 * application logic while invalid requests are rejected at the API boundary.
 */
export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: {
          message: "Validation failed",
          details: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
      });

      return;
    }

    req.body = result.data;

    next();
  };
}
