import DeleteButton from '@/components/delete-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { BreadcrumbItem, Vendor } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Edit2Icon, PlusCircle, Store } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    vendors: { data: Vendor[]; links: any[] };
    filters: { search?: string };
    flash?: { success?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Vendor', href: '/vendors' }];

export default function VendorPage({ vendors, filters, flash }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [shownMessages] = useState(new Set<string>());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
    }, [flash?.success]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/vendors', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Vendor" />
            <div className="p-4 space-y-4">
                <div className="flex gap-2 flex-wrap">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input placeholder="Cari nama vendor..." value={search} onChange={(e) => setSearch(e.target.value)} />
                        <Button variant="outline" type="submit">Cari</Button>
                    </form>
                    {hasAnyPermission(['vendors create']) && (
                        <Link href="/vendors/create">
                            <Button variant="default" className="group flex items-center gap-1">
                                <PlusCircle className="group-hover:rotate-90 transition-all" />
                                Tambah Vendor
                            </Button>
                        </Link>
                    )}
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama Vendor</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Telepon</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>Jml. Barang</TableHead>
                            <TableHead>Tindakan</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[65vh] text-center">Belum ada data vendor.</TableCell>
                            </TableRow>
                        ) : (
                            vendors.data.map((vendor) => (
                                <TableRow key={vendor.id}>
                                    <TableCell className="font-medium">{vendor.nama_vendor}</TableCell>
                                    <TableCell>{vendor.email ?? <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                                    <TableCell>{vendor.telepon ?? <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                                    <TableCell className="max-w-xs truncate">{vendor.alamat ?? <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{vendor.barang_vendors_count ?? 0} barang</Badge>
                                    </TableCell>
                                    <TableCell className="space-x-1">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Link href={`/vendors/${vendor.id}/barangs`}>
                                                    <Button variant="outline" size="sm" className="hover:bg-purple-200 hover:text-purple-600"><Store size={14} /></Button>
                                                </Link>
                                            </TooltipTrigger>
                                            <TooltipContent>Kelola Barang</TooltipContent>
                                        </Tooltip>
                                        {hasAnyPermission(['vendors edit']) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link href={`/vendors/${vendor.id}/edit`}>
                                                        <Button variant="outline" size="sm" className="hover:bg-blue-200 hover:text-blue-600"><Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ubah</TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(['vendors delete']) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={vendor.id} featured="vendors" />
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
                    {vendors.links.map((link, i) => (
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
