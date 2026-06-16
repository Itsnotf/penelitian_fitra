import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Barang } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BarangPermintaan {
    id: number;
    pengajuan_id: number;
    barang_id: number;
    jumlah: number;
}

interface Props {
    barang_permintaan: BarangPermintaan;
    barangs: Barang[];
    permintaan_id: number;
}

export default function BarangPermintaanEditPage({ barang_permintaan, barangs, permintaan_id }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Permintaan', href: '/permintaan' },
        { title: permintaan_id.toString(), href: `/permintaan/${permintaan_id}` },
        { title: 'Ubah', href: `/permintaan/${permintaan_id}/barangs/${barang_permintaan.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Barang Permintaan" />
            <Form
                method="put"
                action={`/permintaan/${permintaan_id}/barangs/${barang_permintaan.id}`}
                disableWhileProcessing
                className="flex flex-col gap-6 p-4"
            >
                {({ processing, errors }) => (
                    <div className="grid gap-6">
                        <Input type="hidden" name="pengajuan_id" value={permintaan_id} />

                        <div className="grid gap-2">
                            <Label htmlFor="barang_id">Barang</Label>
                            <Select name="barang_id" required defaultValue={barang_permintaan.barang_id.toString()}>
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
                            <Input id="jumlah" type="number" required tabIndex={1}
                                autoComplete="jumlah" name="jumlah"
                                defaultValue={barang_permintaan.jumlah} placeholder="(e.g., 10)" min="1" />
                            <InputError message={errors.jumlah} className="mt-2" />
                        </div>

                        <div className="space-x-2">
                            <Button type="submit" className="mt-2 w-fit">
                                {processing ? <><Spinner className="mr-2" />Updating...</> : 'Perbarui Barang Permintaan'}
                            </Button>
                            <Link href={`/permintaan/${permintaan_id}`}>
                                <Button variant="outline" type="button" className="mt-2 w-fit">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
