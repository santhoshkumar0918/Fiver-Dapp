import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { JWT_SECRET } from "..";
import { authMiddleware } from "../Middleware";
import { PrismaClient } from "@prisma/client";

// Extending Request interface to include userId


const router = Router();
const s3Client = new S3Client({
    credentials: {
        accessKeyId: "AKIAQUFLP3L2XOXXPX7G",
        secretAccessKey : "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"
    }
});
const prismaClient = new PrismaClient;
//@ts-ignore
router.get("/presignedUrl", authMiddleware, async (req: Request, res: Response) => {
    //@ts-ignore
    const userId = req.userId; // TypeScript recognizes userId now

    const command = new PutObjectCommand({
        Bucket: "fiver-dappp",
        Key: `/fiver/${userId}/${Math.random()}/image.png`,
        ContentType: "image/png",
    });

    const preSignedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: 3600,
    });

    console.log(preSignedUrl);
    res.json({
        preSignedUrl,
    });
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