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

    $("#createRouteModButton").click(function(){
        $("#createRouteModal").show();
    });

    $("#createRouteX").click(function(){
        $("#createRouteModal").hide();
    });

    $("#createRouteClose").click(function(){
        $("#createRouteModal").hide();
    });

    $("#createRouteButton").click(function(){
        $("#createRouteForm").submit();
    });

    $("button[name='edit']").click(function(){
        $("#editRouteModal").show();

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/route/get?id=" + this.id.substr(5),
            success: function(data){
                $("#idEdit").val(data.Id);
                $("#nameEdit").val(data.Name);
                $("#descriptionEdit").val(data.Description);
            }
        });
    });

    $("button[name='delete']").click(function(){
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/route/delete?id=" + this.id.substr(7),
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

    $("#editRouteClose").click(function(){
        $("#editRouteModal").hide();
    });
    
    $("#editRouteX").click(function(){
        $("#editRouteModal").hide();
    });

    $("#editRouteButton").click(function(){
        $("#editRouteForm").submit();
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