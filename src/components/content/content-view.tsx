
"use client";

import React from 'react';
import { PlusCircle, ChevronLeft, ChevronRight, MonitorPlay, Minimize } from 'lucide-react';
import type { SectionType, ContentBlockType } from '@/lib/types';
import HtmlBlock from './html-block';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentViewProps {
    section?: SectionType;
    onNavigate: (direction: 'prev' | 'next') => void;
    flatSections: SectionType[];
    onOpenAddModal: () => void;
    onEditBlock: (blockId: string, currentHtml: string) => void;
    onDeleteBlock: (blockId: string) => void;
    onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
}

const ContentView: React.FC<ContentViewProps> = ({ 
    section, 
    onNavigate, 
    flatSections, 
    onOpenAddModal,
    onEditBlock,
    onDeleteBlock,
    onMoveBlock
}) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            contentRef.current?.requestFullscreen().catch(err => {
                alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);


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
    const isFirstSection = currentIndex === 0;
    const isLastSection = currentIndex === flatSections.length - 1;

    return (
        <main ref={contentRef} className="flex-1 flex flex-col bg-background overflow-hidden">
            <ScrollArea className="flex-grow p-4 md:p-8">
                <div className="max-w-none">
                    {section.content.map((block, index) => (
                        <HtmlBlock 
                            key={block.id} 
                            block={block}
                            onEdit={() => onEditBlock(block.id, block.html)}
                            onDelete={() => onDeleteBlock(block.id)}
                            onMoveUp={() => onMoveBlock(block.id, 'up')}
                            onMoveDown={() => onMoveBlock(block.id, 'down')}
                            isFirst={index === 0}
                            isLast={index === section.content.length - 1}
                        />
                    ))}
                </div>
            </ScrollArea>
            <div className="p-4 border-t border-border bg-background flex justify-between items-center flex-wrap gap-2 shadow-[-2px_0px_15px_rgba(0,0,0,0.1)]">
                <Button
                    onClick={() => onNavigate('prev')}
                    disabled={isFirstSection}
                    variant="outline"
                    className="text-foreground hover:bg-secondary disabled:opacity-50"
                    aria-label="Sección anterior"
                >
                    <ChevronLeft size={20} className="mr-2" /> Anterior
                </Button>
                
                <div className="flex gap-2">
                    <Button
                        onClick={onOpenAddModal}
                        variant="default"
                        className="bg-accent hover:bg-accent/90 text-accent-foreground"
                        aria-label="Añadir diapositiva a esta sección"
                    >
                        <PlusCircle size={20} className="mr-2" /> Añadir Diapositiva
                    </Button>
                    <Button
                        onClick={toggleFullscreen}
                        variant="outline"
                        className="text-foreground hover:bg-secondary"
                        aria-label={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
                        title={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
                    >
                        {isFullscreen ? <Minimize size={20} /> : <MonitorPlay size={20} />}
                    </Button>
                </div>

                <Button
                    onClick={() => onNavigate('next')}
                    disabled={isLastSection}
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
