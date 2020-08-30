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

    $("#createCityareaModButton").click(function(){
        $("#createCityareaModal").show();
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/city/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#citySelect').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });
    });

    $("#createCityareaX").click(function(){
        $("#createCityareaModal").hide();
    });

    $("#createCityareaClose").click(function(){
        $("#createCityareaModal").hide();
    });

    $("#createCityareaButton").click(function(){
        $("#createCityareaForm").submit();
    });

    $("button[name='edit']").click(function(){
        $("#editCityareaModal").show();

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/city/get",
            success: function(data){
                $.each(data, function(i, value) {
                    $('#citySelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
            }
        });

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/cityarea/get?id=" + this.id.substr(5),
            success: function(data){
                $("#idEdit").val(data.Id);
                $("#nameEdit").val(data.Name);
                $("#sizeEdit").val(data.Size);
                $("#descriptionEdit").val(data.Description);
                $("#citySelectEdit").val(data.CityId).change();
            }
        });

    });

    $("button[name='delete']").click(function(){
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/cityarea/delete?id=" + this.id.substr(7),
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

    $("#editCityareaClose").click(function(){
        $("#editCityareaModal").hide();
    });
    
    $("#editCityareaX").click(function(){
        $("#editCityareaModal").hide();
    });

    $("#editCityareaButton").click(function(){
        $("#editCityareaForm").submit();
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