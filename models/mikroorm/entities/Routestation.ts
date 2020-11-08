import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Route } from './Route';
import { Station } from './Station';
import { Transportationvehicle } from './Transportationvehicle';

@Entity()
export class Routestation {

  @ManyToOne({ entity: () => Route, fieldName: 'RouteId', cascade: [], primary: true, index: 'fk_RouteStation_Route1_idx' })
  Route!: Route;

  @ManyToOne({ entity: () => Station, fieldName: 'StationId', cascade: [], primary: true, index: 'fk_RouteStation_Station1_idx' })
  Station!: Station;

  @PrimaryKey({ fieldName: 'Time', columnType: 'time' })
  Time!: string;

  @ManyToOne({ entity: () => Transportationvehicle, fieldName: 'TransportationVehicleId', cascade: [], primary: true, index: 'fk_RouteStation_TransportationVehicle1_idx' })
  Transportationvehicle!: Transportationvehicle;

  @Property({ fieldName: 'Type', length: 10 })
  Type!: string;

}
