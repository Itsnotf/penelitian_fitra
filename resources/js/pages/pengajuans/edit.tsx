import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem, Pengajuan } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface Props {
    pengajuan: Pengajuan;
}

export default function PengajuanEditPage({ pengajuan }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pengajuan',
            href: '/pengajuans',
        },
        {
            title: 'Edit',
            href: `/pengajuans/${pengajuan.id}/edit`,
        },
    ];

    // Status yang sudah approved/rejected tidak bisa diedit
    const isLocked = pengajuan.status !== 'pending';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Pengajuan" />
            <Form
                method="post"
                action={`/pengajuans/${pengajuan.id}`}
                disableWhileProcessing
                className="flex flex-col gap-6 p-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="deskripsi">Deskripsi Kebutuhan</Label>
                                <Textarea
                                    id="deskripsi"
                                    className='min-h-40'
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="deskripsi"
                                    name="deskripsi"
                                    defaultValue={pengajuan.deskripsi}
                                    placeholder="(e.g., Butuh laptop untuk meeting dengan klien)"
                                    disabled={isLocked}
                                />
                                <InputError
                                    message={errors.deskripsi}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <div className="p-3 bg-gray-100 rounded-md">
                                    <span className={`inline-block px-3 py-1 rounded text-white text-sm font-semibold ${
                                        pengajuan.status === 'approved' ? 'bg-green-600' : 
                                        pengajuan.status === 'rejected' ? 'bg-red-600' :
                                        'bg-yellow-600'
                                    }`}>
                                        {pengajuan.status === 'approved' ? 'Approved' :
                                         pengajuan.status === 'rejected' ? 'Rejected' :
                                         'Pending'}
                                    </span>
                                </div>
                                {isLocked && (
                                    <p className="text-sm text-yellow-600">Status sudah {pengajuan.status}, tidak dapat diubah</p>
                                )}
                            </div>

                            <div className='space-x-2'>
                                <Button type="submit" className="mt-2 w-fit" disabled={isLocked}>
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Pengajuan'
                                    )}
                                </Button>
                                <Link href={'/pengajuans'}>
                                    <Button variant='outline' type="button" className="mt-2 w-fit">
                                        Back
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </Form>
        </AppLayout>
    );
}
