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
exports.City = void 0;
const typeorm_1 = require("typeorm");
const Country_1 = require("./Country");
const Cityarea_1 = require("./Cityarea");
let City = class City {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn({ type: "int", name: "Id" }),
    __metadata("design:type", Number)
], City.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("varchar", { name: "Name", length: 45 }),
    __metadata("design:type", String)
], City.prototype, "name", void 0);
__decorate([
    typeorm_1.Column("float", { name: "Population", precision: 12 }),
    __metadata("design:type", Number)
], City.prototype, "population", void 0);
__decorate([
    typeorm_1.Column("float", { name: "Size", precision: 12 }),
    __metadata("design:type", Number)
], City.prototype, "size", void 0);
__decorate([
    typeorm_1.Column("int", { name: "CountryId" }),
    __metadata("design:type", Number)
], City.prototype, "countryId", void 0);
__decorate([
    typeorm_1.ManyToOne(() => Country_1.Country, (country) => country.cities, {
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
    }),
    typeorm_1.JoinColumn([{ name: "CountryId", referencedColumnName: "id" }]),
    __metadata("design:type", Country_1.Country)
], City.prototype, "country", void 0);
__decorate([
    typeorm_1.OneToMany(() => Cityarea_1.Cityarea, (cityarea) => cityarea.city),
    __metadata("design:type", Array)
], City.prototype, "cityareas", void 0);
City = __decorate([
    typeorm_1.Index("fk_City_Country_idx", ["countryId"], {}),
    typeorm_1.Entity("city", { schema: "transportation" })
], City);
exports.City = City;
//# sourceMappingURL=City.js.map