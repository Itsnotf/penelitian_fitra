import { FileDown } from 'lucide-react';

export default function DownloadPdfLink({ id, type }: { id?: number; type: 'pengadaan' | 'permintaan' | 'barangs' }) {
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
