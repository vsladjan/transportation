import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Country } from './Country';

@Entity()
export class City {

  @ManyToOne({ entity: () => Country, fieldName: 'CountryId', cascade: [], index: 'fk_City_Country_idx' })
  Country!: Country;

  @PrimaryKey({ fieldName: 'Id' })
  Id!: number;

  @Property({ fieldName: 'Name', length: 45 })
  Name!: string;

  @Property({ columnType: 'float', fieldName: 'Population' })
  Population!: number;

  @Property({ columnType: 'float', fieldName: 'Size' })
  Size!: number;

  constructor(Name: string, Population: number, Size: number){
    this.Name = Name;
    this.Population = Population;
    this.Size = Size;
  }

}