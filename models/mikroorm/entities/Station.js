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
const core_1 = require("@mikro-orm/core");
const Cityarea_1 = require("./Cityarea");
let Station = class Station {
    constructor(Name, Description, Location) {
        this.Name = Name;
        this.Description = Description;
        this.Location = Location;
    }
};
__decorate([
    core_1.ManyToOne({ entity: () => Cityarea_1.Cityarea, fieldName: 'CityAreaId', cascade: [], index: 'fk_Station_CityArea1_idx' }),
    __metadata("design:type", Cityarea_1.Cityarea)
], Station.prototype, "Cityarea", void 0);
__decorate([
    core_1.Property({ fieldName: 'Description', length: 45, nullable: true }),
    __metadata("design:type", String)
], Station.prototype, "Description", void 0);
__decorate([
    core_1.PrimaryKey({ fieldName: 'Id' }),
    __metadata("design:type", Number)
], Station.prototype, "Id", void 0);
__decorate([
    core_1.Property({ fieldName: 'Location', length: 45, nullable: true }),
    __metadata("design:type", String)
], Station.prototype, "Location", void 0);
__decorate([
    core_1.Property({ fieldName: 'Name', length: 45 }),
    __metadata("design:type", String)
], Station.prototype, "Name", void 0);
Station = __decorate([
    core_1.Entity(),
    __metadata("design:paramtypes", [String, String, String])
], Station);
exports.Station = Station;
//# sourceMappingURL=Station.js.map