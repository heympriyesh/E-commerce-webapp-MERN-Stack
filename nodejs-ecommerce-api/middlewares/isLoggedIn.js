import { getTokenFromHeader } from "../utils/getTokenFromHeaders.js";
import { verifyToken } from "../utils/verifyToken.js";

export const isLoggedIn = async (req, res, next) => {
  // get token from header

  const token = getTokenFromHeader(req);

  // verify the token
  const decodedUser = verifyToken(token);

  if (!decodedUser) return res.status(401).send("Invalid/Expired token");
  else {
    // save the user info into req obj
    req.userAuthId = decodedUser?.id;
    next();
  }
};
