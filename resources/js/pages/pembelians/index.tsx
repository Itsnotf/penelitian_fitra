import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import ChangeStatusButton from '@/components/change-status-button';
import { Edit2Icon, Glasses, PlusCircle, WalletCards } from 'lucide-react';
import { BreadcrumbItem, Pembelian, SharedData } from '@/types';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import hasAnyPermission from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface Props {
    pembelians: {
        data: Pembelian[];
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
        title: 'Pembelian',
        href: '/pembelians',
    },
];

export default function PembelianPage({ pembelians, filters, flash }: Props) {
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
        router.get('/pembelians', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembelian" />

            <div className="p-4 space-y-4">

                {/* Search Bar */}
                <div className='flex space-x-1'>
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input
                            placeholder="Cari berdasarkan Vendor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant='outline' type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(["pembelians create"]) && (
                        <Link href="/pembelians/create">
                            <Button variant='default' className='group flex items-center'>
                                <PlusCircle className='group-hover:rotate-90 transition-all' />
                                Tambah Pembelian
                            </Button>
                        </Link>
                    )}
                </div>

                {/* User Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pembelian Oleh</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Total Harga</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pembelians.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="h-[65vh]  text-center">
                                    Belum Ada Data Pembelian.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pembelians.data.map((pembelian) => (
                                <TableRow key={pembelian.id}>
                                    <TableCell>{pembelian.user.name}</TableCell>
                                    <TableCell>{pembelian.vendor}</TableCell>
                                    <TableCell>{pembelian.deskripsi}</TableCell>
                                    <TableCell>{pembelian.total_harga}</TableCell>
                                    <TableCell>
                                        <Badge>{pembelian.status}</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        {hasAnyPermission(["pembelians show"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/pembelians/${pembelian.id}`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <WalletCards/></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Detail
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(["pembelians edit"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/pembelians/${pembelian.id}/edit`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Ubah
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["pembelians change status"]) && pembelian.status === 'pending' && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <ChangeStatusButton features='pembelians' id={pembelian.id} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Tandai Selesai
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["pembelians delete"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={pembelian.id} featured='pembelians' />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Delete
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {pembelians.links.map((link, i) => (
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
