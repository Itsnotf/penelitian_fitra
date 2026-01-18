import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, Form } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import pembelians, { store } from '@/routes/pembelians';
import { BreadcrumbItem } from '@/types';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';

import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pembelian',
        href: pembelians.index().url,
    },
    {
        title: 'Buat',
        href: pembelians.create().url,
    },
];

export default function UserCreatePage() {


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Barang" />
            <Form
                {...store.form()}
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
                                    tabIndex={1}
                                    autoComplete="vendor"
                                    name="vendor"
                                    placeholder="(e.g., PT. Sumber Rejeki)"
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
                                    tabIndex={1}
                                    autoComplete="deskripsi"
                                    name="deskripsi"
                                    placeholder="(e.g., Jelaskan secara singkat keterangan pembelian)"
                                />
                                <InputError
                                    message={errors.deskripsi}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dokumen">Dokumen Bukti Pembelian</Label>
                                <Input
                                    id="dokumen"
                                    type="file"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                    tabIndex={1}
                                    name="dokumen"
                                    placeholder="Pilih file dokumen (PDF, Word, atau Gambar)"
                                />
                                <p className="text-xs text-gray-500">
                                    Format: PDF, DOC, DOCX, JPG, PNG, GIF (Max: 5MB)
                                </p>
                                <InputError
                                    message={errors.dokumen}
                                    className="mt-2"
                                />
                            </div>

                            <div className='space-x-2'>
                                <Button type="submit" className="mt-2 w-fit">
                                    {processing ? (
                                        <>
                                            <Spinner className="mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Buat Pembelian'
                                    )}
                                </Button>
                                <Link href={'/pembelians'}>
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
