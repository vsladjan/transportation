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
exports.Station = void 0;
const typeorm_1 = require("typeorm");
const Routestation_1 = require("./Routestation");
const Cityarea_1 = require("./Cityarea");
let Station = class Station {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "Id" }),
    __metadata("design:type", Number)
], Station.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Name", length: 45 }),
    __metadata("design:type", String)
], Station.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Description", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Station.prototype, "description", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Location", nullable: true, length: 45 }),
    __metadata("design:type", String)
], Station.prototype, "location", void 0);
__decorate([
    typeorm_1.Column("int", { name: "CityAreaId" }),
    __metadata("design:type", Number)
], Station.prototype, "cityAreaId", void 0);
__decorate([
    typeorm_1.OneToMany(() => Routestation_1.Routestation, (routestation) => routestation.station),
    __metadata("design:type", Array)
], Station.prototype, "routestations", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Cityarea_1.Cityarea, (cityarea) => cityarea.stations, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    }),
    typeorm_1.JoinColumn([{ name: "CityAreaId", referencedColumnName: "id" }]),
    __metadata("design:type", Cityarea_1.Cityarea)
], Station.prototype, "cityarea", void 0);
Station = __decorate([
    typeorm_1.Index("fk_Station_CityArea1_idx", ["cityAreaId"], {}),
    typeorm_1.Entity("station", { schema: "transportation" })
], Station);
exports.Station = Station;
//# sourceMappingURL=Station.js.map