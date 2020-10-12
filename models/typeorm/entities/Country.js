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
exports.Country = void 0;
const typeorm_1 = require("typeorm");
const City_1 = require("./City");
let Country = class Country {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "Id" }),
    __metadata("design:type", Number)
], Country.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Name", length: 45 }),
    __metadata("design:type", String)
], Country.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("char", { name: "Code", length: 3 }),
    __metadata("design:type", String)
], Country.prototype, "code", void 0);
__decorate([
    typeorm_1.Column("float", { name: "Size", precision: 12 }),
    __metadata("design:type", Number)
], Country.prototype, "size", void 0);
__decorate([
    typeorm_1.Column("float", { name: "Population", precision: 12 }),
    __metadata("design:type", Number)
], Country.prototype, "population", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Continent", length: 45 }),
    __metadata("design:type", String)
], Country.prototype, "continent", void 0);
__decorate([
    typeorm_1.OneToMany(() => City_1.City, (city) => city.country),
    __metadata("design:type", Array)
], Country.prototype, "cities", void 0);
Country = __decorate([
    typeorm_1.Entity("country", { schema: "transportation" })
], Country);
exports.Country = Country;
//# sourceMappingURL=Country.js.map