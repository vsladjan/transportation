function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
  

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

    $("#createRoutestationModButton").click(function(){
        $("#createRoutestationModal").show();
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/route/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#routeSelect').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
        $.ajax({
            type: "GET",
            contentType: "applicaiton/json",
            url: "/transportation/station/get",
            success: function(data){
                $.each(data, function(i, value){
                    $('#stationSelect').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
        $.ajax({
            type: "GET",
            contentType: "applicaiton/json",
            url: "/transportation/vehicle/get",
            success: function(data){
                $.each(data, function(i, value){
                    $('#vehicleSelect').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
    });

    $("#createRoutestationX").click(function(){
        $("#createRoutestationModal").hide();
    });

    $("#createRoutestationClose").click(function(){
        $("#createRoutestationModal").hide();
    });

    $("#createRoutestationButton").click(function(){
        $("#createRoutestationForm").submit();
    });

    $("button[name='edit']").click(function(){
        $("#editRoutestationModal").show();

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/route/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#routeSelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
        $.ajax({
            type: "GET",
            contentType: "applicaiton/json",
            url: "/transportation/station/get",
            success: function(data){
                $.each(data, function(i, value){
                    $('#stationSelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
        $.ajax({
            type: "GET",
            contentType: "applicaiton/json",
            url: "/transportation/vehicle/get",
            success: function(data){
                $.each(data, function(i, value){
                    $('#vehicleSelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });

        var values=[], i=0;
        $row = $(this).closest('tr');
        $row.find('td').each(function() {
            values[i++] = $(this).attr('name');
        });
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/routestation/get",
            data: {
                routeId: values[0].substr(3),
                stationId: values[1].substr(3),
                vehicleId: values[2].substr(3),
                time: values[3]
            },
            success: function(data){
                $("#routeSelectEdit").val(data.RouteId).change();
                $("#stationSelectEdit").val(data.StationId).change();
                $("#vehicleSelectEdit").val(data.TransportationVehicleId).change();
                $("#timeEdit").val(data.Time);
                $("#typeEdit").val(data.Type);
                setCookie('routeId', data.RouteId, 1);
                setCookie('stationId', data.StationId, 1);
                setCookie('vehicleId', data.TransportationVehicleId, 1);
                setCookie('timeRS', data.Time, 1);
            }
        });

    });

    $("button[name='delete']").click(function(){
        var values=[], i=0;
        $row = $(this).closest('tr');
        $row.find('td').each(function() {
            values[i++] = $(this).attr('name');
        });
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/routestation/delete",
            data: {
                routeId: values[0].substr(3),
                stationId: values[1].substr(3),
                vehicleId: values[2].substr(3),
                time: values[3]
            },
            success: function(data){
                if (data.message == "Ok"){
                    $row.remove();
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

    $("#editRoutestationClose").click(function(){
        $("#editRoutestationModal").hide();
    });
    
    $("#editRoutestationX").click(function(){
        $("#editRoutestationModal").hide();
    });

    $("#editRoutestationButton").click(function(){
        var routeId = getCookie('routeId');
        var stationId = getCookie('stationId');
        var vehicleId = getCookie('vehicleId');
        var timeRS = getCookie('timeRS');
        setCookie('routeId', '', -1);
        setCookie('stationId', '', -1);
        setCookie('vehicleId', '', -1);
        setCookie('timeRS', '', -1);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/routestation/edit",
            data: {
                oldRouteId: routeId,
                oldStationId: stationId,
                oldVehicleId: vehicleId,
                oldTime: timeRS,
                routeId:  $("#routeSelectEdit").val(),
                stationId: $("#stationSelectEdit").val(),
                vehicleId: $("#vehicleSelectEdit").val(),
                time: $("#timeEdit").val(),
                type: $("#typeEdit").val()
            },
            success: function(data){
                var msg = data.message;
                if (msg.includes("Error"))
                    $('#message').css('background-color', 'red');
                else{
                    $('#message').css('background-color', 'green');
                }
                $("#message").text(msg);
                $("#message").show();
                $("#editRoutestationModal").hide();
                location.reload();
            }
        });
        //$("#editRoutestationForm").submit();
    });

    $("#messageClose").click(function(){
        $("#message").hide();
    });

    var table = $('#data').DataTable();         
    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').keyup( function() {
        table.draw();
    } );

});