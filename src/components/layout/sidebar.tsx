
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { TableOfContentsType, SectionType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';

interface SectionItemProps {
    section: SectionType;
    activeSection?: SectionType;
    onSectionSelect: (section: SectionType) => void;
    searchTerm: string;
    isInitiallyOpen: boolean;
}

const SectionItem: React.FC<SectionItemProps> = ({ section, activeSection, onSectionSelect, searchTerm, isInitiallyOpen }) => {
    const hasSubsections = section.subsections && section.subsections.length > 0;
    
    const isSelected = activeSection?.id === section.id;
    const isParentOfSelected = activeSection?.id.startsWith(section.id + '.');

    const filterSubsections = (subsections: SectionType[]): SectionType[] => {
        if (!searchTerm) return subsections;
        return subsections.map(sub => {
            const newSub = { ...sub };
            if (newSub.subsections) {
                newSub.subsections = filterSubsections(newSub.subsections);
            }
            const titleMatch = newSub.title.toLowerCase().includes(searchTerm.toLowerCase());
            const idMatch = newSub.id.toLowerCase().includes(searchTerm.toLowerCase());
            const hasMatchingChildren = newSub.subsections && newSub.subsections.length > 0;

            if (titleMatch || idMatch || hasMatchingChildren) {
                return newSub;
            }
            return null;
        }).filter((s): s is SectionType => s !== null);
    };

    const subsectionsToShow = hasSubsections ? filterSubsections(section.subsections!) : [];
    
    const sectionTitleMatches = section.title.toLowerCase().includes(searchTerm.toLowerCase()) || section.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (searchTerm && !sectionTitleMatches && subsectionsToShow.length === 0) {
        return null;
    }

    if (hasSubsections) {
        return (
            <Accordion type="single" collapsible className="w-full" defaultValue={ (isParentOfSelected || isInitiallyOpen) ? section.id : undefined }>
                <AccordionItem value={section.id} className="border-none">
                    <AccordionTrigger
                        className={cn(
                            "p-2 hover:no-underline rounded-sm my-0.5 justify-start gap-2 text-sm",
                            isSelected ? 'bg-primary/20 text-primary font-semibold' : '',
                            isParentOfSelected ? 'text-white' : 'text-gray-400',
                            "hover:bg-sidebar-accent hover:text-white"
                        )}
                        >
                        <span className="flex-grow text-left" onClick={(e) => { e.stopPropagation(); onSectionSelect(section); }}>
                            {section.id} - {section.title}
                        </span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-0 pl-4 border-l-2 border-primary/50 ml-3">
                        {subsectionsToShow.map(subSection => (
                            <SectionItem
                                key={subSection.id}
                                section={subSection}
                                activeSection={activeSection}
                                onSectionSelect={onSectionSelect}
                                searchTerm={searchTerm}
                                isInitiallyOpen={isInitiallyOpen}
                            />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    }
    
    return (
        <a
            href="#"
            onClick={(e) => { e.preventDefault(); onSectionSelect(section); }}
            className={cn(
                "block p-2 pl-2 text-sm rounded-sm my-0.5",
                isSelected ? 'bg-primary/20 text-primary font-semibold' : 'text-gray-400',
                "hover:bg-sidebar-accent hover:text-white"
            )}
            aria-current={isSelected ? "page" : undefined}
        >
            {section.id} - {section.title}
        </a>
    );
};

interface SidebarProps {
    toc: TableOfContentsType;
    activeSection?: SectionType;
    onSectionSelect: (section: SectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toc, activeSection, onSectionSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    
    const filterSections = (sections: SectionType[]): SectionType[] => {
        if (!searchTerm) return sections;
        return sections.map(section => {
            const newSection = { ...section };
            if (newSection.subsections) {
                newSection.subsections = filterSections(newSection.subsections);
            }
            const titleMatch = newSection.title.toLowerCase().includes(searchTerm.toLowerCase());
            const idMatch = newSection.id.toLowerCase().includes(searchTerm.toLowerCase());
            const hasMatchingChildren = newSection.subsections && newSection.subsections.length > 0;

            if (titleMatch || idMatch || hasMatchingChildren) {
                return newSection;
            }
            return null;
        }).filter((s): s is SectionType => s !== null);
    };

    const filteredToc = useMemo(() => {
        if (!searchTerm) return toc;
        return toc.map(chapter => {
            const chapterMatch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) || chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase());
            const filteredSections = filterSections(chapter.sections);
            if (chapterMatch || filteredSections.length > 0) {
                return { ...chapter, sections: filteredSections };
            }
            return null;
        }).filter((c): c is NonNullable<typeof c> => c !== null);
    }, [toc, searchTerm]);

    useEffect(() => {
        if (searchTerm) {
            setExpandedChapters(filteredToc.map(c => c.chapter));
        } else if (activeSection) {
            const chapterNumber = activeSection.id.split('.')[0];
            if (!expandedChapters.includes(chapterNumber)) {
                 setExpandedChapters(prev => [...prev, chapterNumber]);
            }
        }
    }, [activeSection, searchTerm, filteredToc]);

    useEffect(() => {
        if (toc.length > 0 && !searchTerm) {
             const chapterNumber = activeSection ? activeSection.id.split('.')[0] : toc[0].chapter;
             setExpandedChapters([chapterNumber]);
        }
    }, [toc, activeSection]);

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
                <Accordion 
                    type="multiple" 
                    className="w-full p-2"
                    value={expandedChapters}
                    onValueChange={setExpandedChapters}
                >
                    {filteredToc.map(chapter => (
                        <AccordionItem value={chapter.chapter} key={chapter.chapter} className="border-b border-sidebar-border last:border-b-0">
                            <AccordionTrigger className="p-3 text-left text-base font-semibold hover:bg-sidebar-accent/80 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-md data-[state=open]:text-white">
                                <span className="flex-1 text-sidebar-foreground data-[state=open]:text-white">
                                    Cap. {chapter.chapter}: {chapter.title}
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-1 pb-2 pl-4 border-l-2 border-primary ml-3">
                                {chapter.sections.map(section => (
                                    <SectionItem 
                                        key={section.id}
                                        section={section}
                                        activeSection={activeSection}
                                        onSectionSelect={onSectionSelect}
                                        searchTerm={searchTerm}
                                        isInitiallyOpen={!!searchTerm}
                                    />
                                ))}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </ScrollArea>
        </aside>
    );
};

export default Sidebar;
