import { z } from "zod";

export const acceptmessageSchema = z.object({
  acceptmessages: z.boolean(),
});
