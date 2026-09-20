import jwt from 'jsonwebtoken'
export const isAuthenticated=async(req, res,next)=>{
    try {
        const authorization = req.headers.authorization;
        const bearerToken = authorization?.startsWith("Bearer ")
            ? authorization.slice(7)
            : null;
        const token = req.cookies?.token || bearerToken;
        if (!token) {
            return res.status(401).json({
                message: "User not Authenticated",
                success:false,
            })
        }
        const decode= jwt.verify(token, process.env.Secret_Key)
        if (!decode) {
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        }
        req.id=decode.userId;
        next()
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({
            message: "Invalid or expired token",
            success: false,
        });
    }
};