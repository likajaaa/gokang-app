<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class SolutionsSeeder extends Seeder
{
    /**
     * 24 "Solusi Masalah Rumah" untuk kategori Perbaikan + Material.
     *
     * Disimpan di table `services` dengan category='perbaikan' agar bisa
     * di-filter lewat GET /services?category=perbaikan.
     */
    public function run(): void
    {
        $solutions = [
            ['name' => 'Kebocoran', 'slug' => 'kebocoran', 'description' => 'Jaga Rumah Bebas Bocor', 'price' => 200000, 'is_new' => false, 'sort' => 101],
            ['name' => 'Cuci Toren', 'slug' => 'cuci-toren', 'description' => 'Toren Kotor Jadi Bersih, Air Jadi Mengalir Lancar', 'price' => 150000, 'is_new' => true, 'sort' => 102],
            ['name' => 'Cat', 'slug' => 'solusi-cat', 'description' => 'Warnai Rumahmu', 'price' => 150000, 'is_new' => false, 'sort' => 103],
            ['name' => 'Keramik', 'slug' => 'solusi-keramik', 'description' => 'Percantik Lantai dan Dindingmu', 'price' => 180000, 'is_new' => false, 'sort' => 104],
            ['name' => 'Listrik', 'slug' => 'solusi-listrik', 'description' => 'Rumah Terang, Hati Senang', 'price' => 200000, 'is_new' => false, 'sort' => 105],
            ['name' => 'Pipa', 'slug' => 'solusi-pipa', 'description' => 'Air Mengalir Lancar', 'price' => 170000, 'is_new' => false, 'sort' => 106],
            ['name' => 'Toilet', 'slug' => 'toilet', 'description' => 'Kamar Mandi Bersih dan Nyaman', 'price' => 160000, 'is_new' => false, 'sort' => 107],
            ['name' => 'Dinding/Tembok', 'slug' => 'dinding-tembok', 'description' => 'Dinding Kokoh dan Terjaga', 'price' => 150000, 'is_new' => false, 'sort' => 108],
            ['name' => 'Plafon', 'slug' => 'solusi-plafon', 'description' => 'Kebutuhan Langit-langit Rumahmu', 'price' => 150000, 'is_new' => false, 'sort' => 109],
            ['name' => 'Atap/Dak Beton', 'slug' => 'atap-dak-beton', 'description' => 'Atap Pelindung Rumahmu', 'price' => 180000, 'is_new' => false, 'sort' => 110],
            ['name' => 'Pintu/Jendela', 'slug' => 'pintu-jendela', 'description' => 'Kreasi Aksesoris Pintu dan Jendela Rumahmu', 'price' => 160000, 'is_new' => false, 'sort' => 111],
            ['name' => 'Jasa Angkat', 'slug' => 'jasa-angkat', 'description' => 'Bantu Pindahkan Barang-barangmu', 'price' => 120000, 'is_new' => false, 'sort' => 112],
            ['name' => 'Dapur', 'slug' => 'dapur', 'description' => 'Biar Lebih Semangat Memasak', 'price' => 170000, 'is_new' => false, 'sort' => 113],
            ['name' => 'Aluminium Aksesoris', 'slug' => 'solusi-aluminium', 'description' => 'Percantik Interior Rumahmu', 'price' => 160000, 'is_new' => false, 'sort' => 114],
            ['name' => 'Conblock', 'slug' => 'conblock', 'description' => 'Agar Pekarangan Rumahmu Indah', 'price' => 140000, 'is_new' => false, 'sort' => 115],
            ['name' => 'Kipas Angin', 'slug' => 'kipas-angin', 'description' => 'Biar Rumahmu Lebih Adem', 'price' => 130000, 'is_new' => false, 'sort' => 116],
            ['name' => 'Exhaust Fan', 'slug' => 'exhaust-fan', 'description' => 'Sirkulasi Udara Lebih Baik', 'price' => 140000, 'is_new' => false, 'sort' => 117],
            ['name' => 'Lemari', 'slug' => 'lemari', 'description' => 'Pasang dan Perbaiki Lemari Kesayangan', 'price' => 150000, 'is_new' => false, 'sort' => 118],
            ['name' => 'Batu Alam', 'slug' => 'batu-alam', 'description' => 'Hiasan Alami untuk Rumahmu', 'price' => 180000, 'is_new' => false, 'sort' => 119],
            ['name' => 'Tangki Air (Bawah Tanah)', 'slug' => 'tangki-air-bawah', 'description' => 'Perbaiki dan Pasang Tangki Air Bawah Tanah', 'price' => 220000, 'is_new' => false, 'sort' => 120],
            ['name' => 'Tangki Air', 'slug' => 'tangki-air-atas', 'description' => 'Pemasangan Tangki Air di Atas', 'price' => 200000, 'is_new' => false, 'sort' => 121],
            ['name' => 'Kanopi', 'slug' => 'kanopi', 'description' => 'Pelindung Teras dan Carport', 'price' => 190000, 'is_new' => false, 'sort' => 122],
            ['name' => 'Water Heater', 'slug' => 'water-heater', 'description' => 'Mandi Air Hangat Tiap Hari', 'price' => 180000, 'is_new' => false, 'sort' => 123],
            ['name' => 'Lantai', 'slug' => 'lantai', 'description' => 'Perbaikan dan Pemasangan Lantai', 'price' => 170000, 'is_new' => false, 'sort' => 124],
        ];

        foreach ($solutions as $s) {
            Service::updateOrCreate(
                ['slug' => $s['slug']],
                [
                    'code' => 'SOLUSI_'.strtoupper(str_replace('-', '_', $s['slug'])),
                    'name' => $s['name'],
                    'description' => $s['description'],
                    'icon_url' => null,
                    'price_full_day' => $s['price'],
                    'price_morning' => 0,
                    'price_afternoon' => 0,
                    'service_type' => 'daily',
                    'category' => 'perbaikan',
                    'is_new' => $s['is_new'],
                    'is_active' => true,
                    'sort_order' => $s['sort'],
                ]
            );
        }
    }
}
