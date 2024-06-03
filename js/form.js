

// cart
$(document).ready(function() {
    var totalPrice = 0;

    function updateTotalPrice() {
        var formattedTotalPrice = totalPrice.toLocaleString('id-ID'); // Mengubah total harga ke format ribuan
        $('.total-price').text('Total: Rp. ' + formattedTotalPrice);
    }
    function updateCheckoutButton() {
        const cartItems = document.querySelectorAll('.cart-items .cart-item');
        const checkoutButton = document.querySelector('.submit-data');
        if (cartItems.length > 0) {
            checkoutButton.style.display = 'block';
        } else {
            checkoutButton.style.display = 'none';
        }
    }
    updateCheckoutButton();

    $('.add-to-cart').click(function() {
        var productName = $(this).data('name');
        var productImg = $(this).data('img');
        var productPrice = parseInt($(this).data('price').replace(/\./g, '')); // Menghapus titik ribuan dan mengonversi ke integer

        var existingItem = $('.cart-items li').filter(function() {
            return $(this).data('name') === productName;
        });

        if (existingItem.length > 0) {
            var quantityElement = existingItem.find('.quantity');
            var quantity = parseInt(quantityElement.text());
            quantityElement.text(quantity + 1);

            // Update total price for existing product
            totalPrice += productPrice;
        } else {
            var cartItem = '<li data-name="' + productName + '" class="cart-item">' +
                '<img src="' + productImg + '" width="30" height="30" >' +
                '<button class="btn btn-sm btn-primary plus-btn">+</button>' +
                '<button class="btn btn-sm btn-danger minus-btn">-</button>' +
                '<span class="product-name" style="font-size:0.9em; color:black;">' + productName + '</span>' +
                '<span class="quantity" style="font-size:0.9em; color:black;">1</span>' +
                '<span class="product-price" style="display:none;">' + productPrice + '</span>' + // Hidden product price
                '<button class="btn btn-danger btn-sm remove-cart-item">Remove</button>' +
                '</li>';
            $('.cart-items').append(cartItem);

            // Update total price for new product
            totalPrice += productPrice;
        }

        updateTotalPrice(); // Update total price display
        updateCheckoutButton();


        $('.cart, .cart-toggle').removeClass('hidden');

        // Tampilkan notifikasi kecil
        $('.alert-box').removeClass('hidden').fadeIn().delay(500).fadeOut();
    });

    $(document).on('click', '.remove-cart-item', function() {
        var itemElement = $(this).parent();
        var quantity = parseInt(itemElement.find('.quantity').text());
        var productPrice = parseInt(itemElement.find('.product-price').text());

        totalPrice -= quantity * productPrice; // Kurangi total harga sesuai dengan jumlah produk yang dihapus
        itemElement.remove();

        updateTotalPrice();

        if ($('.cart-items li').length === 0) {
            $('.cart, .cart-toggle').addClass('hidden');
        }
    });

    $(document).on('click', '.plus-btn', function() {
        var itemElement = $(this).parent();
        var quantityElement = itemElement.find('.quantity');
        var quantity = parseInt(quantityElement.text());

        quantityElement.text(quantity + 1);

        var productPrice = parseInt(itemElement.find('.product-price').text());
        totalPrice += productPrice; // Tambahkan harga produk ke total
        updateTotalPrice();
    });

    $(document).on('click', '.minus-btn', function() {
        var itemElement = $(this).parent();
        var quantityElement = itemElement.find('.quantity');
        var quantity = parseInt(quantityElement.text());

        if (quantity > 1) {
            quantityElement.text(quantity - 1);

            var productPrice = parseInt(itemElement.find('.product-price').text());
            totalPrice -= productPrice; // Kurangi harga produk dari total
            updateTotalPrice();
        }
    });

    $('.toggle-cart').click(function() {
        $('.cart').toggle();
    });

    // Tutup keranjang saat klik di luar area keranjang
    $(document).click(function(event) {
        if (!$(event.target).closest('.cart, .toggle-cart, .add-to-cart').length) {
            $('.cart').hide();
        }
    });

    // Tampilkan toggle cart ketika scroll ke section food_section
    $(window).scroll(function() {
        var menuSection = $('#menu');
        var menuOffset = menuSection.offset().top;
        var menuHeight = menuSection.outerHeight();
        var scrollPosition = $(window).scrollTop();

        if (scrollPosition >= menuOffset && scrollPosition <= menuOffset + menuHeight) {
            $('.cart-toggle').fadeIn();
        } else {
            $('.cart-toggle').fadeOut();
        }
    });
});
// cehckout keranjang

var totalPrice = 0; // definisikan secara global








 

    

