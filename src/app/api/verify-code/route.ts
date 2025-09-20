import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { verifySchema } from "@/Schemas/verifySchema";

// ✅ Define schema for validation
const VerifyCodeSchema = z.object({
  username: z.string(),
  code: verifySchema.shape.code, // reuse code validation from your schema
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    // ✅ Parse and validate input
    const body = await request.json();
    const parsedData = VerifyCodeSchema.safeParse(body);

    if (!parsedData.success) {
      return Response.json(
        {
          success: false,
          message: "Invalid input",
          errors: parsedData.error.errors,
        },
        { status: 400 }
      );
    }

    const { username, code } = parsedData.data;
    const decodedUsername = decodeURIComponent(username);

    // ✅ Find user
    const user = await UserModel.findOne({ username: decodedUsername });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Check code validity
    const isCodeValid = user.verifycode === code;
    const isCodeNotExpired = user.verifycodeExpiry > new Date();

    if (!isCodeValid || !isCodeNotExpired) {
      return Response.json(
        { success: false, message: "Invalid or expired code" },
        { status: 400 }
      );
    }

    // ✅ Mark user as verified
    user.isVerified = true;
    await user.save();

    return Response.json({
      success: true,
      message: "Code verified successfully",
    });
  } catch (error) {
    console.error("Error verifying code", error);
    return Response.json(
      { success: false, message: "Error verifying code" },
      { status: 500 }
    );
  }
}
