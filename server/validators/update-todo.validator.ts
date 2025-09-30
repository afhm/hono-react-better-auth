import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

export const updateTodoSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional(),
  })
  .strict();

export const updateTodoValidator = zValidator(
  'json',
  updateTodoSchema,
  (result, c) => {
    if (!result.success) {
      return c.json(
        {
          errors: 'error' in result && result.error
            ? result.error.issues.map((issue) => issue.message)
            : ['Validation failed'],
        },
        400
      );
    }
  }
);
