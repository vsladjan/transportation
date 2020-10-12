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
exports.Transportationvehicle = void 0;
const typeorm_1 = require("typeorm");
const Routestation_1 = require("./Routestation");
const Transportationtype_1 = require("./Transportationtype");
let Transportationvehicle = class Transportationvehicle {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "Id" }),
    __metadata("design:type", Number)
], Transportationvehicle.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Name", length: 45 }),
    __metadata("design:type", String)
], Transportationvehicle.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Description", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Transportationvehicle.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Color", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Transportationvehicle.prototype, "color", void 0);
__decorate([
    typeorm_1.Column("int", { name: "ProductionYear", nullable: true }),
    __metadata("design:type", Number)
], Transportationvehicle.prototype, "productionYear", void 0);
__decorate([
    typeorm_1.Column("int", { name: "TransportationTypeId" }),
    __metadata("design:type", Number)
], Transportationvehicle.prototype, "transportationTypeId", void 0);
__decorate([
    typeorm_1.OneToMany(() => Routestation_1.Routestation, (routestation) => routestation.transportationvehicle),
    __metadata("design:type", Array)
], Transportationvehicle.prototype, "routestations", void 0);
__decorate([
    typeorm_1.ManyToMany(() => Routestation_1.Routestation, (routestation) => routestation.transportationvehicles),
    __metadata("design:type", Array)
], Transportationvehicle.prototype, "routestations2", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Transportationtype_1.Transportationtype, (transportationtype) => transportationtype.transportationvehicles, { onDelete: "NO ACTION", onUpdate: "NO ACTION" }),
    typeorm_1.JoinColumn([{ name: "TransportationTypeId", referencedColumnName: "id" }]),
    __metadata("design:type", Transportationtype_1.Transportationtype)
], Transportationvehicle.prototype, "transportationtype", void 0);
Transportationvehicle = __decorate([
    typeorm_1.Index("TransportationTypeId", ["transportationTypeId"], {}),
    typeorm_1.Entity("transportationvehicle", { schema: "transportation" })
], Transportationvehicle);
exports.Transportationvehicle = Transportationvehicle;
//# sourceMappingURL=Transportationvehicle.js.map