import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();

    // existing vrified user
    const existingVerifiedUserByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username is not available",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    // OTP generation
    const verifyCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    //
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User is already registered",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      // OTP expiration time
      const expiryDate = new Date();
      // creating new user
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    // if (!newUser) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: "Failed to create user",
    //     },
    //     { status: 500 }
    //   );
    // } else {
    //   Response.json(
    //     {
    //       success: true,
    //       message: "User created successfully",
    //     },
    //     { status: 201 }
    //   );
    // }
    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message:
          "user registered successfully!! please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user, error: ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}
