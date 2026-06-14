import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download } from 'lucide-react';
import { useState } from 'react';

interface Props {
    tipeOptions: string[];
}

export default function BarangDownloadFilter({ tipeOptions }: Props) {
    const [open, setOpen] = useState(false);
    const [selectedTipe, setSelectedTipe] = useState<string>('_semua');
    const [selectedStok, setSelectedStok] = useState<string>('semua');

    const handleDownload = () => {
        const params = new URLSearchParams();
        if (selectedTipe && selectedTipe !== '_semua') params.set('tipe', selectedTipe);
        if (selectedStok && selectedStok !== 'semua') params.set('stok', selectedStok);

        const url = `/barangs/download-pdf${params.toString() ? '?' + params.toString() : ''}`;
        window.open(url, '_blank');
        setOpen(false);
    };

    return (
        <>
            <Button variant="outline" onClick={() => setOpen(true)}>
                <Download size={16} className="mr-2" />
                Laporan Barang
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Unduh Laporan Barang</DialogTitle>
                        <p className="text-sm text-muted-foreground">
                            Pilih filter untuk laporan yang akan diunduh.
                        </p>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label>Tipe Barang</Label>
                            <Select value={selectedTipe} onValueChange={setSelectedTipe}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="_semua">Semua tipe</SelectItem>
                                    {tipeOptions.map((tipe) => (
                                        <SelectItem key={tipe} value={tipe}>{tipe}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Status Stok</Label>
                            <Select value={selectedStok} onValueChange={setSelectedStok}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="semua">Semua</SelectItem>
                                    <SelectItem value="rendah">Stok Rendah (&lt; 10)</SelectItem>
                                    <SelectItem value="habis">Stok Habis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
                        <Button onClick={handleDownload}>
                            <Download size={16} className="mr-2" />
                            Unduh PDF
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
