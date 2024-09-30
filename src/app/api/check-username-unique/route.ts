import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    //validation with zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log("the result: ", result);
    if (!result.success) {
      const usernameErrors =
        result.error.format().username?._errors || [];
      return Response.json(
        {
          succes: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          succes: false,
          message: "Username is not availible",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        succes: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username, error: ", error);
    return Response.json(
      {
        succes: false,
        message: "Error checking username",
      },
      {
        status: 500,
      }
    );
  }
}
