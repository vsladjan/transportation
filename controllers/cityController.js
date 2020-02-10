var express = require("express");


var getShow = function(req, res){
    res.render("city/city");
}

module.exports.getShow = getShow;