import { FileDown } from 'lucide-react';
import { Button } from './ui/button';

export default function DownloadPdfLink({ id, type }: { id?: number; type: 'pembelians' | 'pengajuans' | 'barangs' }) {
    const route = id ? `/${type}/${id}/download-pdf` : `/barangs/download-pdf`;
    
    return (
        <a
            href={route}
            target="_blank"
            rel="noopener noreferrer"
        >
            <FileDown />
           
        </a>
    );
}
