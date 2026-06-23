import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BarangVendor, BreadcrumbItem, Vendor } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Props {
    vendor: Vendor;
    barangVendor: BarangVendor;
}

export default function VendorBarangEditPage({ vendor, barangVendor }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Vendor', href: '/vendors' },
        { title: vendor.nama_vendor, href: `/vendors/${vendor.id}/barangs` },
        { title: 'Ubah Harga', href: `/vendors/${vendor.id}/barangs/${barangVendor.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Ubah Harga — ${vendor.nama_vendor}`} />
            <Form method="put" action={`/vendors/${vendor.id}/barangs/${barangVendor.id}`} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="rounded-md border bg-muted/30 p-3">
                            <p className="font-semibold">{vendor.nama_vendor}</p>
                            <p className="text-sm text-muted-foreground">{vendor.email ?? '—'} · {vendor.telepon ?? '—'}</p>
                        </div>

                        <div className="grid gap-2">
                            <Label>Barang</Label>
                            <div className="rounded-md border bg-muted/20 px-3 py-2 text-sm">
                                <span className="font-medium">{barangVendor.barang?.nama_barang}</span>
                                <span className="ml-2 text-muted-foreground">
                                    {barangVendor.barang?.satuan} · {barangVendor.barang?.tipe_barang?.nama_tipe ?? 'Tanpa tipe'}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="harga">Harga Satuan (Rp) <span className="text-red-500">*</span></Label>
                            <Input id="harga" name="harga" type="number" min="0" required defaultValue={barangVendor.harga} />
                            <InputError message={errors.harga} />
                            {barangVendor.terakhir_update_harga && (
                                <p className="text-xs text-muted-foreground">
                                    Terakhir diperbarui:{' '}
                                    {new Date(barangVendor.terakhir_update_harga).toLocaleDateString('id-ID', {
                                        day: '2-digit', month: 'short', year: 'numeric',
                                    })}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Perbarui Harga'}
                            </Button>
                            <Link href={`/vendors/${vendor.id}/barangs`}>
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
