<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Pengajuan</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { border-bottom: 3px solid #1f2937; padding-bottom: 20px; margin-bottom: 30px; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1f2937; }
        .info-section { margin-bottom: 25px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #10b981; }
        .info-row { display: flex; margin-bottom: 8px; font-size: 13px; }
        .info-label { width: 150px; font-weight: bold; color: #374151; }
        .info-value { flex: 1; color: #1f2937; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
        table thead { background-color: #1f2937; color: white; }
        table th { padding: 12px; text-align: left; font-weight: bold; border: 1px solid #1f2937; }
        table td { padding: 10px 12px; border: 1px solid #e5e7eb; }
        table tbody tr:nth-child(even) { background-color: #f9fafb; }
        .text-right { text-align: right; }
        .summary { margin-bottom: 30px; padding: 15px; background-color: #f0fdf4; border-left: 4px solid #10b981; text-align: right; }
        .footer { margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px; display: flex; justify-content: space-between; }
        .footer-section { width: 30%; text-align: center; font-size: 11px; }
        .signature-space { height: 60px; margin-bottom: 5px; }
        .footer-name { font-weight: bold; margin-top: 5px; }
        .print-info { text-align: center; font-size: 10px; color: #9ca3af; margin-top: 20px; padding-top: 10px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin: 0;">Lembaga Penelitian FITRA</h2>
        <p style="margin: 5px 0; font-size: 12px; color: #6b7280;">Jl. Contoh No. 123, Jakarta | (021) 1234-5678</p>
    </div>

    <div class="title">LAPORAN PENGAJUAN BARANG</div>

    <div class="info-section">
        <div class="info-row">
            <span class="info-label">No. Pengajuan</span>
            <span class="info-value">: #<?php echo $pengajuan->id; ?></span>
        </div>
        <div class="info-row">
            <span class="info-label">Pengajuan Oleh</span>
            <span class="info-value">: <?php echo $pengajuan->user->name; ?></span>
        </div>
        <div class="info-row">
            <span class="info-label">Deskripsi</span>
            <span class="info-value">: <?php echo $pengajuan->deskripsi ?? '-'; ?></span>
        </div>
        <div class="info-row">
            <span class="info-label">Status</span>
            <span class="info-value">: <strong><?php echo ucfirst($pengajuan->status); ?></strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Tanggal Pengajuan</span>
            <span class="info-value">: <?php echo $pengajuan->created_at->format('d/m/Y H:i'); ?></span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%">No.</th>
                <th style="width: 40%">Nama Barang</th>
                <th style="width: 15%">Satuan</th>
                <th style="width: 25%">Jumlah Diminta</th>
                <th style="width: 15%">Stok Tersedia</th>
            </tr>
        </thead>
        <tbody>
            <?php if(count($pengajuan->barang_pengajuans) > 0): ?>
                <?php foreach($pengajuan->barang_pengajuans as $index => $item): ?>
                    <tr>
                        <td><?php echo $index + 1; ?></td>
                        <td><?php echo $item->barang->nama_barang ?? 'N/A'; ?></td>
                        <td><?php echo $item->barang->tipe ?? '-'; ?></td>
                        <td class="text-right"><?php echo $item->jumlah; ?></td>
                        <td class="text-right"><?php echo $item->barang->stock_tersedia ?? 0; ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr><td colspan="5" style="text-align: center; padding: 20px;">Tidak ada barang</td></tr>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="summary">
        <div style="display: flex; justify-content: flex-end;">
            <div style="width: 150px; font-weight: bold; color: #374151;">Total Barang Diminta</div>
            <div style="width: 150px; text-align: right; color: #1f2937;">
                <?php 
                    $total = 0;
                    foreach($pengajuan->barang_pengajuans as $item) {
                        $total += $item->jumlah;
                    }
                    echo $total . ' item';
                ?>
            </div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-section">
            <div>Dibuat Oleh</div>
            <div class="signature-space"></div>
            <div class="footer-name"><?php echo $pengajuan->user->name; ?></div>
        </div>
        <div class="footer-section">
            <div>Diverifikasi Oleh</div>
            <div class="signature-space"></div>
            <div class="footer-name">Kepala Bagian</div>
        </div>
        <div class="footer-section">
            <div>Disahkan Oleh</div>
            <div class="signature-space"></div>
            <div class="footer-name">Direktur</div>
        </div>
    </div>

    <div class="print-info">
        Dokumen ini dicetak pada <?php echo date('d/m/Y H:i:s'); ?> oleh sistem informasi FITRA
    </div>
</body>
</html>
