import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import { AlertTriangle, CheckCircle2, Download, Edit2Icon, PlusCircle, ShoppingCart } from 'lucide-react';
import { Barang, BreadcrumbItem, JenisBarang, TipeBarang } from '@/types';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import hasAnyPermission from '@/lib/utils';

interface Filters {
    search?: string;
    tipe_barang_id?: string;
    jenis_barang?: JenisBarang;
    stok?: 'semua' | 'rendah' | 'habis';
}

interface Props {
    barangs: { data: Barang[]; links: any[] };
    filters: Filters;
    hasJumlahPermintaan: boolean;
    allStockSufficient: boolean;
    flash?: { success?: string; error?: string };
    can: { approveAllNormal: boolean; buatPengadaanSelisih: boolean };
    tipeBarangs: Pick<TipeBarang, 'id' | 'nama_tipe'>[];
}

const jenisLabel: Record<JenisBarang, string> = {
    habis_pakai: 'Habis Pakai',
    tidak_habis_pakai: 'Tidak Habis Pakai',
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Barang', href: '/barangs' }];

export default function BarangPage({ barangs, filters, flash, hasJumlahPermintaan, allStockSufficient, can, tipeBarangs }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [tipeBarangId, setTipeBarangId] = useState(filters.tipe_barang_id || '_semua');
    const [jenisBarang, setJenisBarang] = useState(filters.jenis_barang || '_semua');
    const [stok, setStok] = useState(filters.stok || 'semua');
    const [shownMessages] = useState(new Set<string>());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
        if (flash?.error && !shownMessages.has(flash.error)) {
            toast.error(flash.error);
            shownMessages.add(flash.error);
        }
    }, [flash?.success, flash?.error]);

    const applyFilters = (overrides: Partial<{ search: string; tipeBarangId: string; jenisBarang: string; stok: string }> = {}) => {
        const next = {
            search: overrides.search ?? search,
            tipe_barang_id: overrides.tipeBarangId ?? tipeBarangId,
            jenis_barang: overrides.jenisBarang ?? jenisBarang,
            stok: overrides.stok ?? stok,
        };

        router.get(
            '/barangs',
            {
                search: next.search || undefined,
                tipe_barang_id: next.tipe_barang_id !== '_semua' ? next.tipe_barang_id : undefined,
                jenis_barang: next.jenis_barang !== '_semua' ? next.jenis_barang : undefined,
                stok: next.stok !== 'semua' ? next.stok : undefined,
            },
            { preserveState: true },
        );
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilters();
    };

    const handleApproveAllNormal = () => {
        router.post('/permintaan/approve-all-normal', {}, { onSuccess: () => {}, onError: () => {} });
    };

    const handleBuatPengadaanSelisih = () => {
        router.post('/permintaan/buat-pengadaan-selisih', {}, { onSuccess: () => {}, onError: () => {} });
    };

    // Laporan PDF mengikuti filter yang SEDANG aktif (yang sudah diterapkan
    // lewat query string), bukan filter terpisah — satu sumber filter.
    const downloadParams = new URLSearchParams();
    if (filters.search) downloadParams.set('search', filters.search);
    if (filters.tipe_barang_id) downloadParams.set('tipe_barang_id', filters.tipe_barang_id);
    if (filters.jenis_barang) downloadParams.set('jenis_barang', filters.jenis_barang);
    if (filters.stok) downloadParams.set('stok', filters.stok);
    const downloadUrl = `/barangs/download-pdf${downloadParams.toString() ? '?' + downloadParams.toString() : ''}`;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventaris Barang" />

            <div className="p-4 space-y-4">
                <div className="flex flex-wrap items-end gap-2">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto md:flex-1 min-w-[220px]">
                        <Input placeholder="Cari nama barang..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>

                    <Select value={tipeBarangId} onValueChange={(v) => { setTipeBarangId(v); applyFilters({ tipeBarangId: v }); }}>
                        <SelectTrigger className="w-44"><SelectValue placeholder="Tipe barang" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_semua">Semua tipe</SelectItem>
                            {tipeBarangs.map((tipe) => (
                                <SelectItem key={tipe.id} value={tipe.id.toString()}>{tipe.nama_tipe}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={jenisBarang} onValueChange={(v) => { setJenisBarang(v); applyFilters({ jenisBarang: v }); }}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Jenis barang" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="_semua">Semua jenis</SelectItem>
                            <SelectItem value="habis_pakai">Habis Pakai</SelectItem>
                            <SelectItem value="tidak_habis_pakai">Tidak Habis Pakai</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={stok} onValueChange={(v) => { setStok(v as 'semua' | 'rendah' | 'habis'); applyFilters({ stok: v }); }}>
                        <SelectTrigger className="w-40"><SelectValue placeholder="Status stok" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="semua">Semua stok</SelectItem>
                            <SelectItem value="rendah">Stok Rendah (&lt; 10)</SelectItem>
                            <SelectItem value="habis">Stok Habis</SelectItem>
                        </SelectContent>
                    </Select>

                    <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">
                            <Download size={16} className="mr-2" />
                            Unduh Laporan
                        </Button>
                    </a>

                    {hasAnyPermission(['barangs create']) && (
                        <Link href="/barangs/create">
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Barang
                            </Button>
                        </Link>
                    )}

                    {can.approveAllNormal && hasJumlahPermintaan && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="default" className="bg-green-600 hover:bg-green-700 gap-1" disabled={!allStockSufficient}>
                                    <CheckCircle2 size={16} />
                                    Setujui Semua Normal
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Setujui Semua Permintaan Normal?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Semua permintaan normal yang sedang diproses akan disetujui. Stock akan dikurangi sesuai jumlah permintaan. Tindakan ini tidak dapat dibatalkan.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleApproveAllNormal}>
                                            Ya, Setujui Semua
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}

                    {can.buatPengadaanSelisih && hasJumlahPermintaan && !allStockSufficient && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="border-orange-400 text-orange-600 hover:bg-orange-50 gap-1">
                                    <ShoppingCart size={16} />
                                    Buat Pengadaan Selisih
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Buat Pengadaan untuk Selisih Stok?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Sistem akan membuat data pengadaan dengan jumlah sesuai selisih antara jumlah permintaan dan stok yang tersedia. Anda perlu memilih vendor setelahnya.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button className="bg-orange-600 hover:bg-orange-700" onClick={handleBuatPengadaanSelisih}>
                                            Ya, Buat Pengadaan
                                        </Button>
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {hasJumlahPermintaan && !allStockSufficient && (
                    <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 p-3 text-sm text-orange-700">
                        <AlertTriangle size={16} />
                        Ada barang dengan stok tidak mencukupi jumlah permintaan. Buat pengadaan selisih terlebih dahulu.
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Barang</TableHead>
                            <TableHead>Tipe</TableHead>
                            <TableHead>Jenis</TableHead>
                            <TableHead>Satuan</TableHead>
                            <TableHead>Stok Awal</TableHead>
                            <TableHead>Stok Masuk</TableHead>
                            <TableHead>Stok Keluar</TableHead>
                            <TableHead>Stok Tersedia</TableHead>
                            <TableHead>Jml. Permintaan</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {barangs.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={10} className="h-[65vh] text-center">Belum ada data barang.</TableCell>
                            </TableRow>
                        ) : (
                            barangs.data.map((barang) => {
                                const isDeficit = barang.jumlah_permintaan > 0 && barang.stock_tersedia < barang.jumlah_permintaan;
                                return (
                                    <TableRow key={barang.id} className={isDeficit ? 'bg-orange-50' : ''}>
                                        <TableCell>{barang.nama_barang}</TableCell>
                                        <TableCell>{barang.tipe_barang?.nama_tipe ?? '—'}</TableCell>
                                        <TableCell>
                                            {barang.jenis_barang ? (
                                                <Badge variant="outline">{jenisLabel[barang.jenis_barang]}</Badge>
                                            ) : '—'}
                                        </TableCell>
                                        <TableCell>{barang.satuan}</TableCell>
                                        <TableCell>{barang.stock_awal}</TableCell>
                                        <TableCell>{barang.stock_masuk}</TableCell>
                                        <TableCell>{barang.stock_keluar}</TableCell>
                                        <TableCell>{barang.stock_tersedia}</TableCell>
                                        <TableCell>
                                            {barang.jumlah_permintaan > 0 ? (
                                                <Badge className={isDeficit ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'}>
                                                    {barang.jumlah_permintaan} {barang.satuan}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            {hasAnyPermission(['barangs edit']) && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <Link href={`/barangs/${barang.id}/edit`}>
                                                            <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Ubah</TooltipContent>
                                                </Tooltip>
                                            )}
                                            {hasAnyPermission(['barangs delete']) && (
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <DeleteButton id={barang.id} featured="barangs" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>Hapus</TooltipContent>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {barangs.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'}
                            className={`px-3 py-1 flex justify-center items-center border rounded-md text-sm ${link.active ? 'bg-primary text-primary-foreground' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
