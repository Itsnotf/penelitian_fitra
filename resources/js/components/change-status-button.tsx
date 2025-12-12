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
import { CheckCircle2 } from 'lucide-react';

export default function ChangeStatusButton({ id, features }: { id: number , features: string}) {
    const handleChangeStatus = () => {
        const changeStatus = new Promise((resolve, reject) => {
            router.post(`/${features}/${id}/change-status`, {}, {
                onSuccess: () => resolve(true),
                onError: () => reject(false),
            });
        });

        toast.promise(changeStatus, {
            loading: 'Mengubah status...',
            success: 'Status berhasil diubah ke finished',
            error: 'Gagal mengubah status',
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className='hover:bg-green-200 hover:text-green-600'
                >
                    <CheckCircle2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Ubah Status ke Finished?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Ketika status diubah ke finished, semua barang dalam pembelian ini akan otomatis merubah stock. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button 
                            className="bg-green-600 hover:bg-green-700" 
                            onClick={handleChangeStatus}
                        >
                            Ya, Ubah Status
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
