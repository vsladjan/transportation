$(document).ready(function(){

    var msg = $("#messageText").text().trim();
    if (msg != "Message"){
        $("#message").show();
        if (msg.includes("Error"))
            $('#message').css('background-color', 'red');
        else
            $('#message').css('background-color', 'green');
    }else{
        
    }

    $("#createCityModButton").click(function(){
        $("#createCityModal").show();
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/country/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#countrySelect').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
    });

    $("#createCityX").click(function(){
        $("#createCityModal").hide();
    });

    $("#createCityClose").click(function(){
        $("#createCityModal").hide();
    });

    $("#createCityButton").click(function(){
        $("#createCityForm").submit();
    });

    $("button[name='edit']").click(function(){
        $("#editCityModal").show();

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/country/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#countrySelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/city/get?id=" + this.id.substr(5),
            success: function(data){
                $("#idEdit").val(data.Id);
                $("#nameEdit").val(data.Name);
                $("#sizeEdit").val(data.Size);
                $("#populationEdit").val(data.Population);
                $("#sizeEdit").val(data.Size);
                $("#countrySelectEdit").val(data.CountryId).change();
            }
        });

    });

    $("button[name='delete']").click(function(){
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/city/delete?id=" + this.id.substr(7),
            success: function(data){
                if (data.message == "Ok"){
                    $("#delete_" + data.id).parent().parent().remove();
                    $('#message').css('background-color', 'green');
                    $("#message").show();
                    $("#messageText").text("Record is successfully deleted!");
                }else{
                    $('#message').css('background-color', 'red');
                    $("#message").show();
                    $("#messageText").text(data.message);
                }
            }
        });
    });

    $("#editCityClose").click(function(){
        $("#editCityModal").hide();
    });
    
    $("#editCityX").click(function(){
        $("#editCityModal").hide();
    });

    $("#editCityButton").click(function(){
        $("#editCityForm").submit();
    });

    $("#messageClose").click(function(){
        $("#message").hide();
    });

});