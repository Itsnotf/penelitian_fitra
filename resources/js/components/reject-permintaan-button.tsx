import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import { XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import InputError from './input-error';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

export default function RejectPermintaanButton({ id }: { id: number }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        alasan_reject: '',
    });

    const handleReject = () => {
        const reject = new Promise((resolve, reject) => {
            post(`/permintaan/${id}/reject-status`, {
                onSuccess: () => {
                    resolve(true);
                    setOpen(false);
                    reset();
                },
                onError: () => reject(false),
            });
        });

        toast.promise(reject, {
            loading: 'Menolak permintaan...',
            success: 'Permintaan berhasil ditolak',
            error: 'Gagal menolak permintaan',
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-200 hover:text-red-600"
                >
                    <XCircle />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tolak Permintaan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda akan menolak permintaan ini. Tindakan ini tidak
                        dapat dibatalkan dan permintaan tidak akan dapat
                        disetujui lagi.
                    </AlertDialogDescription>
                    <AlertDialogDescription asChild>
                        <div className="grid gap-2">
                            <Label htmlFor="alasan_reject">Alasan Penolakan</Label>
                            <Textarea
                                id="alasan_reject"
                                className="min-h-40"
                                autoFocus
                                tabIndex={1}
                                name="alasan_reject"
                                value={data.alasan_reject}
                                onChange={(e) => setData('alasan_reject', e.target.value)}
                                placeholder="(e.g., Alasan penolakan seperti barang sudah tersedia atau tidak sesuai kebutuhan)"
                            />
                            <InputError message={errors.alasan_reject} className="mt-2" />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleReject}
                            disabled={processing}
                        >
                            Ya, Tolak Permintaan
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
