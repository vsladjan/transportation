import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { City } from './City';

@Entity()
export class Cityarea {

  @ManyToOne({ entity: () => City, fieldName: 'CityId', cascade: [], index: 'fk_CityArea_City1_idx' })
  City!: City;

  @Property({ fieldName: 'Description', length: 90, nullable: true })
  Description?: string;

  @PrimaryKey({ fieldName: 'Id' })
  Id!: number;

  @Property({ fieldName: 'Name', length: 45 })
  Name!: string;

  @Property({ fieldName: 'Size', length: 45, nullable: true })
  Size?: string;
  
  constructor(Name: string, Size: string, Description: string){
    this.Name = Name;
    this.Size = Size;
    this.Description = Description;
  }
}
