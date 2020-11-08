import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Cityarea } from './Cityarea';

@Entity()
export class Station {

  @ManyToOne({ entity: () => Cityarea, fieldName: 'CityAreaId', cascade: [], index: 'fk_Station_CityArea1_idx' })
  Cityarea!: Cityarea;

  @Property({ fieldName: 'Description', length: 45, nullable: true })
  Description?: string;

  @PrimaryKey({ fieldName: 'Id' })
  Id!: number;

  @Property({ fieldName: 'Location', length: 45, nullable: true })
  Location?: string;

  @Property({ fieldName: 'Name', length: 45 })
  Name!: string;
  
  constructor(Name: string, Description: string, Location: string){
    this.Name = Name;
    this.Description = Description;
    this.Location = Location;
  }
}
