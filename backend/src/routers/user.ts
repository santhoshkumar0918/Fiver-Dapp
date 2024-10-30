import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { JWT_SECRET } from "..";
import { authMiddleware } from "../Middleware";



const router = Router();
const s3Client = new S3Client({
    credentials: {
        accessKeyId: process.env.NEXT_ACESS_KEY,
        secretAccessKey : process.env.NEXT_SECRET_KEY
    }
});
const prismaClient = new PrismaClient;


router.get("/task", authMiddleware, async (req: , res) => {
  //@ts-ignore
  const userId = req.userId;  // TypeScript now recognizes userId on req
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const command = new PutObjectCommand({
    Bucket: "fiver-dappp",
    Key: `/fiver/${userId}/${Math.random()}/image.png`,
    ContentType: "image/png",
  });

  const preSignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  console.log(preSignedUrl);

  res.json({ preSignedUrl });
});








router.post("/signin", async(req, res) => {
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