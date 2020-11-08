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
const core_1 = require("@mikro-orm/core");
const City_1 = require("./City");
let Cityarea = class Cityarea {
    constructor(Name, Size, Description) {
        this.Name = Name;
        this.Size = Size;
        this.Description = Description;
    }
};
__decorate([
    core_1.ManyToOne({ entity: () => City_1.City, fieldName: 'CityId', cascade: [], index: 'fk_CityArea_City1_idx' }),
    __metadata("design:type", City_1.City)
], Cityarea.prototype, "City", void 0);
__decorate([
    core_1.Property({ fieldName: 'Description', length: 90, nullable: true }),
    __metadata("design:type", String)
], Cityarea.prototype, "Description", void 0);
__decorate([
    core_1.PrimaryKey({ fieldName: 'Id' }),
    __metadata("design:type", Number)
], Cityarea.prototype, "Id", void 0);
__decorate([
    core_1.Property({ fieldName: 'Name', length: 45 }),
    __metadata("design:type", String)
], Cityarea.prototype, "Name", void 0);
__decorate([
    core_1.Property({ fieldName: 'Size', length: 45, nullable: true }),
    __metadata("design:type", String)
], Cityarea.prototype, "Size", void 0);
Cityarea = __decorate([
    core_1.Entity(),
    __metadata("design:paramtypes", [String, String, String])
], Cityarea);
exports.Cityarea = Cityarea;
//# sourceMappingURL=Cityarea.js.map