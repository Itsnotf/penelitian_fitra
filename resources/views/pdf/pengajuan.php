<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Pengajuan Barang</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 30px;
            color: #000;
            font-size: 12px;
            position: relative;
            min-height: 100vh;
        }

        /* Header styling */
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 3px double #000;
            padding-bottom: 10px;
        }

        .header h2 {
            margin: 0;
            text-transform: uppercase;
            font-size: 18px;
        }

        .header p {
            margin: 5px 0;
            font-size: 12px;
        }

        .title {
            text-align: center;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 20px;
            text-transform: uppercase;
            text-decoration: underline;
        }

        /* TABLE STYLING - DATA BARANG */
        .table-data {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            border: 1px solid #000;
        }

        .table-data th {
            background-color: #d1d5db;
            color: #000;
            border: 1px solid #000;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
            font-weight: bold;
            font-size: 11px;
            text-transform: uppercase;
        }

        .table-data td {
            border: 1px solid #000;
            padding: 5px 8px;
            vertical-align: middle;
            font-size: 11px;
        }

        /* TABLE STYLING - INFO & FOOTER (LAYOUTING) */
        /* Tabel tanpa border untuk layout header info & tanda tangan */
        .table-layout {
            width: 100%;
            border-collapse: collapse;
            border: none;
        }
        
        .table-layout td {
            border: none;
            padding: 2px;
            vertical-align: top;
        }

        /* Info Labels */
        .label-column {
            width: 130px;
            font-weight: bold;
        }
        .separator-column {
            width: 15px;
            text-align: center;
        }

        /* Helper classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }

        /* Signature Space */
        .signature-space {
            height: 70px;
        }
        .footer-name {
            font-weight: bold;
            text-decoration: underline;
        }

        .print-info {
            font-size: 9px;
            position: absolute;
            bottom: 0;
            left: 30px;
            right: 30px;
            color: #666;
            font-style: italic;
        }
    </style>
</head>

<body>

    <?php
    // Fungsi Helper
    function penyebut($nilai) {
        $nilai = abs($nilai);
        $huruf = array("", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas");
        $temp = "";
        if ($nilai < 12) {
            $temp = " " . $huruf[$nilai];
        } else if ($nilai < 20) {
            $temp = penyebut($nilai - 10) . " Belas";
        } else if ($nilai < 100) {
            $temp = penyebut($nilai / 10) . " Puluh" . penyebut($nilai % 10);
        } else if ($nilai < 200) {
            $temp = " Seratus" . penyebut($nilai - 100);
        } else if ($nilai < 1000) {
            $temp = penyebut($nilai / 100) . " Ratus" . penyebut($nilai % 100);
        } else if ($nilai < 2000) {
            $temp = " Seribu" . penyebut($nilai - 1000);
        } else if ($nilai < 1000000) {
            $temp = penyebut($nilai / 1000) . " Ribu" . penyebut($nilai % 1000);
        }
        return $temp;
    }

    function terbilang($nilai) {
        if ($nilai < 0) {
            $hasil = "Minus " . trim(penyebut($nilai));
        } else {
            $hasil = trim(penyebut($nilai));
        }
        return $hasil;
    }
    ?>

    <div class="header">
        <h2>Bapenda ProvinsiSumatera Selatan</h2>
        <p>Jl. POM IX, Lorok Pakjo, Kec. Ilir Barat I, Kota Palembang, Sumatera Selatan, 30137-Indonesia <br> Telp: (+62) 08117822364 | bapenda@sumselprov.go.id</p>
    </div>

    <div class="title">
        Laporan Pengajuan Barang
    </div>

    <table class="table-layout" style="margin-bottom: 20px;">
        <tr>
            <td class="label-column">No Dokumen</td>
            <td class="separator-column">:</td>
            <td><?php echo $pengajuan->id; ?></td>
        </tr>
        <tr>
            <td class="label-column">Hari / Tanggal</td>
            <td class="separator-column">:</td>
            <td>
                <?php
                $days = ['Sunday' => 'Minggu', 'Monday' => 'Senin', 'Tuesday' => 'Selasa', 'Wednesday' => 'Rabu', 'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu'];
                $dayName = $days[$pengajuan->created_at->format('l')];
                echo $dayName . ', ' . $pengajuan->created_at->format('d F Y');
                ?>
            </td>
        </tr>
        <tr>
            <td class="label-column">Pihak Penerima</td>
            <td class="separator-column">:</td>
            <td><?php echo $pengajuan->user->name; ?></td>
        </tr>
    </table>

    <table class="table-data">
        <thead>
            <tr>
                <th rowspan="2" style="width: 5%;">NO.</th>
                <th rowspan="2" style="width: 30%;">NAMA BARANG</th>
                <th rowspan="2" style="width: 10%;">TIPE</th>
                <th colspan="2" style="width: 40%;">BANYAKNYA</th>
                <th rowspan="2" style="width: 15%;">KET</th>
            </tr>
            <tr>
                <th style="width: 10%;">ANGKA</th>
                <th style="width: 30%;">HURUF</th>
            </tr>
        </thead>
        <tbody>
            <?php if (count($pengajuan->barang_pengajuans) > 0): ?>
                <?php foreach ($pengajuan->barang_pengajuans as $index => $item): ?>
                    <tr>
                        <td class="text-center"><?php echo $index + 1; ?></td>
                        <td><?php echo $item->barang->nama_barang ?? 'N/A'; ?></td>
                        <td class="text-center"><?php echo $item->barang->tipe ?? 'Unit'; ?></td>
                        <td class="text-center"><?php echo $item->jumlah; ?></td>
                        <td style="text-transform: capitalize; font-style: italic;">
                            <?php echo terbilang($item->jumlah); ?>
                        </td>
                        <td class="text-center">-</td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="6" class="text-center" style="padding: 20px;">Data tidak tersedia</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <table class="table-layout" style="margin-top: 40px;">
        <tr>
            <td width="33%" class="text-center">
                <div>Yang Menyerahkan,</div>
                <div style="font-weight: bold; margin-bottom: 5px;">Tata Usaha</div>
                <div class="signature-space"></div>
                <div class="footer-name">( ........................... )</div>
            </td>

            <td width="33%" class="text-center" style="padding-top: 100px;">
                <div>Mengetahui,</div>
                <div style="font-weight: bold; margin-bottom: 5px;">Kepala Bagian</div>
                <div class="signature-space"></div>
                <div class="footer-name">EKKI APRIANDI, S.STP.</div>
                <div>Penata Tingkat I / III.d</div>
                <div>NIP.199104012010101001</div>
            </td>

            <td width="33%" class="text-center">
                <div>Yang Menerima,</div>
                <div style="font-weight: bold; margin-bottom: 5px;"><?php echo $pengajuan->user->role ?? 'Pemohon'; ?></div>
                <div class="signature-space"></div>
                <div class="footer-name"><?php echo $pengajuan->user->name; ?></div>
            </td>
        </tr>
    </table>

    <div class="print-info">
        Dicetak pada: <?php echo date('d/m/Y H:i:s'); ?> | Bependa Provinsi Sumatera Selatan
    </div>

</body>
</html>