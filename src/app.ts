import express, { NextFunction, Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser"
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundHandler from "./app/middlewares/notFoundHandler";


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

app.use("/api/v1", router);

// Global Error Handler
app.use(globalErrorHandler);

// Not Found
app.use(notFoundHandler)



export default app;