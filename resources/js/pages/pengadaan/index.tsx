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
import { BreadcrumbItem, Pengadaan } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, Eye, PlusCircle, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    pengadaan: { data: Pengadaan[]; links: any[] };
    filters: { search?: string };
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengadaan', href: '/pengadaan' }];

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        pending: 'bg-yellow-500 text-white',
        proses:  'bg-blue-500 text-white',
        selesai: 'bg-green-600 text-white',
    };
    const label: Record<string, string> = { pending: 'Pending', proses: 'Diproses', selesai: 'Selesai' };
    return <Badge className={map[status] ?? 'bg-gray-400 text-white'}>{label[status] ?? status}</Badge>;
};

export default function PengadaanPage({ pengadaan, filters, flash }: Props) {
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
        router.get('/pengadaan', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengadaan" />
            <div className="p-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input placeholder="Cari vendor atau deskripsi..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(['pengadaan create']) && (
                        <Link href="/pengadaan/create">
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Pengadaan
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
                        {pengadaan.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-[65vh] text-center">Belum ada data pengadaan.</TableCell>
                            </TableRow>
                        ) : (
                            pengadaan.data.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.user.name}</TableCell>
                                    <TableCell>{item.vendor?.nama_vendor ?? <span className="text-xs text-muted-foreground">Belum dipilih</span>}</TableCell>
                                    <TableCell className="max-w-xs truncate">{item.deskripsi}</TableCell>
                                    <TableCell>Rp {Number(item.total_harga).toLocaleString('id-ID')}</TableCell>
                                    <TableCell>{statusBadge(item.status)}</TableCell>
                                    <TableCell>
                                        {item.dokumen ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <a href={`/storage/${item.dokumen}`} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="outline" size="sm" className="hover:bg-green-200 hover:text-green-600"><Eye size={16} /></Button>
                                                    </a>
                                                </TooltipTrigger>
                                                <TooltipContent>Lihat Dokumen</TooltipContent>
                                            </Tooltip>
                                        ) : <span className="text-xs text-muted-foreground">—</span>}
                                    </TableCell>
                                    <TableCell className="space-x-1">
                                        {hasAnyPermission(['pengadaan show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/pengadaan/${item.id}`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><WalletCards /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Rincian</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengadaan show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600">
                                                        <DownloadPdfLink id={item.id} type="pengadaan" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Download PDF</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengadaan edit']) && item.status !== 'selesai' && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/pengadaan/${item.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ubah</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengadaan change status']) && item.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features="pengadaan" id={item.id}
                                                        label="Tandai Sedang Diproses?"
                                                        description="Status pengadaan akan berubah menjadi 'Diproses'." />
                                                </TooltipTrigger>
                                                <TooltipContent>Tandai Diproses</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengadaan change status']) && item.status === 'proses' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features="pengadaan" id={item.id}
                                                        label="Tandai Selesai?"
                                                        description="Stok barang akan otomatis bertambah sesuai jumlah pengadaan. Tindakan ini tidak dapat dibatalkan." />
                                                </TooltipTrigger>
                                                <TooltipContent>Tandai Selesai</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengadaan delete']) && item.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={item.id} featured="pengadaan" />
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
                    {pengadaan.links.map((link, i) => (
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
