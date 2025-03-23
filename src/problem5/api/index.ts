import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import { resourceRouter } from "./routers/resourceRouter";
import { AppDataSource } from "./dataSource";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json(), morgan("dev"), cors());

app.use("/v1/resources", resourceRouter);

AppDataSource.initialize()
  .then(() => {
    console.log("🚀 Database connected!");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => console.error("❌ Database connection error:", error));
