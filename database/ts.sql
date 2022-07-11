-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema transportation
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `transportation` ;

-- -----------------------------------------------------
-- Schema transportation
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `transportation` DEFAULT CHARACTER SET utf8 ;
USE `transportation` ;

-- -----------------------------------------------------
-- Table `transportation`.`country`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`country` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Code` CHAR(3) NOT NULL,
  `Size` FLOAT NOT NULL,
  `Population` FLOAT NOT NULL,
  `Continent` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transportation`.`city`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`city` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Population` FLOAT NOT NULL,
  `Size` FLOAT NOT NULL,
  `CountryId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_City_Country_idx` (`CountryId` ASC) VISIBLE,
  CONSTRAINT `fk_City_Country`
    FOREIGN KEY (`CountryId`)
    REFERENCES `transportation`.`country` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transportation`.`cityarea`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`cityarea` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Size` VARCHAR(45) NULL,
  `Description` VARCHAR(90) NULL,
  `CityId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_CityArea_City1_idx` (`CityId` ASC) VISIBLE,
  CONSTRAINT `fk_CityArea_City1`
    FOREIGN KEY (`CityId`)
    REFERENCES `transportation`.`city` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transportation`.`station`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`station` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Description` VARCHAR(45) NULL,
  `Location` VARCHAR(45) NULL,
  `CityAreaId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_Station_CityArea1_idx` (`CityAreaId` ASC) VISIBLE,
  CONSTRAINT `fk_Station_CityArea1`
    FOREIGN KEY (`CityAreaId`)
    REFERENCES `transportation`.`cityarea` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transportation`.`transportationtype`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`transportationtype` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transportation`.`transportationvehicle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`transportationvehicle` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Description` VARCHAR(45) NULL,
  `Color` VARCHAR(45) NULL,
  `ProductionYear` INT NULL,
  `TransportationTypeId` INT NOT NULL,
  PRIMARY KEY (`Id`),
  INDEX `fk_TransportationVehicle_TransoprtationType1_idx` (`TransportationTypeId` ASC) VISIBLE,
  CONSTRAINT `fk_TransportationVehicle_TransoprtationType1`
    FOREIGN KEY (`TransportationTypeId`)
    REFERENCES `transportation`.`transportationtype` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transportation`.`route`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`route` (
  `Id` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(45) NOT NULL,
  `Description` VARCHAR(45) NULL,
  PRIMARY KEY (`Id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `transportation`.`routestation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transportation`.`routestation` (
  `StationId` INT NOT NULL,
  `RouteId` INT NOT NULL,
  `TransportationVehicleId` INT NOT NULL,
  `Time` TIME NOT NULL,
  `Type` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`StationId`, `RouteId`, `TransportationVehicleId`, `Time`),
  INDEX `fk_RouteStation_Station1_idx` (`StationId` ASC) VISIBLE,
  INDEX `fk_RouteStation_Route1_idx` (`RouteId` ASC) VISIBLE,
  INDEX `fk_RouteStation_TransportationVehicle1_idx` (`TransportationVehicleId` ASC) VISIBLE,
  CONSTRAINT `fk_RouteStation_Station1`
    FOREIGN KEY (`StationId`)
    REFERENCES `transportation`.`station` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RouteStation_Route1`
    FOREIGN KEY (`RouteId`)
    REFERENCES `transportation`.`route` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_RouteStation_TransportationVehicle1`
    FOREIGN KEY (`TransportationVehicleId`)
    REFERENCES `transportation`.`transportationvehicle` (`Id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -------------------- COUNTRY --------------------------------
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('Germany', 'GER', 357, 83, 'Europe');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('Italy', 'ITA', 301, 60, 'Europe');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('France', 'FRA', 543, 67, 'Europe');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('Croatia', 'CRO', 56, 4, 'Europe');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('Serbia', 'SER', 88, 7, 'Europe');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('Japan', 'JAP', 377, 125, 'Asia');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('USA', 'USA', 9834, 329, 'North America');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('Brazil', 'BRA', 8516, 212, 'South America');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('Argentina', 'ARG', 2780, 45, 'South America');
 INSERT INTO `country` (`Name`, `Code`, `Size`, `Population`, `Continent`) VALUES ('China', 'CHN', 9597, 1402, 'Asia');
-- -------------------- CITY -----------------------------------
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Berlin', 10, 350, 1);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Frankfurt', 3, 250, 1);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Hamburg', 5, 150, 1);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Lyon', 0.5, 150, 3);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Paris', 5, 350, 3);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Lille', 0.2, 150, 3);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Milano', 3, 550, 2);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Venice', 0.3, 150, 2);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Rome', 6, 650, 2);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Verona', 0.2, 150, 2);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Zagreb', 0.5, 150, 4);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Split', 0.3, 150, 4);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Dubrovnik', 0.2, 130, 4);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Beograd', 2, 450, 5);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Novi Sad', 0.5, 250, 5);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Kragujevac', 0.2, 130, 5);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Tokyo', 14, 450, 6);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Beijing', 21, 540, 10);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Shanghai', 25, 430, 10);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Wuhan', 12, 330, 10);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('New York', 8, 390, 7);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Los Angeles', 6, 340, 7);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Boston', 1, 240, 7);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Austin', 1, 440, 7);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Chicago', 4, 540, 7);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Miami', 2, 240, 7);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Seattle', 0.7, 277, 7);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Rio', 6.7, 377, 8);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Sao Paolo', 22, 400, 8);
 INSERT INTO `city` (`Name`, `Population`, `Size`, `CountryId`) VALUES ('Buenos Aires', 3, 211, 9);
-- -------------------- CITYAREA -----------------------------------
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Berlin 1', 10, 'Berlin 1 description', 1);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Berlin 2', 20, 'Berlin 2 description', 1);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Frankfurt 1', 10, 'Frankfurt 1 description', 2);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Frankfurt 2', 20, 'Frankfurt 2 description', 2);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Lyon 1', 10, 'Lyon 1 description', 4);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Lyon 2', 20, 'Lyon 2 description', 4);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Paris 1', 10, 'Paris 1 description', 5);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Paris 2', 20, 'Paris 2 description', 5);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Paris 3', 30, 'Paris 3 description', 5);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Paris 4', 10, 'Paris 4 description', 5);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Milano 1', 20, 'Milano 1 description', 7);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Venice 1', 20, 'Venice 1 description', 8);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Venice 2', 20, 'Venice 2 description', 8);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Rome 1', 20, 'Rome 1 description', 9);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Rome 2', 20, 'Rome 2 description', 9);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Zagreb 1', 20, 'Zagreb 1 description', 11);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Beograd 1', 20, 'Beograd 1 description', 14);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Tokyo 1', 30, 'Tokyo 1 description', 17);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Tokyo 2', 20, 'Tokyo 2 description', 17);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Tokyo 3', 30, 'Tokyo 3 description', 17);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Beijing 1', 30, 'Beijing 1 description', 18);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Beijing 2', 20, 'Beijing 2 description', 18);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Shanghai 1', 30, 'Shanghai 1 description', 19);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Shanghai 2', 20, 'Shanghai 2 description', 19);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Wuhan 1', 10, 'Wuhan 1 description', 20);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('New York 1', 15, 'New York 1 description', 21);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('New York 2', 15, 'New York 2 description', 21);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Los Angeles 1', 15, 'Los Angeles 1 description', 22);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Los Angeles 2', 15, 'Los Angeles 2 description', 22);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Boston 1', 15, 'Boston 1 description', 23);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Austin 1', 15, 'Austin 1 description', 24);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Chicago 1', 15, 'Chicago 1 description', 25);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Miami 1', 15, 'Miami 1 description', 26);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Seattle 1', 15, 'Seattle 1 description', 27);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Rio 1', 15, 'Rio 1 description', 28);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Rio 2', 20, 'Rio 2 description', 28);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Sao Paolo 1', 10, 'Sao Paolo 1 description', 29);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Sao Paolo 2', 10, 'Sao Paolo 2 description', 29);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Buenos Aires 1', 15, 'Buenos Aires 1 description', 30);
INSERT INTO `cityarea` (`Name`, `Size`, `Description`, `CityId`) VALUES ('Buenos Aires 2', 15, 'Buenos Aires 2 description', 30);
-- -------------------- STATION -----------------------------------
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Berlin 1 S1', 'Berlin 1 S1 description', 'Some location description', 1);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Berlin 1 S2', 'Berlin 1 S2 description', 'Some location description', 1);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Berlin 2 S1', 'Berlin 2 S1 description', 'Some location description', 2);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Berlin 2 S2', 'Berlin 2 S2 description', 'Some location description', 2);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Frankfurt 2 S1', 'Frankfurt 2 S1 description', 'Some location description', 4);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Lyon 1 S1', 'Frankfurt 1 S1 description', 'Some location description', 5);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Paris 1 S1', 'Paris 1 S1 description', 'Some location description', 7);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Paris 1 S2', 'Paris 1 S2 description', 'Some location description', 7);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Paris 2 S1', 'Paris 2 S1 description', 'Some location description', 8);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Paris 2 S2', 'Paris 2 S2 description', 'Some location description', 8);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Paris 3 S1', 'Paris 3 S1 description', 'Some location description', 9);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Milano 1 S1', 'Milano 1 S1 description', 'Some location description', 11);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Venice 1 S1', 'Venice 1 S1 description', 'Some location description', 12);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Venice 2 S1', 'Venice 2 S1 description', 'Some location description', 13);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Rome 1 S1', 'Rome 1 S1 description', 'Some location description', 14);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Rome 2 S1', 'Rome 2 S1 description', 'Some location description', 15);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Zagreb 1 S1', 'Zagreb 1 S1 description', 'Some location description', 16);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Beograd 1 S1', 'Beograd 1 S1 description', 'Some location description', 17);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 1 S1', 'Tokyo 1 S1 description', 'Some location description', 18);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 1 S2', 'Tokyo 1 S2 description', 'Some location description', 18);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 1 S3', 'Tokyo 1 S3 description', 'Some location description', 18);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 1 S4', 'Tokyo 1 S4 description', 'Some location description', 18);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 2 S1', 'Tokyo 2 S1 description', 'Some location description', 19);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 2 S2', 'Tokyo 2 S2 description', 'Some location description', 19);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 3 S1', 'Tokyo 3 S1 description', 'Some location description', 20);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Tokyo 3 S2', 'Tokyo 3 S2 description', 'Some location description', 20);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Beijing 1 S1', 'Beijing 1 S1 description', 'Some location description', 21);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Beijing 2 S1', 'Beijing 2 S1 description', 'Some location description', 22);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Shanghai 1 S1', 'Shanghai 1 S1 description', 'Some location description', 23);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Shanghai 2 S2', 'Shanghai 2 S2 description', 'Some location description', 24);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Wuhan 1 S1', 'Wuhan 1 S1 description', 'Some location description', 25);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('New York 1 S1', 'New York 1 S1 description', 'Some location description', 26);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('New York 1 S2', 'New York 1 S2 description', 'Some location description', 26);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('New York 2 S1', 'New York 2 S1 description', 'Some location description', 27);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('New York 2 S2', 'New York 2 S2 description', 'Some location description', 27);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Los Angeles 1 S1', 'Los Angeles 1 S1 description', 'Some location description', 28);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Los Angeles 1 S2', 'Los Angeles 1 S2 description', 'Some location description', 28);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Boston 1 S1', 'Boston 1 S1 description', 'Some location description', 30);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Boston 1 S2', 'Boston 1 S2 description', 'Some location description', 30);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Austin 1 S1', 'Austin 1 S1 description', 'Some location description', 31);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Austin 1 S2', 'Austin 1 S2 description', 'Some location description', 31);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Chicago 1 S1', 'Chicago 1 S1 description', 'Some location description', 32);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Chicago 1 S2', 'Chicago 1 S2 description', 'Some location description', 32);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Miami 1 S1', 'Miami 1 S1 description', 'Some location description', 33);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Miami 1 S2', 'Miami 1 S2 description', 'Some location description', 33);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Seattle 1 S1', 'Seattle 1 S1 description', 'Some location description', 34);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Rio 1 S1', 'Rio 1 S1 description', 'Some location description', 35);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Sao Paolo 1 S1', 'Sao Paolo 1 S1 description', 'Some location description', 37);
INSERT INTO `station` (`Name`, `Description`, `Location`, `CityAreaId`) VALUES ('Buenos Aires 1 S1', 'Buenos Aires 1 S1 description', 'Some location description', 39);
-- -------------------- TRANSPORTATION TYPE -----------------------------------
INSERT INTO `transportationtype` (`Name`) VALUES ('Bus');
INSERT INTO `transportationtype` (`Name`) VALUES ('Plane');
INSERT INTO `transportationtype` (`Name`) VALUES ('Train');
INSERT INTO `transportationtype` (`Name`) VALUES ('Ship');
INSERT INTO `transportationtype` (`Name`) VALUES ('Car');
-- -------------------- TRANSPORTATION VEHICLE -----------------------------------
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Bus 1', 'Some random bus description', 'Red', '2021', 1);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Bus 2', 'Some random bus description', 'Green', '2020', 1);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Bus 3', 'Some random bus description', 'Blue', '2020', 1);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Bus 4', 'Some random bus description', 'Yellow', '2020', 1);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Bus 5', 'Some random bus description', 'Black', '2021', 1);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Bus 6', 'Some random bus description', 'Black', '2021', 1);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Plane 1', 'Plane description', 'White', '2018', 2);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Plane 2', 'Plane description', 'White', '2017', 2);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Train 1', 'Random train description', 'Blue', '2020', 3);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Train 2', 'Random train description', 'Blue', '2020', 3);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Train 3', 'Random train description', 'Blue', '2020', 3);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Train 4', 'Random train description', 'Blue', '2020', 3);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Ship 1', 'Ship description', 'Red', '2012', 4);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Ship 2', 'Ship description', 'Red', '2012', 4);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Car 1', 'Desc 1', 'White', '2017', 5);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Car 2', 'Desc 2', 'Blue', '2019', 5);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Car 3', 'Desc 3', 'Blue', '2012', 5);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Car 4', 'Desc 4', 'Red', '2017', 5);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Car 5', 'Desc 5', 'Red', '2017', 5);
INSERT INTO `transportationvehicle` (`Name`, `Description`, `Color`, `ProductionYear`, `TransportationTypeId`) VALUES ('Car 6', 'Desc 6', 'Black', '2021', 5);
-- -------------------- ROUTE -----------------------------------
INSERT INTO `route` (`Name`, `Description`) VALUES ('Route1', 'Description 1');
INSERT INTO `route` (`Name`, `Description`) VALUES ('Route2', 'Description 2');
INSERT INTO `route` (`Name`, `Description`) VALUES ('Route3', 'Description 3');
INSERT INTO `route` (`Name`, `Description`) VALUES ('Route4', 'Description 4');
INSERT INTO `route` (`Name`, `Description`) VALUES ('Route5', 'Description 5');
INSERT INTO `route` (`Name`, `Description`) VALUES ('Route6', 'Description 6');
-- -------------------- ROUTESTATION -----------------------------------
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (1, 1, 1, '7:00', 'Type1');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (1, 2, 1, '7:30', 'Type1');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (1, 3, 1, '7:45', 'Type1');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (1, 4, 1, '8:30', 'Type1');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (1, 5, 1, '11:30', 'Type1');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (1, 7, 1, '15:30', 'Type1');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (1, 5, 1, '17:30', 'Type1');

INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (2, 19, 9, '17:00', 'Type2');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (2, 20, 9, '17:30', 'Type2');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (2, 21, 9, '17:45', 'Type2');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (2, 22, 9, '18:00', 'Type2');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (2, 23, 9, '18:20', 'Type2');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (2, 24, 9, '18:45', 'Type2');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (2, 25, 9, '19:15', 'Type2');

INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (3, 32, 10, '11:45', 'Type3');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (3, 33, 10, '12:00', 'Type3');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (3, 34, 10, '12:50', 'Type3');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (3, 38, 10, '16:45', 'Type3');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (3, 39, 10, '17:45', 'Type3');

INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (4, 46, 7, '13:00', 'Type4');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (4, 44, 7, '15:00', 'Type4');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (4, 47, 7, '19:00', 'Type4');

INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (5, 12, 8, '19:00', 'Type5');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (5, 27, 8, '01:00', 'Type5');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (5, 26, 8, '03:00', 'Type5');

INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (6, 18, 3, '12:00', 'Type6');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (6, 17, 3, '14:30', 'Type6');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (6, 13, 3, '18:00', 'Type6');
INSERT INTO `routestation` (`RouteId`, `StationId`, `TransportationVehicleId`, `Time`, `Type`) VALUES (6, 15, 3, '21:00', 'Type6');


DROP USER IF EXISTS 'tsuser'@'%';
CREATE USER 'tsuser'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON transportation.* TO 'tsuser'@'%' WITH GRANT OPTION;
ALTER USER 'tsuser'@'%' IDENTIFIED WITH mysql_native_password BY 'password';