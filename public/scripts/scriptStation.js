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

    $("#createStationModButton").click(function(){
        $("#createStationModal").show();
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/cityarea/get",
            success: function(data){
                $('#cityareaSelect').empty();
                $.each(data, function(i, value) {
                    $('#cityareaSelect').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
    });

    $("#createStationX").click(function(){
        $("#createStationModal").hide();
    });

    $("#createStationClose").click(function(){
        $("#createStationModal").hide();
    });

    $("#createStationButton").click(function(){
        $("#createStationForm").submit();
    });

    $("button[name='edit']").click(function(){
        $("#editStationModal").show();
        var editId = this.id.substr(5);

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/cityarea/get",
            success: function(data){
                $('#cityareaSelectEdit').empty();
                $.each(data, function(i, value) {
                    $('#cityareaSelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/transportation/station/get?id=" + editId,
                    success: function(data){
                        $("#idEdit").val(data.Id);
                        $("#nameEdit").val(data.Name);
                        $("#descriptionEdit").val(data.Description);
                        $("#locationEdit").val(data.Location);
                        $("#cityareaSelectEdit").val(data.CityAreaId).change();
                    }
                });
            }
        });

        

    });

    $("button[name='delete']").click(function(){
        var datatable = $('#data').DataTable();
        var datarow = $(this).parents('tr');
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: "/transportation/station/delete?id=" + this.id.substr(7),
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

    $("#editStationClose").click(function(){
        $("#editStationModal").hide();
    });
    
    $("#editStationX").click(function(){
        $("#editStationModal").hide();
    });

    $("#editStationButton").click(function(){
        $("#editStationForm").submit();
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