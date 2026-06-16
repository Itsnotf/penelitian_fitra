import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Permintaan } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

interface Props {
    permintaan: Permintaan;
}

const statusLabel: Record<string, string> = {
    pending: 'Pending', proses: 'Diproses', selesai: 'Selesai', rejected: 'Ditolak',
};

export default function PermintaanEditPage({ permintaan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Permintaan', href: '/permintaan' },
        { title: 'Ubah', href: `/permintaan/${permintaan.id}/edit` },
    ];

    const isLocked = permintaan.status !== 'pending';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ubah Permintaan" />
            <Form method="put" action={`/permintaan/${permintaan.id}`} disableWhileProcessing className="flex flex-col gap-6 p-4">
                {({ processing, errors }) => (
                    <div className="grid gap-6 max-w-lg">
                        <div className="grid gap-2">
                            <Label htmlFor="deskripsi">Deskripsi Kebutuhan</Label>
                            <Textarea id="deskripsi" name="deskripsi" className="min-h-40" required autoFocus
                                defaultValue={permintaan.deskripsi} disabled={isLocked} />
                            <InputError message={errors.deskripsi} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="urgensi">Urgensi</Label>
                            <Select name="urgensi" defaultValue={permintaan.urgensi} required disabled={isLocked}>
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
                                {statusLabel[permintaan.status] ?? permintaan.status}
                            </div>
                            {isLocked && <p className="text-sm text-muted-foreground">Permintaan sudah diproses dan tidak dapat diubah.</p>}
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isLocked || processing}>
                                {processing ? <><Spinner className="mr-2" /> Menyimpan...</> : 'Perbarui Permintaan'}
                            </Button>
                            <Link href="/permintaan">
                                <Button variant="outline" type="button">Kembali</Button>
                            </Link>
                        </div>
                    </div>
                )}
            </Form>
        </AppLayout>
    );
}
