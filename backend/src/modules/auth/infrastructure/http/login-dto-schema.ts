import z from 'zod';

export const loginDtoSchema = z.object({
  username: z.string().min(3).max(255),
  password: z.string().min(3).max(255),
});
