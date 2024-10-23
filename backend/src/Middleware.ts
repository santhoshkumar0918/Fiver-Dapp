import { NextFunction ,Request,Response } from "express";
import  jwt  from "jsonwebtoken";
import { JWT_SECRET } from ".";


export function authMiddleware(req :Request,res : Response , next : NextFunction) {
    const authHeaders = req.headers["authorization"] ?? "";

   try {
       const decoded = jwt.verify(authHeaders, JWT_SECRET);
       //@ts-ignore
       if (decoded.userId) {
           //@ts-ignore
           req.userid = decoded.userId;
           return next()
       }
       else {
           return res.status(403).json({
               message: "you are not logged in",
           })
       }
   } catch (e) {
       return res.status(403).json({
        message : "you are not  logged in "
    })
   }
}