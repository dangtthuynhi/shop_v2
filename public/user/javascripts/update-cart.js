document.addEventListener('DOMContentLoaded', function () {
    const updateCartBtn = document.getElementById('updateCartBtn');

    updateCartBtn.addEventListener('click', function (event) {
        event.preventDefault();

        const quantityInputs = document.querySelectorAll('.cart-product-quantity input');

        const updatedCart = [];

        quantityInputs.forEach(function (input, index) {
            const qty = parseInt(input.value, 10);
            const itemId = input.dataset.itemId;
            const sizePriceId = input.dataset.sizepriceId;

            updatedCart.push({
                itemId: itemId,
                sizePriceId: sizePriceId,
                qty: qty
            });
        });

        fetch('/cart/update-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart: updatedCart }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server (if needed)
            console.log(data);
        
            // Reload the page after a short delay (adjust the delay if needed)
            setTimeout(() => {
                // Reload the current page
                window.location.reload();
            }, 500); // 500 milliseconds delay, adjust as needed
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
});