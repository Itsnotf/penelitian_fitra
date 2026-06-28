<?php

namespace Database\Seeders;

use App\Models\Barangs;
use App\Models\TipeBarang;
use Illuminate\Database\Seeder;

class BarangSeeder extends Seeder
{
    public function run(): void
    {
        $tipe = TipeBarang::pluck('id', 'nama_tipe');

        $barangData = [
            'Alat Tulis Kantor' => [
                ['nama_barang' => 'Pensil 2B',          'satuan' => 'lusin', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 20, 'stock_masuk' => 40, 'stock_keluar' => 25],
                ['nama_barang' => 'Kertas HVS A4',      'satuan' => 'rim',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 30, 'stock_masuk' => 80, 'stock_keluar' => 60],
                ['nama_barang' => 'Spidol Whiteboard',  'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 30, 'stock_keluar' => 18],
                ['nama_barang' => 'Stapler',             'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 15, 'stock_keluar' => 8],
                ['nama_barang' => 'Binder Clip 50mm',   'satuan' => 'dus',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 15, 'stock_masuk' => 50, 'stock_keluar' => 30],
            ],
            'Alat Elektronik' => [
                ['nama_barang' => 'Lampu LED 10W',      'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 20, 'stock_masuk' => 60, 'stock_keluar' => 45],
                ['nama_barang' => 'Stop Kontak 5 Lubang','satuan' => 'pcs', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 8,  'stock_masuk' => 20, 'stock_keluar' => 12],
                ['nama_barang' => 'Kabel Listrik 2.5mm','satuan' => 'rol',  'jenis_barang' => 'tidak_habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 10, 'stock_keluar' => 7],
                ['nama_barang' => 'Sakelar Tunggal',    'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 12, 'stock_masuk' => 24, 'stock_keluar' => 16],
                ['nama_barang' => 'Baterai AA',          'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 30, 'stock_masuk' => 100,'stock_keluar' => 85],
            ],
            'Furnitur' => [
                ['nama_barang' => 'Kursi Kantor',       'satuan' => 'unit', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 20, 'stock_keluar' => 15],
                ['nama_barang' => 'Meja Kerja',         'satuan' => 'unit', 'jenis_barang' => 'tidak_habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 10, 'stock_keluar' => 8],
                ['nama_barang' => 'Lemari Arsip',       'satuan' => 'unit', 'jenis_barang' => 'tidak_habis_pakai', 'stock_awal' => 3,  'stock_masuk' => 5,  'stock_keluar' => 4],
                ['nama_barang' => 'Rak Buku',           'satuan' => 'unit', 'jenis_barang' => 'tidak_habis_pakai', 'stock_awal' => 4,  'stock_masuk' => 8,  'stock_keluar' => 6],
                ['nama_barang' => 'Papan Tulis',        'satuan' => 'unit', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 2,  'stock_masuk' => 5,  'stock_keluar' => 3],
            ],
            'Alat Kebersihan' => [
                ['nama_barang' => 'Sapu Ijuk',          'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 8,  'stock_masuk' => 15, 'stock_keluar' => 10],
                ['nama_barang' => 'Pel Lantai',         'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 12, 'stock_keluar' => 8],
                ['nama_barang' => 'Sabun Cuci Tangan',  'satuan' => 'botol', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 20, 'stock_masuk' => 60, 'stock_keluar' => 55],
                ['nama_barang' => 'Pengharum Ruangan',  'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 30, 'stock_keluar' => 28],
                ['nama_barang' => 'Kantong Plastik Sampah','satuan' => 'pak','jenis_barang' => 'habis_pakai', 'stock_awal' => 15, 'stock_masuk' => 40, 'stock_keluar' => 35],
            ],
            'Alat Kesehatan' => [
                ['nama_barang' => 'Masker Medis',       'satuan' => 'dus',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 30, 'stock_masuk' => 100,'stock_keluar' => 90],
                ['nama_barang' => 'Sarung Tangan Latex','satuan' => 'dus',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 20, 'stock_masuk' => 60, 'stock_keluar' => 50],
                ['nama_barang' => 'Plester Luka',       'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 15, 'stock_masuk' => 40, 'stock_keluar' => 30],
                ['nama_barang' => 'Obat Antiseptik',    'satuan' => 'botol', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 25, 'stock_keluar' => 20],
                ['nama_barang' => 'Termometer Digital', 'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 10, 'stock_keluar' => 7],
            ],
            'Bahan Kimia' => [
                ['nama_barang' => 'Alkohol 70%',        'satuan' => 'liter', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 30, 'stock_keluar' => 25],
                ['nama_barang' => 'Deterjen Serbuk',    'satuan' => 'kg',    'jenis_barang' => 'habis_pakai', 'stock_awal' => 20, 'stock_masuk' => 50, 'stock_keluar' => 40],
                ['nama_barang' => 'Cairan Pembersih Lantai','satuan' => 'liter','jenis_barang' => 'habis_pakai','stock_awal' => 8, 'stock_masuk' => 20, 'stock_keluar' => 15],
                ['nama_barang' => 'Tiner',              'satuan' => 'liter', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 10, 'stock_keluar' => 9],
                ['nama_barang' => 'Desinfektan',        'satuan' => 'liter', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 12, 'stock_masuk' => 35, 'stock_keluar' => 30],
            ],
            'Peralatan Laboratorium' => [
                ['nama_barang' => 'Pipet Tetes',        'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 20, 'stock_masuk' => 50, 'stock_keluar' => 35],
                ['nama_barang' => 'Gelas Beaker 250ml', 'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 15, 'stock_masuk' => 30, 'stock_keluar' => 20],
                ['nama_barang' => 'Tabung Reaksi',      'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 30, 'stock_masuk' => 60, 'stock_keluar' => 45],
                ['nama_barang' => 'Spatula',             'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 20, 'stock_keluar' => 12],
                ['nama_barang' => 'Corong Kaca',        'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 8,  'stock_masuk' => 15, 'stock_keluar' => 10],
            ],
            'Komputer & Perangkat IT' => [
                ['nama_barang' => 'Mouse USB',          'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 15, 'stock_masuk' => 30, 'stock_keluar' => 22],
                ['nama_barang' => 'Keyboard USB',       'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 20, 'stock_keluar' => 14],
                ['nama_barang' => 'Flashdisk 32GB',     'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 20, 'stock_masuk' => 50, 'stock_keluar' => 42],
                ['nama_barang' => 'Kabel HDMI 2m',      'satuan' => 'pcs',   'jenis_barang' => 'habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 12, 'stock_keluar' => 8],
                ['nama_barang' => 'Tinta Printer Canon','satuan' => 'botol', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 8,  'stock_masuk' => 24, 'stock_keluar' => 20],
            ],
            'Alat Komunikasi' => [
                ['nama_barang' => 'Telepon Kantor',     'satuan' => 'unit', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 3,  'stock_masuk' => 5,  'stock_keluar' => 4],
                ['nama_barang' => 'Walkie Talkie',      'satuan' => 'unit', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 4,  'stock_masuk' => 8,  'stock_keluar' => 5],
                ['nama_barang' => 'Headset',             'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 20, 'stock_keluar' => 16],
                ['nama_barang' => 'Kabel LAN Cat6',     'satuan' => 'm',    'jenis_barang' => 'tidak_habis_pakai', 'stock_awal' => 100,'stock_masuk' => 200,'stock_keluar' => 150],
                ['nama_barang' => 'Switch Hub 8 Port',  'satuan' => 'unit', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 2,  'stock_masuk' => 4,  'stock_keluar' => 3],
            ],
            'Perlengkapan Keamanan' => [
                ['nama_barang' => 'CCTV Camera',        'satuan' => 'unit', 'jenis_barang' => 'habis_pakai', 'stock_awal' => 4,  'stock_masuk' => 8,  'stock_keluar' => 6],
                ['nama_barang' => 'Kunci Gembok',       'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 10, 'stock_masuk' => 20, 'stock_keluar' => 15],
                ['nama_barang' => 'Helm Keselamatan',   'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 8,  'stock_masuk' => 15, 'stock_keluar' => 10],
                ['nama_barang' => 'Rompi Keselamatan',  'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 6,  'stock_masuk' => 12, 'stock_keluar' => 8],
                ['nama_barang' => 'Kotak P3K',          'satuan' => 'pcs',  'jenis_barang' => 'habis_pakai', 'stock_awal' => 5,  'stock_masuk' => 10, 'stock_keluar' => 7],
            ],
        ];

        foreach ($barangData as $namaTipe => $items) {
            $tipeId = $tipe[$namaTipe];

            foreach ($items as $item) {
                $stockTersedia = $item['stock_awal'] + $item['stock_masuk'] - $item['stock_keluar'];

                Barangs::firstOrCreate(
                    ['nama_barang' => $item['nama_barang']],
                    [
                        'tipe_barang_id'  => $tipeId,
                        'jenis_barang'    => $item['jenis_barang'],
                        'satuan'          => $item['satuan'],
                        'stock_awal'      => $item['stock_awal'],
                        'stock_masuk'     => $item['stock_masuk'],
                        'stock_keluar'    => $item['stock_keluar'],
                        'stock_tersedia'  => $stockTersedia,
                        'jumlah_permintaan' => 0,
                    ]
                );
            }
        }
    }
}
