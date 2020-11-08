"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routestation = void 0;
const core_1 = require("@mikro-orm/core");
const Route_1 = require("./Route");
const Station_1 = require("./Station");
const Transportationvehicle_1 = require("./Transportationvehicle");
let Routestation = class Routestation {
};
__decorate([
    core_1.ManyToOne({ entity: () => Route_1.Route, fieldName: 'RouteId', cascade: [], primary: true, index: 'fk_RouteStation_Route1_idx' }),
    __metadata("design:type", Route_1.Route)
], Routestation.prototype, "Route", void 0);
__decorate([
    core_1.ManyToOne({ entity: () => Station_1.Station, fieldName: 'StationId', cascade: [], primary: true, index: 'fk_RouteStation_Station1_idx' }),
    __metadata("design:type", Station_1.Station)
], Routestation.prototype, "Station", void 0);
__decorate([
    core_1.PrimaryKey({ fieldName: 'Time', columnType: 'time' }),
    __metadata("design:type", String)
], Routestation.prototype, "Time", void 0);
__decorate([
    core_1.ManyToOne({ entity: () => Transportationvehicle_1.Transportationvehicle, fieldName: 'TransportationVehicleId', cascade: [], primary: true, index: 'fk_RouteStation_TransportationVehicle1_idx' }),
    __metadata("design:type", Transportationvehicle_1.Transportationvehicle)
], Routestation.prototype, "Transportationvehicle", void 0);
__decorate([
    core_1.Property({ fieldName: 'Type', length: 10 }),
    __metadata("design:type", String)
], Routestation.prototype, "Type", void 0);
Routestation = __decorate([
    core_1.Entity()
], Routestation);
exports.Routestation = Routestation;
//# sourceMappingURL=Routestation.js.map