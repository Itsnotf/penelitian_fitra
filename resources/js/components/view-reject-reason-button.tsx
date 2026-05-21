import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { MessageSquareX } from 'lucide-react';

export default function ViewRejectReasonButton({ alasanReject }: { alasanReject: string | null | undefined }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover:bg-red-200 hover:text-red-600">
                    <MessageSquareX />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Alasan Penolakan</DialogTitle>
                    <DialogDescription>
                        Pengajuan ini telah ditolak dengan alasan berikut.
                    </DialogDescription>
                </DialogHeader>
                <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {alasanReject ?? <span className="italic text-muted-foreground">Tidak ada alasan yang diberikan.</span>}
                </div>
            </DialogContent>
        </Dialog>
    );
}
