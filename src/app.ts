import express, { NextFunction, Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"


const app: Application = express();
app.use(cors());
app.use(cookieParser())

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    Message: "Eventlyze Server...",
  });
});


// app.use("/api/v1", router);



export default app;