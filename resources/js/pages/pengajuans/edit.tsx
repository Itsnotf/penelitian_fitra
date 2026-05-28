import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Pengajuan } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Props {
    pengajuan: Pengajuan;
}

const statusLabel: Record<string, string> = {
    pending: 'Pending', proses: 'Diproses', selesai: 'Selesai', rejected: 'Ditolak',
};

export default function PengajuanEditPage({ pengajuan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Pengajuan', href: '/pengajuans' },
        { title: 'Ubah', href: `/pengajuans/${pengajuan.id}/edit` },
    ];

    const isLocked = pengajuan.status !== 'pending';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Pengajuan" />
            <Form method="put" action={`/pengajuans/${pengajuan.id}`} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi Kebutuhan</Label>
                            <Textarea id="deskripsi" name="deskripsi" className="min-h-40" required autoFocus
                                defaultValue={pengajuan.deskripsi} disabled={isLocked} />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="urgensi">Urgensi</Label>
                            <Select name="urgensi" defaultValue={pengajuan.urgensi} required disabled={isLocked}>
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

                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <div className="rounded-md border bg-muted/30 p-3 text-sm font-medium">
                                {statusLabel[pengajuan.status] ?? pengajuan.status}
                            </div>
                            {isLocked && <p className="text-sm text-muted-foreground">Pengajuan sudah diproses dan tidak dapat diubah.</p>}
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLocked || processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Perbarui Pengajuan'}
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
