<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Pembelian Barang</title>
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

    <div class="header">
        <h2>Bapenda Sumatera Selatan</h2>
        <p>Jl. POM IX, Lorok Pakjo, Kec. Ilir Barat I, Kota Palembang, Sumatera Selatan, 30137-Indonesia <br> Telp: (+62) 08117822364 | bapenda@sumselprov.go.id</p>
    </div>

    <div class="title">
        Laporan Pembelian Barang
    </div>

    <table class="table-layout" style="margin-bottom: 20px;">
        <tr>
            <td class="label-column">No Pembelian</td>
            <td class="separator-column">:</td>
            <td><?php echo $pembelian->id; ?></td>
        </tr>
        <tr>
            <td class="label-column">Tanggal Pembelian</td>
            <td class="separator-column">:</td>
            <td><?php echo $pembelian->created_at->format('d/m/Y'); ?></td>
        </tr>
        <tr>
            <td class="label-column">Vendor</td>
            <td class="separator-column">:</td>
            <td><?php echo $pembelian->vendor; ?></td>
        </tr>
        <tr>
            <td class="label-column">Pembelian Oleh</td>
            <td class="separator-column">:</td>
            <td><?php echo $pembelian->user->name; ?></td>
        </tr>
        <tr>
            <td class="label-column">Deskripsi</td>
            <td class="separator-column">:</td>
            <td><?php echo $pembelian->deskripsi ?? '-'; ?></td>
        </tr>
        <tr>
            <td class="label-column">Status</td>
            <td class="separator-column">:</td>
            <td><strong><?php echo ucfirst($pembelian->status); ?></strong></td>
        </tr>
    </table>

    <table class="table-data">
        <thead>
            <tr>
                <th style="width: 5%;">NO.</th>
                <th style="width: 35%;">NAMA BARANG</th>
                <th style="width: 10%;">SATUAN</th>
                <th style="width: 15%;">JUMLAH</th>
                <th style="width: 25%;">HARGA TOTAL</th>
            </tr>
        </thead>
        <tbody>
            <?php if(count($pembelian->barang_pembelians) > 0): ?>
                <?php foreach($pembelian->barang_pembelians as $index => $item): ?>
                    <tr>
                        <td class="text-center"><?php echo $index + 1; ?></td>
                        <td><?php echo $item->barang->nama_barang ?? 'N/A'; ?></td>
                        <td class="text-center"><?php echo $item->barang->tipe ?? 'Unit'; ?></td>
                        <td class="text-center"><?php echo $item->jumlah; ?></td>
                        <td class="text-right">Rp <?php echo number_format($item->harga ?? 0, 0, ',', '.'); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="5" class="text-center" style="padding: 20px;">Data tidak tersedia</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <table class="table-layout" style="margin-bottom: 20px;">
        <tr>
            <td class="label-column">Total Harga</td>
            <td class="text-right"><strong>Rp <?php echo number_format($pembelian->total_harga ?? 0, 0, ',', '.'); ?></strong></td>
        </tr>
    </table>

    <table class="table-layout" style="margin-top: 40px;">
        <tr>
            <td width="50%" class="text-center">
                <div>Mengetahui,</div>
                <div style="font-weight: bold; margin-bottom: 5px;">Kepala Bagian</div>
                <div class="signature-space"></div>
                <div class="footer-name">EKKI APRIANDI, S.STP.</div>
                <div>Penata Tingkat I / III.d</div>
                <div>NIP.199104012010101001</div>
            </td>

            <td width="50%" class="text-center">
                <div>Yang Mengajukan,</div>
                <div style="font-weight: bold; margin-bottom: 5px;"><?php echo $pembelian->user->role ?? 'Pembelian'; ?></div>
                <div class="signature-space"></div>
                <div class="footer-name"><?php echo $pembelian->user->name; ?></div>
                <div style="padding-top: 20px;">(........................................)</div>
            </td>
        </tr>
    </table>

    <div class="print-info">
        Dicetak pada: <?php echo date('d/m/Y H:i:s'); ?> | Sistem Informasi FITRA
    </div>

</body>
</html>
