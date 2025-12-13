import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { BreadcrumbItem } from '@/types';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';

interface Props {
    // Empty props for create page
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pengajuan',
        href: '/pengajuans',
    },
    {
        title: 'Buat',
        href: '/pengajuans/create',
    },
];

export default function PengajuanCreatePage({ }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Buat Pengajuan" />
            <Form
                method="post"
                action="/pengajuans"
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
                                    placeholder="(e.g., Butuh laptop untuk meeting dengan klien)"
                                />
                                <InputError
                                    message={errors.deskripsi}
                                    className="mt-2"
                                />
                            </div>

                            <div className='space-x-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Membuat...
                                        </>
                                    ) : (
                                        'Buat Pengajuan'
                                    )}
                                </Button>
                                <Link href={'/pengajuans'}>
                                    <Button variant='outline' type="button" className="mt-2 w-fit">
                                        Kembali
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
