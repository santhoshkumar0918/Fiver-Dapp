import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken"

const router = Router();
const prismaClient = new PrismaClient();
const JWT_SECRET = "santhosh0918"

router.post("/sigin", async(req, res) => {
    const hardCodedWallet = "0xa32A6A5a10cC6C028137627977e5739F5568ca65"
    
    const userExisting = await prismaClient.user.findFirst({
        where: {
            address : hardCodedWallet,
        }
    })
    if (userExisting) {
        const token = jwt.sign({
            userID : userExisting.id
        }, JWT_SECRET)
        res.json({
            token
        })
        
    }
    else {
         const user  = await prismaClient.user.create({
             data: {
               address : hardCodedWallet,
           }
         })
          const token = jwt.sign({
            userID : user.id
          }, JWT_SECRET)
         res.json({
            token
        })
    }
});

export default router;