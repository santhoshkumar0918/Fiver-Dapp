import { Router } from "express";

const router = Router();

router.post("/signin", (req, res) => {
      res.json({ message: "Worker signin endpoint" });
});

export default router;