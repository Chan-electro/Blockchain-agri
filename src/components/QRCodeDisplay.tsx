import React, { useRef } from 'react';
import QRCodeSVG from 'react-qr-code';
import { Download, QrCode } from 'lucide-react';
import { Button } from './ui/button';

interface QRCodeDisplayProps {
    batchId: number;
    size?: number;
    showDownload?: boolean;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
    batchId,
    size = 200,
    showDownload = true
}) => {
    const qrRef = useRef<HTMLDivElement>(null);

    // Generate URL for the QR code - using batch ID for simplicity
    // In production, this would be a full URL like https://agrichain.com/product/{batchId}
    const qrValue = `${window.location.origin}/product/${batchId}`;

    const downloadQRCode = () => {
        if (!qrRef.current) return;

        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;

        // Create a canvas and draw the SVG
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();

        img.onload = () => {
            canvas.width = size;
            canvas.height = size;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0);

            // Download
            const link = document.createElement('a');
            link.download = `batch-${batchId}-qr.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <>
            <div className="flex items-center gap-2 text-primary mb-2 justify-center">
                <QrCode size={20} />
                <h3 className="font-semibold">Batch #{batchId}</h3>
            </div>

            <div
                ref={qrRef}
                className="p-4 bg-white rounded-lg shadow-sm mx-auto"
                style={{ width: 'fit-content' }}
            >
                <QRCodeSVG
                    value={qrValue}
                    size={size}
                    level="H"

                />
            </div>

            <p className="text-xs text-muted-foreground text-center mt-2">
                Scan for product details
            </p>

            {showDownload && (
                <Button
                    onClick={downloadQRCode}
                    variant="outline"
                    size="sm"
                    className="gap-2 mt-2 w-full"
                >
                    <Download size={16} />
                    Download
                </Button>
            )}
        </>
    );
};

export default QRCodeDisplay;
