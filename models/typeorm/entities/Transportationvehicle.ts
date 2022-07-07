import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Routestation } from "./Routestation";
import { Transportationtype } from "./Transportationtype";

@Index("TransportationTypeId", ["transportationTypeId"], {})
@Entity("transportationvehicle", { schema: "transportation" })
export class Transportationvehicle {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Name", length: 45 })
  name: string;

  @Column("varchar", { name: "Description", nullable: true, length: 45 })
  description: string | null;

  @Column("varchar", { name: "Color", nullable: true, length: 45 })
  color: string | null;

  @Column("int", { name: "ProductionYear", nullable: true })
  productionYear: number | null;

  @Column("int", { name: "TransportationTypeId" })
  transportationTypeId: number;

  @OneToMany(
    () => Routestation,
    (routestation) => routestation.transportationvehicle
  )
  routestations: Routestation[];

  @ManyToOne(
    () => Transportationtype,
    (transportationtype) => transportationtype.transportationvehicles,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "TransportationTypeId", referencedColumnName: "id" }])
  transportationtype: Transportationtype;
}
