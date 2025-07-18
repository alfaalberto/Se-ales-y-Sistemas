
"use client";

import React from 'react';
import { PlusCircle, ChevronLeft, ChevronRight, MonitorPlay, Minimize, Menu, X, Sparkles } from 'lucide-react';
import type { SectionType } from '@/lib/types';
import HtmlBlock from './html-block';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContentViewProps {
    section?: SectionType;
    onNavigate: (direction: 'prev' | 'next') => void;
    flatSections: SectionType[];
    onOpenAddModal: () => void;
    onOpenAiModal: () => void;
    isSidebarVisible: boolean;
    toggleSidebar: () => void;
    selectedBlockId: string | null;
    onBlockSelect: (blockId: string) => void;
    onBlockEdit: (blockId: string) => void;
    onBlockDelete: (blockId: string) => void;
    onBlockMove: (blockId: string, direction: 'up' | 'down') => void;
    onGenerateImage: (blockId: string) => void;
    generatingImageForBlock: string | null;
}

const ContentView: React.FC<ContentViewProps> = ({ 
    section, 
    onNavigate, 
    flatSections, 
    onOpenAddModal,
    onOpenAiModal,
    isSidebarVisible,
    toggleSidebar,
    selectedBlockId,
    onBlockSelect,
    onBlockEdit,
    onBlockDelete,
    onBlockMove,
    onGenerateImage,
    generatingImageForBlock
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
                <div className="absolute top-4 left-4 z-50 md:hidden">
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={toggleSidebar}
                                    variant="ghost"
                                    size="icon"
                                    className="p-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md shadow-lg"
                                >
                                    {isSidebarVisible ? <X size={20} /> : <Menu size={20} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right"><p>{isSidebarVisible ? "Ocultar Menú" : "Mostrar Menú"}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
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
        <main ref={contentRef} className="flex-1 flex flex-col bg-background overflow-hidden">
            <div className="p-3 border-b border-border bg-card flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-2">
                     <TooltipProvider delayDuration={100}>
                        <Tooltip>
                             <TooltipTrigger asChild>
                                <Button
                                    onClick={toggleSidebar}
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground md:hidden"
                                >
                                    {isSidebarVisible ? <X size={18} /> : <Menu size={18} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right"><p>{isSidebarVisible ? "Ocultar Menú" : "Mostrar Menú"}</p></TooltipContent>
                        </Tooltip>
                     </TooltipProvider>
                     <Button
                        onClick={() => onNavigate('prev')}
                        disabled={isFirstSection}
                        variant="outline"
                        size="sm"
                        className="text-foreground hover:bg-secondary disabled:opacity-50"
                    >
                        <ChevronLeft size={16} className="mr-1 md:mr-2" /> <span className="hidden md:inline">Anterior</span>
                    </Button>
                    <Button
                        onClick={() => onNavigate('next')}
                        disabled={isLastSection}
                        variant="outline"
                        size="sm"
                        className="text-foreground hover:bg-secondary disabled:opacity-50"
                    >
                        <span className="hidden md:inline">Siguiente</span> <ChevronRight size={16} className="ml-1 md:ml-2" />
                    </Button>
                </div>
                
                <div className="flex-1 flex justify-center items-center gap-2">
                     <Button
                        onClick={onOpenAddModal}
                        variant="outline"
                        size="sm"
                        className="shadow-sm"
                    >
                        <PlusCircle size={16} className="mr-1 md:mr-2" /> <span className="hidden md:inline">Añadir Manual</span>
                    </Button>
                    <Button
                        onClick={onOpenAiModal}
                        variant="default"
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                    >
                        <Sparkles size={16} className="mr-1 md:mr-2" /> <span className="hidden md:inline">Generar con IA</span>
                    </Button>
                    <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={toggleFullscreenInternal}
                                    variant="outline"
                                    size="icon-sm" 
                                    className="text-foreground hover:bg-secondary"
                                >
                                    {isFullscreen ? <Minimize size={16} /> : <MonitorPlay size={16} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{isFullscreen ? "Salir de Pantalla Completa" : "Pantalla Completa"}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="flex items-center gap-2">
                </div>
            </div>

            <ScrollArea className="flex-grow p-4 md:p-8">
                <div className="max-w-none prose dark:prose-invert prose-headings:text-primary prose-p:text-foreground prose-strong:text-foreground prose-pre:bg-muted prose-pre:text-foreground">
                    {section.content.map((block, index) => {
                        const canMoveUp = index > 0;
                        const canMoveDown = index < section.content.length - 1;
                        return (
                            <HtmlBlock 
                                key={block.id} 
                                block={block}
                                onSelect={onBlockSelect}
                                isActive={selectedBlockId === block.id}
                                onEdit={onBlockEdit}
                                onDelete={onBlockDelete}
                                onMove={onBlockMove}
                                canMoveUp={canMoveUp}
                                canMoveDown={canMoveDown}
                                onGenerateImage={onGenerateImage}
                                isGeneratingImage={generatingImageForBlock === block.id}
                            />
                        )
                    })}
                </div>
            </ScrollArea>
        </main>
    );
};

declare module '@/components/ui/button' {
    interface ButtonProps {
      size?: 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm';
    }
  }

export default ContentView;

    