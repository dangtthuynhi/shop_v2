function addToCart(productCode) {
    var sizeSelect = document.getElementById('size');
    // Get the selected option
    var selectedOption = sizeSelect.options[sizeSelect.selectedIndex];
    // Get the value of the 'data-id' attribute
    var dataId = selectedOption.getAttribute('data-id');

    var qtyInput = document.getElementById('qty');
    var qty = qtyInput.value;

    var addToCartUrl = '/cart/add-to-cart?productCode=' + productCode + '&sizePrice=' + dataId + '&qty=' + qty;

    // Perform any additional actions or validation if needed

    // Redirect to the addToCartUrl
    window.location.href = addToCartUrl;
}