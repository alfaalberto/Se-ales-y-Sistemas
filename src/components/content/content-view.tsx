
"use client";

import React from 'react';
import { PlusCircle, ChevronLeft, ChevronRight, MonitorPlay, Minimize, Menu, X } from 'lucide-react';
import type { SectionType } from '@/lib/types';
import HtmlBlock from './html-block';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ContentViewProps {
    section?: SectionType;
    onNavigate: (direction: 'prev' | 'next') => void;
    flatSections: SectionType[];
    onOpenAddModal: () => void;
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    selectedBlockId: string | null;
    onBlockSelect: (blockId: string) => void;
}

const ContentView: React.FC<ContentViewProps> = ({ 
    section, 
    onNavigate, 
    flatSections, 
    onOpenAddModal,
    isSidebarVisible,
    toggleSidebar,
    selectedBlockId,
    onBlockSelect
}) => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const toggleFullscreenInternal = () => {
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

    React.useEffect(() => {
        if (section && window.MathJax) {
            setTimeout(() => {
                if (contentRef.current && window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                    window.MathJax.typesetPromise([contentRef.current])
                        .catch((err: any) => console.error('MathJax typesetting failed on section change:', err));
                }
            }, 100);
        }
    }, [section]);


    if (!section) {
        return (
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-gray-400 bg-background">
                <div className="fixed top-4 left-4 z-50 md:hidden">
                     <Button
                        onClick={toggleSidebar}
                        className="p-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md shadow-lg"
                        aria-label={isSidebarVisible ? "Ocultar menú lateral" : "Mostrar menú lateral"}
                        variant="ghost"
                        size="icon"
                    >
                        {isSidebarVisible ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                </div>
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
        <main ref={contentRef} className="flex-1 flex flex-col bg-background overflow-hidden pt-16 md:pt-0"> {/* Added padding top for fixed global buttons */}
            {/* Barra de encabezado para acciones de contenido */}
            <div className="p-3 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={toggleSidebar}
                        className="p-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md md:hidden"
                        aria-label={isSidebarVisible ? "Ocultar menú lateral" : "Mostrar menú lateral"}
                        variant="ghost"
                        size="icon"
                    >
                        {isSidebarVisible ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                     <Button
                        onClick={() => onNavigate('prev')}
                        disabled={isFirstSection}
                        variant="outline"
                        className="text-foreground hover:bg-secondary disabled:opacity-50"
                        aria-label="Sección anterior"
                        size="sm"
                    >
                        <ChevronLeft size={18} className="mr-1 md:mr-2" /> <span className="hidden md:inline">Anterior</span>
                    </Button>
                </div>
                
                <div className="flex-1 flex justify-center gap-2">
                     <Button
                        onClick={onOpenAddModal}
                        variant="default"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        aria-label="Añadir diapositiva a esta sección"
                        size="sm"
                    >
                        <PlusCircle size={18} className="mr-1 md:mr-2" /> <span className="hidden md:inline">Añadir Diapositiva</span>
                    </Button>
                     <Button
                        onClick={toggleFullscreenInternal}
                        variant="outline"
                        className="text-foreground hover:bg-secondary"
                        aria-label={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
                        title={isFullscreen ? "Salir de pantalla completa" : "Ver en pantalla completa"}
                        size="sm"
                    >
                        {isFullscreen ? <Minimize size={18} /> : <MonitorPlay size={18} />}
                         <span className="hidden md:inline ml-1 md:ml-2">{isFullscreen ? "Minimizar" : "Completa"}</span>
                    </Button>
                </div>

                <Button
                    onClick={() => onNavigate('next')}
                    disabled={isLastSection}
                    variant="outline"
                    className="text-foreground hover:bg-secondary disabled:opacity-50"
                    aria-label="Siguiente sección"
                    size="sm"
                >
                    <span className="hidden md:inline">Siguiente</span> <ChevronRight size={18} className="ml-1 md:ml-2" />
                </Button>
            </div>

            <ScrollArea className="flex-grow p-4 md:p-8">
                <div className="max-w-none">
                    {section.content.map((block) => (
                        <HtmlBlock 
                            key={block.id} 
                            block={block}
                            onSelect={onBlockSelect}
                            isActive={selectedBlockId === block.id}
                        />
                    ))}
                </div>
            </ScrollArea>
        </main>
    );
};

export default ContentView;


    