
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
        // Default to visible on desktop, hidden on mobile
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
        // On mobile, hide sidebar after section selection
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
    }, [activeSection, flatSections, isModalOpen, handleNavigate]);

    return (
        <div className="bg-background text-foreground h-screen w-screen flex antialiased font-body overflow-hidden">
            <HtmlAddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddHtmlToSection} />

            {isSidebarVisible && (
                <div
                    onClick={() => setIsSidebarVisible(false)}
                    className="fixed inset-0 bg-black/60 z-20 md:hidden" // Overlay only for mobile
                    aria-hidden="true"
                />
            )}

            <Button
                onClick={() => setIsSidebarVisible(!isSidebarVisible)}
                className="fixed top-4 left-4 z-40 p-2 bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent rounded-md shadow-lg" // Removed md:hidden
                aria-label={isSidebarVisible ? "Cerrar menú" : "Abrir menú"}
                variant="ghost"
                size="icon"
            >
                {isSidebarVisible ? <X size={24} /> : <ChevronRight size={24} />}
            </Button>

            <div
                className={`
                    fixed md:relative z-30 h-full transition-all duration-300 ease-in-out overflow-hidden 
                    md:translate-x-0
                    ${isSidebarVisible ? 'translate-x-0 md:w-80 lg:w-96' : '-translate-x-full md:w-0'}
                `}
            >
                <Sidebar toc={toc} activeSection={activeSection} onSectionSelect={handleSectionSelect} />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
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
