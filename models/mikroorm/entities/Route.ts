import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Route {

  @Property({ fieldName: 'Description', length: 45, nullable: true })
  Description?: string;

  @PrimaryKey({ fieldName: 'Id' })
  Id!: number;

  @Property({ fieldName: 'Name', length: 45 })
  Name!: string;
  
  constructor(Name: string, Description: string){
    this.Name = Name;
    this.Description = Description;
  }
}
