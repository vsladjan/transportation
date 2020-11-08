import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Country {

  @Property({ fieldName: 'Code', length: 3, columnType: 'char' })
  Code!: string;

  @Property({ fieldName: 'Continent', length: 45 })
  Continent!: string;

  @PrimaryKey({ fieldName: 'Id' })
  Id!: number;

  @Property({ fieldName: 'Name', length: 45 })
  Name!: string;

  @Property({ columnType: 'float', fieldName: 'Population' })
  Population!: number;

  @Property({ columnType: 'float', fieldName: 'Size' })
  Size!: number;
  
  
  constructor(Name: string, Code: string,  Size: number, Population: number, Continent: string){
    this.Name = Name;
    this.Code = Code;
    this.Size = Size;
    this.Population = Population;
    this.Continent = Continent;
  }
}