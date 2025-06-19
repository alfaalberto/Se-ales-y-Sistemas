"use client";

import React from 'react';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { SectionType } from '@/lib/types';
import HtmlBlock from './html-block';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentViewProps {
    section?: SectionType;
    onNavigate: (direction: 'prev' | 'next') => void;
    flatSections: SectionType[];
    onOpenModal: () => void;
}

const ContentView: React.FC<ContentViewProps> = ({ section, onNavigate, flatSections, onOpenModal }) => {
    if (!section) {
        return (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-gray-400 bg-background">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-notebook-tabs mx-auto mb-4 text-primary"><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M15 2v20"/><path d="M15 7h5"/><path d="M15 12h5"/><path d="M15 17h5"/></svg>
                    <h2 className="text-3xl font-bold text-white">Bienvenido al Visor Interactivo</h2>
                    <p className="mt-2 text-lg">Selecciona una sección del menú para comenzar.</p>
                </div>
            </div>
        );
    }

    const currentIndex = flatSections.findIndex(s => s.id === section.id);
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === flatSections.length - 1;

    return (
        <main className="flex-1 flex flex-col bg-background overflow-hidden">
            <ScrollArea className="flex-grow p-4 md:p-8">
                <div className="prose prose-invert max-w-none prose-lg text-gray-300 prose-headings:text-primary prose-strong:text-white prose-a:text-accent">
                    {section.content.map((block) => (
                        <HtmlBlock key={block.id} htmlString={block.html} />
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-border bg-background flex justify-between items-center flex-wrap gap-4 shadow-[-2px_0px_15px_rgba(0,0,0,0.1)]">
                <Button
                    onClick={() => onNavigate('prev')}
                    disabled={isFirst}
                    variant="outline"
                    className="text-foreground hover:bg-secondary disabled:opacity-50"
                    aria-label="Sección anterior"
                >
                    <ChevronLeft size={20} className="mr-2" /> Anterior
                </Button>
                <Button
                    onClick={onOpenModal}
                    variant="default"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                    aria-label="Añadir contenido HTML"
                >
                    <PlusCircle size={20} className="mr-2" /> Añadir Contenido HTML
                </Button>
                <Button
                    onClick={() => onNavigate('next')}
                    disabled={isLast}
                    variant="outline"
                    className="text-foreground hover:bg-secondary disabled:opacity-50"
                    aria-label="Siguiente sección"
                >
                    Siguiente <ChevronRight size={20} className="ml-2" />
                </Button>
            </div>
        </main>
    );
};

export default ContentView;
