import { Button } from '@/components/ui/button';
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
} from "@/components/ui/alert-dialog";
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';

export default function RejectPengajuanButton({ id }: { id: number }) {
    const handleReject = () => {
        const reject = new Promise((resolve, reject) => {
            router.post(`/pengajuans/${id}/reject-status`, {}, {
                onSuccess: () => resolve(true),
                onError: () => reject(false),
            });
        });

        toast.promise(reject, {
            loading: 'Menolak pengajuan...',
            success: 'Pengajuan berhasil ditolak',
            error: 'Gagal menolak pengajuan',
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className='hover:bg-red-200 hover:text-red-600'
                >
                    <XCircle />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tolak Pengajuan?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Anda akan menolak pengajuan ini. Tindakan ini tidak dapat dibatalkan dan pengajuan tidak akan dapat disetujui lagi.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button 
                            className="bg-red-600 hover:bg-red-700" 
                            onClick={handleReject}
                        >
                            Ya, Tolak Pengajuan
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
