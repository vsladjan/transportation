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
const typeorm_1 = require("typeorm");
const Route_1 = require("./Route");
const Station_1 = require("./Station");
const Transportationvehicle_1 = require("./Transportationvehicle");
let Routestation = class Routestation {
};
__decorate([
    typeorm_1.Column("int", { primary: true, name: "StationId" }),
    __metadata("design:type", Number)
], Routestation.prototype, "stationId", void 0);
__decorate([
    typeorm_1.Column("int", { primary: true, name: "RouteId" }),
    __metadata("design:type", Number)
], Routestation.prototype, "routeId", void 0);
__decorate([
    typeorm_1.Column("int", { primary: true, name: "TransportationVehicleId" }),
    __metadata("design:type", Number)
], Routestation.prototype, "transportationVehicleId", void 0);
__decorate([
    typeorm_1.Column("time", { primary: true, name: "Time" }),
    __metadata("design:type", String)
], Routestation.prototype, "time", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Type", length: 10 }),
    __metadata("design:type", String)
], Routestation.prototype, "type", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Route_1.Route, (route) => route.routestations, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    }),
    typeorm_1.JoinColumn([{ name: "RouteId", referencedColumnName: "id" }]),
    __metadata("design:type", Route_1.Route)
], Routestation.prototype, "route", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Station_1.Station, (station) => station.routestations, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    }),
    typeorm_1.JoinColumn([{ name: "StationId", referencedColumnName: "id" }]),
    __metadata("design:type", Station_1.Station)
], Routestation.prototype, "station", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Transportationvehicle_1.Transportationvehicle, (transportationvehicle) => transportationvehicle.routestations, { onDelete: "NO ACTION", onUpdate: "NO ACTION" }),
    typeorm_1.JoinColumn([{ name: "TransportationVehicleId", referencedColumnName: "id" }]),
    __metadata("design:type", Transportationvehicle_1.Transportationvehicle)
], Routestation.prototype, "transportationvehicle", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Transportationvehicle_1.Transportationvehicle, (transportationvehicle) => transportationvehicle.routestations2),
    typeorm_1.JoinTable({
        name: "stationroutes",
        joinColumns: [
            { name: "routestationStationId", referencedColumnName: "stationId" },
        ],
        inverseJoinColumns: [
            { name: "TransportationVehicleId", referencedColumnName: "id" },
        ],
        schema: "transportation",
    }),
    __metadata("design:type", Array)
], Routestation.prototype, "transportationvehicles", void 0);
Routestation = __decorate([
    typeorm_1.Index("fk_RouteStation_Route1_idx", ["routeId"], {}),
    typeorm_1.Index("fk_RouteStation_Station1_idx", ["stationId"], {}),
    typeorm_1.Index("fk_RouteStation_TransportationVehicle1_idx", ["transportationVehicleId"], {}),
    typeorm_1.Entity("routestation", { schema: "transportation" })
], Routestation);
exports.Routestation = Routestation;
//# sourceMappingURL=Routestation.js.map