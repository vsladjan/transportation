import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Country } from "./Country";
import { Cityarea } from "./Cityarea";

@Index("fk_City_Country_idx", ["countryId"], {})
@Entity("city", { schema: "transportation" })
export class City {
  @PrimaryGeneratedColumn({ type: "int", name: "Id"  })
  id: number;

  @Column("varchar", { name: "Name", length: 45 })
  name: string;

  @Column("float", { name: "Population", precision: 12 })
  population: number;

  @Column("float", { name: "Size", precision: 12 })
  size: number;

  @Column("int", { name: "CountryId" })
  countryId: number;

  @ManyToOne(() => Country, (country) => country.cities, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "CountryId", referencedColumnName: "id" }])
  country: Country;

  @OneToMany(() => Cityarea, (cityarea) => cityarea.city)
  cityareas: Cityarea[];
}
