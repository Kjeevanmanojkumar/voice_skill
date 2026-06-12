import React, { useState, useEffect } from 'react';
import { getCertificates } from '../services/api';
import type { Certificate, Skill } from '../lib/supabase';
import { Award, Download, Calendar, CheckCircle, ExternalLink, Zap, Heart, Hammer, Cpu } from 'lucide-react';
import jsPDF from 'jspdf';

interface CertificateWithSkill extends Certificate {
  skill: Skill;
}

const skillGradients: Record<string, { bg: string; border: string; icon: string }> = {
  electrical: {
    bg: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
  },
  healthcare: {
    bg: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    icon: 'text-rose-400',
  },
  carpentry: {
    bg: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
  },
  computer_hardware: {
    bg: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/30',
    icon: 'text-sky-400',
  },
};

export function CertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateWithSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getCertificates();
        setCertificates(data);
      } catch (error) {
        console.error('Failed to load certificates:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const downloadCertificate = (cert: CertificateWithSkill) => {
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    // Border
    doc.setDrawColor(14, 165, 233);
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20, 'S');

    doc.setLineWidth(1);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'S');

    // Platform name
    doc.setFontSize(12);
    doc.setTextColor(148, 163, 184);
    doc.text('VoiceSkill - Vocational Learning Platform', pageWidth / 2, 30, { align: 'center' });

    // Title
    doc.setFontSize(40);
    doc.setTextColor(14, 165, 233);
    doc.text('Certificate', pageWidth / 2, 55, { align: 'center' });

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('of Achievement', pageWidth / 2, 65, { align: 'center' });

    // Decorative line
    doc.setDrawColor(217, 70, 239);
    doc.setLineWidth(0.5);
    doc.line(60, 72, pageWidth - 60, 72);

    // Content
    doc.setFontSize(14);
    doc.setTextColor(148, 163, 184);
    doc.text('This is to certify that', pageWidth / 2, 90, { align: 'center' });

    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('Learner', pageWidth / 2, 108, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(148, 163, 184);
    doc.text('has successfully demonstrated competency in', pageWidth / 2, 125, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233);
    doc.text(cert.skill.name, pageWidth / 2, 142, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(148, 163, 184);
    doc.text(`with a score of ${cert.score_achieved}%`, pageWidth / 2, 155, { align: 'center' });

    // Competency Level
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129);
    doc.text(`Competency Level: ${cert.competency_level}`, pageWidth / 2, 172, { align: 'center' });

    // Footer info
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Certificate No: ${cert.certificate_number}`, pageWidth / 2, 190, { align: 'center' });
    doc.text(`Issued: ${new Date(cert.issued_at).toLocaleDateString()}`, pageWidth / 2, 198, { align: 'center' });
    doc.text(`Verification Code: ${cert.verification_code}`, pageWidth / 2, 206, { align: 'center' });

    doc.save(`certificate-${cert.skill.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 blur-xl opacity-50 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Certificate Center</h1>
        <p className="text-slate-400">
          View and download your earned certifications
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-slate-500" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">No Certificates Yet</h2>
          <p className="text-slate-400 mb-6">
            Complete assessments to earn certificates for your vocational skills
          </p>
          <a
            href="/assessments"
            className="btn-primary inline-flex items-center gap-2"
          >
            Go to Assessments
          </a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => {
            const gradient = skillGradients[cert.skill.category] || skillGradients.electrical;
            return (
              <div key={cert.id} className="glass-card overflow-hidden group">
                {/* Card Header */}
                <div className={`relative p-6 bg-gradient-to-br ${gradient.bg}`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative flex items-center justify-between">
                    <Award className={`w-10 h-10 ${gradient.icon}`} />
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-success-400" />
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <h3 className="text-xl font-bold text-white">{cert.skill.name}</h3>
                    <p className="text-slate-300 text-sm">Certificate of Competency</p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(cert.issued_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                      cert.competency_level === 'Expert'
                        ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                        : cert.competency_level === 'Proficient'
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'bg-success-500/20 text-success-400 border border-success-500/30'
                    }`}>
                      {cert.competency_level}
                    </span>
                    <span className="text-slate-400 text-sm">Score: {cert.score_achieved}%</span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 break-all">
                    {cert.certificate_number}
                  </p>

                  <button
                    onClick={() => downloadCertificate(cert)}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* About Section */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">About Certifications</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-white mb-2">Competency Levels</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-success-500"></span>
                Competent (70-79%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                Proficient (80-89%)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-accent-500"></span>
                Expert (90-100%)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-white mb-2">Verification</h3>
            <p className="text-sm text-slate-400">
              Each certificate has a unique verification code that can be used to
              authenticate your credentials with employers.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-white mb-2">Renewal</h3>
            <p className="text-sm text-slate-400">
              Certifications are valid indefinitely. Retake assessments to
              improve your competency level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
