@extends('layouts.app')

@section('content')

    <!-- Section 1 -->
    <section class="relative h-screen flex items-center justify-start bg-black pt-24 md:pt-32">
        <!-- Background video / gambar -->
        <div class="absolute inset-0">
            <img src="https://www.gokang.id/borongan/hero-workers.webp" alt="GoKang Hero Background"
                class="w-full h-full object-cover opacity-80" />
        </div>

        <!-- Overlay gelap -->
        <div class="absolute inset-0 bg-black/20"></div>

    <!-- Konten utama -->
    <div class="relative z-10 max-w-7xl mx-auto w-full px-6 md:px-10 text-left">
            <h1
                class="text-white text-4xl md:text-6xl font-extrabold leading-[1.4] tracking-tight drop-shadow-lg space-y-6">
                <span class="block mb-4">Perbaikan Mudah,</span>
                <span class="block">Tinggal Lebih Nyaman</span>
            </h1>

            <button
                class="mt-10 bg-red-700 hover:bg-red-700 text-white text-lg md:text-xl font-semibold px-8 py-4 rounded-full shadow-lg transition duration-300">
                Download Sekarang
            </button>
        </div>

        <!-- Tombol WhatsApp (pojok kanan bawah) -->
        <a href="https://wa.me/6281234567890" target="_blank"
            class="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-6 h-6">
                <path
                    d="M12.04 2.002a9.94 9.94 0 0 0-8.64 14.82L2 22l5.32-1.39a9.94 9.94 0 0 0 4.72 1.19h.01a9.97 9.97 0 0 0 0-19.94Zm5.78 14.26a2.84 2.84 0 0 1-1.3.9c-.35.12-.8.22-1.29.13-.3-.05-.68-.23-1.18-.45a10.05 10.05 0 0 1-1.63-.9 8.5 8.5 0 0 1-2.78-2.91 3.14 3.14 0 0 1-.68-1.69c-.08-.92.44-1.41.6-1.58.16-.17.35-.21.47-.21h.34c.1.01.26-.04.41.31.16.38.54 1.3.59 1.39.05.09.08.2.01.33-.06.12-.09.2-.17.3-.08.1-.18.22-.25.29-.08.08-.17.16-.08.32.09.16.41.66.87 1.06.6.52 1.1.68 1.27.76.17.08.26.07.36-.04.1-.1.43-.49.55-.65.12-.16.23-.13.39-.08.16.05 1.02.48 1.19.56.18.09.29.13.33.2.04.07.04.82-.32 1.62Z" />
            </svg>
        </a>
    </section>

    <!-- Section 2 -->
    <section class="bg-white py-16 px-6 md:px-10">
    <div class="max-w-7xl mx-auto px-6 md:px-10">
            <!-- Judul Tengah -->
            <h2 class="text-3xl md:text-5xl font-extrabold text-gray-900 text-center mb-12">
                Keuntungan Borongan Dari <span class="text-red-600">GoKang</span>
            </h2>

            <!-- Grid Dua Kolom -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                <!-- Gambar: pasti di ATAS untuk mobile & sm, di KANAN untuk md+ -->
                <div class="flex justify-center order-1 sm:order-1 md:order-2">
                    <div
                        class="bg-[#A81217] p-3 rounded-[40px] shadow-2xl relative overflow-hidden w-full max-w-3xl min-h-[320px] md:min-h-[450px] flex items-center justify-center">
                        <img src="https://www.gokang.id/borongan/benefit/tukang-terkualifikasi.webp"
                            alt="Sertifikat GoKang" class="rounded-[40px] shadow-lg w-full h-full object-cover" />
                        <div class="absolute top-8 right-8 w-24 h-24 bg-white/20 rounded-full blur-md"></div>
                    </div>
                </div>

                <!-- List keuntungan: di BAWAH untuk mobile & sm, di KIRI untuk md+ -->
                <div class="space-y-6 order-2 sm:order-2 md:order-1" id="keuntunganList">
                    <!-- Item 1 -->
                    <div class="item bg-red-100 rounded-full px-5 py-4 cursor-pointer transition duration-300 hover:scale-[1.02]"
                        data-target="desc1">
                        <div class="flex items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white mr-3">
                                <i class="fas fa-tags"></i>
                            </div>
                            <span class="font-bold text-[19px] text-gray-800">Harga Transparan</span>
                        </div>
                    </div>
                    <div id="desc1" class="hidden pl-14 pr-4 mt-2 text-gray-700 leading-relaxed">
                        Harga survey + jasa + material + pengawasan lebih transparan
                    </div>

                    <!-- Item 2 -->
                    <div class="item bg-red-100 rounded-full px-5 py-3 cursor-pointer transition duration-300 hover:scale-[1.02]"
                        data-target="desc2">
                        <div class="flex items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white mr-3">
                                <i class="fas fa-handshake"></i>
                            </div>
                            <span class="font-bold text-[19px] text-gray-800">Lebih Mudah</span>
                        </div>
                    </div>
                    <div id="desc2" class="hidden pl-14 pr-4 mt-2 text-gray-700 leading-relaxed">
                        Dari survey hingga pengerjaan, semuanya diurus dan tinggal terima hasil terbaik
                    </div>

                    <!-- Item 3 -->
                    <div class="item bg-red-100 rounded-full px-5 py-3 cursor-pointer transition duration-300 hover:scale-[1.02]"
                        data-target="desc3">
                        <div class="flex items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white mr-3">
                                <i class="fas fa-user-shield"></i>
                            </div>
                            <span class="font-bold text-[19px] text-gray-800">Bertanggung Jawab</span>
                        </div>
                    </div>
                    <div id="desc3" class="hidden pl-14 pr-4 mt-2 text-gray-700 leading-relaxed">
                        Memastikan seluruh proses pengerjaan agar hasil sesuai dengan harapan dan standar kualitas
                    </div>

                    <!-- Item 4 -->
                    <div class="item bg-red-100 rounded-full px-5 py-3 cursor-pointer transition duration-300 hover:scale-[1.02]"
                        data-target="desc4">
                        <div class="flex items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white mr-3">
                                <i class="fas fa-certificate"></i>
                            </div>
                            <span class="font-bold text-[19px] text-gray-800">Bergaransi</span>
                        </div>
                    </div>
                    <div id="desc4" class="hidden pl-14 pr-4 mt-2 text-gray-700 leading-relaxed">
                        Dapat mengajukan klaim garansi jika hasil pengerjaan tidak sesuai dengan yang diinginkan
                    </div>

                    <!-- Item 5 -->
                    <div class="item bg-red-100 rounded-full px-5 py-3 cursor-pointer transition duration-300 hover:scale-[1.02]"
                        data-target="desc5">
                        <div class="flex items-center">
                            <div
                                class="w-8 h-8 flex items-center justify-center rounded-full bg-red-600 text-white mr-3">
                                <i class="fas fa-helmet-safety"></i>
                            </div>
                            <span class="font-bold text-[19px] text-gray-800">Tukang Terkualifikasi</span>
                        </div>
                    </div>
                    <div id="desc5" class="hidden pl-14 pr-4 mt-2 text-gray-700 leading-relaxed">
                        Tukang profesional dan berpengalaman, siap memberikan hasil pengerjaan yang maksimal
                    </div>
                </div>
            </div>
        </div>

        <!-- Script interaksi item -->
        <script>
            document.querySelectorAll('.item').forEach((item) => {
                item.addEventListener('click', () => {
                    const targetId = item.getAttribute('data-target');
                    const desc = document.getElementById(targetId);
                    const isActive = item.classList.contains('active');

                    // reset semua
                    document.querySelectorAll('.item').forEach((el) => {
                        el.classList.remove(
                            'bg-gradient-to-r',
                            'from-[#E21E25]',
                            'to-[#F8B563]',
                            'text-white',
                            'active'
                        );
                        el.classList.add('bg-red-100');
                    });
                    document.querySelectorAll('[id^="desc"]').forEach((d) => d.classList.add('hidden'));

                    // aktifkan pilihan
                    if (!isActive) {
                        item.classList.add(
                            'bg-gradient-to-r',
                            'from-[#E21E25]',
                            'to-[#F8B563]',
                            'text-white',
                            'active'
                        );
                        item.classList.remove('bg-red-100');
                        desc.classList.remove('hidden');
                    }
                });
            });
        </script>
    </section>


    <!-- section 3 -->
    <section class="relative w-screen flex items-center justify-start overflow-hidden 
  h-[160px] sm:h-[180px] md:h-[280px] lg:h-[320px]">
        <!-- Background image -->
        <img src="https://www.gokang.id/borongan/subheader-1.webp" alt="GoKang Hero Background"
            class="absolute inset-0 w-full h-full" />

    </section>

    <!-- section 4 -->
    <section class="bg-white py-16 px-6 md:px-10">
    <div class="max-w-7xl mx-auto px-6 md:px-10">
            <!-- Judul -->
            <h2 class="text-3xl md:text-5xl font-extrabold text-center text-gray-900 mt-14 mb-16">
                Tahap Pelayanan <span class="text-red-600">Tukang Borongan</span>
            </h2>

            <!-- Grid Cards -->
            <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-10">

                <!-- Card 1 -->
                <div class="text-center">
                    <div class="relative overflow-hidden">
                        <img src="https://www.gokang.id/borongan/service/service-order-1.webp" alt="Konsultasi"
                            class="w-full h-full object-cover" />
                    </div>
                    <h3 class="text-lg font-extrabold text-gray-800 mt-4">Konsultasi</h3>
                    <p class="text-gray-600 mt-1 text-sm md:text-[18px]">
                        Diskusikan masalah bangunan kamu dengan kami.
                    </p>
                </div>

                <!-- Card 2 -->
                <div class="text-center">
                    <div class="relative overflow-hidden">
                        <img src="https://www.gokang.id/borongan/service/service-order-2.webp" alt="Survey Lokasi"
                            class="w-full h-full object-cover" />
                    </div>
                    <h3 class="text-lg font-extrabold text-gray-800 mt-4">Survey Lokasi</h3>
                    <p class="text-gray-600 mt-1 text-sm md:text-[18px]">
                        Tim survey datang mengecek masalah bangunan kamu.
                    </p>
                </div>

                <!-- Card 3 -->
                <div class="text-center">
                    <div class="relative overflow-hidden">
                        <img src="https://www.gokang.id/borongan/service/service-order-3.webp" alt="Penawaran Harga"
                            class="w-full h-full object-cover" />
                    </div>
                    <h3 class="text-lg font-extrabold text-gray-800 mt-4">Penawaran Harga</h3>
                    <p class="text-gray-600 mt-1 text-sm md:text-[18px]">
                        Kami memberikan penawaran terbaik yang sesuai untuk proyek kamu.
                    </p>
                </div>

                <!-- Card 4 -->
                <div class="text-center">
                    <div class="relative overflow-hidden">
                        <img src="https://www.gokang.id/borongan/service/service-order-4.webp" alt="Proyek Dimulai"
                            class="w-full h-full object-cover" />
                    </div>
                    <h3 class="text-lg font-extrabold text-gray-800 mt-4">Proyek Dimulai</h3>
                    <p class="text-gray-600 mt-1 text-sm md:text-[18px]">
                        Tukang Jagoan GoKang akan kerjakan semua proyek tersebut.
                    </p>
                </div>

            </div>
        </div>
    </section>

    <!-- section 5 -->
    <section class="relative bg-gradient-to-br from-[#fce7ef] via-[#fdeff5] to-[#ffffff] py-20 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-10">
            <!-- Judul -->
            <h2 class="text-2xl md:text-4xl font-extrabold text-center text-gray-900 mb-12">
                Kata Mereka tentang <span class="text-red-600">Layanan Borongan</span>
            </h2>

            <!-- Wrapper Slider -->
            <div class="relative flex justify-center">
                <div id="testimonialSlider"
                    class="flex transition-transform duration-700 ease-in-out w-full md:w-[1000px] py-10">
                    <!-- Slide 1 -->
                    <div class="flex-none w-full px-2 md:px-4">
                        <div
                            class="bg-white rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-5 md:p-14 h-autow-auto md:h-[450px] md:w-[900px] sm:h-[300px] sm:w-[400px] flex flex-col justify-between">
                            <div>
                                <svg class="w-20 h-20 text-pink-200 mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M7.17 6A4.17 4.17 0 003 10.17V18a2 2 0 002 2h4a2 2 0 002-2v-7.83A4.17 4.17 0 007.17 6zM17.17 6A4.17 4.17 0 0013 10.17V18a2 2 0 002 2h4a2 2 0 002-2v-7.83A4.17 4.17 0 0017.17 6z" />
                                </svg>
                                <p class="text-gray-700 text-[17px] md:text-[24px] leading-relaxed">
                                    “Abis bikin kamar pake jasa GoKang, pengerjaan cepat dan hasilnya memuaskan.
                                    Ditambah harga yang reasonable. Recommended banget!!”
                                </p>
                            </div>
                            <p class="font-bold text-gray-800 mt-6 text-lg md:text-[20px] md:text-[20px]">Aldo Augusto
                            </p>
                        </div>
                    </div>

                    <!-- Slide 2 -->
                    <div class="flex-none w-full px-2 md:px-4">
                        <div
                            class="bg-white rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-5 md:p-14 h-autow-auto md:h-[450px] md:w-[900px] sm:h-[300px] sm:w-[400px] flex flex-col justify-between">
                            <div>
                                <svg class="w-20 h-20 text-pink-200 mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M7.17 6A4.17 4.17 0 003 10.17V18a2 2 0 002 2h4a2 2 0 002-2v-7.83A4.17 4.17 0 007.17 6zM17.17 6A4.17 4.17 0 0013 10.17V18a2 2 0 002 2h4a2 2 0 002-2v-7.83A4.17 4.17 0 0017.17 6z" />
                                </svg>
                                <p class="text-gray-700 text-[17px] md:text-[24px] leading-relaxed">
                                    “Renovasi ruang tamu dan dapur pake GoKang, pengalamannya sangat positif.
                                    Dikasih penawaran harga yang sesuai ekspektasi. Mantap!”
                                </p>
                            </div>
                            <p class="font-bold text-gray-800 mt-6 text-lg md:text-[20px]">Kevin Aditya</p>
                        </div>
                    </div>

                    <!-- Slide 3 -->
                    <div class="flex-none w-full px-2 md:px-4">
                        <div
                            class="bg-white rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-5 md:p-14 h-autow-auto md:h-[450px] md:w-[900px] sm:h-[300px] sm:w-[400px] flex flex-col justify-between">
                            <div>
                                <svg class="w-20 h-20 text-pink-200 mb-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M7.17 6A4.17 4.17 0 003 10.17V18a2 2 0 002 2h4a2 2 0 002-2v-7.83A4.17 4.17 0 007.17 6zM17.17 6A4.17 4.17 0 0013 10.17V18a2 2 0 002 2h4a2 2 0 002-2v-7.83A4.17 4.17 0 0017.17 6z" />
                                </svg>
                                <p class="text-gray-700 text-[17px] md:text-[24px] leading-relaxed">
                                    “Hasil pekerjaannya rapi banget! Tukang juga profesional dan ramah. Worth it
                                    banget.”
                                </p>
                            </div>
                            <p class="font-bold text-gray-800 mt-6 text-lg md:text-[20px]">Rizky Putra</p>
                        </div>
                    </div>
                </div>

            </div>
            <!-- Navigasi di kiri bawah -->
            <div class="absolute left-10 bottom-4 flex items-center gap-4 mb-6 ml-10">
                <button id="prevBtn"
                    class="w-9 h-9 flex items-center justify-center bg-red-100 hover:bg-red-300 text-red-600 rounded-full shadow">
                    <i class="fas fa-chevron-left"></i>
                </button>

                <div id="dots" class="flex gap-2"></div>

                <button id="nextBtn"
                    class="w-9 h-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full shadow">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>

        <!-- Script -->
        <script>
            const slider = document.getElementById("testimonialSlider");
            const slides = slider.children.length;
            const dotsContainer = document.getElementById("dots");
            const prevBtn = document.getElementById("prevBtn");
            const nextBtn = document.getElementById("nextBtn");
            let current = 0;

            // Buat dot navigasi
            for (let i = 0; i < slides; i++) {
                const dot = document.createElement("button");
                dot.className = "w-3 h-3 rounded-full bg-gray-300 transition-all duration-300";
                dot.addEventListener("click", () => moveTo(i));
                dotsContainer.appendChild(dot);
            }
            const dots = dotsContainer.querySelectorAll("button");

            function moveTo(index) {
                current = index;
                slider.style.transform = `translateX(-${index * 100}%)`;
                dots.forEach((d, i) => d.className = i === index
                    ? "w-3 h-3 rounded-full bg-red-600"
                    : "w-3 h-3 rounded-full bg-gray-300");
            }

            prevBtn.onclick = () => moveTo((current - 1 + slides) % slides);
            nextBtn.onclick = () => moveTo((current + 1) % slides);

            moveTo(0);
        </script>
    </section>

    <!-- section 7 -->
    <section class="bg-gradient-to-r from-[#a80000] to-[#e31313] text-white relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">

            <!-- Gambar di kiri -->
            <div class="flex justify-start md:justify-start w-full md:w-1/3">
                <img src="https://www.gokang.id/borongan/bg-building.webp" alt="Bangunan dan Rumah"
                    class="w-[220px] sm:w-[280px] md:w-[300px] lg:w-[380px] drop-shadow-lg ml-[-60px]">
            </div>

            <!-- Konten Teks dan Badge -->
            <div class="flex flex-col items-start md:items-start text-start md:text-left w-full md:w-3/4">
                <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2">
                    Tunggu Apa Lagi?
                </h2>
                <p class="text-lg sm:text-xl font-semibold mb-6">
                    Pesan Borongan untuk Rumah dan Bisnismu
                </p>

                <!-- Badge List -->
                <!-- Badge + Tombol (sebaris semua) -->
                <div
                    class="flex justify-center md:justify-start gap-4 mb-8 overflow-x-auto whitespace-nowrap px-2 scrollbar-hide items-center">
                    <div class="inline-flex items-center bg-white/20 rounded-full px-5 py-2 shrink-0">
                        <i class="fas fa-check text-white mr-2"></i>
                        <span class="text-white font-medium">Harga Transparan</span>
                    </div>
                    <div class="inline-flex items-center bg-white/20 rounded-full px-5 py-2 shrink-0">
                        <i class="fas fa-check text-white mr-2"></i>
                        <span class="text-white font-medium">Bertanggung Jawab</span>
                    </div>
                    <div class="inline-flex items-center bg-white/20 rounded-full px-5 py-2 shrink-0">
                        <i class="fas fa-check text-white mr-2"></i>
                        <span class="text-white font-medium">Bergaransi</span>
                    </div>

                    <!-- Tombol (ikut di baris yang sama) -->
                    <a href="#"
                        class="inline-flex items-center justify-center bg-white text-[#d00] font-bold rounded-full px-8 py-3 text-lg hover:bg-gray-100 transition-all duration-300 shadow-md shrink-0">
                        Download Sekarang
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- section akhir -->
 <section class="bg-[#fde8e8] pt-12 pb-16 px-6 md:px-10 relative overflow-hidden">
    <div class="max-w-7xl mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
    
    <!-- Gambar HP -->
    <div class="flex justify-center md:justify-start w-full md:w-1/2">
      <img 
        src="https://www.gokang.id/footer/gokang-app-interface.webp" 
        alt="Aplikasi GoKang" 
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
        <a href="#"><img src="https://developer.android.com/images/brand/en_app_rgb_wo_45.png" alt="Google Play" class="w-[140px]"></a>
        <a href="#"><img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="App Store" class="w-[130px]"></a>
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
      <img src="https://www.gokang.id/images/gokang-logo-new-red.png" alt="GoKang Logo" class="w-[150px] mb-3">
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
  <div class="max-w-7xl mx-auto mt-8 flex justify-center md:justify-start gap-5">
    <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-instagram"></i></a>
    <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-facebook"></i></a>
    <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-tiktok"></i></a>
    <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-youtube"></i></a>
    <a href="#" class="text-gray-600 hover:text-red-500 text-xl"><i class="fab fa-linkedin"></i></a>
  </div>

  <!-- Copyright -->
  <p class="text-center text-gray-500 text-sm mt-8">
    © 2025 GoKang | Merek terdaftar oleh PT. Tenaga GoKang Indonesia di Direktorat Jenderal Kekayaan Intelektual Republik Indonesia
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