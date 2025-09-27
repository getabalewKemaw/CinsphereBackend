import User from "../models/User.js";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
//sign up controller the main logic
// 1 the user enter name email password  and 
//2 check if the user aleardy exists by using email counting
// 3 if exist send error response 
// 4 else hash the password using the bycrypt js and save the user to the db
//5 create a jwt token and send it back to the user
//6 the user will store the token in the local storage and use it for further requests
//7 the token will be verified in the auth middleware
//8 the user will be able to access the protected routes
//9 the user can also login using google oauth
//
export const signUp = async (req, res) => {
    //destructure the request body
    try {
        const { name, email, password } = req.body;
        //check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: ` some one using your email :${email} ` })
        }
        // 400  means bad request
        // if not hash the password 


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // then save the user to the database  in the user database
        const newUser = await User.create({ name, email, password: hashedPassword });
        await newUser.save();//Save the new user
        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(201).json({
            msg: "User created successfully",
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            },
        });


    } catch (error) {

        console.log(error);
       res.status(500).json({ msg: "Internal server error, please try again later", error: error.message });


    }
}

export const login = async (req, res) => {
  try {
    console.log("✅ Login request received");
    console.log("📩 Request body:", req.body);

    const { email, password } = req.body;
    if (!req.body) {
  return res.status(400).json({ msg: "Request body is missing" });
}



    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // 3. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4. Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,   // can’t be accessed by JS
      secure: process.env.NODE_ENV === "production", // only HTTPS in production
      sameSite: "strict", // protect against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 5. Respond with JSON
    res.status(200).json({
      msg: "User logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};



export const googleLogin = (req, res) => {
    res.send("google login placeholder");
}