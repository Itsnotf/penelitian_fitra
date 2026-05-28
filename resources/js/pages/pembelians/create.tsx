import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Vendor } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';
import pembelians, { store } from '@/routes/pembelians';

interface Props {
    vendors: Vendor[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pembelian', href: pembelians.index().url },
    { title: 'Buat', href: pembelians.create().url },
];

export default function PembelianCreatePage({ vendors }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pembelian" />
            <Form {...store.form()} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="vendor_id">Vendor</Label>
                            <Select name="vendor_id">
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih vendor (opsional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendors.length === 0 ? (
                                        <SelectItem value="0" disabled>Belum ada vendor terdaftar</SelectItem>
                                    ) : (
                                        vendors.map((v) => (
                                            <SelectItem key={v.id} value={v.id.toString()}>{v.nama_vendor}</SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">Opsional — dapat diisi setelah pembelian dibuat.</p>
                            <InputError message={errors.vendor_id} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi</Label>
                            <Textarea id="deskripsi" name="deskripsi" className="min-h-32" required autoFocus
                                placeholder="Jelaskan keperluan pembelian ini..." />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dokumen">Dokumen Bukti Pembelian</Label>
                            <Input id="dokumen" name="dokumen" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif" />
                            <p className="text-xs text-muted-foreground">Format: PDF, DOC, DOCX, JPG, PNG, GIF (Maks: 5MB)</p>
                            <InputError message={errors.dokumen} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? <><Spinner className="mr-2" /> Membuat...</> : 'Buat Pembelian'}
                            </Button>
                            <Link href="/pembelians">
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
