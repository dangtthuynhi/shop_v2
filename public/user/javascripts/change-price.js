var changePrice = function () {
    var select = $(".form-control"),
        displayPrice = $(".product-price"),
        input = $("#qty");

    select.change(function () {
        var inputed = input.val();
        var selected = $(this).children("option:selected").val();
        displayPrice.text(selected * inputed);
    });

    input.change(function () {
        var inputed = $(this).val();
        var selected = select.children("option:selected").val();
        displayPrice.text(selected * inputed);
    });
}

changePrice();