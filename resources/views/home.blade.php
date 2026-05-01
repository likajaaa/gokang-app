@extends('layouts.app')

@section('content')
 <!-- Section 1 -->
    <section id="beranda" class="relative w-full h-screen flex justify-center items-center overflow-hidden pt-24 md:pt-32">
        <!-- Background video YouTube -->
        <div class="absolute inset-0">
            <div class="relative w-full h-full overflow-hidden">
                <iframe
                    class="absolute w-[400vw] h-[400vh] xs:w-[300vw] xs:h-[300vh] sm:w-[200vw] sm:h-[200vh] md:w-[150vw] md:h-[150vh] lg:w-[120vw] lg:h-[120vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    src="https://www.youtube.com/embed/eq0SRFNwp2M?autoplay=1&mute=1&loop=1&playlist=eq0SRFNwp2M&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0"
                    frameborder="0" allow="autoplay; fullscreen" allowfullscreen style="pointer-events: none;"></iframe>
            </div>
        </div>

        <!-- Overlay opsional agar teks terbaca -->
        <div class="absolute inset-0 bg-black/40"></div>

        <!-- Konten -->
        <div class="relative z-10 h-full text-white text-center flex flex-col justify-center items-center px-6 md:px-10">
            <div class="max-w-7xl mx-auto max-w-[750px]">
                <h1
                    class="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight sm:leading-relaxed md:leading-snug">
                    Bersama, Kita Ciptakan Jutaan Pekerjaan untuk Tukang
                </h1>
                <p class="mt-6 sm:mt-10 text-base sm:text-xl md:text-2xl">
                    Pesan tukang terkualifikasi dengan mudah lewat aplikasi GoKang.
                </p>
            </div>
        </div>
    </section>

    <!-- Section 2 -->
    <section class="bg-white py-6 overflow-hidden">
        <h2 class="text-center text-[15px] font-extrabold text-gray-800 mb-14">
            Dipercaya oleh
        </h2>

        <!-- Wrapper animasi -->
        <div class="relative w-full overflow-hidden">
            <div class="flex animate-marquee space-x-16 md:space-x-24">
                <!-- Deretan logo -->
                <img src="https://th.bing.com/th/id/OIP.jS8rBrN-eJ41gPvYksyuLAHaHa?w=153&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
                    alt="BSD City" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="https://deviloarts.com/wp-content/uploads/Hokben-Logo-Vector-1024x1024.jpg" alt="HokBen"
                    class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="data:image/webp;base64,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"
                    alt="FIFGROUP" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="https://www.sunwaycarnival.com/static/shops/c816aced9459dc2945d74d8d3d2a29ae/w960-crop.png"
                    alt="KKV" class="h-20 md:h-16 max-h-16 w-auto object-contain" />
                <img src="data:image/webp;base64,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"
                    alt="Nespresso" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="
data:image/webp;base64,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"
                    alt="Nespresso" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="
https://www.bing.com/th/id/OIP.fU1f4Q6Ctp1XJvSGxh7bZQHaEK?w=270&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
                    alt="Nespresso" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <!-- Ulangi untuk efek loop -->
                <img src="https://th.bing.com/th/id/OIP.jS8rBrN-eJ41gPvYksyuLAHaHa?w=153&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3"
                    alt="BSD City" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="https://deviloarts.com/wp-content/uploads/Hokben-Logo-Vector-1024x1024.jpg" alt="HokBen"
                    class="h-12 md:h-16 max-h-16 w-auto object-contain" />
                <img src="data:image/webp;base64,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"
                    alt="FIFGROUP" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="https://www.sunwaycarnival.com/static/shops/c816aced9459dc2945d74d8d3d2a29ae/w960-crop.png"
                    alt="KKV" class="h-12 md:h-16 max-h-16 w-auto object-contain" />
                <img src="data:image/webp;base64,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"
                    alt="Nespresso" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="
data:image/webp;base64,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"
                    alt="Nespresso" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
                <img src="
https://www.bing.com/th/id/OIP.fU1f4Q6Ctp1XJvSGxh7bZQHaEK?w=270&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2"
                    alt="Nespresso" class="h-16 md:h-16 max-h-16 w-auto object-contain" />
            </div>
        </div>
    </section>

    <!-- section 3 -->
    <section id="layanan" class="py-16 px-6 md:px-10 md:mt-16 mt-10 bg-white relative overflow-hidden ">
        <!-- Background ikon dekoratif -->
        <img src="https://www.gokang.id/images/plumber-icon.png" alt="Ikon"
            class="absolute left-10 top-20 w-16 opacity-10 hidden sm:block">
        <img src="https://www.gokang.id/images/worker-icon.png" alt="Ikon"
            class="absolute right-10 top-10 w-20 opacity-10 hidden sm:block">

        <!-- Judul -->
        <div class="text-center mb-12 relative z-10">
            <h2 class="text-5xl font-extrabold text-gray-900">
                Layanan <span class="text-red-600">GoKang</span>
            </h2>
        </div>

        <!-- Kartu layanan -->
        <div
            class="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 px-6 md:px-10 relative z-10">

            <!-- Borongan -->
            <div class="relative bg-white overflow-hidden flex flex-col items-center text-center">
                <!-- Bulatan logo: setengah masuk ke gambar -->
                <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                    <div class="bg-white p-[6px] rounded-full shadow-md">
                        <div
                            class="w-12 sm:w-14 h-12 sm:h-14 bg-[#C9A74D] rounded-full flex items-center justify-center shadow-inner">
                            <img src="https://www.gokang.id/home/services/icon-untuk-borongan.svg" alt="Logo"
                                class="w-12 sm:w-14 h-12 sm:h-14">
                        </div>
                    </div>
                </div>

                <!-- Gambar utama -->
                <div class="mt-8 sm:mt-10 w-full rounded-[20px] sm:rounded-[28px] overflow-hidden relative">
                    <img src="https://www.gokang.id/home/services/untuk-borongan.webp" alt="Borongan"
                        class="w-full object-cover h-[200px] sm:h-[250px] relative z-10">
                </div>

                <!-- Judul -->
                <h3 class="font-bold text-gray-800 text-lg sm:text-[20px] mt-4 sm:mt-5 text-gray-900">
                    Borongan
                    <span
                        class="bg-red-600 text-white text-xs sm:text-[11px] italic px-2 py-[1px] rounded-full ml-1">(Full
                        Service)</span>
                </h3>

                <!-- Deskripsi -->
                <p class="text-gray-700 text-sm sm:text-[15px] mt-2 sm:mt-3 leading-relaxed px-4">
                    GoKang menyediakan solusi layanan borongan agar proses perbaikan jadi mudah.
                </p>

                <!-- Tombol -->
                <button
                    class="mt-6 sm:mt-20 border-2 border-red-600 text-red-600 text-sm sm:text-[16px] font-semibold rounded-full px-8 sm:px-10 py-2 hover:bg-red-600 hover:text-white transition-all duration-300">
                    Selengkapnya
                </button>
            </div>
            <!-- Tukang Harian -->
            <div class="relative bg-white overflow-hidden flex flex-col items-center text-center max-w-xs mx-auto">
                <!-- Bulatan logo: setengah masuk ke gambar -->
                <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                    <div class="bg-white p-[6px] rounded-full shadow-md">
                        <div class="w-14 h-14 bg-[#C9A74D] rounded-full flex items-center justify-center shadow-inner">
                            <img src="https://www.gokang.id/home/services/icon-untuk-konsumen.svg" alt="Logo"
                                class="w-14 h-14">
                        </div>
                    </div>
                </div>

                <!-- Gambar utama -->
                <div class="mt-10 w-full rounded-[28px] overflow-hidden relative">
                    <img src="https://www.gokang.id/home/services/untuk-konsumen.webp" alt="Borongan"
                        class="w-full object-cover h-[250px] relative z-10">
                </div>

                <!-- Judul -->
                <h3 class="font-bold text-gray-800 text-[20px] mt-5 text-gray-900">
                    Tukang Harian
                </h3>

                <!-- Deskripsi -->
                <p class="text-gray-700 text-[15px] mt-3 leading-relaxed">
                    GoKang menyediakan solusi perbaikan rumah agar kamu dan keluarga dapat hidup nyaman.
                </p>

                <!-- Tombol -->
                <button
                    class="mt-20 border-2 border-red-600 text-red-600 text-[16px] font-semibold rounded-full px-10 py-2 hover:bg-red-600 hover:text-white transition-all duration-300">
                    Selengkapnya
                </button>
            </div>
            <!-- GoKang Corp -->
            <div class="relative bg-white overflow-hidden flex flex-col items-center text-center max-w-xs mx-auto">
                <!-- Bulatan logo: setengah masuk ke gambar -->
                <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                    <div class="bg-white p-[6px] rounded-full shadow-md">
                        <div class="w-14 h-14 bg-[#C9A74D] rounded-full flex items-center justify-center shadow-inner">
                            <img src="https://www.gokang.id/home/services/icon-untuk-perusahaan.svg" alt="Logo"
                                class="w-14 h-14">
                        </div>
                    </div>
                </div>

                <!-- Gambar utama -->
                <div class="mt-10 w-full rounded-[28px] overflow-hidden relative">
                    <img src="https://www.gokang.id/home/services/untuk-perusahaan.webp" alt="Borongan"
                        class="w-full object-cover h-[250px] relative z-10">
                </div>

                <!-- Judul -->
                <h3 class="font-bold text-gray-800 text-[20px] mt-5 text-gray-900">
                    GoKang Corp
                </h3>

                <!-- Deskripsi -->
                <p class="text-gray-700 text-[15px] mt-3 leading-relaxed">
                    GoKang memperbaiki, memelihara kantor dan cabang sehingga bisnismu dapat berjalan lancar. </p>
                <!-- Tombol -->
                <button
                    class="mt-14 border-2 border-red-600 text-red-600 text-[16px] font-semibold rounded-full px-10 py-2 hover:bg-red-600 hover:text-white transition-all duration-300">
                    Selengkapnya
                </button>
            </div>
            <!-- Tukang Jagoan -->
            <div class="relative bg-white overflow-hidden flex flex-col items-center text-center max-w-xs mx-auto">
                <!-- Bulatan logo: setengah masuk ke gambar -->
                <div class="absolute top-2 left-1/2 -translate-x-1/2 z-20">
                    <div class="bg-white p-[6px] rounded-full shadow-md">
                        <div class="w-14 h-14 bg-[#C9A74D] rounded-full flex items-center justify-center shadow-inner">
                            <img src="https://www.gokang.id/home/services/icon-for-mitra-jagoan.svg" alt="Logo"
                                class="w-14 h-14">
                        </div>
                    </div>
                </div>

                <!-- Gambar utama -->
                <div class="mt-10 w-full rounded-[28px] overflow-hidden relative">
                    <img src="https://www.gokang.id/home/services/untuk-tukang-jagoan.webp" alt="Borongan"
                        class="w-full object-cover h-[250px] relative z-10">
                </div>

                <!-- Judul -->
                <h3 class="font-bold text-gray-800 text-[20px] mt-5 text-gray-900">
                    Tukang Jagoan
                </h3>

                <!-- Deskripsi -->
                <p class="text-gray-700 text-[15px] mt-3 leading-relaxed">
                    GoKang menciptakan peluang kerja yang berkesinambungan sehingga kamu dapat menjadi tukang yang
                    profesional dan menyejahterakan keluarga. </p>

                <!-- Tombol -->
                <button
                    class="mt-7 border-2 border-red-600 text-red-600 text-[16px] font-semibold rounded-full px-10 py-2 hover:bg-red-600 hover:text-white transition-all duration-300">
                    Selengkapnya
                </button>
            </div>
        </div>
    </section>

    <!-- section 4 -->
    <section class=" py-20 px-6 text-center">
        <!-- Judul -->
        <h2 class="text-5xl md:text-5xl font-extrabold mb-16 text-gray-900">
            Tukang <span class="text-red-600">Terkualifikasi</span>
        </h2>

        <!-- Tombol Hubungi Kami -->
        <div class="flex justify-center mb-10">
            <button
                class="group relative flex items-center bg-red-600 hover:bg-green-600 text-white font-bold text-center px-5 py-3 mr-10 rounded-full shadow-md transition duration-300 overflow-hidden">

                <!-- Logo WhatsApp muncul dari kiri -->
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp"
                    class="absolute left-4 w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />

                <span class="transition-all px-4 duration-300 group-hover:ml-6">Hubungi Kami</span>
            </button>
        </div>

        <!-- Container Card Video -->
        <div class="relative w-full">
            <!-- SLIDER -->
            <div id="slider"
                class="flex overflow-x-auto snap-x snap-mandatory space-x-4 sm:space-x-6 px-6 md:px-10 scroll-smooth scrollbar-hide">
                <!-- CARD 1 -->
                <div
                    class="relative group flex-none w-[300px] h-[500px] rounded-[40px] overflow-hidden shadow-lg snap-center">
                    <!-- Video -->
                    <video
                        src="https://www.youtube.com/embed/eq0SRFNwp2M?autoplay=1&mute=1&loop=1&playlist=eq0SRFNwp2M&controls=0&showinfo=0&modestbranding=1&playsinline=1"
                        muted playsinline loop
                        class="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105">
                    </video>

                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-500"></div>

                    <!-- Konten -->
                    <div class="relative z-10 flex flex-col justify-between h-full text-white text-left p-4 pb-3">
                        <!-- Bagian atas -->
                        <div>
                            <h3 class="text-xl font-bold leading-tight mb-3 mt-5">CERITA SI JAGOAN</h3>
                            <p class="text-sm mb-2">
                                Kenalin Bang Madrohim si Tukang Jagoan. Rezeki lancar!
                            </p>
                        </div>

                        <!-- Bagian bawah -->
                        <div class="flex items-center gap-2 text-sm">
                            <img src="https://www.gokang.id/home/services/icon-untuk-borongan.svg" alt=""
                                class="w-5 h-5 mb-5" />
                            <span class="mb-5">Jagoan Batu</span>
                        </div>
                    </div>
                </div>

                <!-- CARD 2 -->
                <div class="relative group flex-none w-[300px] h-[500px] rounded-[40px] overflow-hidden snap-center">
                    <video
                        src="https://www.youtube.com/embed/eq0SRFNwp2M?autoplay=1&mute=1&loop=1&playlist=eq0SRFNwp2M&controls=0&showinfo=0&modestbranding=1&playsinline=1"
                        muted playsinline loop
                        class="absolute inset-0 w-full h-full object-cover rounded-3xl transition-all duration-500 group-hover:scale-105"></video>
                    <div class="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-500"></div>
                    <div class="relative z-10 flex flex-col justify-between h-full text-white text-left p-4 pb-3">
                        <h3 class="text-xl font-bold leading-tight mb-3 mt-5 ml-3">CERITA SI JAGOAN</h3>
                        <p class="text-sm mb-2 ml-3">
                            Kenalin Bang Madrohim si Tukang Jagoan. Rezeki lancar!
                        </p>
                        <div class="flex items-center gap-2 text-sm mt-auto">
                            <img src="https://www.gokang.id/home/services/icon-for-mitra-jagoan.svg" alt=""
                                class="w-5 h-5 mb-5 ml-3" />
                            <span class="mb-5">Jagoan Batu</span>
                        </div>
                    </div>
                </div>

                <!-- CARD 3 -->
                <div class="relative group flex-none w-[300px] h-[500px] rounded-[40px] overflow-hidden snap-center">
                    <!-- Video -->
                    <video
                        src="https://www.youtube.com/embed/eq0SRFNwp2M?autoplay=1&mute=1&loop=1&playlist=eq0SRFNwp2M&controls=0&showinfo=0&modestbranding=1&playsinline=1"
                        muted playsinline loop
                        class="absolute inset-0 w-full h-full object-cover rounded-3xl transition-all duration-500 group-hover:scale-105">
                    </video>

                    <!-- Overlay -->
                    <div class="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-500"></div>

                    <!-- Konten -->
                    <div class="relative z-10 flex flex-col justify-between h-full text-white text-left p-4 pb-3">
                        <!-- Bagian atas -->
                        <div>
                            <h3 class="text-xl font-bold leading-tight mb-3 mt-5 ml-3">CERITA SI JAGOAN</h3>
                            <p class="text-sm mb-2 ml-3">
                                Kenalin Bang Madrohim si Tukang Jagoan. Rezeki lancar!
                            </p>
                        </div>

                        <!-- Bagian bawah -->
                        <div class="flex items-center gap-2 text-sm">
                            <img src="https://www.gokang.id/home/services/icon-untuk-borongan.svg" alt=""
                                class="w-5 h-5 mb-5 ml-3" />
                            <span class="mb-5">Jagoan Batu</span>
                        </div>
                    </div>
                </div>

                <!-- CARD 4 -->
                <div class="relative group flex-none w-[300px] h-[500px] rounded-[40px] overflow-hidden snap-center">
                    <video
                        src="https://www.youtube.com/embed/eq0SRFNwp2M?autoplay=1&mute=1&loop=1&playlist=eq0SRFNwp2M&controls=0&showinfo=0&modestbranding=1&playsinline=1"
                        muted playsinline loop
                        class="absolute inset-0 w-full h-full object-cover rounded-3xl transition-all duration-500 group-hover:scale-105"></video>
                    <div class="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-500"></div>
                    <div class="relative z-10 flex flex-col justify-between h-full text-white text-left p-4 pb-3">
                        <h3 class="text-xl font-bold leading-tight mb-3 mt-5 ml-3">CERITA SI JAGOAN</h3>
                        <p class="text-sm mb-2 ml-3">
                            Kenalin Bang Madrohim si Tukang Jagoan. Rezeki lancar!
                        </p>
                        <div class="flex items-center gap-2 text-sm mt-auto">
                            <img src="https://www.gokang.id/home/services/icon-untuk-borongan.svg" alt=""
                                class="w-5 h-5 mb-5 ml-3" />
                            <span class="mb-5">Jagoan Batu</span>
                        </div>
                    </div>
                </div>
                <!-- CARD 5 -->
                <div class="relative group flex-none w-[300px] h-[500px] rounded-[40px] overflow-hidden snap-center">
                    <video
                        src="https://www.youtube.com/embed/eq0SRFNwp2M?autoplay=1&mute=1&loop=1&playlist=eq0SRFNwp2M&controls=0&showinfo=0&modestbranding=1&playsinline=1"
                        muted playsinline loop
                        class="absolute inset-0 w-full h-full object-cover rounded-3xl transition-all duration-500 group-hover:scale-105"></video>
                    <div class="absolute inset-0 bg-black/60 group-hover:bg-black/0 transition-all duration-500"></div>
                    <div class="relative z-10 flex flex-col justify-between h-full text-white text-left p-4 pb-3">
                        <h3 class="text-xl font-bold leading-tight mb-3 mt-5 ml-3">CERITA SI JAGOAN</h3>
                        <p class="text-sm mb-2 ml-3">
                            Kenalin Bang Madrohim si Tukang Jagoan. Rezeki lancar!
                        </p>
                        <div class="flex items-center gap-2 text-sm mt-auto">
                            <img src="https://www.gokang.id/home/services/icon-untuk-borongan.svg" alt=""
                                class="w-5 h-5 mb-5 ml-3" />
                            <span class="mb-5">Jagoan Batu</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- DOTS -->
            <div id="dots" class="flex justify-center mt-5 space-x-2 md:hidden">
                <button class="dot w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"></button>
                <button class="dot w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"></button>
                <button class="dot w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"></button>
                <button class="dot w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"></button>
                <button class="dot w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"></button>
                <button class="dot w-3 h-3 bg-gray-400 rounded-full transition-all duration-300"></button>
            </div>
        </div>
        </div>
    </section>

    <!-- section 5 -->
    <section
        class="bg-pink-100 rounded-3xl mx-4 sm:mx-20 my-10 sm:my-20 px-6 md:px-10 py-8 sm:py-10 flex flex-col-reverse lg:flex-row items-center justify-between overflow-hidden relative">
        <!-- Teks -->
        <div class="text-center lg:text-left max-w-xl px-2 sm:px-0">
            <h2 class="text-2xl sm:text-4xl md:text-[40px] font-extrabold text-gray-900 leading-tight sm:leading-snug">
                Inilah, <span class="text-red-600">GoKang</span>.
                Aplikasi Andalanmu Berikutnya.
            </h2>
            <button
                class="mt-4 sm:mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-full shadow-md transition duration-300 text-sm sm:text-base">
                Hubungi Kami
            </button>
        </div>

        <!-- Gambar animasi -->
        <div class="w-[200px] sm:w-[300px] lg:w-[380px] animate-float mb-6 lg:mb-0">
            <img src="/img/gokanganimation.png" alt="GoKang Jagoan" class="w-full object-contain" />
        </div>

        <!-- Dekorasi background (opsional seperti garis lengkung) -->
        <div class="absolute inset-0 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="absolute right-0 top-0 opacity-10 hidden sm:block"
                width="500" height="500" fill="none" viewBox="0 0 500 500">
                <path d="M100 100 Q250 0 400 100 T700 100" stroke="#fca5a5" stroke-width="6" stroke-dasharray="10 10"
                    fill="none" />
            </svg>
        </div>
    </section>

    <!-- section 6 -->
    <section class="bg-[#8b0000] relative overflow-hidden py-32 rounded-t-[100px]">
        <!-- Pola background -->
        <div class="absolute inset-0 bg-[url('https://www.gokang.id/images/bg-triangle.svg')] opacity-10"></div>

    <!-- Konten utama -->
    <div class="relative z-10 text-center px-6 md:px-10 mb-10">
            <h2 class="text-3xl md:text-5xl font-extrabold text-white mb-10">
                Apa yang Baru di GoKang
            </h2>
            <button
                class="border border-white text-white font-bold text-lg px-20 py-3 rounded-full hover:bg-white hover:text-[#8b0000] transition duration-300">
                Cek Berita Lain
            </button>
        </div>

        <!-- Daftar berita -->
        <div class="relative z-10 mt-16 mb-40">
            <div class="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                <!-- Card 1 -->
                <div class="bg-[#8b0000] rounded-2xl w-64 flex-shrink-0">
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2025/10/cashback-100-survey-untuk-pengerjaan-perbaikan-rumah.webp"
                        alt="Berita 1" class="w-full h-44 object-cover rounded-t-2xl rounded-b-2xl" />
                    <div class="mt-5">
                        <h3 class="font-bold text-white text-white text-lg mb-2">
                            Cashback 100% Survey Untuk Pengerjaan Perbaikan Rumah!
                        </h3>
                        <p class="text-gray-200 text-sm mb-4">
                            Dapatkan cashback 100% biaya survey dari GoKang! Bayar...
                        </p>
                        <p class="text-sm text-gray-300">
                            Okt 21, 2025 | <span class="font-semibold">Promo</span>
                        </p>
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="bg-[#8b0000] rounded-2xl w-64 flex-shrink-0">
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2025/10/diskon-60-survey-perbaikan-rumah-gokang.webp"
                        alt="Berita 2" class="w-full h-44 object-cover rounded-t-2xl rounded-b-2xl" />
                    <div class="mt-5">
                        <h3 class="font-bold text-white text-lg mb-2">
                            Diskon 60% Untuk Survey Perbaikan Rumah di GoKang
                        </h3>
                        <p class="text-gray-200 text-sm mb-4">
                            Nikmati promo diskon 60% biaya survey perbaikan rumah dari...
                        </p>
                        <p class="text-sm text-gray-300">
                            Okt 21, 2025 | <span class="font-semibold">Promo</span>
                        </p>
                    </div>
                </div>

                <!-- Card 3 -->
                <div class="bg-[#8b0000] rounded-2xl w-64 flex-shrink-0">
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2023/08/Penandatanganan-MOU-antara-PT.-PLN-Persero-dan-PT.-Tenaga-GoKang-Indonesia.jpeg"
                        alt="Berita 3" class="w-full h-44 object-cover rounded-t-2xl rounded-b-2xl" />
                    <div class="mt-5">
                        <h3 class="font-bold text-white text-lg mb-2">
                            PLN Gandeng GoKang Kembangkan Bisnis Beyond...
                        </h3>
                        <p class="text-gray-200 text-sm mb-4">
                            PLN gandeng GoKang dalam program kolaborasi untuk...
                        </p>
                        <p class="text-sm text-gray-300">Agt 7, 2023</p>
                    </div>
                </div>

                <!-- Card 4 -->
                <div class="bg-[#8b0000] rounded-2xl w-64 flex-shrink-0">
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2022/05/Banner_B_Carousel.png" alt="Berita 4"
                        class="w-full h-44 object-cover rounded-t-2xl rounded-b-2xl" />
                    <div class="mt-5">
                        <h3 class="font-bold text-white text-lg mb-2">
                            Pengumuman Terkait Informasi Libur Nasional Lebaran Tahu...
                        </h3>
                        <p class="text-gray-200 text-sm mb-4">
                            Pengumuman terkait operasional aplikasi selama...
                        </p>
                        <p class="text-sm text-gray-300">Mei 1, 2022</p>
                    </div>
                </div>

                <!-- Card 5 -->
                <div class="bg-[#8b0000] rounded-2xl w-64 flex-shrink-0">
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2022/05/Banner_B_Carousel.png" alt="Berita 5"
                        class="w-full h-44 object-cover rounded-t-2xl rounded-b-2xl" />
                    <div class="mt-5">
                        <h3 class="font-bold text-white text-lg mb-2">
                            Pengumuman Tambahan Tentang Operasional GoKang
                        </h3>
                        <p class="text-gray-200 text-sm mb-4">
                            Informasi tambahan seputar jadwal dan layanan...
                        </p>
                        <p class="text-sm text-gray-300">Mei 3, 2022</p>
                    </div>
                </div>
                <div class="bg-[#8b0000] rounded-2xl w-64 flex-shrink-0">
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2022/05/Banner_B_Carousel.png" alt="Berita 5"
                        class="w-full h-44 object-cover rounded-t-2xl rounded-b-2xl" />
                    <div class="mt-5">
                        <h3 class="font-bold text-white text-lg mb-2">
                            Pengumuman Tambahan Tentang Operasional GoKang
                        </h3>
                        <p class="text-gray-200 text-sm mb-4">
                            Informasi tambahan seputar jadwal dan layanan...
                        </p>
                        <p class="text-sm text-gray-300">Mei 3, 2022</p>
                    </div>
                </div>
                <div class="bg-[#8b0000] rounded-2xl w-64 flex-shrink-0">
                    <img src="https://wpcms.gokang.id/wp-content/uploads/2022/05/Banner_B_Carousel.png" alt="Berita 5"
                        class="w-full h-44 object-cover rounded-t-2xl rounded-b-2xl" />
                    <div class="mt-5">
                        <h3 class="font-bold text-white text-lg mb-2">
                            Pengumuman Tambahan Tentang Operasional GoKang
                        </h3>
                        <p class="text-gray-200 text-sm mb-4">
                            Informasi tambahan seputar jadwal dan layanan...
                        </p>
                        <p class="text-sm text-gray-300">Mei 3, 2022</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- CSS untuk menyembunyikan scrollbar -->
    <style>
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }

        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>

    <!-- section 7 -->
    <section
        class="relative w-full bg-white rounded-t-[60px] sm:rounded-t-[100px] mt-[-60px] sm:mt-[-100px] overflow-visible mb-16 sm:mb-32">
        <!-- Pola dekoratif -->
        <div class="absolute inset-0 bg-[url('https://www.gokang.id/images/bg-triangle.svg')] opacity-10"></div>

        <!-- Konten utama -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-12 sm:py-16">
            <div class="flex flex-col items-center">
                <!-- Gambar HP - Responsive positioning -->
                <div class="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] mb-8 sm:mb-12">
                    <img src="https://www.gokang.id/footer/gokang-app-interface.webp" alt="Aplikasi GoKang"
                        class="w-full h-auto drop-shadow-2xl animate-bounce-slow" />
                </div>

                <!-- Teks -->
                <div class="text-center sm:text-left w-full max-w-[600px]">
                    <h2 class="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight text-gray-900">
                        Belum Punya Aplikasi GoKang?
                    </h2>
                    <p class="text-gray-600 text-base md:text-lg">
                        Download aplikasi GoKang sekarang dan nikmati kemudahannya!
                    </p>

                    <button
                        class="bg-pink-200 text-[#8b0000] font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition">
                        Download dengan QR Code
                    </button>
                    <div class="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-4">
                        <!-- Google Play -->
                        <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                alt="Get it on Google Play" class="h-12 w-auto" />
                        </a>

                        <!-- App Store -->
                        <a href="https://apps.apple.com/" target="_blank" rel="noopener noreferrer">
                            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                alt="Download on the App Store" class="h-12 w-auto" />
                        </a>
                    </div>
                </div>
            </div>
    </section>
@endsection

@push('scripts')
    <!-- Script untuk kontrol hover video -->
    <script>
        document.querySelectorAll('.group').forEach(card => {
            const video = card.querySelector('video');

            card.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 768) video.play(); // hanya desktop
            });

            card.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 768) video.pause();
            });
        });

        const slider = document.getElementById("slider");
        const dots = document.querySelectorAll(".dot");
        const slides = document.querySelectorAll("#slider > div");

        let activeIndex = 0;

        function updateDots(index) {
            dots.forEach((dot, i) => {
                dot.classList.toggle("bg-red-500", i === index);
                dot.classList.toggle("bg-gray-400", i !== index);
                dot.classList.toggle("scale-125", i === index);
            });
        }

        dots.forEach((dot, i) => {
            dot.addEventListener("click", () => {
                activeIndex = i;
                slider.scrollTo({
                    left: slides[i].offsetLeft - 24, // 24 = px padding kiri (px-6)
                    behavior: "smooth",
                });
                updateDots(i);
            });
        });

        slider.addEventListener("scroll", () => {
            const scrollCenter = slider.scrollLeft + slider.offsetWidth / 2;
            slides.forEach((slide, i) => {
                const center = slide.offsetLeft + slide.offsetWidth / 2;
                if (scrollCenter >= center - slide.offsetWidth / 2) activeIndex = i;
            });
            updateDots(activeIndex);
        });

        updateDots(activeIndex);
    </script>


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
                navbar.classList.remove("bg-transparent", "text-white");
                navbar.classList.add("bg-white", "text-black", "shadow-md");
                logo.src = "https://www.gokang.id/images/gokang-logo-new-red.png"; // logo merah

                // Pastikan semua link navbar berwarna hitam (hapus text-white jika ada)
                navLinksLive.forEach(link => {
                    link.classList.remove('text-white');
                    link.classList.add('text-black');
                });
            } else {
                // Saat di atas (awal halaman): navbar transparan dan teks putih
                navbar.classList.add("bg-transparent", "text-white");
                navbar.classList.remove("bg-white", "text-black", "shadow-md");
                logo.src = "https://www.gokang.id/images/gokang-logo-new-white.png"; // logo putih

                // Kembalikan semua link navbar ke warna putih
                navLinksLive.forEach(link => {
                    link.classList.remove('text-black');
                    link.classList.add('text-white');
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
        const currentHash = window.location.hash || "#beranda";

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
    @endpush
</body>

</html>