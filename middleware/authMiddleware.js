import jwt from "jsonwebtoken";

export const authMiddleWare = (req, res, next) => {
// 1. Get token from Authorization header
  const token = req.cookies.token;
if (!token) return res.status(401).json({ msg: "No token, auth denied" });

  // 2. Format should be "Bearer <token>"

 

  try {
    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user payload to request (decoded = { id: user._id, iat, exp })
    req.user = decoded;

    next(); // ✅ Go to next middleware/controller
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
