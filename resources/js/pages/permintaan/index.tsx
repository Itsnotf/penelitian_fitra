import DeleteButton from '@/components/delete-button';
import DownloadPdfLink from '@/components/download-pdf-link';
import RejectPermintaanButton from '@/components/reject-permintaan-button';
import ViewRejectReasonButton from '@/components/view-reject-reason-button';
import ChangeStatusButton from '@/components/change-status-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { BreadcrumbItem, Permintaan } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, PlusCircle, WalletCards } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    permintaans: { data: Permintaan[]; links: any[] };
    filters: { search?: string };
    flash?: { success?: string; error?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Permintaan', href: '/permintaan' }];

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

export default function PermintaanPage({ permintaans, filters, flash }: Props) {
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
        router.get('/permintaan', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Permintaan" />
            <div className="p-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input placeholder="Cari berdasarkan deskripsi..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(['permintaan create']) && (
                        <Link href="/permintaan/create">
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Permintaan
                            </Button>
                        </Link>
                    )}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Permintaan Oleh</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Urgensi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {permintaans.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[65vh] text-center">Belum ada data permintaan.</TableCell>
                            </TableRow>
                        ) : (
                            permintaans.data.map((permintaan) => (
                                <TableRow key={permintaan.id}>
                                    <TableCell>{permintaan.user.name}</TableCell>
                                    <TableCell className="max-w-sm truncate">{permintaan.deskripsi}</TableCell>
                                    <TableCell>{urgensiBadge(permintaan.urgensi)}</TableCell>
                                    <TableCell>{statusBadge(permintaan.status)}</TableCell>
                                    <TableCell>{new Date(permintaan.created_at).toLocaleDateString('id-ID')}</TableCell>
                                    <TableCell className="space-x-1">
                                        {hasAnyPermission(['permintaan show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/permintaan/${permintaan.id}`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><WalletCards /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Rincian</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['permintaan show']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600">
                                                        <DownloadPdfLink id={permintaan.id} type="permintaan" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Download PDF</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['permintaan edit']) && permintaan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/permintaan/${permintaan.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ubah</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['permintaan change status']) && permintaan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features="permintaan" id={permintaan.id}
                                                        label="Setujui & Proses?"
                                                        description={permintaan.urgensi === 'mendesak'
                                                            ? 'Permintaan mendesak akan langsung dicek stoknya. Jika kurang, pengadaan akan dibuat otomatis.'
                                                            : 'Jumlah permintaan akan ditambahkan ke kolom permintaan barang.'} />
                                                </TooltipTrigger>
                                                <TooltipContent>Setujui & Proses</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['permintaan change status']) && permintaan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <RejectPermintaanButton id={permintaan.id} />
                                                </TooltipTrigger>
                                                <TooltipContent>Tolak</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {permintaan.status === 'rejected' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ViewRejectReasonButton alasanReject={permintaan.alasan_reject} />
                                                </TooltipTrigger>
                                                <TooltipContent>Alasan Penolakan</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['permintaan delete']) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={permintaan.id} featured="permintaan" />
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
                    {permintaans.links.map((link, i) => (
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
