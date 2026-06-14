# Spesifikasi Teknis: UX Improvement
**Project:** Sistem Informasi FITRA — Bapenda Provinsi Sumatera Selatan  
**Tanggal:** 2026-06-14  
**Status:** Ready for execution

---

## Konteks Codebase

Stack yang digunakan:
- **Backend:** Laravel 12, Inertia.js v2 (server-side)
- **Frontend:** React 19 + TypeScript strict, `useForm` hook dari `@inertiajs/react`
- **Form pattern yang berlaku:** Untuk form statis sudah ada `<Form>` component dari Inertia. Untuk form dengan state dinamis (seperti array items), harus pakai `useForm` hook.
- **Komponen UI:** shadcn/ui (sudah ada: Dialog, Select, Input, Button, Label, Table, Badge, dll.)

---

## FITUR 1 — Inline Barang pada Create Pengajuan & Pembelian

### Konteks & Masalah

Flow saat ini memaksa user melakukan dua navigasi terpisah:
1. Buat header pengajuan/pembelian → submit → redirect ke list
2. Masuk ke halaman show → klik "Tambah Barang" → isi form barang

Tujuan: gabungkan langkah ini menjadi **satu halaman create** yang memuat header + tabel barang inline.

### Keputusan Desain Penting (baca sebelum eksekusi)

- **Items wajib minimal 1** saat create. Rationale: jika user sudah di halaman create all-in-one, tidak masuk akal submit tanpa barang. Halaman show masih bisa dipakai untuk menambah barang tambahan setelah create.
- **Halaman show/edit barang TIDAK diubah** — alur tambah barang dari halaman rincian tetap ada sebagai fallback.
- **Pembelian lebih kompleks dari Pengajuan** karena ada vendor price auto-fill. Kerjakan Pengajuan dulu, baru Pembelian.

---

### TASK F1-A: Backend — Pengajuan

#### F1-A1: Update `PengajuansController::create()`
**File:** `app/Http/Controllers/PengajuansController.php`

```php
public function create()
{
    $barangs = Barangs::orderBy('nama_barang')->get(['id', 'nama_barang', 'satuan', 'tipe']);
    return Inertia::render('pengajuans/create', [
        'barangs' => $barangs,
    ]);
}
```

#### F1-A2: Update `Pengajuan/StoreRequest.php`
**File:** `app/Http/Requests/Pengajuan/StoreRequest.php`

Tambahkan validasi nested items:

```php
public function rules(): array
{
    return [
        'deskripsi' => 'required|string|max:1000',
        'urgensi'   => 'required|in:normal,mendesak',
        'items'     => 'required|array|min:1',
        'items.*.barang_id' => 'required|exists:barangs,id',
        'items.*.jumlah'    => 'required|integer|min:1',
    ];
}

public function messages(): array
{
    return [
        'items.required'            => 'Minimal tambahkan 1 barang.',
        'items.min'                 => 'Minimal tambahkan 1 barang.',
        'items.*.barang_id.required'=> 'Pilih barang.',
        'items.*.barang_id.exists'  => 'Barang tidak valid.',
        'items.*.jumlah.required'   => 'Jumlah wajib diisi.',
        'items.*.jumlah.min'        => 'Jumlah minimal 1.',
    ];
}
```

#### F1-A3: Update `PengajuansController::store()`
**File:** `app/Http/Controllers/PengajuansController.php`

Wrap dalam DB transaction. Ganti isi method `store()`:

```php
public function store(StoreRequest $request)
{
    DB::transaction(function () use ($request) {
        $pengajuan = Pengajuans::create([
            ...$request->only(['deskripsi', 'urgensi']),
            'user_id' => Auth::id(),
            'status'  => 'pending',
        ]);

        foreach ($request->items as $item) {
            $pengajuan->barang_pengajuans()->create([
                'barang_id' => $item['barang_id'],
                'jumlah'    => $item['jumlah'],
            ]);
        }
    });

    return redirect()->route('pengajuans.index')
        ->with('success', 'Pengajuan berhasil dibuat.');
}
```

---

### TASK F1-B: Backend — Pembelian

#### F1-B1: Update `PembeliansController::create()`
**File:** `app/Http/Controllers/PembeliansController.php`

Pass barangs + semua vendor prices dikelompokkan per vendor:

```php
public function create()
{
    $vendors = Vendor::orderBy('nama_vendor')->get(['id', 'nama_vendor']);
    $barangs = Barangs::orderBy('nama_barang')->get(['id', 'nama_barang', 'satuan', 'tipe']);

    // Shape: { vendor_id => { barang_id => harga } }
    $allVendorPrices = BarangVendor::all(['vendor_id', 'barang_id', 'harga'])
        ->groupBy('vendor_id')
        ->map(fn($items) => $items->keyBy('barang_id')->map(fn($bv) => $bv->harga));

    return Inertia::render('pembelians/create', [
        'vendors'         => $vendors,
        'barangs'         => $barangs,
        'allVendorPrices' => $allVendorPrices,
    ]);
}
```

#### F1-B2: Update `PembeliansController::store()`
**File:** `app/Http/Controllers/PembeliansController.php`

Tambahkan validasi items dan buat dalam transaction:

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'vendor_id' => 'nullable|exists:vendors,id',
        'deskripsi' => 'required|string|max:255',
        'dokumen'   => 'nullable|file|mimes:pdf,doc,docx,jpg,jpeg,png,gif|max:5120',
        'items'     => 'required|array|min:1',
        'items.*.barang_id' => 'required|exists:barangs,id',
        'items.*.jumlah'    => 'required|integer|min:1',
        'items.*.harga'     => 'required|integer|min:0',
    ], [
        'items.required'             => 'Minimal tambahkan 1 barang.',
        'items.min'                  => 'Minimal tambahkan 1 barang.',
        'items.*.barang_id.required' => 'Pilih barang.',
        'items.*.jumlah.required'    => 'Jumlah wajib diisi.',
        'items.*.jumlah.min'         => 'Jumlah minimal 1.',
        'items.*.harga.required'     => 'Harga wajib diisi.',
        'items.*.harga.min'          => 'Harga tidak boleh negatif.',
    ]);

    DB::transaction(function () use ($request, $validated) {
        $pembelianData = [
            'user_id'     => Auth::id(),
            'vendor_id'   => $validated['vendor_id'] ?? null,
            'status'      => 'pending',
            'total_harga' => 0,
            'deskripsi'   => $validated['deskripsi'],
        ];

        if ($request->hasFile('dokumen')) {
            $pembelianData['dokumen'] = $request->file('dokumen')->store('pembelians', 'public');
        }

        $pembelian = Pembelians::create($pembelianData);

        foreach ($validated['items'] as $item) {
            $pembelian->barang_pembelians()->create([
                'barang_id' => $item['barang_id'],
                'jumlah'    => $item['jumlah'],
                'harga'     => $item['harga'],
            ]);
        }
        // total_harga otomatis dihitung oleh model event Barang_Pembelian::booted()
    });

    return redirect()->route('pembelians.index')
        ->with('success', 'Pembelian berhasil dibuat.');
}
```

---

### TASK F1-C: Frontend — `pengajuans/create.tsx`
**File:** `resources/js/pages/pengajuans/create.tsx`

Ganti implementasi dengan `useForm` hook. Hapus `<Form>` component dari Inertia dan gunakan `useForm`.

**Interface Props yang dibutuhkan:**
```typescript
interface Props {
    barangs: Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe'>[];
}

interface ItemRow {
    barang_id: string;
    jumlah: number;
}
```

**State dengan useForm:**
```typescript
const { data, setData, post, processing, errors } = useForm<{
    deskripsi: string;
    urgensi: string;
    items: ItemRow[];
}>({
    deskripsi: '',
    urgensi: 'normal',
    items: [{ barang_id: '', jumlah: 1 }],
});
```

**Fungsi pengelola items:**
```typescript
const addItem = () =>
    setData('items', [...data.items, { barang_id: '', jumlah: 1 }]);

const removeItem = (index: number) =>
    setData('items', data.items.filter((_, i) => i !== index));

const updateItem = (index: number, field: keyof ItemRow, value: string | number) => {
    const updated = [...data.items];
    updated[index] = { ...updated[index], [field]: value };
    setData('items', updated);
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(pengajuans.store().url);
};
```

**Layout halaman:**
```
[Header Form: deskripsi + urgensi]
─────────────────────────────────
[Tabel Barang]
  Header: Barang | Jumlah | Satuan | Aksi
  Row 1: [Select Barang] [Input Jumlah] [auto] [Hapus]
  Row 2: ...
  [+ Tambah Barang]
─────────────────────────────────
[Tombol Submit | Batal]
```

**Ketentuan implementasi tabel barang:**
- Gunakan komponen `Select` dari shadcn untuk pilih barang
- Kolom satuan auto-fill dari barang yang dipilih (read-only)
- Tombol hapus row disable jika hanya ada 1 item (minimal 1 harus ada)
- Error validasi per-item ditampilkan di bawah field masing-masing, akses via `errors['items.0.barang_id']`
- Error `errors.items` (level array) tampilkan di atas tabel

---

### TASK F1-D: Frontend — `pembelians/create.tsx`
**File:** `resources/js/pages/pembelians/create.tsx`

Lebih kompleks dari pengajuan karena ada vendor price auto-fill.

**Interface Props:**
```typescript
interface Props {
    vendors: Pick<Vendor, 'id' | 'nama_vendor'>[];
    barangs: Pick<Barang, 'id' | 'nama_barang' | 'satuan' | 'tipe'>[];
    allVendorPrices: Record<string, Record<string, number>>;
    // Shape: { "1": { "3": 50000, "7": 120000 }, "2": { ... } }
}

interface ItemRow {
    barang_id: string;
    jumlah: number;
    harga: number;
}
```

**State:**
```typescript
const { data, setData, post, processing, errors } = useForm<{
    vendor_id: string;
    deskripsi: string;
    dokumen: File | null;
    items: ItemRow[];
}>({
    vendor_id: '',
    deskripsi: '',
    dokumen: null,
    items: [{ barang_id: '', jumlah: 1, harga: 0 }],
});
```

**Logika vendor price auto-fill:**
```typescript
// Ketika vendor berubah → update semua harga item yang sudah dipilih
const handleVendorChange = (vendorId: string) => {
    setData(prev => ({
        ...prev,
        vendor_id: vendorId,
        items: prev.items.map(item => ({
            ...item,
            harga: allVendorPrices[vendorId]?.[item.barang_id] ?? item.harga,
        })),
    }));
};

// Ketika barang di row berubah → auto-fill harga dari vendor yang dipilih
const updateItem = (index: number, field: keyof ItemRow, value: string | number) => {
    const updated = [...data.items];
    if (field === 'barang_id' && data.vendor_id) {
        updated[index] = {
            ...updated[index],
            barang_id: value as string,
            harga: allVendorPrices[data.vendor_id]?.[value as string] ?? 0,
        };
    } else {
        updated[index] = { ...updated[index], [field]: value };
    }
    setData('items', updated);
};
```

**Layout halaman:**
```
[Header Form: vendor (optional) + deskripsi + dokumen]
─────────────────────────────────────────────────────
[Tabel Barang]
  Header: Barang | Jumlah | Harga | Total | Aksi
  Row 1: [Select Barang] [Input Jumlah] [Input Harga*] [auto] [Hapus]
  Row 2: ...
  [+ Tambah Barang]
─────────────────────────────────────────────────────
[Total Keseluruhan: Rp xxx]
[Tombol Submit | Batal]
```

*Kolom Harga: jika vendor dipilih dan barang punya harga vendor, field auto-fill + tampilkan badge "Harga Vendor". User tetap bisa edit manual.

**Format currency:** tampilkan harga dengan `toLocaleString('id-ID')` untuk display, kirim sebagai integer.

**Submit:** gunakan `post()` dengan `forceFormData: true` karena ada file upload (dokumen).

---

## FITUR 2 — Filter Download PDF Barang

### Konteks & Masalah

Download button saat ini (`DownloadPdfLink` type="barangs") langsung hit `/barangs/download-pdf` tanpa filter apapun, selalu download semua barang.

Tujuan: tambahkan filter tipe barang (dan opsional: status stok) sebelum download.

---

### TASK F2-A: Backend — `BarangsController`

#### F2-A1: Update `index()` — pass tipe options
**File:** `app/Http/Controllers/BarangsController.php`

Tambahkan ke data yang dikirim ke view:

```php
// Di dalam method index(), tambahkan ke array Inertia::render():
'tipeOptions' => Barangs::distinct()->orderBy('tipe')->pluck('tipe'),
```

#### F2-A2: Update `downloadPdf()` — tambahkan filter support
**File:** `app/Http/Controllers/BarangsController.php`

```php
public function downloadPdf(Request $request)
{
    $request->validate([
        'tipe'  => 'nullable|string',
        'stok'  => 'nullable|in:semua,rendah,habis',
    ]);

    $barangs = Barangs::query()
        ->when($request->tipe, fn($q, $v) => $q->where('tipe', $v))
        ->when($request->stok === 'rendah', fn($q) => $q->where('stock_tersedia', '<', 10)->where('stock_tersedia', '>', 0))
        ->when($request->stok === 'habis',  fn($q) => $q->where('stock_tersedia', 0))
        ->orderBy('nama_barang')
        ->get();

    $filterInfo = $this->buildFilterInfo($request);

    $html = view('pdf.barang', [
        'barangs'    => $barangs,
        'filterInfo' => $filterInfo,
    ])->render();

    $pdf = Pdf::loadHTML($html)->setPaper('A4', 'portrait');

    $filename = 'Laporan-Barang-' . date('Y-m-d');
    if ($request->tipe)  $filename .= '-' . str_replace(' ', '_', $request->tipe);
    if ($request->stok && $request->stok !== 'semua') $filename .= '-stok_' . $request->stok;

    return $pdf->download($filename . '.pdf');
}

private function buildFilterInfo(Request $request): string
{
    $parts = [];
    if ($request->tipe) $parts[] = 'Tipe: ' . $request->tipe;
    if ($request->stok && $request->stok !== 'semua') {
        $parts[] = 'Stok: ' . match($request->stok) {
            'rendah' => 'Stok Rendah (< 10)',
            'habis'  => 'Stok Habis',
            default  => $request->stok,
        };
    }
    return $parts ? implode(' | ', $parts) : 'Semua barang';
}
```

---

### TASK F2-B: Update PDF view — tampilkan info filter
**File:** `resources/views/pdf/barang.php`

Tambahkan info filter di bawah title, sebelum tabel:

```html
<div class="title">
    Laporan Data Barang
</div>

<!-- Tambah ini: -->
@if($filterInfo !== 'Semua barang')
<div style="text-align:center; font-size:11px; margin-bottom:12px; color:#555;">
    Filter: {{ $filterInfo }}
</div>
@endif
```

> **Catatan:** file ini adalah pure PHP (bukan Blade), bukan `.blade.php`. Gunakan sintaks PHP:
```php
<?php if ($filterInfo !== 'Semua barang'): ?>
<div style="text-align:center; font-size:11px; margin-bottom:12px; color:#555;">
    Filter: <?php echo htmlspecialchars($filterInfo); ?>
</div>
<?php endif; ?>
```

---

### TASK F2-C: Frontend — Komponen `BarangDownloadFilter`
**File baru:** `resources/js/components/barang-download-filter.tsx`

Buat komponen Dialog yang muncul saat download diklik.

**Interface:**
```typescript
interface Props {
    tipeOptions: string[];
}
```

**State internal komponen:**
```typescript
const [open, setOpen] = useState(false);
const [selectedTipe, setSelectedTipe] = useState<string>('');
const [selectedStok, setSelectedStok] = useState<string>('semua');
```

**Build URL dan trigger download:**
```typescript
const handleDownload = () => {
    const params = new URLSearchParams();
    if (selectedTipe) params.set('tipe', selectedTipe);
    if (selectedStok && selectedStok !== 'semua') params.set('stok', selectedStok);
    
    const url = `/barangs/download-pdf?${params.toString()}`;
    window.open(url, '_blank');
    setOpen(false);
};
```

**UI Dialog:**
```
[Title: "Unduh Laporan Barang"]
[Description: "Pilih filter untuk laporan yang akan diunduh."]

[Label: Tipe Barang]
[Select: "Semua tipe" | ATK | dll... (dari tipeOptions)]

[Label: Status Stok]  
[Select: "Semua" | "Stok Rendah (< 10)" | "Stok Habis"]

[Footer: Batal | Unduh PDF]
```

Gunakan komponen `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter` dari shadcn (sudah ada).

---

### TASK F2-D: Frontend — Update `barangs/index.tsx`
**File:** `resources/js/pages/barangs/index.tsx`

1. Tambahkan `tipeOptions: string[]` ke interface `Props`
2. Pass `tipeOptions` ke komponen `BarangDownloadFilter`
3. Ganti baris `<DownloadPdfLink type="barangs" />` dengan komponen baru:

```tsx
// Sebelum:
<DownloadPdfLink type="barangs" />

// Sesudah:
<BarangDownloadFilter tipeOptions={tipeOptions} />
```

Tambah import:
```typescript
import BarangDownloadFilter from '@/components/barang-download-filter';
```

---

## Urutan Eksekusi yang Disarankan

```
F1-A1 → F1-A2 → F1-A3   (backend pengajuan, sequential)
F1-C                       (frontend pengajuan, bisa dikerjakan setelah F1-A selesai)

F1-B1 → F1-B2             (backend pembelian)
F1-D                       (frontend pembelian, bisa dikerjakan setelah F1-B selesai)

F2-A1 → F2-A2 → F2-B     (backend filter download, sequential)
F2-C → F2-D               (frontend filter download)
```

Fitur 1 (pengajuan) dan Fitur 2 bisa dikerjakan paralel karena tidak ada dependency silang.

---

## Hal-hal yang TIDAK Perlu Diubah

- Halaman `pengajuans/barangs/create.tsx` dan `pembelians/barangs/create.tsx` (tetap ada sebagai alur tambah barang dari halaman rincian)
- `BarangPengajuanController` dan `BarangPembelianController` (tidak diubah)
- Halaman `pengajuans/edit.tsx` dan `pembelians/edit.tsx` (scope tidak termasuk edit)
- Komponen `DownloadPdfLink` yang sudah ada (masih dipakai untuk pembelian dan pengajuan per-ID)

---

## Bugs yang Sebaiknya Diperbaiki Sekalian (Quick Wins)

Ini bukan bagian dari dua fitur di atas tapi sangat minor dan bisa dikerjakan sekalian:

1. **Trailing space middleware** — di `BarangPengajuanController`, `UserController`, `RoleController`:
   ```php
   // Ganti 'update   ' menjadi 'update'
   new Middleware('permission:...', only: ['edit', 'update   '])
   //                                                     ^^^
   ```

2. **Kolom `harga` dan `jumlah` di migration `barang__pembelians`** bertipe `string`, seharusnya integer. Perlu migration baru:
   ```php
   Schema::table('barang__pembelians', function (Blueprint $table) {
       $table->unsignedBigInteger('harga')->change();
       $table->unsignedInteger('jumlah')->change();
   });
   ```
   Catatan: butuh `doctrine/dbal` package atau Laravel `alter` support. Jika tidak mau buat migration baru, pastikan cast di model sudah benar (sudah ada di `Barang_Pembelian` model? — perlu cek, tidak ada `$casts` di model itu).

---

*Dokumen ini siap dieksekusi oleh Claude Code. Setiap task memiliki file target, kode referensi, dan context yang cukup untuk implementasi tanpa perlu bertanya balik.*
