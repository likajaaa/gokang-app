<?php

namespace Database\Seeders;

use App\Models\Area;
use Illuminate\Database\Seeder;

class AreasSeeder extends Seeder
{
    public function run(): void
    {
        $cities = [
            [
                'name' => 'Jakarta',
                'districts' => [
                    'Jakarta Pusat',
                    'Jakarta Utara',
                    'Jakarta Barat',
                    'Jakarta Selatan',
                    'Jakarta Timur',
                ],
            ],
            [
                'name' => 'Bogor',
                'districts' => [
                    'Bogor Utara',
                    'Bogor Selatan',
                    'Bogor Timur',
                    'Bogor Barat',
                    'Bogor Tengah',
                    'Tanah Sareal',
                ],
            ],
            [
                'name' => 'Depok',
                'districts' => [
                    'Beji',
                    'Cimanggis',
                    'Pancoran Mas',
                    'Sukmajaya',
                    'Cinere',
                    'Limo',
                    'Sawangan',
                    'Tapos',
                    'Cipayung',
                    'Bojongsari',
                    'Cilodong',
                ],
            ],
            [
                'name' => 'Tangerang',
                'districts' => [
                    'Tangerang Kota',
                    'Tangerang Selatan',
                    'Serpong',
                    'Pamulang',
                    'Ciputat',
                    'Cisauk',
                    'Pagedangan',
                    'BSD',
                    'Alam Sutera',
                    'Karawaci',
                ],
            ],
            [
                'name' => 'Bekasi',
                'districts' => [
                    'Bekasi Barat',
                    'Bekasi Timur',
                    'Bekasi Utara',
                    'Bekasi Selatan',
                    'Medan Satria',
                    'Pondok Gede',
                    'Jatiasih',
                    'Bantargebang',
                    'Mustika Jaya',
                    'Rawalumbu',
                    'Pondok Melati',
                    'Jatisampurna',
                ],
            ],
        ];

        foreach ($cities as $cityData) {
            $city = Area::updateOrCreate(
                ['name' => $cityData['name'], 'level' => 'city'],
                ['parent_id' => null, 'is_covered' => true]
            );

            foreach ($cityData['districts'] as $districtName) {
                Area::updateOrCreate(
                    [
                        'parent_id' => $city->id,
                        'name' => $districtName,
                        'level' => 'district',
                    ],
                    ['is_covered' => true]
                );
            }
        }
    }
}
