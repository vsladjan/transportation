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

    $("button[name='edit']").click(function(){
        $("#editCountryModal").show();

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/country/get?id=" + this.id.substr(5),
            success: function(data){
                $("#idEdit").val(data.Id);
                $("#nameEdit").val(data.Name);
                $("#countryCodeEdit").val(data.Code);
                $("#populationEdit").val(data.Population);
                $("#sizeEdit").val(data.Size);
                $("#continentSelectEdit").val(data.Continent).change();
            }
        });
    });

    $("button[name='delete']").click(function(){
        var datatable = $('#data').DataTable();
        var datarow = $(this).parents('tr');
        $.ajax({
            type: "DELETE",
            contentType: "application/json",
            url: "/transportation/country/delete?id=" + this.id.substr(7),
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

    $("#editCountryClose").click(function(){
        $("#editCountryModal").hide();
    });
    
    $("#editCountryX").click(function(){
        $("#editCountryModal").hide();
    });

    $("#editCountryButton").click(function(){
        $("#editCountryForm").submit();
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