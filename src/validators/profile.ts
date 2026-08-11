import * as z from "zod";
import { nameSchema } from "./auth";

export const updateNameSchema = z.object({
  name: nameSchema,
});
