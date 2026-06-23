# Panduan Penerapan — Update Tipe/Jenis Barang + Perbaikan Bug

Paket ini berisi 4 commit (dalam bentuk patch) yang siap diterapkan ke branch kerja kamu.

## Isi paket

| Patch | Isi |
|---|---|
| `0001` | 4 bug dari review awal: typo role seeder (`Tata Kelola`→`Tata Usaha`), relasi `User` mati, password wajib saat edit user, inkonsistensi nama kolom FK `pengadaan`/`permintaan` |
| `0002` | Tipe Barang dinamis (master data + CRUD + halaman), Jenis Barang (enum pendek/sedang/panjang), filter kombinasi di halaman Barang, laporan PDF ikut filter aktif |
| `0003` | Form tambah-barang ke Pengadaan/Permintaan existing jadi multi-baris (konsisten dgn form utama), Combobox pencarian di semua select barang (7 titik), test coverage domain inti yang sebelumnya kosong |
| `0004` | Fix laporan PDF yang masih mereferensikan kolom `tipe` lama (akan fatal error tanpa fix ini), tambah kolom Jenis di laporan, hapus 2 file PDF mati peninggalan rename sebelumnya |

## Cara menerapkan

Dari root project kamu (working tree harus bersih):

```bash
git checkout -b feature/tipe-jenis-barang
git am 0001-*.patch 0002-*.patch 0003-*.patch 0004-*.patch
```

`git am` menjaga riwayat commit & pesan commit apa adanya (bukan jadi satu commit besar). Kalau ada konflik (misalnya kamu sudah mengubah file yang sama sejak commit `66a0cef`), `git am --abort` lalu beri tahu saya bagian mana yang konflik.

## Setelah apply — urutan wajib

```bash
composer install
npm install          # menambahkan cmdk & @radix-ui/react-popover (dependency baru utk Combobox)
```

### 1. Migration — JANGAN migrate semua sekaligus di deploy pertama

Ada 6 migration baru (`2026_06_23_000001` s/d `000006`). Yang paling sensitif adalah:

- **`000004`** — membackfill kolom `tipe` (string) lama ke tabel master `tipe_barangs` baru.
- **`000005`** — baru MENGHAPUS kolom `tipe` lama & mengunci `tipe_barang_id` jadi wajib. Migration ini punya **guard**: kalau ternyata masih ada baris `barangs` yang belum berhasil dipetakan, migration akan **berhenti dengan error** (tidak akan korup data secara senyap).

Saran konkret:
```bash
php artisan migrate                      # jalankan 000001–000006
```
Migration `000004` sudah saya tulis untuk otomatis memetakan nilai `tipe` lama ("ATK", "ELEKTRONIK", atau apa pun yang ada di data produksimu) ke tabel `tipe_barangs`, termasuk menangani variasi spasi/kapitalisasi. **Saya sudah memverifikasi logic ini langsung terhadap MariaDB sungguhan** (bukan cuma baca kode) dengan data uji yang mengandung spasi & variasi penulisan — hasilnya benar. Tapi karena saya tidak punya akses ke database produksi kamu, **setelah migrate, cek dulu hasilnya**:

```sql
SELECT id, nama_tipe FROM tipe_barangs;
SELECT COUNT(*) FROM barangs WHERE tipe_barang_id IS NULL;
```

Kalau query kedua hasilnya 0 dan daftar `tipe_barangs` masuk akal, kamu aman. Migration `000005` akan otomatis menolak jalan kalau masih ada yang `NULL` — jadi worst-case-nya migration berhenti dengan pesan jelas, bukan data hilang.

### 2. Build frontend

```bash
npm run build
```
(atau `npm run dev` saat development). Ini juga akan regenerate file typed-routes Wayfinder.

### 3. Jalankan test

```bash
php artisan test
```
Saya menambahkan test baru untuk: seeder (regresi bug #1), relasi User (regresi bug #2), update user tanpa password (regresi bug #3), CRUD Tipe Barang, validasi & filter kombinasi Barang, alur bisnis Permintaan (approve normal/mendesak, reject, approve-all, pengadaan selisih), alur bisnis Pengadaan (total harga otomatis, perubahan status, sync harga vendor), dan tambah-barang multi-item ke Pengadaan/Permintaan (termasuk guard anti-duplikat).

**Catatan jujur:** saya tidak punya akses `composer install` di sandbox saya (jaringan ke packagist.org diblokir), jadi saya tidak bisa menjalankan `php artisan test` sendiri untuk verifikasi akhir. Yang sudah saya lakukan sebagai gantinya:
- Setiap file PHP dicek `php -l` (sintaks valid).
- Migration inti (rename kolom FK, buat tabel `tipe_barangs`, backfill, finalize+guard) saya **jalankan sungguhan** terhadap MariaDB asli yang saya install di sandbox — termasuk uji kasus guard (sengaja menyisakan data NULL untuk pastikan migration menolak jalan) dan uji rollback (`down()`).
- Semua kode frontend (TypeScript) lolos `tsc --noEmit` dan `eslint` tanpa error baru dibanding kondisi awal.
- `npm run build` gagal di sandbox saya — tapi murni karena Wayfinder butuh `php artisan` yang hidup (butuh `vendor/` yang tidak bisa saya install), bukan karena kode saya salah.

Karena saya tidak bisa menjalankan Pest secara sungguhan, **mohon jalankan `php artisan test` di mesinmu sebagai langkah verifikasi terakhir** sebelum merge.

## Yang perlu kamu putuskan/cek manual

1. **Data tipe barang hasil backfill** — kalau di database produksi ada nilai `tipe` selain "ATK"/"ELEKTRONIK", migration akan tetap memasukkannya ke `tipe_barangs` apa adanya (di-trim spasi saja). Cek dan rapikan namanya lewat halaman Tipe Barang kalau perlu.
2. **`jenis_barang` barang lama** — kolom ini nullable untuk barang yang sudah ada (karena sistem tidak bisa menebak sendiri pendek/sedang/panjang-nya). Form edit barang akan meminta nilai ini diisi begitu barang itu di-edit, tapi barang yang tidak pernah di-edit akan tetap `NULL` di laporan/filter sampai diisi manual.
3. **Permission baru** — `tipe barangs index/create/edit/delete` sudah otomatis diberikan ke role **Admin** dan **Tata Usaha** lewat migration `000006`. Kalau ada role custom lain yang perlu akses ini juga, tambahkan manual lewat halaman Peran.
