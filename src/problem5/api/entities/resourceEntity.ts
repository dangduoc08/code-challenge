import "reflect-metadata"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Resource {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  scores!: number;
}
