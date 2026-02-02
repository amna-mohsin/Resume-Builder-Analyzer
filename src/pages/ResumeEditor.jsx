import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, GraduationCap, Settings, Download, Plus, Link as LinkIcon,
  Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Search, User, FileText, Code, Languages, Type, FolderKanban, Palette, Mail, Linkedin, Github, Phone, Calendar, CheckCircle, AlertCircle, ArrowLeft
} from 'lucide-react';

// 10 ATS-friendly Resume Layouts
const RESUME_LAYOUTS = {
  1: { name: "Classic ATS", structure: "top-down", align: "text-left", border: "border-b-2", color: "#000000" },
  2: { name: "Modern Professional", structure: "top-down", align: "text-left", border: "border-b-2", color: "#1e293b" },
  3: { name: "Executive", structure: "top-down", align: "text-center", border: "border-y-2", color: "#000000" },
  4: { name: "Minimalist ATS", structure: "top-down", align: "text-left", border: "none", color: "#475569" },
  5: { name: "Tech Focus", structure: "grid-2col", align: "text-left", border: "border-t-4", color: "#2563eb" },
  6: { name: "Academic", structure: "sidebar-left", align: "text-left", border: "border-l-4", color: "#7c3aed" },
  7: { name: "Creative Professional", structure: "sidebar-right", align: "text-left", border: "none", color: "#dc2626" },
  8: { name: "Corporate", structure: "top-down", align: "text-left", border: "border-b-8", color: "#0f172a" },
  9: { name: "Clean Lines", structure: "grid-2col", align: "text-left", border: "border-b", color: "#1e40af" },
  10: { name: "Simple & Effective", structure: "top-down", align: "text-left", border: "border-b-2", color: "#334155" }
};

const ResumeEditor = () => {
  const navigate = useNavigate();
  const resumeRef = useRef();
  const [zoom, setZoom] = useState(45);
  const [showPDFNameModal, setShowPDFNameModal] = useState(false);
  const [pdfName, setPdfName] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [layoutId, setLayoutId] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Fixed section order: summary, education, work, projects, skills, languages
  const [sectionOrder, setSectionOrder] = useState(['summary', 'education', 'work', 'projects', 'skills', 'languages']);

  const [resumeData, setResumeData] = useState({
    personal: { name: '', email: '', phone: '', linkedin: '', github: '' },
    summary: { content: '', visible: true },
    education: [{ id: 'e1', school: '', degree: '', start: '', end: '', visible: true }],
    work: [{ id: 'w1', company: '', role: '', start: '', end: '', desc: '• ', visible: true }],
    projects: [{ id: 'p1', name: '', link: '', start: '', end: '', desc: '• ', visible: true }],
    skills: [{ id: 's1', name: '' }], // Removed level for PDF
    languages: [{ id: 'l1', name: '' }], // Removed level for PDF
    settings: {
      themeColor: '#2563eb',
      fontFamily: 'Georgia, serif',
      fontSize: 11
    }
  });

  // Load saved resume data from sessionStorage if editing
  useEffect(() => {
    const savedData = sessionStorage.getItem('resumeData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setResumeData(parsed);
      } catch (err) {
        console.error('Error loading resume data:', err);
      }
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Helper functions
  const updateSection = (section, field, value) => {
    setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const updateArrayItem = (section, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = (section) => {
    const id = Date.now().toString();
    const templates = {
      work: { id, company: '', role: '', start: '', end: '', desc: '• ', visible: true },
      education: { id, school: '', degree: '', start: '', end: '', visible: true },
      projects: { id, name: '', link: '', start: '', end: '', desc: '• ', visible: true },
      skills: { id, name: '' },
      languages: { id, name: '' }
    };
    setResumeData(prev => ({ ...prev, [section]: [...prev[section], templates[section]] }));
  };

  const moveSection = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= sectionOrder.length) return;

    setSectionOrder(prev => {
      const newOrder = [...prev];
      const temp = newOrder[index];
      newOrder[index] = newOrder[newIdx];
      newOrder[newIdx] = temp;
      return newOrder;
    });
  };

  const deleteItem = (section, id) => {
    setResumeData(prev => ({ ...prev, [section]: prev[section].filter(i => i.id !== id) }));
  };

  const handleBulletKeyDown = (e, section, id = null, field = 'desc') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const cursor = e.target.selectionStart;
      const val = e.target.value;
      const newVal = val.substring(0, cursor) + '\n• ' + val.substring(cursor);
      if (id) updateArrayItem(section, id, field, newVal);
      else updateSection(section, field, newVal);
      setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = cursor + 3; }, 10);
    }
  };

  const handleDownload = () => {
    const defaultName = resumeData.personal.name || 'Resume';
    setPdfName(defaultName);
    setShowPDFNameModal(true);
  };

  const handleConfirmDownload = async () => {
    const finalName = pdfName.trim() || resumeData.personal.name || 'Resume';
    setPdfName(finalName);
    setShowPDFNameModal(false);
    setIsDownloading(true);
    
    try {
      // Save to dashboard FIRST
      const resumeId = sessionStorage.getItem('resumeId');
      const existingResumes = JSON.parse(localStorage.getItem('savedResumes') || '[]');
      
      let savedResumeId;
      
      if (resumeId) {
        const index = existingResumes.findIndex(r => r.id === resumeId);
        if (index !== -1) {
          existingResumes[index] = {
            ...existingResumes[index],
            name: finalName,
            data: JSON.stringify(resumeData),
            updated_at: new Date().toISOString()
          };
          savedResumeId = resumeId;
        } else {
          savedResumeId = Date.now().toString();
          const resumeToSave = {
            id: savedResumeId,
            name: finalName,
            data: JSON.stringify(resumeData),
            created_at: new Date().toISOString()
          };
          existingResumes.unshift(resumeToSave);
        }
        sessionStorage.removeItem('resumeId');
      } else {
        savedResumeId = Date.now().toString();
        const resumeToSave = {
          id: savedResumeId,
          name: finalName,
          data: JSON.stringify(resumeData),
          created_at: new Date().toISOString()
        };
        existingResumes.unshift(resumeToSave);
      }
      
      localStorage.setItem('savedResumes', JSON.stringify(existingResumes));
      
      showToast('Generating PDF...', 'success');
      
      // Generate PDF using browser's print functionality (from your 2nd code)
      await generatePDF();
      
      showToast('PDF downloaded successfully!', 'success');
      
    } catch (err) {
      console.error('Error downloading PDF:', err);
      showToast('PDF download failed. Resume is saved to dashboard.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  const generatePDF = () => {
    return new Promise((resolve, reject) => {
      try {
        const element = resumeRef.current;
        if (!element) {
          throw new Error('Resume element not found');
        }
        
        // Store original styles
        const originalTransform = element.style.transform;
        const originalBoxShadow = element.style.boxShadow;
        const originalPosition = element.style.position;
        const originalTop = element.style.top;
        const originalLeft = element.style.left;
        const originalZIndex = element.style.zIndex;
        
        // Temporarily modify styles for PDF generation
        element.style.transform = 'none';
        element.style.boxShadow = 'none';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.left = '0';
        element.style.zIndex = '9999';
        
        // Create a print-friendly version
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Could not open print window. Please allow popups for this site.');
        }
        
        // Create print content
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>${pdfName || 'Resume'}</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Roboto:wght@400;700&family=Open+Sans:wght@400;700&family=Poppins:wght@400;700&family=Montserrat:wght@400;700&family=Lato:wght@400;700&family=Merriweather:wght@400;700&family=Playfair+Display:wght@400;700&display=swap');
                
                * {
                  margin: 0;
                  padding: 0;
                  box-sizing: border-box;
                }
                
                body {
                  font-family: ${resumeData.settings.fontFamily};
                  font-size: ${resumeData.settings.fontSize}pt;
                  line-height: 1.5;
                  color: #000000;
                  background: white;
                  padding: 20mm;
                  width: 210mm;
                  min-height: 297mm;
                }
                
                .resume-container {
                  max-width: 100%;
                  margin: 0 auto;
                }
                
                h1 {
                  font-size: 32pt;
                  font-weight: 900;
                  text-transform: uppercase;
                  margin-bottom: 10px;
                  color: #000000;
                }
                
                .contact-info {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 15px;
                  margin-bottom: 20px;
                  font-size: 9pt;
                  font-weight: bold;
                  text-transform: uppercase;
                  color: #666666;
                }
                
                .section {
                  margin-bottom: 15px;
                }
                
                .section-title {
                  font-size: 12pt;
                  font-weight: 900;
                  text-transform: uppercase;
                  color: ${currentLayout.color};
                  border-bottom: 1px solid #e5e5e5;
                  padding-bottom: 5px;
                  margin-bottom: 10px;
                }
                
                .section-content {
                  padding-left: 5px;
                }
                
                .job-item, .education-item, .project-item {
                  margin-bottom: 12px;
                  page-break-inside: avoid;
                }
                
                .job-header, .education-header, .project-header {
                  display: flex;
                  justify-content: space-between;
                  font-weight: bold;
                  margin-bottom: 3px;
                }
                
                .date {
                  font-size: 8pt;
                  color: #666666;
                  text-transform: uppercase;
                }
                
                .position {
                  font-style: italic;
                  color: ${currentLayout.color};
                  margin-bottom: 5px;
                }
                
                .description {
                  white-space: pre-wrap;
                  font-size: 9pt;
                  line-height: 1.4;
                  text-align: justify;
                }
                
                .summary-content {
                  white-space: pre-wrap;
                  font-size: 10pt;
                  line-height: 1.6;
                  text-align: justify;
                }
                
                .skills-grid, .languages-grid {
                  display: grid;
                  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                  gap: 10px;
                }
                
                .skill-item, .language-item {
                  padding: 3px 0;
                  border-bottom: 1px solid #f0f0f0;
                }
                
                .skill-item:last-child, .language-item:last-child {
                  border-bottom: none;
                }
                
                @media print {
                  body {
                    padding: 0;
                    min-height: auto;
                  }
                  
                  .resume-container {
                    page-break-inside: avoid;
                  }
                  
                  .section {
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              <div class="resume-container">
                <!-- Header -->
                <header style="text-align: ${currentLayout.align}; margin-bottom: 20px;">
                  <h1>${resumeData.personal.name || 'YOUR NAME'}</h1>
                  <div class="contact-info" style="justify-content: ${currentLayout.align === 'text-center' ? 'center' : currentLayout.align === 'text-right' ? 'flex-end' : 'flex-start'}">
                    ${resumeData.personal.email ? `<span>📧 ${resumeData.personal.email}</span>` : ''}
                    ${resumeData.personal.phone ? `<span>📞 ${resumeData.personal.phone}</span>` : ''}
                    ${resumeData.personal.linkedin ? `<span>🔗 ${resumeData.personal.linkedin}</span>` : ''}
                    ${resumeData.personal.github ? `<span>💻 ${resumeData.personal.github}</span>` : ''}
                  </div>
                </header>
                
                <!-- Content based on layout -->
                ${generatePrintContent()}
              </div>
              
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Restore original styles
        element.style.transform = originalTransform;
        element.style.boxShadow = originalBoxShadow;
        element.style.position = originalPosition;
        element.style.top = originalTop;
        element.style.left = originalLeft;
        element.style.zIndex = originalZIndex;
        
        // Resolve when print dialog opens
        printWindow.onbeforeprint = resolve;
        printWindow.onafterprint = () => {
          printWindow.close();
          resolve();
        };
        
      } catch (error) {
        reject(error);
      }
    });
  };

  const generatePrintContent = () => {
    const currentLayout = RESUME_LAYOUTS[layoutId];
    
    if (currentLayout.structure === "top-down") {
      return sectionOrder.map(sectionKey => generateSectionHTML(sectionKey)).join('');
    } else if (currentLayout.structure === "sidebar-left") {
      return `
        <div style="display: flex; gap: 15px;">
          <div style="width: 25%;">
            ${generateSectionHTML('skills', true)}
            ${generateSectionHTML('languages', true)}
          </div>
          <div style="width: 75%;">
            ${generateSectionHTML('summary', true)}
            ${generateSectionHTML('education', true)}
            ${generateSectionHTML('work', true)}
            ${generateSectionHTML('projects', true)}
          </div>
        </div>
      `;
    } else if (currentLayout.structure === "sidebar-right") {
      return `
        <div style="display: flex; gap: 15px;">
          <div style="width: 75%;">
            ${generateSectionHTML('summary', true)}
            ${generateSectionHTML('education', true)}
            ${generateSectionHTML('work', true)}
            ${generateSectionHTML('projects', true)}
          </div>
          <div style="width: 25%;">
            ${generateSectionHTML('skills', true)}
            ${generateSectionHTML('languages', true)}
          </div>
        </div>
      `;
    } else if (currentLayout.structure === "grid-2col") {
      return `
        <div style="margin-bottom: 15px;">
          ${generateSectionHTML('summary', true)}
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div>
            ${generateSectionHTML('education', true)}
            ${generateSectionHTML('skills', true)}
            ${generateSectionHTML('languages', true)}
          </div>
          <div>
            ${generateSectionHTML('work', true)}
            ${generateSectionHTML('projects', true)}
          </div>
        </div>
      `;
    }
    
    return sectionOrder.map(sectionKey => generateSectionHTML(sectionKey)).join('');
  };

  const generateSectionHTML = (key, noTitle = false) => {
    const color = RESUME_LAYOUTS[layoutId].color;
    
    switch (key) {
      case 'summary':
        if (!resumeData.summary.content.trim()) return '';
        // Remove bullets from summary and format properly
        const summaryContent = resumeData.summary.content.replace(/^•\s*/gm, '').replace(/\n/g, '<br>');
        return `
          <div class="section">
            ${!noTitle ? `<h3 class="section-title">Professional Summary</h3>` : ''}
            <div class="section-content">
              <p class="summary-content">${summaryContent}</p>
            </div>
          </div>
        `;
      case 'work':
        if (resumeData.work.length === 0) return '';
        return `
          <div class="section">
            ${!noTitle ? `<h3 class="section-title">Work Experience</h3>` : ''}
            <div class="section-content">
              ${resumeData.work.map(job => {
                // Clean description - remove leading bullets if they exist
                const cleanDesc = job.desc.replace(/^•\s*/gm, '').replace(/\n•\s*/g, '\n');
                return `
                <div class="job-item">
                  <div class="job-header">
                    <span>${job.company || 'Company'}</span>
                    <span class="date">${job.start || ''} — ${job.end || 'Present'}</span>
                  </div>
                  <div class="position">${job.role || 'Position'}</div>
                  <div class="description">${cleanDesc.replace(/\n/g, '<br>') || ''}</div>
                </div>
              `}).join('')}
            </div>
          </div>
        `;
      case 'education':
        if (resumeData.education.length === 0) return '';
        return `
          <div class="section">
            ${!noTitle ? `<h3 class="section-title">Education</h3>` : ''}
            <div class="section-content">
              ${resumeData.education.map(edu => `
                <div class="education-item">
                  <div class="education-header">
                    <span>${edu.school || 'School'}</span>
                    <span class="date">${edu.start || ''} — ${edu.end || ''}</span>
                  </div>
                  <div class="position">${edu.degree || 'Degree'}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      case 'projects':
        if (resumeData.projects.length === 0) return '';
        return `
          <div class="section">
            ${!noTitle ? `<h3 class="section-title">Key Projects</h3>` : ''}
            <div class="section-content">
              ${resumeData.projects.map(proj => {
                const cleanDesc = proj.desc.replace(/^•\s*/gm, '').replace(/\n•\s*/g, '\n');
                return `
                <div class="project-item">
                  <div class="project-header">
                    <span>${proj.name || 'Project'} ${proj.link ? `(${proj.link})` : ''}</span>
                    <span class="date">${proj.start || ''} — ${proj.end || ''}</span>
                  </div>
                  <div class="description">${cleanDesc.replace(/\n/g, '<br>') || ''}</div>
                </div>
              `}).join('')}
            </div>
          </div>
        `;
      case 'skills':
        if (resumeData.skills.length === 0) return '';
        return `
          <div class="section">
            ${!noTitle ? `<h3 class="section-title">Skills</h3>` : ''}
            <div class="section-content">
              <div class="skills-grid">
                ${resumeData.skills.map(skill => `
                  <div class="skill-item">${skill.name || 'Skill'}</div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      case 'languages':
        if (resumeData.languages.length === 0) return '';
        return `
          <div class="section">
            ${!noTitle ? `<h3 class="section-title">Languages</h3>` : ''}
            <div class="section-content">
              <div class="languages-grid">
                ${resumeData.languages.map(lang => `
                  <div class="language-item">${lang.name || 'Language'}</div>
                `).join('')}
              </div>
            </div>
          </div>
        `;
      default:
        return '';
    }
  };

  const currentLayout = RESUME_LAYOUTS[layoutId];
  const layoutColor = currentLayout.color;

  const renderPreviewSection = (key, noControls = false) => {
    const color = layoutColor;
    const currentIdx = sectionOrder.indexOf(key);

    switch (key) {
      case 'summary':
        return (
          <PreviewSection key={key} title="Professional Summary" color={color} onUp={() => moveSection(currentIdx, 'up')} onDown={() => moveSection(currentIdx, 'down')} noControls={noControls}>
            <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">{resumeData.summary.content.replace(/^•\s*/gm, '').replace(/\n•\s*/g, '\n') || ''}</p>
          </PreviewSection>
        );
      case 'education':
        return (
          <PreviewSection key={key} title="Education" color={color} onUp={() => moveSection(currentIdx, 'up')} onDown={() => moveSection(currentIdx, 'down')} noControls={noControls}>
            {resumeData.education.length > 0 ? resumeData.education.map(e => (
              <div key={e.id} className="mb-3">
                <div className="flex justify-between font-bold"><span>{e.school || 'School'}</span> <span className="text-slate-400 text-[0.75em] uppercase font-medium">{e.start || ''} — {e.end || ''}</span></div>
                <div className="text-slate-600 text-[0.9em] italic">{e.degree || 'Degree'}</div>
              </div>
            )) : <p className="text-slate-400 text-sm italic">No education added yet</p>}
          </PreviewSection>
        );
      case 'work':
        return (
          <PreviewSection key={key} title="Work Experience" color={color} onUp={() => moveSection(currentIdx, 'up')} onDown={() => moveSection(currentIdx, 'down')} noControls={noControls}>
            {resumeData.work.length > 0 ? resumeData.work.map((j, idx) => (
              <div key={j.id} className="mb-4">
                <div className="flex justify-between font-bold text-[1.1em]"><span>{j.company || 'Company'}</span> <span className="text-slate-400 text-[0.75em] uppercase font-medium">{j.start || ''} — {j.end || 'Present'}</span></div>
                <div className="italic mb-1 opacity-90 font-medium" style={{color}}>{j.role || 'Position'}</div>
                <p className="whitespace-pre-wrap text-slate-700 leading-snug text-justify">{j.desc.replace(/^•\s*/gm, '').replace(/\n•\s*/g, '\n') || ''}</p>
              </div>
            )) : <p className="text-slate-400 text-sm italic">No work experience added yet</p>}
          </PreviewSection>
        );
      case 'projects':
        return (
          <PreviewSection key={key} title="Key Projects" color={color} onUp={() => moveSection(currentIdx, 'up')} onDown={() => moveSection(currentIdx, 'down')} noControls={noControls}>
            {resumeData.projects.length > 0 ? resumeData.projects.map(p => (
              <div key={p.id} className="mb-4">
                <div className="flex justify-between font-bold">
                  <div className="flex items-center gap-2">
                    <span>{p.name || 'Project'}</span>
                    {p.link && <span className="text-[0.7em] font-normal text-blue-500 flex items-center gap-0.5 opacity-70"><LinkIcon size={10}/>{p.link}</span>}
                  </div>
                  <span className="text-slate-400 text-[0.75em] uppercase font-medium">{p.start || ''} — {p.end || ''}</span>
                </div>
                <p className="whitespace-pre-wrap text-slate-700 leading-snug mt-1 text-justify">{p.desc.replace(/^•\s*/gm, '').replace(/\n•\s*/g, '\n') || ''}</p>
              </div>
            )) : <p className="text-slate-400 text-sm italic">No projects added yet</p>}
          </PreviewSection>
        );
      case 'skills':
        return (
          <PreviewSection key={key} title="Skills" color={color} onUp={() => moveSection(currentIdx, 'up')} onDown={() => moveSection(currentIdx, 'down')} noControls={noControls}>
            {resumeData.skills.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-10">
                {resumeData.skills.map(s => (
                  <div key={s.id} className="flex items-center mb-1.5 border-b border-slate-50 pb-1">
                    <span className="text-[0.9em] text-slate-700 font-medium">{s.name || 'Skill'}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-400 text-sm italic">No skills added yet</p>}
          </PreviewSection>
        );
      case 'languages':
        return (
          <PreviewSection key={key} title="Languages" color={color} onUp={() => moveSection(currentIdx, 'up')} onDown={() => moveSection(currentIdx, 'down')} noControls={noControls}>
            {resumeData.languages.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-10">
                {resumeData.languages.map(l => (
                  <div key={l.id} className="flex items-center mb-1.5 border-b border-slate-50 pb-1">
                    <span className="text-[0.9em] text-slate-700 font-medium">{l.name || 'Language'}</span>
                  </div>
                ))}
              </div>
            ) : <p className="text-slate-400 text-sm italic">No languages added yet</p>}
          </PreviewSection>
        );
      default: return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-full bg-[#f1f5f9] overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <div className="w-full md:w-[540px] h-auto md:h-full bg-white border-r border-slate-200 flex flex-col z-10 shadow-2xl overflow-y-auto max-h-[50vh] md:max-h-none">
        <div className="p-2 sm:p-3 md:p-4 border-b bg-white flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="bg-blue-600 p-1 sm:p-1.5 rounded-lg flex-shrink-0"><Code size={16} className="sm:w-5 sm:h-5 text-white"/></div>
            <h1 className="text-slate-800 font-black text-sm sm:text-base md:text-xl tracking-tight truncate">ResumeAI<span className="text-blue-600">+</span></h1>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-slate-100 hover:bg-slate-200 rounded-lg sm:rounded-xl transition-all flex items-center gap-1 sm:gap-2 text-slate-700 hover:text-slate-900 font-bold text-xs sm:text-sm shadow-sm hover:shadow-md active:scale-95 flex-shrink-0 min-h-[32px]"
            title="Back to Dashboard"
          >
            <ArrowLeft size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">Back</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 sm:p-3 md:p-5 space-y-3 sm:space-y-4 md:space-y-6 custom-editor-scrollbar bg-slate-50/30">
          
          {/* Theme Selector - Moved to Top */}
          <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-3 block">Choose Layout Style</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(RESUME_LAYOUTS).map(([id, layout]) => (
                <button 
                  key={id}
                  onClick={() => setLayoutId(Number(id))}
                  className={`text-[10px] p-3 rounded-xl border text-left transition-all ${layoutId == id ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-slate-100 hover:bg-slate-50'}`}
                >
                  {id}. {layout.name}
                </button>
              ))}
            </div>
          </div>
          
          <SectionWrapper title="Personal Info" icon={User}>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Full Name" value={resumeData.personal.name} onChange={v => updateSection('personal', 'name', v)} full />
              <Input label="Email" value={resumeData.personal.email} onChange={v => updateSection('personal', 'email', v)} />
              <Input label="Phone" value={resumeData.personal.phone} onChange={v => updateSection('personal', 'phone', v)} />
              <Input label="LinkedIn" value={resumeData.personal.linkedin} onChange={v => updateSection('personal', 'linkedin', v)} />
              <Input label="GitHub" value={resumeData.personal.github} onChange={v => updateSection('personal', 'github', v)} />
            </div>
          </SectionWrapper>

          <SectionWrapper title="Summary" icon={FileText}>
            <Input label="Professional Summary" textarea value={resumeData.summary.content} onChange={v => updateSection('summary', 'content', v)} full />
            <p className="text-xs text-slate-500 mt-2">Note: Summary should be a paragraph, not bullet points</p>
          </SectionWrapper>

          <SectionWrapper title="Education" icon={GraduationCap} onAdd={() => addItem('education')}>
            {resumeData.education.map((edu, idx) => (
              <ItemCard key={edu.id} onDel={() => deleteItem('education', edu.id)}>
                <Input label="Institution" value={edu.school} onChange={v => updateArrayItem('education', edu.id, 'school', v)} full />
                <Input label="Degree" value={edu.degree} onChange={v => updateArrayItem('education', edu.id, 'degree', v)} full />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Start" type="month" value={edu.start} onChange={v => updateArrayItem('education', edu.id, 'start', v)} />
                  <Input label="End" type="month" value={edu.end} onChange={v => updateArrayItem('education', edu.id, 'end', v)} />
                </div>
              </ItemCard>
            ))}
          </SectionWrapper>

          <SectionWrapper title="Work Experience" icon={Briefcase} onAdd={() => addItem('work')}>
            {resumeData.work.map((job, idx) => (
              <ItemCard key={job.id} onDel={() => deleteItem('work', job.id)}>
                <Input label="Company" value={job.company} onChange={v => updateArrayItem('work', job.id, 'company', v)} full />
                <Input label="Position" value={job.role} onChange={v => updateArrayItem('work', job.id, 'role', v)} full />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Start" type="month" value={job.start} onChange={v => updateArrayItem('work', job.id, 'start', v)} />
                  <Input label="End" type="month" value={job.end} onChange={v => updateArrayItem('work', job.id, 'end', v)} />
                </div>
                <Input label="Description" textarea value={job.desc} onChange={v => updateArrayItem('work', job.id, 'desc', v)} onKeyDown={(e) => handleBulletKeyDown(e, 'work', job.id)} full />
              </ItemCard>
            ))}
          </SectionWrapper>

          <SectionWrapper title="Projects" icon={FolderKanban} onAdd={() => addItem('projects')}>
            {resumeData.projects.map((proj, idx) => (
              <ItemCard key={proj.id} onDel={() => deleteItem('projects', proj.id)}>
                <Input label="Project Name" value={proj.name} onChange={v => updateArrayItem('projects', proj.id, 'name', v)} full />
                <Input label="Project Link (Optional)" value={proj.link} onChange={v => updateArrayItem('projects', proj.id, 'link', v)} full />
                <div className="grid grid-cols-2 gap-2">
                  <Input label="Start" type="month" value={proj.start} onChange={v => updateArrayItem('projects', proj.id, 'start', v)} />
                  <Input label="End" type="month" value={proj.end} onChange={v => updateArrayItem('projects', proj.id, 'end', v)} />
                </div>
                <Input label="Description" textarea value={proj.desc} onChange={v => updateArrayItem('projects', proj.id, 'desc', v)} onKeyDown={(e) => handleBulletKeyDown(e, 'projects', proj.id)} full />
              </ItemCard>
            ))}
          </SectionWrapper>

          <SectionWrapper title="Skills" icon={Settings} onAdd={() => addItem('skills')}>
             <div className="space-y-3">
                {resumeData.skills.map(s => (
                  <div key={s.id} className="flex items-center gap-2 bg-white p-3 border rounded-xl shadow-sm">
                    <input className="flex-1 text-xs outline-none px-2 font-medium" value={s.name} onChange={e => updateArrayItem('skills', s.id, 'name', e.target.value)} placeholder="Skill name" />
                    <button onClick={() => deleteItem('skills', s.id)} className="text-red-400 p-1 hover:bg-red-50 rounded transition-colors"><Trash2 size={14}/></button>
                  </div>
                ))}
             </div>
          </SectionWrapper>

          <SectionWrapper title="Languages" icon={Languages} onAdd={() => addItem('languages')}>
             <div className="space-y-3">
                {resumeData.languages.map(l => (
                  <div key={l.id} className="flex items-center gap-2 bg-white p-3 border rounded-xl shadow-sm">
                    <input className="flex-1 text-xs outline-none px-2 font-medium" value={l.name} onChange={e => updateArrayItem('languages', l.id, 'name', e.target.value)} placeholder="Language name" />
                    <button onClick={() => deleteItem('languages', l.id)} className="text-red-400 p-1 hover:bg-red-50 rounded transition-colors"><Trash2 size={14}/></button>
                  </div>
                ))}
             </div>
          </SectionWrapper>

          <div className="p-6 bg-slate-900 rounded-[2rem] text-white space-y-6 shadow-xl">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2"><Palette size={14}/> Design Panel</h2>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-[9px] uppercase text-slate-400 block mb-2 font-bold">Font Style</label>
                    <select className="w-full bg-slate-800 p-2 rounded-lg text-xs outline-none" value={resumeData.settings.fontFamily} onChange={e => updateSection('settings', 'fontFamily', e.target.value)}>
                        <option value="Georgia, serif">Georgia (Serif)</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
                        <option value="'Playfair Display', serif">Playfair Display</option>
                        <option value="'Merriweather', serif">Merriweather</option>
                        <option value="'Inter', sans-serif">Inter (Sans)</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                        <option value="'Open Sans', sans-serif">Open Sans</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                        <option value="'Montserrat', sans-serif">Montserrat</option>
                        <option value="'Lato', sans-serif">Lato</option>
                        <option value="'Courier New', monospace">Courier New (Mono)</option>
                        <option value="'Fira Code', monospace">Fira Code</option>
                    </select>
                </div>
                <div>
                    <label className="text-[9px] uppercase text-slate-400 block mb-2 font-bold">Font Size</label>
                    <div className="flex items-center gap-2">
                      <input type="range" min="8" max="14" step="0.5" value={resumeData.settings.fontSize} onChange={e => updateSection('settings', 'fontSize', parseFloat(e.target.value))} className="flex-1 accent-blue-500" />
                      <span className="text-[10px] w-8 text-right">{resumeData.settings.fontSize}pt</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW */}
      <div className="flex-1 overflow-hidden flex flex-col relative min-h-[50vh]">
        <div className="flex-1 overflow-auto p-4 md:p-12 flex justify-center custom-preview-scrollbar">
          <div ref={resumeRef} className="bg-white shadow-2xl origin-top transition-all" data-resume-content
            style={{ 
              width: '210mm', 
              minHeight: '297mm', 
              maxHeight: '297mm',
              padding: '15mm 20mm', 
              transform: `scale(${zoom/100})`,
              fontFamily: resumeData.settings.fontFamily, 
              fontSize: `${resumeData.settings.fontSize}pt`,
              overflow: 'hidden',
              boxSizing: 'border-box'
            }}>
            
            {/* HEADER AREA */}
            <header className={`${currentLayout.align} mb-8`} style={{ 
              borderBottom: currentLayout.structure === 'top-down' && currentLayout.border !== 'none' ? `3px solid ${currentLayout.color}` : 'none',
              borderTop: currentLayout.border.includes('border-y') || currentLayout.border.includes('border-t') ? `3px solid ${currentLayout.color}` : 'none',
              borderColor: currentLayout.color,
              paddingBottom: currentLayout.border !== 'none' ? '1.5rem' : '0',
              paddingTop: currentLayout.border.includes('border-y') || currentLayout.border.includes('border-t') ? '1.5rem' : '0',
              marginBottom: currentLayout.border.includes('border-b-8') ? '2rem' : '2rem'
            }}>
              <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">{resumeData.personal.name || 'YOUR NAME'}</h1>
              <div className={`flex flex-wrap ${currentLayout.align === 'text-center' ? 'justify-center' : currentLayout.align === 'text-right' ? 'justify-end' : 'justify-start'} gap-x-5 gap-y-2 text-[9px] font-bold text-slate-500 mt-4 uppercase tracking-wider`}>
                {resumeData.personal.email && <span className="flex items-center gap-1.5"><Mail size={12} style={{color: currentLayout.color}}/> {resumeData.personal.email}</span>}
                {resumeData.personal.phone && <span className="flex items-center gap-1.5"><Phone size={12} style={{color: currentLayout.color}}/> {resumeData.personal.phone}</span>}
                {resumeData.personal.linkedin && <span className="flex items-center gap-1.5"><Linkedin size={12} style={{color: currentLayout.color}}/> {resumeData.personal.linkedin}</span>}
                {resumeData.personal.github && <span className="flex items-center gap-1.5"><Github size={12} style={{color: currentLayout.color}}/> {resumeData.personal.github}</span>}
              </div>
            </header>

            {/* Layout Engine */}
            <div className={`
              ${currentLayout.structure === 'sidebar-left' ? 'flex gap-8' : ''}
              ${currentLayout.structure === 'sidebar-right' ? 'flex flex-row-reverse gap-8' : ''}
              ${currentLayout.structure === 'grid-2col' ? 'grid grid-cols-2 gap-8' : 'block'}
            `}>
              
              {/* Primary Column */}
              <div className={`
                ${currentLayout.structure.includes('sidebar') ? 'w-1/3' : 'w-full'}
              `}>
                {currentLayout.structure.includes('sidebar') 
                  ? sectionOrder.filter(k => ['summary', 'skills', 'languages'].includes(k)).map(k => renderPreviewSection(k, true))
                  : sectionOrder.map(k => renderPreviewSection(k, true))
                }
              </div>

              {/* Secondary Column (Only for Sidebar/Grid layouts) */}
              {currentLayout.structure !== 'top-down' && (
                <div className={`
                  ${currentLayout.structure.includes('sidebar') ? 'w-2/3' : 'w-full'}
                `}>
                  {currentLayout.structure.includes('sidebar')
                    ? sectionOrder.filter(k => ['education', 'work', 'projects'].includes(k)).map(k => renderPreviewSection(k, true))
                    : null // Grid handled by parent grid
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-auto md:h-16 bg-white border-t flex flex-col md:flex-row items-center justify-between p-4 md:px-10 gap-4 md:gap-0">
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
             <Search size={14} className="text-slate-400 md:w-4 md:h-4"/>
             <input type="range" min="30" max="100" value={zoom} onChange={e => setZoom(e.target.value)} className="flex-1 md:w-40 accent-blue-600" />
             <span className="text-[10px] font-black text-slate-500">{zoom}%</span>
          </div>
          <button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full md:w-auto bg-blue-600 text-white px-6 md:px-10 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">GENERATING...</span>
                <span className="sm:hidden">GEN...</span>
              </>
            ) : (
              <>
                <Download size={16} className="md:w-[18px] md:h-[18px]"/> 
                <span className="hidden sm:inline">EXPORT PDF</span>
                <span className="sm:hidden">EXPORT</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Name Modal */}
      {showPDFNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={() => setShowPDFNameModal(false)}>
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Name Your Resume</h3>
            <p className="text-sm text-slate-600 mb-6">Enter a name for your PDF file. The resume will be saved to your dashboard.</p>
            <input
              type="text"
              value={pdfName}
              onChange={(e) => setPdfName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmDownload();
                } else if (e.key === 'Escape') {
                  setShowPDFNameModal(false);
                }
              }}
              placeholder="e.g., John_Doe_Resume"
              className="w-full p-4 border-2 border-slate-200 rounded-xl text-base outline-none focus:border-blue-500 transition-all mb-6 font-medium"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowPDFNameModal(false)}
                className="flex-1 px-6 py-3 border-2 border-slate-200 rounded-xl font-black text-slate-700 hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDownload}
                disabled={isDownloading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  'Download PDF'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      <div className={`fixed bottom-8 right-8 z-[2000] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'} ${toast.type === 'success' ? 'bg-white border-green-100 text-green-600' : 'bg-white border-red-100 text-red-600'}`}>
        {toast.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
        <span className="font-black text-sm uppercase tracking-tight">{toast.message}</span>
      </div>
    </div>
  );
};

// --- Helpers ---
const SectionWrapper = ({ title, icon: Icon, children, onAdd }) => (
  <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
    <div className="flex justify-between items-center mb-5">
      <h3 className="flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.1em] text-slate-800">
        <Icon size={18} className="text-blue-600" /> {title}
      </h3>
      {onAdd && <button onClick={onAdd} className="text-blue-600 text-[10px] font-black hover:bg-blue-50 px-3 py-1.5 rounded-full border border-blue-50 transition-all">+ ADD</button>}
    </div>
    {children}
  </div>
);

const ItemCard = ({ children, onUp, onDown, onDel }) => (
  <div className="mb-5 p-5 rounded-2xl border bg-slate-50/50 group relative border-slate-100 transition-all">
    <div className="absolute -right-3 top-2 opacity-0 group-hover:opacity-100 transition-all bg-white shadow-xl border rounded-lg p-1 z-10">
      <button onClick={onDel} className="p-2 hover:bg-red-50 text-red-500 rounded transition-colors" title="Delete">
        <Trash2 size={16}/>
      </button>
    </div>
    {children}
  </div>
);

const Input = ({ label, value, onChange, textarea, full, onKeyDown, type = "text" }) => (
  <div className={`${full ? 'col-span-2' : ''} mb-4`}>
    <label className="text-[9px] font-black text-slate-400 uppercase mb-1 block ml-2 tracking-widest">{label}</label>
    {textarea ? (
      <textarea className="w-full p-3 border rounded-xl text-xs outline-none focus:border-blue-500 h-28 resize-none transition-all" value={value} onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown} />
    ) : (
      <input type={type} className="w-full p-3 border rounded-xl text-xs outline-none focus:border-blue-500 transition-all" value={value} onChange={e => onChange(e.target.value)} />
    )}
  </div>
);

const PreviewSection = ({ title, color, children, onUp, onDown, noControls }) => (
  <div className="group/section relative">
    {!noControls && (
      <div className="absolute -left-10 top-0 flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-opacity no-print">
        <button onClick={onUp} className="p-1 bg-white border rounded shadow-sm hover:bg-slate-50 text-slate-400 hover:text-blue-600"><ChevronUp size={12}/></button>
        <button onClick={onDown} className="p-1 bg-white border rounded shadow-sm hover:bg-slate-50 text-slate-400 hover:text-blue-600"><ChevronDown size={12}/></button>
      </div>
    )}
    <div className="flex items-center gap-4 mb-3">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color }}>{title}</h4>
      <div className="h-[1px] w-full bg-slate-100" />
    </div>
    <div className="pl-2">{children}</div>
  </div>
);

export default ResumeEditor;