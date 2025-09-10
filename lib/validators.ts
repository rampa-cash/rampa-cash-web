import { z } from 'zod';

export const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long');

export const nameSchema = z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const sanitizedStringSchema = z
    .string()
    .transform((str) => str.trim().replace(/[<>]/g, '').slice(0, 1000));

export const waitlistRequestSchema = z.object({
    name: nameSchema,
    email: emailSchema,
});

export const baseApiResponseSchema = z.object({
    success: z.boolean(),
    message: z.string().optional(),
    error: z.string().optional(),
});

export const waitlistResponseSchema = baseApiResponseSchema.extend({
    count: z.number().optional(),
});

export type WaitlistRequest = z.infer<typeof waitlistRequestSchema>;
export type BaseApiResponse = z.infer<typeof baseApiResponseSchema>;
export type WaitlistResponse = z.infer<typeof waitlistResponseSchema>;

export const validateEmail = (email: string): boolean => {
    return emailSchema.safeParse(email).success;
};

export const validateName = (name: string): boolean => {
    return nameSchema.safeParse(name).success;
};

export const sanitizeInput = (input: string): string => {
    return sanitizedStringSchema.parse(input);
};
