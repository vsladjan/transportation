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

    /* Create city click */ 
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
        var editId = this.id.substr(5);
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/transportation/country/get",
            success: function(data){
                $('#countrySelectEdit').empty();
                $.each(data, function(i, value) {
                    $('#countrySelectEdit').append($('<option>').text(value.Name).attr('value', value.Id));
                });
                $.ajax({
                    type: "GET",
                    contentType: "application/json",
                    url: "/transportation/city/get?id=" + editId,
                    success: function(data){
                        $("#idEdit").val(data.Id);
                        $("#nameEdit").val(data.Name);
                        $("#sizeEdit").val(data.Size);
                        $("#populationEdit").val(data.Population);
                        $("#countrySelectEdit").val(data.CountryId).change();
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
            url: "/transportation/city/delete?id=" + this.id.substr(7),
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

    var table = $('#data').DataTable();         
    // Event listener to the two range filtering inputs to redraw on input
    $('#min, #max').keyup( function() {
        table.draw();
    } );
});