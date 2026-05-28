import DeleteButton from '@/components/delete-button';
import DownloadPdfLink from '@/components/download-pdf-link';
import RejectPengajuanButton from '@/components/reject-pengajuan-button';
import ViewRejectReasonButton from '@/components/view-reject-reason-button';
import ChangeStatusButton from '@/components/change-status-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { BreadcrumbItem, Pengajuan } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, PlusCircle, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    pengajuans: { data: Pengajuan[]; links: any[] };
    filters: { search?: string };
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Pengajuan', href: '/pengajuans' }];

const statusBadge = (status: string) => {
    const map: Record<string, string> = {
        pending: 'bg-yellow-500 text-white', proses: 'bg-blue-500 text-white',
        selesai: 'bg-green-600 text-white', rejected: 'bg-red-600 text-white',
    };
    const label: Record<string, string> = {
        pending: 'Pending', proses: 'Diproses', selesai: 'Selesai', rejected: 'Ditolak',
    };
    return <Badge className={map[status] ?? 'bg-gray-400 text-white'}>{label[status] ?? status}</Badge>;
};

const urgensiBadge = (urgensi: string) => urgensi === 'mendesak'
    ? <Badge className="bg-red-600 text-white">Mendesak</Badge>
    : <Badge className="bg-slate-500 text-white">Normal</Badge>;

export default function PengajuanPage({ pengajuans, filters, flash }: Props) {
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
        router.get('/pengajuans', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan" />
            <div className="p-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input placeholder="Cari berdasarkan deskripsi..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(['pengajuans create']) && (
                        <Link href="/pengajuans/create">
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Pengajuan
                            </Button>
                        </Link>
                    )}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pengajuan Oleh</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Urgensi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pengajuans.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[65vh] text-center">Belum ada data pengajuan.</TableCell>
                            </TableRow>
                        ) : (
                            pengajuans.data.map((pengajuan) => (
                                <TableRow key={pengajuan.id}>
                                    <TableCell>{pengajuan.user.name}</TableCell>
                                    <TableCell className="max-w-sm truncate">{pengajuan.deskripsi}</TableCell>
                                    <TableCell>{urgensiBadge(pengajuan.urgensi)}</TableCell>
                                    <TableCell>{statusBadge(pengajuan.status)}</TableCell>
                                    <TableCell>{new Date(pengajuan.created_at).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell className="space-x-1">
                                        {hasAnyPermission(['pengajuans show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/pengajuans/${pengajuan.id}`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><WalletCards /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Rincian</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengajuans show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600">
                                                        <DownloadPdfLink id={pengajuan.id} type="pengajuans" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Download PDF</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengajuans edit']) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/pengajuans/${pengajuan.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ubah</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengajuans change status']) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features="pengajuans" id={pengajuan.id}
                                                        label="Setujui & Proses?"
                                                        description={pengajuan.urgensi === 'mendesak'
                                                            ? 'Pengajuan mendesak akan langsung dicek stoknya. Jika kurang, pembelian akan dibuat otomatis.'
                                                            : 'Jumlah permintaan akan ditambahkan ke kolom permintaan barang.'} />
                                                </TooltipTrigger>
                                                <TooltipContent>Setujui & Proses</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengajuans change status']) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <RejectPengajuanButton id={pengajuan.id} />
                                                </TooltipTrigger>
                                                <TooltipContent>Tolak</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {pengajuan.status === 'rejected' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ViewRejectReasonButton alasanReject={pengajuan.alasan_reject} />
                                                </TooltipTrigger>
                                                <TooltipContent>Alasan Penolakan</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['pengajuans delete']) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={pengajuan.id} featured="pengajuans" />
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
                    {pengajuans.links.map((link, i) => (
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
