import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, TipeBarang } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Props {
    tipeBarang: TipeBarang;
}

export default function TipeBarangEditPage({ tipeBarang }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Tipe Barang', href: '/tipe-barangs' },
        { title: 'Ubah Tipe Barang', href: `/tipe-barangs/${tipeBarang.id}/edit` },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Tipe Barang" />
            <Form method="put" action={`/tipe-barangs/${tipeBarang.id}`} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_tipe">Nama Tipe <span className="text-red-500">*</span></Label>
                            <Input id="nama_tipe" name="nama_tipe" type="text" required autoFocus defaultValue={tipeBarang.nama_tipe} />
                            <InputError message={errors.nama_tipe} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Simpan Perubahan'}
                            </Button>
                            <Link href="/tipe-barangs">
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
