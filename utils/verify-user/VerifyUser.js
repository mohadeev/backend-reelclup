import jwt from "jsonwebtoken";
const AuthToken = async (req, res, next) => {
  const reqParamsToken = req.params.token;
  // console.log("user is verfying from here", reqParamsToken);
  if (
    typeof reqParamsToken !== "undefined" &&
    reqParamsToken !== "undefined" &&
    reqParamsToken.length > 20
  ) {
    const CookiesParsed = JSON.parse(req.params.token);
    const User = CookiesParsed;
    if (typeof User !== "undefined") {
      const accesToken = User.accessToken;
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
      jwt.verify(accesToken, accessTokenSecret, function (err, decoded) {
        if (!err) {
          req.userId = decoded;
          const UserIdReq = req.userId;
          if (typeof UserIdReq !== "undefined") {
            console.log(UserIdReq, "vfy");
            next();
          }
        }
      });
    } else {
    }
  }
};
export default AuthToken;
