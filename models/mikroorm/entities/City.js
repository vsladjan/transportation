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
const core_1 = require("@mikro-orm/core");
const Country_1 = require("./Country");
let City = class City {
    constructor(Name, Population, Size) {
        this.Name = Name;
        this.Population = Population;
        this.Size = Size;
    }
};
__decorate([
    core_1.ManyToOne({ entity: () => Country_1.Country, fieldName: 'CountryId', cascade: [], index: 'fk_City_Country_idx' }),
    __metadata("design:type", Country_1.Country)
], City.prototype, "Country", void 0);
__decorate([
    core_1.PrimaryKey({ fieldName: 'Id' }),
    __metadata("design:type", Number)
], City.prototype, "Id", void 0);
__decorate([
    core_1.Property({ fieldName: 'Name', length: 45 }),
    __metadata("design:type", String)
], City.prototype, "Name", void 0);
__decorate([
    core_1.Property({ columnType: 'float', fieldName: 'Population' }),
    __metadata("design:type", Number)
], City.prototype, "Population", void 0);
__decorate([
    core_1.Property({ columnType: 'float', fieldName: 'Size' }),
    __metadata("design:type", Number)
], City.prototype, "Size", void 0);
City = __decorate([
    core_1.Entity(),
    __metadata("design:paramtypes", [String, Number, Number])
], City);
exports.City = City;
//# sourceMappingURL=City.js.map