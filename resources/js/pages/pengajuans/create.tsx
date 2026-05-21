import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Form, Head, Link } from '@inertiajs/react';

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

export default function PengajuanCreatePage({}: Props) {
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
                                <Label htmlFor="deskripsi">
                                    Deskripsi Kebutuhan
                                </Label>
                                <Textarea
                                    id="deskripsi"
                                    className="min-h-40"
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

                            <div className="grid gap-2">
                                <Label htmlFor="urgensi">Urgensi</Label>
                                <Select name="urgensi" required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a urgensi" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key={'biasa'} value={'biasa'}>
                                            Biasa
                                        </SelectItem>
                                        <SelectItem key={'segera'} value={'segera'}>
                                            Segera
                                        </SelectItem>
                                        <SelectItem key={'mendesak'} value={'mendesak'}>
                                            Mendesak
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.urgensi} />
                            </div>

                            <div className="space-x-2">
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
                                    <Button
                                        variant="outline"
                                        type="button"
                                        className="mt-2 w-fit"
                                    >
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
