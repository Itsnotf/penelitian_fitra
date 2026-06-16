import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Pengadaan, Vendor } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Props {
    pengadaan: Pengadaan;
    vendors: Vendor[];
}

const statusLabel: Record<string, string> = {
    pending: 'Pending',
    proses:  'Diproses',
    selesai: 'Selesai',
};

export default function PengadaanEditPage({ pengadaan, vendors }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pengadaan', href: '/pengadaan' },
        { title: 'Ubah', href: `/pengadaan/${pengadaan.id}/edit` },
    ];

    const isSelesai = pengadaan.status === 'selesai';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Pengadaan" />
            <Form method="put" action={`/pengadaan/${pengadaan.id}`} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="vendor_id">Vendor</Label>
                            <Select name="vendor_id" defaultValue={pengadaan.vendor_id?.toString() ?? ''} disabled={isSelesai}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih vendor" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendors.map((v) => (
                                        <SelectItem key={v.id} value={v.id.toString()}>{v.nama_vendor}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                                Mengubah vendor akan memperbarui harga semua barang dalam pengadaan ini secara otomatis.
                            </p>
                            <InputError message={errors.vendor_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea id="deskripsi" name="deskripsi" className="min-h-32" required
                                defaultValue={pengadaan.deskripsi} disabled={isSelesai} />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dokumen">Dokumen Bukti Pengadaan</Label>
                            <Input id="dokumen" name="dokumen" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" disabled={isSelesai} />
                            <p className="text-xs text-muted-foreground">Format: PDF, DOC, DOCX, JPG, PNG, GIF (Maks: 5MB)</p>
                            {pengadaan.dokumen && (
                                <p className="text-xs text-blue-600">File saat ini: {pengadaan.dokumen.split('/').pop()}</p>
                            )}
                            <InputError message={errors.dokumen} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <div className="rounded-md border bg-muted/30 p-3 text-sm font-medium">
                                {statusLabel[pengadaan.status] ?? pengadaan.status}
                            </div>
                            {isSelesai && <p className="text-sm text-muted-foreground">Pengadaan sudah selesai dan tidak dapat diubah.</p>}
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isSelesai || processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Perbarui Pengadaan'}
                            </Button>
                            <Link href="/pengadaan">
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
