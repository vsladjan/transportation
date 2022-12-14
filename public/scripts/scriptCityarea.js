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
 

    $("#createCityareaModButton").click(function(){
        $("#createCityareaModal").show();
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/city/get",
            success: function(data){
                $('#citySelect').empty();
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
        var editId = this.id.substr(5);
        
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/city/get",
            success: function(data){
                $('#citySelectEdit').empty();
                $.each(data, function(i, value) {
                    $('#citySelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/transportation/cityarea/get?id=" + editId,
                    success: function(data){
                        $("#idEdit").val(data.Id);
                        $("#nameEdit").val(data.Name);
                        $("#sizeEdit").val(data.Size);
                        $("#descriptionEdit").val(data.Description);
                        $("#citySelectEdit").val(data.CityId).change();
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
            url: "/transportation/cityarea/delete?id=" + this.id.substr(7),
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