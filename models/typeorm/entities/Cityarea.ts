import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { City } from "./City";
import { Station } from "./Station";

@Index("fk_CityArea_City1_idx", ["cityId"], {})
@Entity("cityarea", { schema: "transportation" })
export class Cityarea {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Name", length: 45 })
  name: string;

  @Column("varchar", { name: "Size", nullable: true, length: 45 })
  size: string | null;

  @Column("varchar", { name: "Description", nullable: true, length: 90 })
  description: string | null;

  @Column("int", { name: "CityId" })
  cityId: number;

  @ManyToOne(() => City, (city) => city.cityareas, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "CityId", referencedColumnName: "id" }])
  city: City;

  @OneToMany(() => Station, (station) => station.cityarea)
  stations: Station[];
}
