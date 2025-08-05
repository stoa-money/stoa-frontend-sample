import { ExternalLink, Loader2 } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

interface AuthorizationInterfaceProps {
  url?: string;
}

export function AuthorizationInterface({
  url,
}: AuthorizationInterfaceProps) {
  
  if (!url) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      {/* Scan QR Code Section */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Scan QR Code</h2>
        <p className="text-gray-600">
          Use your phone's camera or banking app to scan this code
        </p>
      </div>
      
      {/* QR Code */}
      <div className="flex justify-center mb-8">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors"
          title="Click to open authorization page"
        >
          <QRCodeCanvas
            value={url}
            size={280}
            bgColor="#ffffff"
            fgColor="#000000"
            level="L"
          />
        </a>
      </div>
      
      {/* Authorise Access Button */}
      <div className="flex justify-center mb-6">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium px-12 py-4 rounded-full transition-colors duration-200"
        >
          Authorise Access
        </a>
      </div>
      
      {/* Alternative link */}
      <p className="text-center text-gray-600">
        Or authorise deposit though a secure bank portal{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-700"
        >
          <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      </p>
    </div>
  );
}
