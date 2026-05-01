@extends('layouts.app')

@section('content')

    <!-- section 1 -->
    <section class="relative bg-white py-20 px-6 overflow-hidden pt-24 md:pt-32">
        <div class="max-w-7xl mx-auto text-center">
            <!-- Judul -->
            <h1 class="text-2xl md:text-4xl lg:text-4xl font-extrabold text-gray-900 mb-8 mt-10">
                Semua Perbaikan Rumah Beres Bersama <span class="text-red-600">GoKang</span>
            </h1>

            <!-- Tombol -->
            <div class="flex justify-center mb-10">
                <button
                    class="group relative flex items-center bg-red-600 hover:bg-green-600 text-white font-bold text-center px-5 py-3 mr-10 rounded-full shadow-md transition duration-300 overflow-hidden">

                    <!-- Logo WhatsApp muncul dari kiri -->
                    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp"
                        class="absolute left-4 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />

                    <span class="transition-all px-4 duration-300 group-hover:ml-6">Hubungi Kami</span>
                </button>
            </div>
        </div>

        <!-- Gambar-gambar dekoratif bawah -->
        <div
            class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-16 items-center justify-center max-w-7xl mx-auto">
            <img src="https://www.gokang.id/images/plumbing.jpg" alt="Pekerja"
                class="rounded-3xl object-cover w-full h-40 sm:h-48 opacity-90">
            <img src="https://www.gokang.id/images/mason.jpg" alt="Tukang"
                class="rounded-3xl object-cover w-full h-40 sm:h-48 opacity-90">
            <img src="https://www.gokang.id/images/electrician.jpg" alt="Listrik"
                class="rounded-3xl object-cover w-full h-40 sm:h-48 opacity-90">
            <img src="https://www.gokang.id/images/painting.jpg" alt="Pengecatan"
                class="rounded-3xl object-cover w-full h-40 sm:h-48 opacity-90 hidden sm:block">
            <img src="https://www.gokang.id/images/worker.jpg" alt="Teknisi"
                class="rounded-3xl object-cover w-full h-40 sm:h-48 opacity-90 hidden md:block">
        </div>
    </section>

    <!-- section 2 -->
    <section class="relative bg-white py-16 md:ml-[-26px] overflow-hidden px-6 md:px-10">
        <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            <!-- Bagian Kiri: Teks -->
            <div class="text-start lg:text-left">
                <h2
                    class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-relaxed md:leading-relaxed">
                    Satu Aplikasi,<br />
                    <span class="text-red-600 text-4xl sm:text-4xl md:text-[70px]">Ratusan Solusi</span>
                </h2>
            </div>

            <!-- Bagian Kanan: Gambar Aplikasi -->
            <div class="flex justify-center lg:justify-end">
                <img src="/img/hp.png" alt="Aplikasi GoKang"
                    class="hidden lg:block w-64 sm:w-80 md:w-96 drop-shadow-xl" />
            </div>
        </div>

        <!-- Kartu-kartu layanan -->
        <div id="cards-container"
            class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl px-6 md:px-6 mx-auto">
            <!-- Card 1 -->
            <div class="card bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-kebocoran.svg" alt="Kebocoran"
                        class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Kebocoran</h3>
                <p class="text-gray-600 text-sm">Jaga Rumah Bebas Bocor</p>
            </div>

            <!-- Card 2 -->
            <div class="card bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-cat.svg" alt="Cat" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Cat</h3>
                <p class="text-gray-600 text-sm">Warnai Rumahmu</p>
            </div>

            <!-- Card 3 -->
            <div class="card bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-keramik.svg" alt="Keramik" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Keramik</h3>
                <p class="text-gray-600 text-sm">Percantik Lantai dan Dindingmu</p>
            </div>

            <!-- Card 4 -->
            <div class="card bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-listrik.svg" alt="Listrik" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Listrik</h3>
                <p class="text-gray-600 text-sm">Rumah Terang, Hati Senang</p>
            </div>

            <!-- Card 5 -->
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-pipa.svg" alt="Pipa" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Pipa</h3>
                <p class="text-gray-600 text-sm">Air Mengalir Lancar</p>
            </div>

            <!-- Card 6 -->
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-toilet.svg" alt="Toilet" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Toilet</h3>
                <p class="text-gray-600 text-sm">Kamar Mandi Bersih dan Nyaman</p>
            </div>

            <!-- Card 7 -->
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-konsultan.svg" alt="Konsultan"
                        class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Konsultan</h3>
                <p class="text-gray-600 text-sm">Bantu Rencanakan Proyekmu</p>
            </div>

            <!-- Card 8 -->
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>
            <div class="card hidden bg-white rounded-3xl p-6 text-center border border-gray-100 transition">
                <div class="flex justify-center mb-3">
                    <img src="https://www.gokang.id/icons/new/icon-solusi-plafon.svg" alt="Plafon" class="w-10 h-10">
                </div>
                <h3 class="text-lg font-bold text-gray-800">Plafon</h3>
                <p class="text-gray-600 text-sm">Kebutuhan Langit-langit Rumahmu</p>
            </div>

            <!-- Tombol Selengkapnya -->
            <div class="col-span-full flex justify-center">
                <button id="toggleButton"
                    class="mt-6 border-2 border-red-600 text-red-600 text-sm sm:text-[16px] md:text-[20px] font-semibold rounded-full px-8 sm:px-10 py-3 hover:bg-red-600 hover:text-white transition-all duration-300">
                    Lihat Layanan Lainnya
                </button>
            </div>
        </div>
    </section>
    <script>
        const toggleButton = document.getElementById('toggleButton');
        const cards = document.querySelectorAll('#cards-container .card');

        toggleButton.addEventListener('click', () => {
            const hiddenCards = [...cards].slice(4); // Ambil semua card setelah card ke-4
            const isHidden = hiddenCards[0].classList.contains('hidden');

            hiddenCards.forEach(card => {
                card.classList.toggle('hidden');
            });

            toggleButton.textContent = isHidden ? 'Sembunyikan' : 'Lihat Layanan Lainnya';
        });
    </script>

    <!-- section 3 -->
    <section
        class="relative bg-gradient-to-r from-red-800 to-red-600 text-white py-16 px-6 overflow-hidden rounded-t-[50px]">
        <!-- Judul -->
        <div class="text-center max-w-3xl mx-auto">
            <h2 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
                Titip Beli Material Bangunan
            </h2>
            <p class="text-base sm:text-lg font-medium">
                Gak perlu repot cari material sendiri! Titip langsung ke Tukang Jagoan lewat aplikasi.
            </p>
        </div>

        <!-- Kartu Fitur -->
        <div class="mt-12 grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <!-- Card 1 -->
            <div class="flex flex-col items-center text-center">
                <div class="bg-white rounded-full p-6 shadow-lg w-40 h-40 flex items-center justify-center">
                    <img src="https://www.gokang.id/untukKonsumen/material/mudah.png" alt="Mudah" class="w-34 h-34" />
                </div>
                <h3 class="text-[22px] font-extrabold mt-4">Mudah</h3>
                <p class="text-lg mt-2 text-white/90 max-w-[800px]">
                    Jenis barang akan direkomendasikan Tukang Jagoan
                </p>
            </div>

            <!-- Card 2 -->
            <div class="flex flex-col items-center text-center">
                <div class="bg-white rounded-full p-6 shadow-lg w-40 h-40 flex items-center justify-center">
                    <img src="https://www.gokang.id/untukKonsumen/material/transparan.webp" alt="Transparan"
                        class="w-26 h-26" />
                </div>
                <h3 class="text-[22px] font-extrabold mt-4">Transparan</h3>
                <p class="text-lg mt-2 text-white/90 max-w-[800px]">
                    Jumlah dan harga material diketahui sebelum dibeli
                </p>
            </div>

            <!-- Card 3 -->
            <div class="flex flex-col items-center text-center">
                <div class="bg-white rounded-full p-6 shadow-lg w-40 h-40 flex items-center justify-center">
                    <img src="https://www.gokang.id/untukKonsumen/material/aman.png" alt="Mudah" class="w-34 h-34" />
                </div>
                <h3 class="text-[22px] font-extrabold mt-4">Aman</h3>
                <p class="text-lg mt-2 text-white/90 max-w-[200px]">
                    Tidak berisiko karena pembayaran melalui aplikasi
                </p>
            </div>

            <!-- Card 4 -->
            <div class="flex flex-col items-center text-center">
                <div class="bg-white rounded-full p-6 shadow-lg w-40 h-40 flex items-center justify-center">
                    <img src="https://www.gokang.id/untukKonsumen/material/nyaman.png" alt="Mudah" class="w-34 h-34" />
                </div>
                <h3 class="text-[22px] font-extrabold mt-4">Nyaman</h3>
                <p class="text-lg mt-2 text-white/90 max-w-[200px]">
                    Tidak perlu cari toko dan beli sendiri
                </p>
            </div>
        </div>
    </section>

    <!-- section 4 -->
    <section class="w-full bg-white py-10 px-6 md:px-16">
        <!-- Judul utama -->
        <h2 class="text-center text-3xl md:text-4xl font-extrabold text-gray-800 mb-12">
            Tukang <span class="text-red-600">Jagoan</span>
        </h2>

        <!-- Konten utama -->
        <div class="flex flex-col md:flex-row items-center justify-center gap-6">
            <!-- Gambar -->
            <div class="w-full md:w-1/2 flex justify-center order-1 md:order-1">
                <img src="https://www.gokang.id/untukKonsumen/tukang-jagoan/jagoan-cat.jpeg" alt="Tukang Cat"
                    class="rounded-[40px] shadow-md w-full max-w-[700px]" />
            </div>

            <!-- Teks -->
            <div class="w-full md:w-1/2 text-center md:text-left order-2 md:order-2">
                <h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">Jagoan Cat</h3>
                <p class="text-gray-600 leading-relaxed sm:mb-4">
                    Cat rumah sudah kusam atau terkelupas? Layanan tukang cat kami bantu membuang cat lama, melakukan
                    cat dasar, finishing dan segala permasalahan cat lainnya. Melayani cat di dinding, plafon, pintu dan
                    jendela kayu.
                </p>
            </div>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-center gap-10">
            <!-- Teks -->
            <div class="w-full md:w-1/2 text-center md:text-left order-2 md:order-1">
                <h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">Jagoan Keramik</h3>
                <p class="text-gray-600 leading-relaxed sm:mb-4">
                    Keramik rumah rusak ingin diganti? Layanan tukang keramik kami ahli dalam bongkar pasang
                    keramik/porselen untuk lantai maupun dinding secara presisi.
                </p>
            </div>
            <!-- Gambar -->
            <div class="w-full md:w-1/2 flex justify-center order-1 md:order-2">
                <img src="https://www.gokang.id/untukKonsumen/tukang-jagoan/jagoan-keramik-illustration.webp"
                    alt="Tukang Keramik" class="rounded-[40px] shadow-md w-full max-w-[700px]" />
            </div>
        </div>

        <div class="flex flex-col md:flex-row items-center justify-center gap-10">
            <!-- Gambar -->
            <div class="w-full md:w-1/2 flex justify-center order-1 md:order-1">
                <img src="https://www.gokang.id/untukKonsumen/tukang-jagoan/jagoan-listrik.jpeg" alt="Tukang Listrik"
                    class="rounded-[40px] shadow-md w-full max-w-[700px]" />
            </div>

            <!-- Teks -->
            <div class="w-full md:w-1/2 text-center md:text-left order-2 md:order-2">
                <h3 class="text-2xl md:text-3xl font-extrabold text-gray-800 mb-2">Jagoan Listrik</h3>
                <p class="text-gray-600 leading-relaxed sm:mb-4">
                    Listrik rumah bermasalah? Layanan tukang listrik kami siap melayani segala kebutuhan listrik seperti
                    memasang stop kontak, fitting lampu, mengatasi konslet dan permasalahan listrik lainnya.
                </p>
            </div>
        </div>
    </section>

    <!-- section 5 -->
    <section class="w-full bg-white py-12 px-6 md:px-16">
        <!-- Judul -->
        <h2 class="text-center text-2xl md:text-3xl font-extrabold text-gray-800 mb-10">
            ...dan Banyak Jagoan Lainnya
        </h2>

        <!-- Grid kartu -->
        <div class="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
            <!-- Card -->
            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-cat.svg" class="w-8 h-8" alt="Jagoan Cat" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Cat</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-keramik.svg" class="w-8 h-8"
                    alt="Jagoan Keramik" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Keramik</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-listrik.svg" class="w-8 h-8"
                    alt="Jagoan Listrik" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Listrik</span>
            </div>

            <!-- Tambahkan kartu lain sesuai kebutuhan -->
            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-pipa.svg" class="w-8 h-8" alt="Jagoan Pipa" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Pipa</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-conblock.svg" class="w-8 h-8" alt="Jagoan Gali" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Gali</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-batu-alam.svg" class="w-8 h-8"
                    alt="Jagoan Besi" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Besi (Las)</span>
            </div>
            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-cat.svg" class="w-8 h-8" alt="Jagoan Cat" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Cat</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-keramik.svg" class="w-8 h-8"
                    alt="Jagoan Keramik" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Keramik</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-listrik.svg" class="w-8 h-8"
                    alt="Jagoan Listrik" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Listrik</span>
            </div>

            <!-- Tambahkan kartu lain sesuai kebutuhan -->
            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-pipa.svg" class="w-8 h-8" alt="Jagoan Pipa" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Pipa</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-conblock.svg" class="w-8 h-8" alt="Jagoan Gali" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Gali</span>
            </div>

            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-batu-alam.svg" class="w-8 h-8"
                    alt="Jagoan Besi" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Besi (Las)</span>
            </div>
            <div
                class="flex items-center gap-3 bg-gray-50 px-5 py-3 rounded-full shadow-sm hover:shadow-md transition w-fit">
                <img src="https://www.gokang.id/icons/new/icon-solusi-batu-alam.svg" class="w-8 h-8"
                    alt="Jagoan Besi" />
                <span class="font-semibold text-gray-800 text-sm md:text-base">Jagoan Besi (Las)</span>
            </div>
        </div>
    </section>

    <!-- section 6 -->
    <section class="w-full bg-white py-12 px-6 md:px-16">
        <div class="flex flex-col md:flex-row items-center justify-center gap-10">
            <!-- Gambar -->
            <div class="relative w-full md:w-1/2 flex justify-center">
                <div class="relative">
                    <!-- Ilustrasi -->
                    <img src="/img/mss.png" alt="CS GoKang"
                        class="relative w-[500px] sm:w-[500px] md:w-[900px] animate-blink-smile" />
                </div>
            </div>

            <!-- Teks -->
            <div class="w-full md:w-1/2 text-center md:text-left">
                <h2 class="text-4xl md:text-6xl font-extrabold text-gray-900 mb-2">
                    Butuh Bantuan?
                </h2>
                <h2 class="text-3xl md:text-6xl font-extrabold text-red-600 mb-4">
                    Tanya GoKang
                </h2>
                <p class="text-gray-800 text-[20px] font-semibold leading-relaxed mb-6">
                    Punya pertanyaan atau ingin konsultasi, <br> kami siap membantu
                </p>

                <!-- Kontak -->
                <div class="flex flex-col gap-3 mb-6">
                    <div class="flex items-center justify-center md:justify-start gap-3">
                        <div class="bg-red-100 p-2 rounded-full">
                            <i class="fa-solid fa-phone text-red-600"></i>
                        </div>
                        <span class="font-bold text-gray-800">(021) 5011 2100</span>
                    </div>
                    <div class="flex items-center justify-center md:justify-start gap-3">
                        <div class="bg-red-100 p-2 rounded-full">
                            <i class="fa-solid fa-envelope text-red-600"></i>
                        </div>
                        <span class="font-bold text-gray-800">cs@gokang.id</span>
                    </div>
                </div>

                <!-- Tombol -->
                <div class="flex justify-start mb-10">
                    <button
                        class="group relative flex items-center bg-red-600 hover:bg-green-600 text-white font-bold text-center px-5 py-3 mr-10 rounded-full shadow-md transition duration-300 overflow-hidden">

                        <!-- Logo WhatsApp muncul dari kiri -->
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp"
                            class="absolute left-4 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />

                        <span class="transition-all px-4 duration-300 text-[18px] group-hover:translate-x-2">Hubungi Kami</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Animasi kedip + senyum -->
        <style>
            @keyframes blinkSmile {

                0%,
                90%,
                100% {
                    transform: scale(1);
                    filter: brightness(1);
                }

                92%,
                94% {
                    transform: scale(0.98) translateY(2px);
                    filter: brightness(0.9);
                }

                96%,
                98% {
                    transform: scale(1.02);
                    filter: brightness(1.1);
                }
            }

            .animate-wink {
                animation: blinkSmile 5s infinite ease-in-out;
            }
        </style>
    </section>

    <!-- section akhir -->
    <section class="bg-[#fde8e8] pt-12 pb-16 px-6 md:px-10 relative overflow-hidden">
        <div class="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">

            <!-- Gambar HP -->
            <div class="flex justify-center md:justify-start w-full md:w-1/2">
                <img src="https://www.gokang.id/footer/gokang-app-interface.webp" alt="Aplikasi GoKang"
                    class="w-[220px] sm:w-[260px] md:w-[300px] lg:w-[340px] drop-shadow-xl" />
            </div>

            <!-- Konten Teks -->
            <div class="w-full md:w-1/2 text-center md:text-left">
                <h2 class="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
                    Belum Punya Aplikasi <span class="text-red-600">GoKang?</span>
                </h2>
                <p class="text-gray-700 mb-6 text-lg">
                    Download aplikasi GoKang sekarang
                </p>

                <!-- Tombol QR dan Store -->
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 mb-4">
                    <a href="#"
                        class="bg-[#f8b4b4] hover:bg-[#f87171] text-red-700 font-semibold rounded-full px-6 py-3 transition-all duration-300 shadow-md">
                        Download dengan QR Code
                    </a>
                </div>

                <!-- Store Button -->
                <div class="flex justify-center md:justify-start gap-4 mt-3">
                    <a href="#"><img src="https://developer.android.com/images/brand/en_app_rgb_wo_45.png"
                            alt="Google Play" class="w-[140px]"></a>
                    <a href="#"><img
                            src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                            alt="App Store" class="w-[130px]"></a>
                </div>
            </div>
        </div>
    </section>
    @endsection

    <!-- Footer -->
    <footer class="bg-white text-gray-800 pt-10 pb-6 px-6 md:px-10">
        <div class="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-10 border-t pt-8">

            <!-- Logo dan Alamat -->
            <div>
                <img src="https://www.gokang.id/images/gokang-logo-new-red.png" alt="GoKang Logo"
                    class="w-[150px] mb-3">
                <p class="font-semibold">PT. Tenaga GoKang Indonesia</p>
                <p class="text-sm leading-relaxed text-gray-600 mt-2">
                    Foresta Business Loft 1 Unit 32 <br>
                    Jl. BSD Raya Utama, BSD City <br>
                    Pagedangan, Kota Tangerang, Banten <br>
                    Kode Pos: 15339 - Indonesia
                </p>
            </div>

            <!-- Kolom 2 -->
            <div>
                <h3 class="font-bold mb-3">Inilah GoKang</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li><a href="#" class="hover:text-red-500">Tentang Kami</a></li>
                    <li><a href="#" class="hover:text-red-500">Berita</a></li>
                    <li><a href="#" class="hover:text-red-500">Blog</a></li>
                    <li><a href="#" class="hover:text-red-500">Karir</a></li>
                </ul>
            </div>

            <!-- Kolom 3 -->
            <div>
                <h3 class="font-bold mb-3">Layanan</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li><a href="#" class="hover:text-red-500">Borongan</a></li>
                    <li><a href="#" class="hover:text-red-500">Tukang Harian</a></li>
                    <li><a href="#" class="hover:text-red-500">GoKang Corp</a></li>
                    <li><a href="#" class="hover:text-red-500">Tukang Jagoan</a></li>
                </ul>
            </div>

            <!-- Kolom 4 -->
            <div>
                <h3 class="font-bold mb-3">Hubungi Kami</h3>
                <ul class="space-y-2 text-sm text-gray-600">
                    <li><a href="#" class="hover:text-red-500">Customer Service</a></li>
                    <li><a href="#" class="hover:text-red-500">Kebijakan & Privasi</a></li>
                    <li><a href="#" class="hover:text-red-500">Syarat & Ketentuan</a></li>
                    <li><a href="#" class="hover:text-red-500">Bantuan</a></li>
                </ul>
            </div>
        </div>

        <!-- Ikon Sosial -->
        <div class="max-w-7xl mx-auto px-6 md:px-10 mt-8 flex justify-center md:justify-start gap-5">
            <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-instagram"></i></a>
            <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-facebook"></i></a>
            <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-tiktok"></i></a>
            <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-youtube"></i></a>
            <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-linkedin"></i></a>
        </div>

        <!-- Copyright -->
        <p class="text-center text-gray-500 text-sm mt-8">
            © 2025 GoKang | Merek terdaftar oleh PT. Tenaga GoKang Indonesia di Direktorat Jenderal Kekayaan Intelektual
            Republik Indonesia
        </p>
    </footer>

    <!-- Script -->
    <script>
        const navbar = document.getElementById("navbar");
        const logo = document.getElementById("navbar-logo");
        const menuBtn = document.getElementById("menu-btn");
        const closeBtn = document.getElementById("close-btn");
        const mobileMenu = document.getElementById("mobile-menu");
        const perbaikiBtn = document.getElementById("perbaikiBtn");
        const perbaikiDropdown = document.getElementById("perbaikiDropdown");
        const menuButton = document.getElementById("menuButton");
        const dropdownMenu = document.getElementById("dropdownMenu");
        const menuArrow = document.getElementById("menuArrow");

        window.addEventListener("scroll", () => {
            const navLinksLive = document.querySelectorAll('#mainNav .nav-link');
            if (window.scrollY > 50) {
                // Saat discroll turun: ubah navbar jadi putih dan teks jadi hitam
                navbar.classList.remove("bg-transparent", "text-black");
                navbar.classList.add("bg-white", "text-black", "shadow-md");
                logo.src = "https://www.gokang.id/images/gokang-logo-new-red.png"; // logo merah

                // Pastikan semua link navbar berwarna hitam (hapus text-black jika ada)
                navLinksLive.forEach(link => {
                    link.classList.remove('text-black');
                    link.classList.add('text-black');
                });
            } else {
                // Saat di atas (awal halaman): navbar transparan dan teks putih
                navbar.classList.add("bg-transparent", "text-black");
                navbar.classList.remove("bg-white", "text-black", "shadow-md");
                logo.src = "https://www.gokang.id/images/gokang-logo-new-red.png"; // logo putih

                // Kembalikan semua link navbar ke warna putih
                navLinksLive.forEach(link => {
                    link.classList.remove('text-black');
                    link.classList.add('text-black');
                });
            }
        });

        // Toggle menu fullscreen
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.remove("hidden");
            mobileMenu.classList.add("flex");
            document.body.style.overflow = "hidden";
        });

        closeBtn.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            mobileMenu.classList.remove("flex");
            document.body.style.overflow = "auto";
        });

        // Ganti warna navbar saat scroll (threshold lebih besar) — sinkronkan juga warna link
        window.addEventListener("scroll", () => {
            const navLinksLive = document.querySelectorAll('#mainNav .nav-link');
            if (window.scrollY > window.innerHeight - 100) {
                navbar.classList.remove("bg-transparent", "text-white");
                navbar.classList.add("bg-white/60", "text-black", "shadow-md");

                navLinksLive.forEach(link => {
                    link.classList.remove('text-white');
                    link.classList.add('text-black');
                });
            } else {
                navbar.classList.remove("bg-white/60", "text-black", "shadow-md");
                navbar.classList.add("bg-transparent", "text-white");

                navLinksLive.forEach(link => {
                    link.classList.remove('text-black');
                    link.classList.add('text-white');
                });
            }
        });

        // Dropdown Perbaiki Bangunan
        const perbaikiArrow = document.getElementById('perbaikiArrow');

        perbaikiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            perbaikiDropdown.classList.toggle('hidden');
            perbaikiArrow.classList.toggle('rotate-180');
        });

        // Dropdown Lainnya
        menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
            menuArrow.classList.toggle('rotate-180');
        });

        // Tutup semua dropdown ketika klik di luar
        document.addEventListener('click', (e) => {
            // Untuk dropdown Perbaiki Bangunan
            if (!perbaikiBtn.contains(e.target) && !perbaikiDropdown.contains(e.target)) {
                perbaikiDropdown.classList.add('hidden');
                perbaikiArrow.classList.remove('rotate-180');
            }

            // Untuk dropdown Lainnya
            if (!menuButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
                menuArrow.classList.remove('rotate-180');
            }
        });

        const navLinks = document.querySelectorAll("#mainNav .nav-link");

        // Ambil hash atau path saat ini
        const currentHash = window.location.hash || "#perbaikiBangunan";

        // Loop dan aktifkan yang sesuai
        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentHash) {
                // hanya tambahkan penanda aktif (tebal + underline), warna mengikuti state navbar
                link.classList.add("font-bold");
                link.classList.add("after:w-full"); // tampilkan underline merah
            } else {
                link.classList.remove("font-bold");
                link.classList.remove("after:w-full");
            }

            // Saat diklik, ubah aktif secara langsung tanpa reload
            link.addEventListener("click", () => {
                navLinks.forEach(l => {
                    l.classList.remove("font-bold");
                    l.classList.remove("after:w-full");
                });
                link.classList.add("font-bold");
                link.classList.add("after:w-full");
            });
        });
    </script>
</body>

</html>