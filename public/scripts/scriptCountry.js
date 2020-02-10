$(document).ready(function(){

    $("#createCountryModButton").click(function(){
        $("#createCountryModal").show();
    });

    $("#createCountryX").click(function(){
        $("#createCountryModal").hide();
    });

    $("#createCountryClose").click(function(){
        $("#createCountryModal").hide();
    });

    $("#createCountryButton").click(function(){
        $("#createCountryForm").submit();
    });
    
});