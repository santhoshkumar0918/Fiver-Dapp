import express from "express";
import userRouter from "./routers/user";
import workerRouter from "./routers/worker";

const app = express();

app.use(express.json());

app.use("/v1/user", userRouter);
app.use("/v1/worker", workerRouter);

app.get("/", (req, res) => {
    res.send("Welcome to the API!");
});

app.use((req, res) => {
    res.status(404).send("Route not found");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
