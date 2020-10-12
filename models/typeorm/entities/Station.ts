import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Routestation } from "./Routestation";
import { Cityarea } from "./Cityarea";

@Index("fk_Station_CityArea1_idx", ["cityAreaId"], {})
@Entity("station", { schema: "transportation" })
export class Station {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Name", length: 45 })
  name: string;

  @Column("varchar", { name: "Description", nullable: true, length: 45 })
  description: string | null;

  @Column("varchar", { name: "Location", nullable: true, length: 45 })
  location: string | null;

  @Column("int", { name: "CityAreaId" })
  cityAreaId: number;

  @OneToMany(() => Routestation, (routestation) => routestation.station)
  routestations: Routestation[];

  @ManyToOne(() => Cityarea, (cityarea) => cityarea.stations, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "CityAreaId", referencedColumnName: "id" }])
  cityarea: Cityarea;
}
