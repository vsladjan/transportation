import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Transportationtype {

  @PrimaryKey({ fieldName: 'Id' })
  Id!: number;

  @Property({ fieldName: 'Name', length: 45 })
  Name!: string;
  
  constructor(Name: string){
    this.Name = Name;
  }
}
