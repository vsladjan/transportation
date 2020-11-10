
$(document).ready(function(){

    var msg = $("#messageText").text().trim();
    console.log(msg);
    if (msg != "Message"){
        $("#message").show();
        if (msg.includes("Error"))
            $('#message').css('background-color', 'red');
        else
            $('#message').css('background-color', 'green');
    }else{
        
    }

    /* Handling of which ORM will be used */
    var ormSelected = getCookie("orm");
    if (ormSelected == ""){
        ormSelected = "Sequelize";
        setCookie("orm", ormSelected, 1);
    }
    $("#ormSelect").val(ormSelected).change();

    $('#ormSelect').on('change', function() {
        ormSelected = $("#ormSelect").val();
        setCookie("orm", ormSelected, 1);
    });

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
            async: false,
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
            async: false,
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
            async: false,
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
        var datatable = $('#data').DataTable();
        var datarow = $(this).parents('tr');
        var values=[], i=0;
        $row = $(this).closest('tr');
        $row.find('td').each(function() {
            values[i++] = $(this).attr('name');
        });
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: "/transportation/routestation/delete?routeId=" + values[0].substr(3) + 
                    "&stationId=" + values[1].substr(3) + "&vehicleId=" + values[2].substr(3) +
                         "&time=" + values[3],
            success: function(data){
                if (data.message == "Ok"){
                    datatable.row($(datarow)).remove().draw(false);
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
        var data = {};
        data.oldRouteId = routeId;
        data.oldStationId = stationId;
        data.oldVehicleId = vehicleId;
        data.oldTime = timeRS;
        data.routeId = $("#routeSelectEdit").val();
        data.stationId = $("#stationSelectEdit").val();
        data.vehicleId = $("#vehicleSelectEdit").val();
        data.time = $("#timeEdit").val(),
        data.type = $("#typeEdit").val()
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/transportation/routestation/edit",
            data: JSON.stringify(data),
            contentType: 'application/json',
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
                setTimeout(
                    function() 
                    {
                        location.reload();
                    }, 1000);
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