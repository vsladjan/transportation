import { Cascade, Entity, ManyToOne } from '@mikro-orm/core';
import { Routestation } from './Routestation';
import { Transportationvehicle } from './Transportationvehicle';

@Entity()
export class Stationroutes {

  @ManyToOne({ entity: () => Routestation, fieldName: 'routestationStationId', cascade: [], primary: true, index: 'IDX_12862a005a9bec93d438fb90f8' })
  routestationStationId!: Routestation;

  @ManyToOne({ entity: () => Transportationvehicle, fieldName: 'TransportationVehicleId', cascade: [], primary: true, index: 'IDX_e77cc2d4223ba10a8ded36cc88' })
  TransportationVehicleId!: Transportationvehicle;

}