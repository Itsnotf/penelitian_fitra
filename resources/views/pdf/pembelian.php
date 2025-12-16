<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Pembelian</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { border-bottom: 3px solid #1f2937; padding-bottom: 20px; margin-bottom: 30px; }
        .title { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1f2937; }
        .info-section { margin-bottom: 25px; padding: 15px; background-color: #f9fafb; border-left: 4px solid #3b82f6; }
        .info-row { display: flex; margin-bottom: 8px; font-size: 13px; }
        .info-label { width: 150px; font-weight: bold; color: #374151; }
        .info-value { flex: 1; color: #1f2937; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 12px; }
        table thead { background-color: #1f2937; color: white; }
        table th { padding: 12px; text-align: left; font-weight: bold; border: 1px solid #1f2937; }
        table td { padding: 10px 12px; border: 1px solid #e5e7eb; }
        table tbody tr:nth-child(even) { background-color: #f9fafb; }
        .text-right { text-align: right; }
        .summary { margin-bottom: 30px; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #3b82f6; text-align: right; }
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

    <div class="title">LAPORAN PEMBELIAN BARANG</div>

    <div class="info-section">
        <div class="info-row">
            <span class="info-label">No. Pembelian</span>
            <span class="info-value">: #<?php echo $pembelian->id; ?></span>
        </div>
        <div class="info-row">
            <span class="info-label">Vendor</span>
            <span class="info-value">: <?php echo $pembelian->vendor; ?></span>
        </div>
        <div class="info-row">
            <span class="info-label">Pembelian Oleh</span>
            <span class="info-value">: <?php echo $pembelian->user->name; ?></span>
        </div>
        <div class="info-row">
            <span class="info-label">Deskripsi</span>
            <span class="info-value">: <?php echo $pembelian->deskripsi ?? '-'; ?></span>
        </div>
        <div class="info-row">
            <span class="info-label">Status</span>
            <span class="info-value">: <strong><?php echo ucfirst($pembelian->status); ?></strong></span>
        </div>
        <div class="info-row">
            <span class="info-label">Tanggal Pembelian</span>
            <span class="info-value">: <?php echo $pembelian->created_at->format('d/m/Y H:i'); ?></span>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%">No.</th>
                <th style="width: 40%">Nama Barang</th>
                <th style="width: 15%">Satuan</th>
                <th style="width: 15%">Jumlah</th>
                <th style="width: 25%; text-align: right;">Harga Total</th>
            </tr>
        </thead>
        <tbody>
            <?php if(count($pembelian->barang_pembelians) > 0): ?>
                <?php foreach($pembelian->barang_pembelians as $index => $item): ?>
                    <tr>
                        <td><?php echo $index + 1; ?></td>
                        <td><?php echo $item->barang->nama_barang ?? 'N/A'; ?></td>
                        <td><?php echo $item->barang->tipe ?? '-'; ?></td>
                        <td class="text-right"><?php echo $item->jumlah; ?></td>
                        <td class="text-right">Rp <?php echo number_format($item->harga_total ?? 0, 0, ',', '.'); ?></td>
                    </tr>
                <?php endforeach; ?>
            <?php else: ?>
                <tr><td colspan="5" style="text-align: center; padding: 20px;">Tidak ada barang</td></tr>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="summary">
        <div style="display: flex; justify-content: flex-end;">
            <div style="width: 150px; font-weight: bold; color: #374151;">Total Harga Pembelian</div>
            <div style="width: 150px; text-align: right; color: #1f2937;">Rp <?php echo number_format($pembelian->total_harga ?? 0, 0, ',', '.'); ?></div>
        </div>
    </div>

    <div class="footer">
        <div class="footer-section">
            <div>Dibuat Oleh</div>
            <div class="signature-space"></div>
            <div class="footer-name"><?php echo $pembelian->user->name; ?></div>
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
