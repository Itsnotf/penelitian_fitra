import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pengajuan', href: '/pengajuans' },
    { title: 'Buat', href: '/pengajuans/create' },
];

export default function PengajuanCreatePage() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan" />
            <Form method="post" action="/pengajuans" disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi Kebutuhan</Label>
                            <Textarea id="deskripsi" name="deskripsi" className="min-h-40" required autoFocus
                                placeholder="Jelaskan kebutuhan barang secara singkat..." />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="urgensi">Urgensi</Label>
                            <Select name="urgensi" required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih urgensi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="normal">Normal</SelectItem>
                                    <SelectItem value="mendesak">Mendesak</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.urgensi} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? <><Spinner className="mr-2" /> Membuat...</> : 'Buat Pengajuan'}
                            </Button>
                            <Link href="/pengajuans">
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
