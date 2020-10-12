import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transportationvehicle } from "./Transportationvehicle";

@Entity("transportationtype", { schema: "transportation" })
export class Transportationtype {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Name", length: 45 })
  name: string;

  @OneToMany(
    () => Transportationvehicle,
    (transportationvehicle) => transportationvehicle.transportationtype
  )
  transportationvehicles: Transportationvehicle[];
}
