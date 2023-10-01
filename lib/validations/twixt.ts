import * as z from "zod";
export const TwixtValidation = z.object({
  twixt: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  twixt: z.string().nonempty().min(3, { message: "Minimum 3 characters" }),
});
