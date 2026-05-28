import ChangeStatusButton from '@/components/change-status-button';
import DeleteButton from '@/components/delete-button';
import DownloadPdfLink from '@/components/download-pdf-link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { BreadcrumbItem, Pembelian } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, Eye, PlusCircle, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    pembelians: { data: Pembelian[]; links: any[] };
    filters: { search?: string };
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pembelian', href: '/pembelians' }];

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        pending: 'bg-yellow-500 text-white',
        proses:  'bg-blue-500 text-white',
        selesai: 'bg-green-600 text-white',
    };
    const label: Record<string, string> = { pending: 'Pending', proses: 'Diproses', selesai: 'Selesai' };
    return <Badge className={map[status] ?? 'bg-gray-400 text-white'}>{label[status] ?? status}</Badge>;
};

export default function PembelianPage({ pembelians, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search || '');
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/pembelians', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembelian" />
            <div className="p-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input placeholder="Cari vendor atau deskripsi..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(['pembelians create']) && (
                        <Link href="/pembelians/create">
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Pembelian
                            </Button>
                        </Link>
                    )}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Dibuat Oleh</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Total Harga</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dokumen</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pembelians.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-[65vh] text-center">Belum ada data pembelian.</TableCell>
                            </TableRow>
                        ) : (
                            pembelians.data.map((pembelian) => (
                                <TableRow key={pembelian.id}>
                                    <TableCell>{pembelian.user.name}</TableCell>
                                    <TableCell>{pembelian.vendor?.nama_vendor ?? <span className="text-xs text-muted-foreground">Belum dipilih</span>}</TableCell>
                                    <TableCell className="max-w-xs truncate">{pembelian.deskripsi}</TableCell>
                                    <TableCell>Rp {Number(pembelian.total_harga).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{statusBadge(pembelian.status)}</TableCell>
                                    <TableCell>
                                        {pembelian.dokumen ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <a href={`/storage/${pembelian.dokumen}`} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="sm" className="hover:bg-green-200 hover:text-green-600"><Eye size={16} /></Button>
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent>Lihat Dokumen</TooltipContent>
                                            </Tooltip>
                                        ) : <span className="text-xs text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell className="space-x-1">
                                        {hasAnyPermission(['pembelians show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/pembelians/${pembelian.id}`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><WalletCards /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Rincian</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pembelians show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600">
                                                        <DownloadPdfLink id={pembelian.id} type="pembelians" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Download PDF</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pembelians edit']) && pembelian.status !== 'selesai' && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/pembelians/${pembelian.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ubah</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pembelians change status']) && pembelian.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features="pembelians" id={pembelian.id}
                                                        label="Tandai Sedang Diproses?"
                                                        description="Status pembelian akan berubah menjadi 'Diproses'." />
                                                </TooltipTrigger>
                                                <TooltipContent>Tandai Diproses</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pembelians change status']) && pembelian.status === 'proses' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features="pembelians" id={pembelian.id}
                                                        label="Tandai Selesai?"
                                                        description="Stok barang akan otomatis bertambah sesuai jumlah pembelian. Tindakan ini tidak dapat dibatalkan." />
                                                </TooltipTrigger>
                                                <TooltipContent>Tandai Selesai</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pembelians delete']) && pembelian.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={pembelian.id} featured="pembelians" />
                                                </TooltipTrigger>
                                                <TooltipContent>Hapus</TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {pembelians.links.map((link, i) => (
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
