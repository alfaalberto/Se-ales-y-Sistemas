"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, X } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import ContentView from '@/components/content/content-view';
import HtmlAddModal from '@/components/modals/html-add-modal';
import { initialTableOfContents } from '@/lib/data';
import type { TableOfContentsType, SectionType, ContentBlockType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";

export default function SignalVisorPage() {
    const [toc, setToc] = useState<TableOfContentsType>(initialTableOfContents);
    const [activeSection, setActiveSection] = useState<SectionType | undefined>(undefined);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const flatSections = useMemo(() => toc.flatMap(c => c.sections), [toc]);

    useEffect(() => {
        // Set sidebar visibility based on screen size on initial mount
        if (typeof window !== 'undefined') {
            setIsSidebarVisible(window.innerWidth >= 768);
        }
    }, []);

    useEffect(() => {
        // Set initial active section if not already set
        if (flatSections.length > 0 && !activeSection) {
            setActiveSection(flatSections[0]);
        }
    }, [flatSections, activeSection]);

    const handleSectionSelect = (section: SectionType) => {
        setActiveSection(section);
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarVisible(false);
        }
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        if (!activeSection) return;
        const currentIndex = flatSections.findIndex(s => s.id === activeSection.id);
        let newIndex = -1;
        if (direction === 'prev' && currentIndex > 0) {
            newIndex = currentIndex - 1;
        } else if (direction === 'next' && currentIndex < flatSections.length - 1) {
            newIndex = currentIndex + 1;
        }

        if (newIndex !== -1) {
           const newSection = flatSections[newIndex];
           setActiveSection(newSection);
           // Ensure the chapter of the new section is expanded
           const chapterNumber = newSection.id.split('.')[0];
           // This logic might be better inside Sidebar or via a callback to expand chapter
        }
    };

    const handleAddHtmlToSection = (htmlContent: string) => {
        if (!activeSection || !htmlContent) return;

        const newBlock: ContentBlockType = { id: crypto.randomUUID(), html: htmlContent };
        
        setToc(currentToc => {
            return currentToc.map(chapter => ({
                ...chapter,
                sections: chapter.sections.map(section => {
                    if (section.id === activeSection.id) {
                        const updatedContent = [...section.content, newBlock];
                        // Also update activeSection immediately to reflect the change
                        setActiveSection(prevActiveSection => prevActiveSection ? { ...prevActiveSection, content: updatedContent } : undefined);
                        return { ...section, content: updatedContent };
                    }
                    return section;
                })
            }));
        });
        toast({
            title: "Contenido Añadido",
            description: "El bloque HTML ha sido añadido a la sección actual.",
        });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || isModalOpen) return;
            if (e.key === 'ArrowLeft') handleNavigate('prev');
            if (e.key === 'ArrowRight') handleNavigate('next');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeSection, flatSections, isModalOpen, handleNavigate]); // Added handleNavigate to dependencies

    return (
        <div className="bg-background text-foreground h-screen w-screen flex antialiased font-body overflow-hidden">
            <HtmlAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddHtmlToSection} />

            {isSidebarVisible && (
                <div
                    onClick={() => setIsSidebarVisible(false)}
                    className="fixed inset-0 bg-black/60 z-20 md:hidden"
                    aria-hidden="true"
                />
            )}

            <Button
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="md:hidden fixed top-4 left-4 z-40 p-2 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent rounded-md shadow-lg"
                aria-label={isSidebarVisible ? "Cerrar menú" : "Abrir menú"}
                variant="ghost"
                size="icon"
            >
                {isSidebarVisible ? <X size={24} /> : <ChevronRight size={24} />}
            </Button>

            <div
                className={`fixed md:relative z-30 h-full transition-transform duration-300 ease-in-out transform ${
                    isSidebarVisible ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0`}
            >
                <Sidebar toc={toc} activeSection={activeSection} onSectionSelect={handleSectionSelect} />
            </div>

            <div className="flex-1 flex flex-col min-w-0"> {/* min-w-0 is important for flex children to shrink properly */}
                <ContentView
                    section={activeSection}
                    onNavigate={handleNavigate}
                    flatSections={flatSections}
                    onOpenModal={() => setIsModalOpen(true)}
                />
            </div>
        </div>
    );
}
