
import React from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  color?: string;
  sections?: { title: string; content: React.ReactNode }[];
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({
  title,
  subtitle,
  description,
  imageUrl,
  color,
  sections,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        
        {/* Header Image or Color Banner */}
        <div className="h-40 w-full relative shrink-0">
             {imageUrl ? (
                 <div className="w-full h-full relative">
                     {/* Stronger gradient for text readability */}
                     <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
                     <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                 </div>
             ) : (
                 <div 
                    className="w-full h-full relative"
                    style={{ backgroundColor: color || '#374151' }}
                 >
                     <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
                 </div>
             )}
             <button 
                onClick={onClose} 
                className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full transition-colors backdrop-blur-md"
             >
                 <X size={24} />
             </button>
        </div>

        {/* Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar -mt-16 relative z-20 space-y-8">
             {/* Main Header */}
             <div>
                 <h2 className="text-3xl font-bold text-white leading-tight mb-1 drop-shadow-lg">{title}</h2>
                 {subtitle && <div className="text-amber-400 font-mono text-base font-medium drop-shadow-md">{subtitle}</div>}
             </div>
             
             {/* Description */}
             <div className="bg-gray-800 border border-gray-700 p-5 rounded-lg text-gray-300 text-base leading-relaxed whitespace-pre-wrap shadow-sm">
                 {description || <span className="italic text-gray-500">No description available.</span>}
             </div>

             {/* Dynamic Sections (Family, Titles, etc.) */}
             {sections && sections.length > 0 && (
                 <div className="space-y-6">
                    {sections.map((section, idx) => (
                        <div key={idx} className="border-t border-gray-800 pt-4">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                {section.title}
                            </h3>
                            <div className="text-sm text-gray-300">
                                {section.content}
                            </div>
                        </div>
                    ))}
                 </div>
             )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-950 border-t border-gray-800 flex justify-end shrink-0">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-medium transition-colors border border-gray-700"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
