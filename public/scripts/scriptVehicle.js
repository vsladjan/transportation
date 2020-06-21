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

    $("#createVehicleModButton").click(function(){
        $("#createVehicleModal").show();
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/type/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#typeSelect').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
    });

    $("#createVehicleX").click(function(){
        $("#createVehicleModal").hide();
    });

    $("#createVehicleClose").click(function(){
        $("#createVehicleModal").hide();
    });

    $("#createVehicleButton").click(function(){
        $("#createVehicleForm").submit();
    });

    $("button[name='edit']").click(function(){
        $("#editVehicleModal").show();

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/type/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#typeSelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/vehicle/get?id=" + this.id.substr(5),
            success: function(data){
                $("#idEdit").val(data.Id);
                $("#nameEdit").val(data.Name);
                $("#descriptionEdit").val(data.Description);
                $("#colorEdit").val(data.Color);
                $("#productionYearEdit").val(data.ProductionYear);
                $("#typeSelectEdit").val(data.TransportationTypeId).change();
            }
        });

    });

    $("button[name='delete']").click(function(){
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/vehicle/delete?id=" + this.id.substr(7),
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

    $("#editVehicleClose").click(function(){
        $("#editVehicleModal").hide();
    });
    
    $("#editVehicleX").click(function(){
        $("#editVehicleModal").hide();
    });

    $("#editVehicleButton").click(function(){
        $("#editVehicleForm").submit();
    });

    $("#messageClose").click(function(){
        $("#message").hide();
    });

});