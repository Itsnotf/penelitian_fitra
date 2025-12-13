import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import ChangeStatusButton from '@/components/change-status-button';
import RejectPengajuanButton from '@/components/reject-pengajuan-button';
import { Edit2Icon, PlusCircle, WalletCards } from 'lucide-react';
import { BreadcrumbItem, SharedData } from '@/types';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import hasAnyPermission from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Pengajuan {
    id: number;
    user: { name: string };
    deskripsi: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

interface Props {
    pengajuans: {
        data: Pengajuan[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/pengajuans',
    },
];

export default function PengajuanPage({ pengajuans, filters, flash }: Props) {
    const user = usePage<SharedData>().props.auth.user;

    const [search, setSearch] = useState(filters.search || '');
    const [shownMessages] = useState(new Set());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
    }, [flash?.success]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/pengajuans', { search }, { preserveState: true });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <Badge className="bg-green-600">Approved</Badge>;
            case 'rejected':
                return <Badge className="bg-red-600">Rejected</Badge>;
            default:
                return <Badge className="bg-yellow-600">Pending</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengajuan" />

            <div className="p-4 space-y-4">

                {/* Search Bar */}
                <div className='flex space-x-1'>
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input
                            placeholder="Cari berdasarkan Deskripsi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant='outline' type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(["pengajuans create"]) && (
                        <Link href="/pengajuans/create">
                            <Button variant='default' className='group flex items-center'>
                                <PlusCircle className='group-hover:rotate-90 transition-all' />
                                Tambah Pengajuan
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Pengajuan Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pengajuan Oleh</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pengajuans.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-[65vh]  text-center">
                                    Belum Ada Data Pengajuan.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pengajuans.data.map((pengajuan) => (
                                <TableRow key={pengajuan.id}>
                                    <TableCell>{pengajuan.user.name}</TableCell>
                                    <TableCell className="max-w-sm truncate">{pengajuan.deskripsi}</TableCell>
                                    <TableCell>
                                        {getStatusBadge(pengajuan.status)}
                                    </TableCell>
                                    <TableCell>{new Date(pengajuan.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="space-x-2">
                                        {hasAnyPermission(["pengajuans show"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/pengajuans/${pengajuan.id}`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <WalletCards/></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Rincian
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(["pengajuans edit"]) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/pengajuans/${pengajuan.id}/edit`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Ubah
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["pengajuans change status"]) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features='pengajuans' id={pengajuan.id} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Approve
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["pengajuans change status"]) && pengajuan.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <RejectPengajuanButton id={pengajuan.id} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Tolak
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["pengajuans delete"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={pengajuan.id} featured='pengajuans' />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Hapus
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {pengajuans.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1 flex justify-center items-center border rounded-md ${link.active ? 'bg-primary text-primary-foreground text-sm' : 'text-sm'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}
