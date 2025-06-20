
"use client";

import React, { useState, useEffect, useRef } from 'react';
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

interface SidebarProps {
    toc: TableOfContentsType;
    activeSection?: SectionType;
    onSectionSelect: (section: SectionType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toc, activeSection, onSectionSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
    const isInitialLoad = useRef(true);

    // Set initial expanded chapter on first load
    useEffect(() => {
        if (isInitialLoad.current && toc.length > 0) {
            setExpandedChapters([toc[0].chapter]);
            isInitialLoad.current = false;
        }
    }, [toc]);

    // Handle search term changes to expand relevant chapters
    useEffect(() => {
        if (searchTerm) {
            const chaptersWithMatches = toc
                .filter(chapter => {
                    const chapterMatch = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                         chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase());
                    const sectionMatch = chapter.sections.some(section => 
                                            section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            section.id.toLowerCase().includes(searchTerm.toLowerCase()));
                    return chapterMatch || sectionMatch;
                })
                .map(chapter => chapter.chapter);
            setExpandedChapters(chaptersWithMatches);
        }
    }, [searchTerm, toc]);

    // Handle active section changes to expand its chapter
    useEffect(() => {
        if (activeSection) {
            const chapterNumber = activeSection.id.split('.')[0];
            setExpandedChapters(prev => {
                if (prev.includes(chapterNumber)) {
                    return prev;
                }
                return [...prev, chapterNumber];
            });
        }
    }, [activeSection]);
    
    const filteredToc = toc.filter(chapter => {
        if (!searchTerm) return true;
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
                <Accordion 
                    type="multiple" 
                    className="w-full p-2"
                    value={expandedChapters}
                    onValueChange={setExpandedChapters}
                >
                    {filteredToc.map(chapter => {
                        const chapterTitleMatches = chapter.title.toLowerCase().includes(searchTerm.toLowerCase()) || chapter.chapter.toLowerCase().includes(searchTerm.toLowerCase());

                        const sectionsToShow = (searchTerm && !chapterTitleMatches)
                            ? chapter.sections.filter(section => 
                                section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                section.id.toLowerCase().includes(searchTerm.toLowerCase())
                              )
                            : chapter.sections;

                        return (
                            <AccordionItem value={chapter.chapter} key={chapter.chapter} className="border-b border-sidebar-border last:border-b-0">
                                <AccordionTrigger className="p-3 text-left text-base font-semibold hover:bg-sidebar-accent/80 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring rounded-md data-[state=open]:text-white">
                                    <span className="flex-1 text-sidebar-foreground data-[state=open]:text-white">
                                        Cap. {chapter.chapter}: {chapter.title}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-1 pb-2 pl-4 border-l-2 border-primary ml-3">
                                    {sectionsToShow.map(section => (
                                        <a
                                            key={section.id}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onSectionSelect(section);
                                            }}
                                            className={cn(
                                                "block p-2 pl-4 text-sm text-gray-400 hover:bg-sidebar-accent hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-sidebar-ring rounded-sm my-0.5",
                                                activeSection?.id === section.id ? 'bg-primary/20 text-primary font-semibold' : ''
                                            )}
                                            aria-current={activeSection?.id === section.id ? "page" : undefined}
                                        >
                                            {section.id} - {section.title}
                                        </a>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            </ScrollArea>
        </aside>
    );
};

export default Sidebar;
