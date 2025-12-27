<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Barang</title>
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

        /* Helper classes */
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .text-left { text-align: left; }

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
        <h2>Bapenda Provinsi Sumatera Selatan</h2>
        <p>Jl. POM IX, Lorok Pakjo, Kec. Ilir Barat I, Kota Palembang, Sumatera Selatan, 30137-Indonesia <br> Telp: (+62) 08117822364 | bapenda@sumselprov.go.id</p>
    </div>

    <div class="title">
        Laporan Data Barang
    </div>

    <table class="table-data">
        <thead>
            <tr>
                <th style="width: 5%;">NO.</th>
                <th style="width: 30%;">NAMA BARANG</th>
                <th style="width: 10%;">TIPE</th>
                <th style="width: 12%;">STOCK AWAL</th>
                <th style="width: 12%;">STOCK KELUAR</th>
                <th style="width: 12%;">STOCK MASUK</th>
                <th style="width: 12%;">STOCK TERSEDIA</th>
            </tr>
        </thead>
        <tbody>
            <?php if(count($barangs) > 0): ?>
                <?php foreach($barangs as $index => $barang): ?>
                    <tr>
                        <td class="text-center"><?php echo $index + 1; ?></td>
                        <td><?php echo $barang->nama_barang; ?></td>
                        <td class="text-center"><?php echo $barang->tipe; ?></td>
                        <td class="text-center"><?php echo $barang->stock_awal; ?></td>
                        <td class="text-center"><?php echo $barang->stock_keluar; ?></td>
                        <td class="text-center"><?php echo $barang->stock_masuk; ?></td>
                        <td class="text-center"><?php echo $barang->stock_tersedia; ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr>
                    <td colspan="7" class="text-center" style="padding: 20px;">Data tidak tersedia</td>
                </tr>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="print-info">
        Dicetak pada: <?php echo date('d/m/Y H:i:s'); ?> | Sistem Informasi FITRA
    </div>

</body>
</html>
