"use client";

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { TableOfContentsType, SectionType } from '@/lib/types';
import AccordionSection from './accordion-section';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
    toc: TableOfContentsType;
    activeSection?: SectionType;
    onSectionSelect: (section: SectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toc, activeSection, onSectionSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Expand chapter of active section or default to first chapter if no search term
        if (activeSection) {
            const chapterNumber = activeSection.id.split('.')[0];
            setExpandedChapters(prev => ({ ...prev, [chapterNumber]: true }));
        } else if (!searchTerm && toc.length > 0) {
            setExpandedChapters({ [toc[0].chapter]: true });
        }
    }, [activeSection, searchTerm, toc]);

    const toggleChapter = (chapterNum: string) => {
        setExpandedChapters(prev => ({ ...prev, [chapterNum]: !prev[chapterNum] }));
    };
    
    const filteredToc = toc.filter(chapter => {
        const chapterMatch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase());
        const sectionMatch = chapter.sections.some(section => 
                                section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                section.id.toLowerCase().includes(searchTerm.toLowerCase()));
        return chapterMatch || sectionMatch;
    });

    return (
        <aside className="w-full md:w-80 lg:w-96 bg-sidebar text-sidebar-foreground flex flex-col h-full shadow-lg">
            <div className="p-4 space-y-4 border-b border-sidebar-border">
                <h1 className="text-2xl font-bold text-center text-white">Señales y Sistemas</h1>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="Buscar tema..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-700 border-gray-600 rounded-md py-2 pl-10 pr-4 text-white focus-visible:ring-primary"
                        aria-label="Buscar en el contenido"
                    />
                </div>
            </div>
            <ScrollArea className="flex-grow">
                <nav className="py-2">
                    {filteredToc.map(chapter => (
                        <AccordionSection
                            key={chapter.chapter}
                            chapter={chapter}
                            activeSectionId={activeSection?.id}
                            onSectionSelect={onSectionSelect}
                            searchTerm={searchTerm}
                            expandedChapters={expandedChapters}
                            toggleChapter={toggleChapter}
                        />
                    ))}
                </nav>
            </ScrollArea>
        </aside>
    );
};

export default Sidebar;
