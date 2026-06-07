'use client';

import { useEffect, useState } from 'react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { EyeOff, Eye } from 'lucide-react';
import { initializeScreenshotPrevention, ScreenshotPreventionConfig } from '@/utils/screenshotPrevention';

export default function PdfViewerPage() {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const config: ScreenshotPreventionConfig = {
      onViolationDetected: (type) => {
        console.log(`Security violation detected: ${type}`);
        setIsBlurred(true);
        
        // Auto-hide the warning after 3 seconds
        setTimeout(() => {
          setIsBlurred(false);
        }, 3000);
      },
      blurOnViolation: true,
      strictMode: true
    };

    const prevention = initializeScreenshotPrevention(config);

    return () => {
      prevention.deactivate();
    };
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 relative h-full min-h-[80vh]">
      {/* Security Overlay when violated */}
      {isBlurred && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 rounded-xl">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center shadow-2xl border-2 border-red-500">
            <EyeOff className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Content Hidden</h3>
            <p className="text-gray-600 mb-6">
              Screenshot attempt or security violation detected. Course material is protected.
            </p>
            <button
              onClick={() => setIsBlurred(false)}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded-lg font-medium transition-colors"
            >
              <Eye className="h-5 w-5" />
              <span>Resume Viewing</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content (Blurred if violation) */}
      <div 
        className="h-full transition-all duration-200" 
        style={{ 
          filter: isBlurred ? 'blur(12px)' : 'none',
          pointerEvents: isBlurred ? 'none' : 'auto',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        <div className="bg-red-600 text-white px-4 py-2 rounded-t-xl flex items-center justify-center font-medium text-sm mb-4">
          SECURE VIEW MODE: Screenshots and downloads are disabled
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">PDF Viewer</h1>
        <Card>
          <CardHeader><CardTitle>Course Material</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-text-muted">PDF content will be rendered here.</p>
            <div className="mt-4 aspect-[3/4] bg-hover rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-sm text-text-muted">PDF Preview</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
