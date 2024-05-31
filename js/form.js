document.addEventListener('DOMContentLoaded', function () {
    var namaLengkapInput = document.getElementById('namaLengkap');
    var noTeleponInput = document.getElementById('noTelepon');
    var alamatInput = document.getElementById('alamat');
    var menuInput = document.getElementById('menu1');
    var kirimButton = document.querySelector('#formpesan .btn-primary');

    kirimButton.addEventListener('click', function () {
        var namaLengkap = namaLengkapInput.value;
        var noTelepon = noTeleponInput.value;
        var alamat = alamatInput.value;
        var menu1 = menuInput.value;

        // Check if all form fields are filled
        if (namaLengkap === '' || noTelepon === '' || alamat === '' || menu1 === '') {
            Swal.fire({
                icon: "warning",
                text: "Lengkapi Formulir Sebelum Melanjutkan",
            });
        } else {
            // Construct the message
        var additionalMessage = "Hallo admin, ada pesanan baru nih👋😇 :\n";
        var formattedData = additionalMessage
            + 'Nama Lengkap: ' + namaLengkap + '\n'
            + 'No Telepon: ' + noTelepon + '\n'
            + 'Alamat: ' + alamat + '\n'
            + 'Menu: ' + menu1;

            // Send the message to Telegram
            var telegramBotURL = 'https://api.telegram.org/bot6901570358:AAHJcBMb1IkLY3LzDtGd6zEq_P2NcCHIBf4/sendMessage';
            var chatId = '-1001955994789'; // Update with your chat ID
            var text = encodeURIComponent(formattedData);
            var sendMessageURL = telegramBotURL + '?chat_id=' + chatId + '&text=' + text;

            fetch(sendMessageURL)
                .then(response => response.json())
                .then(data => {
                    // Handle success response if needed
                    console.log(data);
                    // Optionally, you can display a success message to the user
                    Swal.fire({
                        icon: "success",
                        text: "Pesanan berhasil terkirim!",
                    });
                })
                .catch(error => {
                    // Handle error if needed
                    console.error('Error:', error);
                    // Optionally, you can display an error message to the user
                    Swal.fire({
                        icon: "error",
                        text: "Gagal mengirim pesanan. Silakan coba lagi nanti.",
                    });
                });
        }
    });
});
// cart
$(document).ready(function() {
    var totalPrice = 0;

    function updateTotalPrice() {
        var formattedTotalPrice = totalPrice.toLocaleString('id-ID'); // Mengubah total harga ke format ribuan
        $('.total-price').text('Total: Rp. ' + formattedTotalPrice);
    }

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

        $('.cart').show();

        // Tampilkan notifikasi kecil
        $('.notification').text('Item ditambahkan ke keranjang!').fadeIn().delay(1000).fadeOut();
    });

    $(document).on('click', '.remove-cart-item', function() {
        var itemElement = $(this).parent();
        var quantity = parseInt(itemElement.find('.quantity').text());
        var productPrice = parseInt(itemElement.find('.product-price').text());

        totalPrice -= quantity * productPrice; // Kurangi total harga sesuai dengan jumlah produk yang dihapus
        itemElement.remove();

        updateTotalPrice();

        if ($('.cart-items li').length === 0) {
            $('.cart').hide();
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
});


