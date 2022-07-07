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
const core_1 = require("@mikro-orm/core");
const Transportationtype_1 = require("./Transportationtype");
let Transportationvehicle = class Transportationvehicle {
    constructor(Name, Description, Color, ProductionYear) {
        this.Name = Name;
        this.Description = Description;
        this.Color = Color;
        this.ProductionYear = ProductionYear;
    }
};
__decorate([
    (0, core_1.Property)({ fieldName: 'Color', length: 45, nullable: true }),
    __metadata("design:type", String)
], Transportationvehicle.prototype, "Color", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'Description', length: 45, nullable: true }),
    __metadata("design:type", String)
], Transportationvehicle.prototype, "Description", void 0);
__decorate([
    (0, core_1.PrimaryKey)({ fieldName: 'Id' }),
    __metadata("design:type", Number)
], Transportationvehicle.prototype, "Id", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'Name', length: 45 }),
    __metadata("design:type", String)
], Transportationvehicle.prototype, "Name", void 0);
__decorate([
    (0, core_1.Property)({ fieldName: 'ProductionYear', nullable: true }),
    __metadata("design:type", Number)
], Transportationvehicle.prototype, "ProductionYear", void 0);
__decorate([
    (0, core_1.ManyToOne)({ entity: () => Transportationtype_1.Transportationtype, fieldName: 'TransportationTypeId', cascade: [], index: 'TransportationTypeId' }),
    __metadata("design:type", Transportationtype_1.Transportationtype)
], Transportationvehicle.prototype, "Transportationtype", void 0);
Transportationvehicle = __decorate([
    (0, core_1.Entity)(),
    __metadata("design:paramtypes", [String, String, String, Number])
], Transportationvehicle);
exports.Transportationvehicle = Transportationvehicle;
//# sourceMappingURL=Transportationvehicle.js.map