@extends('layouts.app')

@section('content')

    <!-- section 1 -->
    <section class="pb-16 px-6 md:px-10 relative overflow-hidden 
    bg-gradient-to-br from-white to-[#ffd6de]" style="background-size: 150% 150%;">
        <div class="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">

            <!-- Kolom Teks -->
            <div class="w-full md:w-1/2 text-center md:text-left">
                <h2 class="text-2xl md:text-6xl font-extrabold text-gray-900 mb-2 md:leading-snug">
                    Yuk, Liat Apa yang Baru di <span class="text-red-600">GoKang?</span>
                </h2>

                <p class="text-gray-700 mb-6 text-xl">
                    Atau konsultasi dengan kami
                </p>

                <div class="flex justify-start mb-10">
                    <button
                        class="group relative flex items-start bg-red-600 hover:bg-green-600 text-white font-bold text-center px-5 py-3 mr-10 rounded-full shadow-md transition duration-300 overflow-hidden">

                        <!-- Logo WhatsApp muncul dari kiri -->
                        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp"
                            class="absolute left-4 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />

                        <span class="transition-all px-4 text-xl duration-300">Hubungi Kami</span>
                    </button>
                </div>

            </div>

            <!-- Kolom Gambar -->
            <div class="flex justify-center md:justify-end w-full md:w-1/2 mt-10 md:mt-20">
                <img src="https://www.gokang.id/images/blog-illustration-gokang.webp" alt="Aplikasi GoKang"
                    class="w-[220px] sm:w-[260px] md:w-[500px] lg:w-[540px] drop-shadow-xl" />
            </div>

        </div>
    </section>


    <!-- section 2 -->
   <section class="px-6 md:px-12 py-10 md:py-16 bg-white">
    <!-- Header -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900">
            Kamu Mungkin Suka
        </h2>

        <!-- Search -->
        <div class="w-full lg:w-[480px] relative">
            <input type="text" placeholder="Cari artikel disini"
                class="w-full border border-gray-300 rounded-full py-3 pl-12 pr-12 text-gray-700 focus:ring-2 focus:ring-red-400" />
            <svg xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 text-red-600 absolute left-4 top-1/2 -translate-y-1/2" fill="currentColor"
                viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" stroke="none" />
                <path d="M21 21l-4.35-4.35" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" />
            </svg>
            <button
                class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white">
                →
            </button>
        </div>
    </div>

    <!-- Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        <!-- LEFT: Carousel -->
        <div class="relative group">
            <img src="https://wpcms.gokang.id/wp-content/uploads/2025/11/membersihkan-rumah-bersama-keluarga.webp"
                class="w-full h-[300px] sm:h-[350px] md:h-[420px] lg:h-[480px] object-cover rounded-3xl shadow-md" />

            <!-- Arrow Left -->
            <button
                class="absolute left-5 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md border border-white text-white w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/50 transition">
                ←
            </button>

            <!-- Arrow Right -->
            <button
                class="absolute right-5 top-1/2 -translate-y-1/2 bg-white/30 backdrop-blur-md border border-white text-white w-14 h-14 flex items-center justify-center rounded-full hover:bg-white/50 transition">
                →
            </button>

            <!-- Text -->
            <div class="absolute bottom-6 left-6 right-6 text-white">
                <p class="text-lg">Nov 10, 2025 | Rumah</p>
                <h3 class="text-2xl md:text-3xl font-bold leading-tight">
                    7 Area di Rumah yang Wajib Bersih Untuk Jaga Kenyamanan Kamu
                </h3>
                <p class="hidden md:block text-white/90 mt-2">
                    Ini 7 area di rumah yang wajib bersih agar tinggal selalu merasa nyaman…
                </p>
            </div>
        </div>

        <!-- RIGHT: Article List -->
        <div class="flex flex-col gap-8">

            <!-- Item 1 -->
            <div class="flex items-start gap-5">
                <div class="flex-1">
                    <h3 class="text-xl md:text-2xl font-semibold text-gray-900">
                        Tips Membersihkan Rumah agar Tidak Berantakan dan…
                    </h3>
                    <p class="text-gray-700 mt-1 hidden sm:block">
                        Rumah sering berantakan dan sulit dibersihkan? Yuk pelajari tips…
                    </p>
                    <p class="text-gray-500 text-sm mt-2">Nov 5, 2025</p>
                </div>
                <img src="https://wpcms.gokang.id/wp-content/uploads/2025/11/membersihkan-rumah-bersama-keluarga.webp"
                    class="w-28 h-20 md:w-36 md:h-28 object-cover rounded-2xl" />
            </div>

            <!-- Item 2 -->
            <div class="flex items-start gap-5">
                <div class="flex-1">
                    <h3 class="text-xl md:text-2xl font-semibold text-gray-900">
                        Persiapkan Rumah Menghadapi Musim Hujan…
                    </h3>
                    <p class="text-gray-700 mt-1 hidden sm:block">
                        Musim hujan datang? Pastikan rumah kamu siap dengan cek…
                    </p>
                    <p class="text-gray-500 text-sm mt-2">Nov 5, 2025 | Rumah</p>
                </div>
                <img src="https://wpcms.gokang.id/wp-content/uploads/2025/11/cuaca-di-luar-sedang-hujan.webp"
                    class="w-28 h-20 md:w-36 md:h-28 object-cover rounded-2xl" />
            </div>

            <!-- Item 3 -->
            <div class="flex items-start gap-5">
                <div class="flex-1">
                    <h3 class="text-xl md:text-2xl font-semibold text-gray-900">
                        10 Aktivitas Keluarga di Rumah, Tingkatkan Kualitas…
                    </h3>
                    <p class="text-gray-700 mt-1 hidden sm:block">
                        Momen hangat dengan aktivitas keluarga di rumah…
                    </p>
                    <p class="text-gray-500 text-sm mt-2">Nov 5, 2025</p>
                </div>
                <img src="https://wpcms.gokang.id/wp-content/uploads/2025/11/bapak-dan-anaknya-sedang-berkegiatan-bersama-di-rumah.webp"
                    class="w-28 h-20 md:w-36 md:h-28 object-cover rounded-2xl" />
            </div>

        </div>

    </div>
</section>

    <!-- section 3 -->
    <section class="w-full bg-white py-12 px-6 md:px-16">
        <div class="flex flex-col md:flex-row items-center justify-center gap-10">
            <!-- Gambar -->
            <div class="relative w-full md:w-2/3 flex justify-center">
                <div class="relative">
                    <!-- Ilustrasi -->
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2025/11/cuaca-di-luar-sedang-hujan.webp" alt="CS GoKang"
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