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
exports.Stationroutes = void 0;
const core_1 = require("@mikro-orm/core");
const Routestation_1 = require("./Routestation");
const Transportationvehicle_1 = require("./Transportationvehicle");
let Stationroutes = class Stationroutes {
};
__decorate([
    core_1.ManyToOne({ entity: () => Routestation_1.Routestation, fieldName: 'routestationStationId', cascade: [], primary: true, index: 'IDX_12862a005a9bec93d438fb90f8' }),
    __metadata("design:type", Routestation_1.Routestation)
], Stationroutes.prototype, "routestationStationId", void 0);
__decorate([
    core_1.ManyToOne({ entity: () => Transportationvehicle_1.Transportationvehicle, fieldName: 'TransportationVehicleId', cascade: [], primary: true, index: 'IDX_e77cc2d4223ba10a8ded36cc88' }),
    __metadata("design:type", Transportationvehicle_1.Transportationvehicle)
], Stationroutes.prototype, "TransportationVehicleId", void 0);
Stationroutes = __decorate([
    core_1.Entity()
], Stationroutes);
exports.Stationroutes = Stationroutes;
//# sourceMappingURL=Stationroutes.js.map