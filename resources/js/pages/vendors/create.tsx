import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Vendor', href: '/vendors' },
    { title: 'Tambah Vendor', href: '/vendors/create' },
];

export default function VendorCreatePage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Vendor" />
            <Form method="post" action="/vendors" disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="nama_vendor">Nama Vendor <span className="text-red-500">*</span></Label>
                            <Input id="nama_vendor" name="nama_vendor" type="text" required autoFocus placeholder="contoh: PT. Sumber Makmur" />
                            <InputError message={errors.nama_vendor} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="contoh: vendor@email.com" />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="telepon">Telepon</Label>
                            <Input id="telepon" name="telepon" type="text" placeholder="contoh: 08123456789" />
                            <InputError message={errors.telepon} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="alamat">Alamat</Label>
                            <Input id="alamat" name="alamat" type="text" placeholder="contoh: Jl. Raya No. 1, Jakarta" />
                            <InputError message={errors.alamat} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Tambah Vendor'}
                            </Button>
                            <Link href="/vendors">
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
