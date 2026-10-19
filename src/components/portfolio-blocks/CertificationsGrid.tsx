import React from 'react';
import { Award, ExternalLink, Calendar, CheckCircle2 } from 'lucide-react';
import { Certification } from '../../types/portfolio.ts';

interface CertificationsGridProps {
  certifications?: Certification[];
  accentColor?: string;
  borderClass?: string;
}

export const CertificationsGrid: React.FC<CertificationsGridProps> = ({
  certifications = [],
  accentColor = '#f97316',
  borderClass = 'glass-panel',
}) => {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold tracking-widest uppercase mb-1 block" style={{ color: accentColor }}>
          Verified Credentials
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Certifications & Honors</h3>
        <div className="w-12 h-1 mx-auto mt-2 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, #ea580c)` }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl ${borderClass} flex flex-col justify-between space-y-4 group hover:border-zinc-700 transition-all`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
                >
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-base leading-snug group-hover:text-orange-400 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-zinc-400 text-xs font-medium mt-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cert.issuer}</span>
                  </p>
                </div>
              </div>

              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
                  title="Verify Credential"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            {cert.date && (
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono border-t border-zinc-800/80 pt-3">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>Issued: {cert.date}</span>
                <span className="ml-auto text-emerald-400 text-[10px] uppercase font-bold tracking-wider">
                  Verified
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
