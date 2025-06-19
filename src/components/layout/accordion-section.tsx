"use client";

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ChapterType, SectionType } from '@/lib/types';
import { cn } from '@/lib/utils';

interface AccordionSectionProps {
    chapter: ChapterType;
    activeSectionId?: string;
    onSectionSelect: (section: SectionType) => void;
    searchTerm: string;
    expandedChapters: Record<string, boolean>;
    toggleChapter: (chapterNum: string) => void;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
    chapter,
    activeSectionId,
    onSectionSelect,
    searchTerm,
    expandedChapters,
    toggleChapter
}) => {
    const isExpanded = expandedChapters[chapter.chapter];

    const filteredSections = chapter.sections.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const chapterTitleMatches = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                chapter.chapter.includes(searchTerm);

    // If searching and chapter title doesn't match, and no sections match, hide the chapter
    if (searchTerm && filteredSections.length === 0 && !chapterTitleMatches) {
        return null;
    }
    
    const sectionsToShow = searchTerm && !chapterTitleMatches && filteredSections.length > 0 ? filteredSections : chapter.sections;


    return (
        <div className="border-b border-sidebar-border">
            <button
                onClick={() => toggleChapter(chapter.chapter)}
                className="w-full flex justify-between items-center p-3 text-left text-lg font-semibold hover:bg-sidebar-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-sm"
                aria-expanded={isExpanded}
                aria-controls={`chapter-content-${chapter.chapter}`}
            >
                <span className="flex-1 text-sidebar-foreground">
                    Cap. {chapter.chapter}: {chapter.title}
                </span>
                {isExpanded ? <ChevronDown size={20} className="text-sidebar-foreground" /> : <ChevronRight size={20} className="text-sidebar-foreground" />}
            </button>
            {isExpanded && (
                <div id={`chapter-content-${chapter.chapter}`} className="pl-4 border-l-2 border-primary ml-3">
                    {sectionsToShow.map(section => (
                        <a
                            key={section.id}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onSectionSelect(section);
                            }}
                            className={cn(
                                "block p-3 pl-4 text-sm text-gray-400 hover:bg-sidebar-accent hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring rounded-sm",
                                activeSectionId === section.id ? 'bg-primary/20 text-primary font-semibold' : ''
                            )}
                            aria-current={activeSectionId === section.id ? "page" : undefined}
                        >
                            {section.id} - {section.title}
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AccordionSection;
