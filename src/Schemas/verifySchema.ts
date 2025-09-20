import { z } from "zod";

export const verifySchema = z.object({
    code:z.string().length(5,{message:"Verify code must be at least 5 characters long"}),
})

