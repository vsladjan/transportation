import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Routestation } from "./Routestation";

@Entity("route", { schema: "transportation" })
export class Route {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Name", length: 45 })
  name: string;

  @Column("varchar", { name: "Description", nullable: true, length: 45 })
  description: string | null;

  @OneToMany(() => Routestation, (routestation) => routestation.route)
  routestations: Routestation[];
}
