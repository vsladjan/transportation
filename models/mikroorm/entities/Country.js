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
const core_1 = require("@mikro-orm/core");
let Country = class Country {
    constructor(Name, Code, Size, Population, Continent) {
        this.Name = Name;
        this.Code = Code;
        this.Size = Size;
        this.Population = Population;
        this.Continent = Continent;
    }
};
__decorate([
    core_1.Property({ fieldName: 'Code', length: 3, columnType: 'char' }),
    __metadata("design:type", String)
], Country.prototype, "Code", void 0);
__decorate([
    core_1.Property({ fieldName: 'Continent', length: 45 }),
    __metadata("design:type", String)
], Country.prototype, "Continent", void 0);
__decorate([
    core_1.PrimaryKey({ fieldName: 'Id' }),
    __metadata("design:type", Number)
], Country.prototype, "Id", void 0);
__decorate([
    core_1.Property({ fieldName: 'Name', length: 45 }),
    __metadata("design:type", String)
], Country.prototype, "Name", void 0);
__decorate([
    core_1.Property({ columnType: 'float', fieldName: 'Population' }),
    __metadata("design:type", Number)
], Country.prototype, "Population", void 0);
__decorate([
    core_1.Property({ columnType: 'float', fieldName: 'Size' }),
    __metadata("design:type", Number)
], Country.prototype, "Size", void 0);
Country = __decorate([
    core_1.Entity(),
    __metadata("design:paramtypes", [String, String, Number, Number, String])
], Country);
exports.Country = Country;
//# sourceMappingURL=Country.js.map