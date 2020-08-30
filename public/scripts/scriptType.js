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

    $("#createTypeModButton").click(function(){
        $("#createTypeModal").show();
    });

    $("#createTypeX").click(function(){
        $("#createTypeModal").hide();
    });

    $("#createTypeClose").click(function(){
        $("#createTypeModal").hide();
    });

    $("#createTypeButton").click(function(){
        $("#createTypeForm").submit();
    });

    $("button[name='edit']").click(function(){
        $("#editTypeModal").show();

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/type/get?id=" + this.id.substr(5),
            success: function(data){
                $("#idEdit").val(data.Id);
                $("#nameEdit").val(data.Name);
            }
        });
    });

    $("button[name='delete']").click(function(){
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/type/delete?id=" + this.id.substr(7),
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

    $("#editTypeClose").click(function(){
        $("#editTypeModal").hide();
    });
    
    $("#editTypeX").click(function(){
        $("#editTypeModal").hide();
    });

    $("#editTypeButton").click(function(){
        $("#editTypeForm").submit();
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