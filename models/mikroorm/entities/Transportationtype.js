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
exports.Transportationtype = void 0;
const core_1 = require("@mikro-orm/core");
let Transportationtype = class Transportationtype {
    constructor(Name) {
        this.Name = Name;
    }
};
__decorate([
    core_1.PrimaryKey({ fieldName: 'Id' }),
    __metadata("design:type", Number)
], Transportationtype.prototype, "Id", void 0);
__decorate([
    core_1.Property({ fieldName: 'Name', length: 45 }),
    __metadata("design:type", String)
], Transportationtype.prototype, "Name", void 0);
Transportationtype = __decorate([
    core_1.Entity(),
    __metadata("design:paramtypes", [String])
], Transportationtype);
exports.Transportationtype = Transportationtype;
//# sourceMappingURL=Transportationtype.js.map