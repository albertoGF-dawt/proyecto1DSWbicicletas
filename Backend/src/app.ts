import express from "express";
import apiRouter from "./routes";

export const app = express();

app.use(express.json());
app.use("/api", apiRouter);

app.get("/", (req, res) => {
    res.json({
        message: "API funcionando",
    });
});

app.get("/holaholita", (req, res) => {
    res.json({
        message: "Mensaje del flanders",
    });
});