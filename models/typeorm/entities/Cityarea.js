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
exports.Cityarea = void 0;
const typeorm_1 = require("typeorm");
const City_1 = require("./City");
const Station_1 = require("./Station");
let Cityarea = class Cityarea {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "int", name: "Id" }),
    __metadata("design:type", Number)
], Cityarea.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "Name", length: 45 }),
    __metadata("design:type", String)
], Cityarea.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "Size", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Cityarea.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)("varchar", { name: "Description", nullable: true, length: 90 }),
    __metadata("design:type", String)
], Cityarea.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { name: "CityId" }),
    __metadata("design:type", Number)
], Cityarea.prototype, "cityId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => City_1.City, (city) => city.cityareas, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "CityId", referencedColumnName: "id" }]),
    __metadata("design:type", City_1.City)
], Cityarea.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Station_1.Station, (station) => station.cityarea),
    __metadata("design:type", Array)
], Cityarea.prototype, "stations", void 0);
Cityarea = __decorate([
    (0, typeorm_1.Index)("fk_CityArea_City1_idx", ["cityId"], {}),
    (0, typeorm_1.Entity)("cityarea", { schema: "transportation" })
], Cityarea);
exports.Cityarea = Cityarea;
//# sourceMappingURL=Cityarea.js.map