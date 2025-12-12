import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import pembelians, { update } from '@/routes/pembelians';
import { BreadcrumbItem, Pembelian } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    pembelian: Pembelian;
};

export default function PembelianEditPage({ pembelian }: Props) {

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Pembelian',
            href: pembelians.index().url,
        },
        {
            title: 'Edit',
            href: pembelians.edit(pembelian.id).url,
        },
    ];

    // Status finished tidak bisa diedit
    const isFinished = pembelian.status === 'finished';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pembelians" />
            <Form
                {...update.form(pembelian.id)}
                disableWhileProcessing
                className="flex flex-col gap-6 p-4"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="vendor">Nama Vendor</Label>
                                <Input
                                    id="vendor"
                                    type="text"
                                    required
                                    autoFocus
                                    defaultValue={pembelian.vendor}
                                    tabIndex={1}
                                    autoComplete="vendor"
                                    name="vendor"
                                    placeholder="(e.g., PT. Sumber Rejeki)"
                                    disabled={isFinished}
                                />
                                <InputError
                                    message={errors.vendor}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <Textarea
                                    id="deskripsi"
                                    className='min-h-40'
                                    required
                                    autoFocus
                                    defaultValue={pembelian.deskripsi}
                                    tabIndex={1}
                                    autoComplete="deskripsi"
                                    name="deskripsi"
                                    placeholder="(e.g., Pembelian untuk keperluan kantor)"
                                    disabled={isFinished}
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
                                        pembelian.status === 'finished' ? 'bg-green-600' : 'bg-yellow-600'
                                    }`}>
                                        {pembelian.status === 'finished' ? 'Finished' : 'Pending'}
                                    </span>
                                </div>
                                {isFinished && (
                                    <p className="text-sm text-yellow-600">Status selesai tidak dapat diubah</p>
                                )}
                            </div>

                            <div className='space-x-2'>
                                <Button type="submit" className="mt-2 w-fit" disabled={isFinished}>
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Updating...
                                        </>
                                    ) : (
                                        'Update Pembelian'
                                    )}
                                </Button>
                                <Link href={'/pembelians'}>
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
