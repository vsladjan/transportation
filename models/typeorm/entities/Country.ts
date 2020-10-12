import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { City } from "./City";

@Entity("country", { schema: "transportation" })
export class Country {
  @PrimaryGeneratedColumn({ type: "int", name: "Id" })
  id: number;

  @Column("varchar", { name: "Name", length: 45 })
  name: string;

  @Column("char", { name: "Code", length: 3 })
  code: string;

  @Column("float", { name: "Size", precision: 12 })
  size: number;

  @Column("float", { name: "Population", precision: 12 })
  population: number;

  @Column("varchar", { name: "Continent", length: 45 })
  continent: string;

  @OneToMany(() => City, (city) => city.country)
  cities: City[];
}
