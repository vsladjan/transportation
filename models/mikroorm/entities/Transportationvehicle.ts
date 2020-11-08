import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Transportationtype } from './Transportationtype';

@Entity()
export class Transportationvehicle {

  @Property({ fieldName: 'Color', length: 45, nullable: true })
  Color?: string;

  @Property({ fieldName: 'Description', length: 45, nullable: true })
  Description?: string;

  @PrimaryKey({ fieldName: 'Id' })
  Id!: number;

  @Property({ fieldName: 'Name', length: 45 })
  Name!: string;

  @Property({ fieldName: 'ProductionYear', nullable: true })
  ProductionYear?: number;

  @ManyToOne({ entity: () => Transportationtype, fieldName: 'TransportationTypeId', cascade: [], index: 'TransportationTypeId' })
  Transportationtype!: Transportationtype;
  
  constructor(Name: string, Description: string, Color: string, ProductionYear: number){
    this.Name = Name;
    this.Description = Description;
    this.Color = Color;
    this.ProductionYear = ProductionYear;
  }
}
