import "reflect-metadata";
import { DataSource } from "typeorm";
// import { User } from "./entities/User";
import { Resource } from './entities/resourceEntity';
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.POSTGRE_HOST,
  port: Number(process.env.POSTGRE_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: false,
  entities: [Resource],
});
