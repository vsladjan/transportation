import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Route } from "./Route";
import { Station } from "./Station";
import { Transportationvehicle } from "./Transportationvehicle";

@Index("fk_RouteStation_Route1_idx", ["routeId"], {})
@Index("fk_RouteStation_Station1_idx", ["stationId"], {})
@Index(
  "fk_RouteStation_TransportationVehicle1_idx",
  ["transportationVehicleId"],
  {}
)
@Entity("routestation", { schema: "transportation" })
export class Routestation {
  @Column("int", { primary: true, name: "StationId" })
  stationId: number;

  @Column("int", { primary: true, name: "RouteId" })
  routeId: number;

  @Column("int", { primary: true, name: "TransportationVehicleId" })
  transportationVehicleId: number;

  @Column("time", { primary: true, name: "Time" })
  time: string;

  @Column("varchar", { name: "Type", length: 10 })
  type: string;

  @ManyToOne(() => Route, (route) => route.routestations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "RouteId", referencedColumnName: "id" }])
  route: Route;

  @ManyToOne(() => Station, (station) => station.routestations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "StationId", referencedColumnName: "id" }])
  station: Station;

  @ManyToOne(
    () => Transportationvehicle,
    (transportationvehicle) => transportationvehicle.routestations,
    { onDelete: "NO ACTION", onUpdate: "NO ACTION" }
  )
  @JoinColumn([{ name: "TransportationVehicleId", referencedColumnName: "id" }])
  transportationvehicle: Transportationvehicle;

  @ManyToMany(
    () => Transportationvehicle,
    (transportationvehicle) => transportationvehicle.routestations2
  )
  @JoinTable({
    name: "stationroutes",
    joinColumns: [
      { name: "routestationStationId", referencedColumnName: "stationId" },
    ],
    inverseJoinColumns: [
      { name: "TransportationVehicleId", referencedColumnName: "id" },
    ],
    schema: "transportation",
  })
  transportationvehicles: Transportationvehicle[];
}
