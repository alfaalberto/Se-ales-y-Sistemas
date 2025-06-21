"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, PlusCircle, Pencil } from 'lucide-react';
import type { TableOfContentsType, SectionType, ChapterType } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  AccordionHeader,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface SectionItemProps {
    section: SectionType;
    activeSection?: SectionType;
    onSectionSelect: (section: SectionType) => void;
    searchTerm: string;
    isInitiallyOpen: boolean;
    onAddSubsection: (sectionId: string) => void;
    onRenameSection: (sectionId: string, currentTitle: string) => void;
}

const SectionItem: React.FC<SectionItemProps> = ({ 
    section, 
    activeSection, 
    onSectionSelect, 
    searchTerm, 
    isInitiallyOpen,
    onAddSubsection,
    onRenameSection
}) => {
    const hasSubsections = section.subsections && section.subsections.length > 0;
    
    const isSelected = activeSection?.id === section.id;
    const isParentOfSelected = hasSubsections && activeSection ? activeSection.id.startsWith(section.id + '.') : false;

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

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    if (hasSubsections) {
        return (
            <Accordion type="single" collapsible className="w-full" defaultValue={ (isSelected || isParentOfSelected || isInitiallyOpen) ? section.id : undefined }>
                <AccordionItem value={section.id} className="border-none group">
                     <AccordionHeader className={cn(
                        "flex w-full items-center p-2 rounded-sm my-0.5 text-sm hover:bg-sidebar-accent hover:text-white",
                        isParentOfSelected ? 'text-white' : 'text-gray-400',
                     )}>
                        <AccordionTrigger
                            className={cn(
                                "p-0 hover:no-underline justify-start gap-2 flex-1 text-left",
                                isSelected ? 'text-primary font-semibold' : '',
                            )}
                            >
                            <span onClick={(e) => { e.stopPropagation(); onSectionSelect(section); }}>
                                {section.id} - {section.title}
                            </span>
                        </AccordionTrigger>
                        
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                            <TooltipProvider delayDuration={100}>
                                <Tooltip>
                                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleActionClick(e, () => onAddSubsection(section.id))}><PlusCircle size={14}/></Button></TooltipTrigger>
                                    <TooltipContent side="right"><p>Añadir Subsección</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleActionClick(e, () => onRenameSection(section.id, section.title))}><Pencil size={14}/></Button></TooltipTrigger>
                                    <TooltipContent side="right"><p>Renombrar</p></TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </AccordionHeader>
                    <AccordionContent className="pt-1 pb-0 pl-4 border-l-2 border-primary/50 ml-3">
                        {subsectionsToShow.map(subSection => (
                            <SectionItem
                                key={subSection.id}
                                section={subSection}
                                activeSection={activeSection}
                                onSectionSelect={onSectionSelect}
                                searchTerm={searchTerm}
                                isInitiallyOpen={isInitiallyOpen}
                                onAddSubsection={onAddSubsection}
                                onRenameSection={onRenameSection}
                            />
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    }
    
    return (
         <div className="group relative pr-2">
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); onSectionSelect(section); }}
                className={cn(
                    "block p-2 pl-2 text-sm rounded-sm my-0.5 w-full",
                    isSelected ? 'bg-primary/20 text-primary font-semibold' : 'text-gray-400',
                    "hover:bg-sidebar-accent hover:text-white"
                )}
                aria-current={isSelected ? "page" : undefined}
            >
                {section.id} - {section.title}
            </a>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                         <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleActionClick(e, () => onAddSubsection(section.id))}><PlusCircle size={14}/></Button></TooltipTrigger>
                         <TooltipContent side="right"><p>Añadir Subsección</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleActionClick(e, () => onRenameSection(section.id, section.title))}><Pencil size={14}/></Button></TooltipTrigger>
                        <TooltipContent side="right"><p>Renombrar</p></TooltipContent>
                    </Tooltip>
                 </TooltipProvider>
            </div>
        </div>
    );
};

interface SidebarProps {
    toc: TableOfContentsType;
    activeSection?: SectionType;
    onSectionSelect: (section: SectionType) => void;
    onAddSection: (chapterNum: string) => void;
    onAddSubsection: (sectionId: string) => void;
    onRenameChapter: (chapterNum: string, currentTitle: string) => void;
    onRenameSection: (sectionId: string, currentTitle: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
    toc, 
    activeSection, 
    onSectionSelect,
    onAddSection,
    onAddSubsection,
    onRenameChapter,
    onRenameSection
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    
    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }
    
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
        } else {
            let chapterToExpand: string | undefined;
            if (activeSection) {
                chapterToExpand = activeSection.id.split('.')[0];
            } else if (toc.length > 0) {
                chapterToExpand = toc[0].chapter;
            }
            
            if (chapterToExpand) {
                setExpandedChapters([chapterToExpand]);
            } else {
                setExpandedChapters([]);
            }
        }
    }, [searchTerm, activeSection, toc, filteredToc]);

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
                        <AccordionItem value={chapter.chapter} key={chapter.chapter} className="border-b border-sidebar-border last:border-b-0 group">
                           <AccordionHeader className="flex w-full items-center p-3 text-left text-base font-semibold hover:bg-sidebar-accent/80 hover:no-underline focus-within:ring-2 focus-within:ring-sidebar-ring rounded-md data-[state=open]:text-white">
                                <AccordionTrigger className="p-0 flex-1 hover:no-underline focus:outline-none">
                                    <span className="flex-1 text-sidebar-foreground data-[state=open]:text-white">
                                        Cap. {chapter.chapter}: {chapter.title}
                                    </span>
                                </AccordionTrigger>
                                <div className="pl-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                    <TooltipProvider delayDuration={100}>
                                        <Tooltip>
                                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleActionClick(e, () => onAddSection(chapter.chapter))}><PlusCircle size={14}/></Button></TooltipTrigger>
                                            <TooltipContent side="right"><p>Añadir Sección</p></TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleActionClick(e, () => onRenameChapter(chapter.chapter, chapter.title))}><Pencil size={14}/></Button></TooltipTrigger>
                                            <TooltipContent side="right"><p>Renombrar Capítulo</p></TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </AccordionHeader>
                            <AccordionContent className="pt-1 pb-2 pl-4 border-l-2 border-primary ml-3">
                                {chapter.sections.map(section => (
                                    <SectionItem 
                                        key={section.id}
                                        section={section}
                                        activeSection={activeSection}
                                        onSectionSelect={onSectionSelect}
                                        searchTerm={searchTerm}
                                        isInitiallyOpen={!!searchTerm}
                                        onAddSubsection={onAddSubsection}
                                        onRenameSection={onRenameSection}
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
