# Transportation System: This project is for example of usage different ORMs


## Usage

First run SQL script **ts.sql** located in database dir to create database and populate needed data.
After that navigate to root dir of project and run npm install to install all the projects deps.
Add config.json file in root of project with following data:
```json
{
    "db_username": "user",
    "db_password": "password"
}
```
Run **node app.js**, if everything is fine server should be listening on port 3000. Enter in browser **http://localhost:3000/transportation/**