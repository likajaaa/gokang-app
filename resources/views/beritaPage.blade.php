@extends('layouts.app')

@section('content')

    <!-- section 1 -->
    <section class="w-full px-6 md:px-14 lg:px-24 py-10 md:py-24">

        <!-- TOP ROW: title kiri, search kanan -->
        <div class="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <!-- Title (left) -->
            <h2 class="text-4xl md:text-5xl font-extrabold text-gray-900">
                Berita
            </h2>

            <!-- Search (right) -->
            <div class="w-full md:w-[55%] lg:w-[45%]">
                <div class="relative">
                    <input type="text" placeholder="Cari artikel disini"
                        class="w-full rounded-full border border-gray-200 shadow-sm py-3 pl-12 pr-14 text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-200" />
                    <!-- icon left -->
                    <div class="absolute left-4 top-1/2 -translate-y-1/2 text-red-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <circle cx="10.5" cy="10.5" r="5.5" fill="currentColor" class="text-red-600"></circle>
                        </svg>
                    </div>

                    <!-- button right -->
                    <button
                        class="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 w-10 h-10 rounded-full flex items-center justify-center text-white shadow">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" stroke="currentColor"
                            stroke-width="2" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- HERO CARD -->
        <div class="w-full max-w-[1200px] mx-auto relative">

            <!-- card wrapper -->
            <div id="sliderWrapper" class="relative rounded-[28px] overflow-hidden shadow-xl">

                <!-- image -->
                <img id="sliderImage" src="https://wpcms.gokang.id/wp-content/uploads/2025/10/cashback-100-survey-untuk-pengerjaan-perbaikan-rumah.webp"
                    class="w-full h-[420px] md:h-[520px] object-cover relative z-10">

                <!-- left arrow -->
                <button id="prevBtn"
                    class="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/25 backdrop-blur rounded-full border border-white/40 flex items-center justify-center text-white hover:scale-105 transition-shadow z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <!-- right arrow -->
                <button id="nextBtn"
                    class="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/25 backdrop-blur rounded-full border border-white/40 flex items-center justify-center text-white hover:scale-105 transition-shadow z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                <!-- Text overlay -->
                <div class="absolute left-6 md:left-12 bottom-6 md:bottom-10 text-white z-20 max-w-[70%]">
                    <p class="text-sm md:text-base opacity-80 mb-2">Agt 7, 2023</p>
                    <h3 class="text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight">
                        PLN Gandeng GoKang Kembangkan Bisnis Beyond kWh
                    </h3>
                    <p class="mt-2 text-sm md:text-base opacity-90 max-w-2xl">
                        PLN gandeng GoKang dalam program kolaborasi untuk memberikan pelayanan konsumen...
                    </p>
                </div>

            </div>
        </div>

        <!-- small spacing -->
        <div class="mt-6"></div>

        <!-- OPTIONAL: pagination dots (centered) -->
        <div id="dots" class="flex justify-center gap-2 mt-4"></div>
    </section>

    <!-- script: simple fade slider for multiple images -->
    <script>
        (function () {
            // images list (replace and add as needed)
            const banners = [
                'https://wpcms.gokang.id/wp-content/uploads/2025/10/cashback-100-survey-untuk-pengerjaan-perbaikan-rumah.webp',
                'https://wpcms.gokang.id/wp-content/uploads/2025/10/diskon-60-survey-perbaikan-rumah-gokang.webp',
                'https://wpcms.gokang.id/wp-content/uploads/2025/10/cashback-100-survey-untuk-pengerjaan-perbaikan-rumah.webp'
            ];

            // references
            const wrapper = document.querySelector('.max-w-[1200px] > .relative');
            const imgEl = wrapper.querySelector('img');
            const prev = document.getElementById('prevBtn');
            const next = document.getElementById('nextBtn');
            const dotsContainer = document.getElementById('dots');

            // state
            let idx = 0;
            let animating = false;
            const duration = 700; // ms (matches tailwind transition duration if used)

            // create dots
            function createDots() {
                dotsContainer.innerHTML = '';
                banners.forEach((_, i) => {
                    const d = document.createElement('button');
                    d.className = 'w-3 h-3 rounded-full bg-gray-300/60';
                    d.onclick = () => goTo(i);
                    dotsContainer.appendChild(d);
                });
                updateDots();
            }

            function updateDots() {
                const dots = dotsContainer.children;
                for (let i = 0; i < dots.length; i++) {
                    dots[i].classList.toggle('bg-white', i === idx);
                    dots[i].classList.toggle('bg-gray-300/60', i !== idx);
                }
            }

            // fade to index
            function goTo(i) {
                if (animating || i === idx) return;
                animating = true;

                // create overlay img for crossfade
                const overlay = document.createElement('img');
                overlay.src = banners[i];
                overlay.className = 'absolute inset-0 w-full h-full object-cover z-15';
                overlay.style.opacity = 0;
                overlay.style.transition = `opacity ${duration}ms ease`;
                wrapper.appendChild(overlay);

                // fade-in overlay while original stays
                requestAnimationFrame(() => {
                    overlay.style.opacity = 1;
                });

                setTimeout(() => {
                    // replace main img src
                    imgEl.src = banners[i];
                    // remove overlay
                    wrapper.removeChild(overlay);
                    idx = i;
                    updateDots();
                    animating = false;
                }, duration + 20);
            }

            function nextSlide() {
                goTo((idx + 1) % banners.length);
            }
            function prevSlide() {
                goTo((idx - 1 + banners.length) % banners.length);
            }

            // attach
            next.addEventListener('click', nextSlide);
            prev.addEventListener('click', prevSlide);

            // init
            createDots();

            // autoplay (optional)
            let autoplay = setInterval(nextSlide, 6000);
            // pause on hover
            wrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
            wrapper.addEventListener('mouseleave', () => autoplay = setInterval(nextSlide, 6000));

        })();
    </script>

    <style>
        /* small helpers for consistent z-index on overlay images */
        .max-w-\[1200px\]>.relative img {
            z-index: 10;
            position: relative;
        }

        .max-w-\[1200px\]>.relative .z-15 {
            z-index: 15;
            position: absolute;
            top: 0;
            left: 0;
        }
    </style>

    <!-- section 2 -->
    <div class="max-w-7xl mx-auto px-4 py-10">

        <!-- Judul -->
        <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Baca Berita Sesuai Topik
        </h1>

        <!-- Filter Buttons -->
        <div class="flex items-center gap-3 mb-10">
            <button class="px-6 py-2 bg-red-600 text-white rounded-full font-semibold shadow">
                Semua
            </button>
            <button class="px-6 py-2 border border-gray-300 bg-white text-gray-800 rounded-full font-semibold">
                Promo
            </button>
        </div>

        <!-- Grid Berita -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            <!-- Card 1 -->
            <div class="bg-white rounded-3xl transition overflow-hidden">
                <img src="https://wpcms.gokang.id/wp-content/uploads/2025/10/cashback-100-survey-untuk-pengerjaan-perbaikan-rumah.webp" class="w-full h-64 object-cover" />

                <div class="p-5">
                    <h2 class="text-xl font-bold text-gray-900 leading-snug">
                        Cashback 100% Survey Untuk Pengerjaan Perbaikan Rumah!
                    </h2>

                    <p class="text-gray-600 mt-2 line-clamp-3">
                        Dapatkan cashback 100% biaya survey dari GoKang...
                    </p>

                    <p class="text-sm text-gray-500 mt-4">Okt 21, 2025 | Promo</p>
                </div>
            </div>

            <!-- Card 2 -->
            <div class="bg-white rounded-3xl transition overflow-hidden">
                <img src="https://wpcms.gokang.id/wp-content/uploads/2025/10/diskon-60-survey-perbaikan-rumah-gokang.webp" class="w-full h-64 object-cover" />

                <div class="p-5">
                    <h2 class="text-xl font-bold text-gray-900 leading-snug">
                        Diskon 60% Untuk Survey Perbaikan Rumah di GoKang
                    </h2>

                    <p class="text-gray-600 mt-2 line-clamp-3">
                        Nikmati promo diskon 60% biaya survey...
                    </p>

                    <p class="text-sm text-gray-500 mt-4">Okt 21, 2025 | Promo</p>
                </div>
            </div>

            <!-- Card 3 -->
            <div class="bg-white rounded-3xl transition overflow-hidden">
                <img src="https://wpcms.gokang.id/wp-content/uploads/2023/08/Penandatanganan-MOU-antara-PT.-PLN-Persero-dan-PT.-Tenaga-GoKang-Indonesia.jpeg" class="w-full h-64 object-cover" />

                <div class="p-5">
                    <h2 class="text-xl font-bold text-gray-900 leading-snug">
                        PLN Gandeng GoKang Kembangkan Bisnis Beyond kWh
                    </h2>

                    <p class="text-gray-600 mt-2 line-clamp-3">
                        PLN menggandeng GoKang dalam program kolaborasi...
                    </p>

                    <p class="text-sm text-gray-500 mt-4">Agt 7, 2023</p>
                </div>
            </div>
            <!-- Card 2 -->
            <div class="bg-white rounded-3xl transition overflow-hidden">
                <img src="https://wpcms.gokang.id/wp-content/uploads/2025/10/diskon-60-survey-perbaikan-rumah-gokang.webp" class="w-full h-64 object-cover" />

                <div class="p-5">
                    <h2 class="text-xl font-bold text-gray-900 leading-snug">
                        Diskon 60% Untuk Survey Perbaikan Rumah di GoKang
                    </h2>

                    <p class="text-gray-600 mt-2 line-clamp-3">
                        Nikmati promo diskon 60% biaya survey...
                    </p>

                    <p class="text-sm text-gray-500 mt-4">Okt 21, 2025 | Promo</p>
                </div>
            </div>

            <!-- Card 3 -->
            <div class="bg-white rounded-3xl transition overflow-hidden">
                <img src="https://wpcms.gokang.id/wp-content/uploads/2023/08/Penandatanganan-MOU-antara-PT.-PLN-Persero-dan-PT.-Tenaga-GoKang-Indonesia.jpeg" class="w-full h-64 object-cover" />

                <div class="p-5">
                    <h2 class="text-xl font-bold text-gray-900 leading-snug">
                        PLN Gandeng GoKang Kembangkan Bisnis Beyond kWh
                    </h2>

                    <p class="text-gray-600 mt-2 line-clamp-3">
                        PLN menggandeng GoKang dalam program kolaborasi...
                    </p>

                    <p class="text-sm text-gray-500 mt-4">Agt 7, 2023</p>
                </div>
            </div>

        </div>
    </div>

    <!-- section 3 -->
       <section class="w-full bg-white py-12 px-6 md:px-16">
        <div class="flex flex-col md:flex-row items-center justify-center gap-10">
            <!-- Gambar -->
            <div class="relative w-full md:w-2/3 flex justify-center">
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

                        <span class="transition-all px-4 duration-300 text-[18px] group-hover:translate-x-2">Hubungi
                            Kami</span>
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
                navbar.classList.remove("bg-transparent", "text-black");
                navbar.classList.add("bg-white/60", "text-black", "shadow-md");

                navLinksLive.forEach(link => {
                    link.classList.remove('text-black');
                    link.classList.add('text-black');
                });
            } else {
                navbar.classList.remove("bg-white/60", "text-black", "shadow-md");
                navbar.classList.add("bg-transparent", "text-black");

                navLinksLive.forEach(link => {
                    link.classList.remove('text-black');
                    link.classList.add('text-black');
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