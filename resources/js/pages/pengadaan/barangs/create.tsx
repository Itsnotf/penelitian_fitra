import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Barang, BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Props {
    barangs: Barang[];
    pengadaan_id: number;
}

export default function BarangPengadaanCreatePage({ barangs, pengadaan_id }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pengadaan', href: '/pengadaan' },
        { title: pengadaan_id.toString(), href: `/pengadaan/${pengadaan_id}` },
        { title: 'Buat', href: `/pengadaan/${pengadaan_id}/barangs/create` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Barang Pengadaan" />
            <Form
                method="post"
                action={`/pengadaan/${pengadaan_id}/barangs`}
                disableWhileProcessing
                className="flex flex-col gap-6 p-4"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <Input type="hidden" name="pembelian_id" value={pengadaan_id} />

                        <div className="grid gap-2">
                            <Label htmlFor="barang_id">Barang</Label>
                            <Select name="barang_id" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih barang" />
                                </SelectTrigger>
                                <SelectContent>
                                    {barangs.map((barang) => (
                                        <SelectItem key={barang.id} value={barang.id.toString()}>
                                            {barang.nama_barang}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.barang_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="jumlah">Jumlah</Label>
                            <Input id="jumlah" type="number" required autoFocus tabIndex={1}
                                autoComplete="jumlah" name="jumlah" placeholder="(e.g., 10)" min="1" />
                            <InputError message={errors.jumlah} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="harga">Harga Satuan</Label>
                            <Input id="harga" type="number" required tabIndex={2}
                                autoComplete="harga" name="harga" placeholder="(e.g., 5000)" min="0" />
                            <InputError message={errors.harga} className="mt-2" />
                        </div>

                        <div className="space-x-2">
                            <Button type="submit" className="mt-2 w-fit">
                                {processing ? <><Spinner className="mr-2" />Creating...</> : 'Buat Barang Pengadaan'}
                            </Button>
                            <Link href={`/pengadaan/${pengadaan_id}`}>
                                <Button variant="outline" type="button" className="mt-2 w-fit">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
