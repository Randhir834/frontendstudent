'use client';

import { useEffect, useState } from 'react';
import { 
  Award, Download, Calendar, CheckCircle, Loader2, 
  AlertCircle, Share2, ExternalLink 
} from 'lucide-react';
import { certificateService, Certificate } from '@/services/certificateService';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState<number | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await certificateService.getMyCertificates();
      setCertificates(data.certificates);
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId: number) => {
    try {
      setDownloading(certificateId);
      await certificateService.downloadCertificate(certificateId);
      
      // Update certificate in state
      setCertificates(certs =>
        certs.map(cert =>
          cert.id === certificateId
            ? { ...cert, is_downloaded: true, downloaded_at: new Date().toISOString() }
            : cert
        )
      );
    } catch (err) {
      console.error('Failed to download certificate:', err);
      setError('Failed to download certificate');
    } finally {
      setDownloading(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isValidCertificate = (cert: Certificate) => {
    const now = new Date();
    const validFrom = new Date(cert.valid_from);
    const validUntil = new Date(cert.valid_until);
    return now >= validFrom && now <= validUntil;
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#1E88E5] mx-auto mb-4" />
            <p className="text-[#78909C]">Loading your certificates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Award className="w-8 h-8 text-[#1E88E5]" />
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Certificates</h1>
        </div>
        <p className="text-[#78909C]">
          Your earned certificates and achievements
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[#FFEBEE] border border-[#EF5350] text-[#C62828] p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-[#1E88E5] to-[#1565C0]">
          <CardContent className="p-6">
            <div className="text-white">
              <p className="text-sm opacity-90">Total Certificates</p>
              <p className="text-3xl font-bold mt-2">{certificates.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-[#43A047] to-[#2E7D32]">
          <CardContent className="p-6">
            <div className="text-white">
              <p className="text-sm opacity-90">Downloaded</p>
              <p className="text-3xl font-bold mt-2">
                {certificates.filter(c => c.is_downloaded).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Award className="w-16 h-16 text-[#B0BEC5] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#1E3A5F] mb-2">
              No Certificates Yet
            </h3>
            <p className="text-[#78909C]">
              Complete courses to earn certificates and showcase your learning
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {certificates.map(certificate => (
            <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Certificate Info */}
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#1E3A5F]">
                        {certificate.course_title}
                      </h3>
                      <p className="text-sm text-[#78909C] mt-1">
                        Instructed by: {certificate.instructor_name}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#1E3A5F]">
                          Certificate #:
                        </span>
                        <code className="text-xs bg-[#F5F5F5] px-2 py-1 rounded text-[#1E3A5F] font-mono">
                          {certificate.certificate_number}
                        </code>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#78909C]" />
                        <span className="text-sm text-[#78909C]">
                          Issued: {formatDate(certificate.issued_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-[#43A047]" />
                        <span className="text-sm">
                          {isValidCertificate(certificate) ? (
                            <span className="text-[#43A047]">
                              Valid until {formatDate(certificate.valid_until)}
                            </span>
                          ) : (
                            <span className="text-[#EC407A]">
                              Expired on {formatDate(certificate.valid_until)}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-col justify-between gap-3">
                    <Button
                      onClick={() => handleDownload(certificate.id)}
                      disabled={downloading === certificate.id}
                      className="w-full flex items-center justify-center gap-2"
                    >
                      {downloading === certificate.id ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Download
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2"
                      title="Share this certificate"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </Button>

                    <div className="bg-[#F5F5F5] p-3 rounded text-xs text-center">
                      {certificate.is_downloaded ? (
                        <span className="text-[#43A047]">✓ Downloaded</span>
                      ) : (
                        <span className="text-[#FF9800]">Not Downloaded</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <Card className="bg-[#E3F2FD] border border-[#90CAF9]">
        <CardContent className="p-4">
          <p className="text-sm text-[#1565C0]">
            💡 <span className="font-medium">Tip:</span> You can verify any certificate by sharing its certificate number. 
            Recipients can verify it independently on our certificate verification page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
