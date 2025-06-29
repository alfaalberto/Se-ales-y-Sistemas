
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Save, Menu, X, Loader2, Check } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import ContentView from '@/components/content/content-view';
import HtmlAddModal from '@/components/modals/html-add-modal';
import AiGenerateModal from '@/components/modals/ai-generate-modal';
import InputDialog from '@/components/modals/input-dialog';
import { generateContent, type GenerateContentInput } from '@/ai/flows/generate-content-flow';
import { generateImage } from '@/ai/flows/generate-image-flow';
import type { SectionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useTocManager } from '@/hooks/use-toc-manager';
import { useToast } from "@/hooks/use-toast";

type InputDialogState = {
    isOpen: boolean;
    mode: 'addSection' | 'addSubsection' | 'renameChapter' | 'renameSection' | null;
    parentId?: string;
    sectionId?: string;
    currentTitle?: string;
    chapterNum?: string;
};

export default function SignalVisorPage() {
    const {
        toc,
        activeSection,
        setActiveSection,
        addBlock,
        editBlock,
        deleteBlock,
        moveBlock,
        savingStatus,
        addSection,
        renameChapter,
        renameSection,
    } = useTocManager();

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    const [isHtmlModalOpen, setIsHtmlModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingBlockInfo, setEditingBlockInfo] = useState<{ blockId: string } | null>(null);
    const [htmlToEdit, setHtmlToEdit] = useState<string>('');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [blockToDelete, setBlockToDelete] = useState<string | null>(null);
    const [generatingImageForBlock, setGeneratingImageForBlock] = useState<string | null>(null);
    const [inputDialogState, setInputDialogState] = useState<InputDialogState>({ isOpen: false, mode: null });

    const { toast } = useToast();

    const flattenSections = (sections: SectionType[]): SectionType[] => {
        let flatList: SectionType[] = [];
        sections.forEach(section => {
            flatList.push({ ...section, subsections: undefined });
            if (section.subsections) {
                flatList = flatList.concat(flattenSections(section.subsections));
            }
        });
        return flatList;
    };

    const flatSections = useMemo(() => {
        return toc.flatMap(chapter => flattenSections(chapter.sections));
    }, [toc]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const showSidebar = window.innerWidth >= 768;
            setIsSidebarVisible(showSidebar);
        }
    }, []);

    useEffect(() => {
        if (flatSections.length > 0 && !activeSection) {
            setActiveSection(flatSections[0]);
            setSelectedBlockId(null); 
        }
    }, [flatSections, activeSection, setActiveSection]);

    const handleSectionSelect = (section: SectionType) => {
        setActiveSection(section);
        setSelectedBlockId(null); 
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
            setIsSidebarVisible(false);
        }
    };

    const handleBlockSelect = (blockId: string) => {
        setSelectedBlockId(currentSelectedId => currentSelectedId === blockId ? null : blockId); 
    };
    
    const handleNavigate = useCallback((direction: 'prev' | 'next') => {
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
           setSelectedBlockId(null); 
        }
    }, [activeSection, flatSections, setActiveSection]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setHtmlToEdit('');
        setEditingBlockInfo(null); 
        setIsHtmlModalOpen(true);
    };
    
    const handleOpenEditModal = (blockId: string) => {
        if (!activeSection) return;
        const blockToEdit = activeSection.content.find(b => b.id === blockId);
        if (!blockToEdit) return;
    
        setModalMode('edit');
        setHtmlToEdit(blockToEdit.html);
        setEditingBlockInfo({ blockId });
        setIsHtmlModalOpen(true);
    };
    
    const handleSaveFromModal = (htmlContent: string) => {
        if (!activeSection) return;
        if (modalMode === 'edit' && editingBlockInfo) {
            editBlock(activeSection.id, editingBlockInfo.blockId, htmlContent);
        } else {
            const newBlock = addBlock(activeSection.id, htmlContent);
            if (newBlock) {
                setSelectedBlockId(newBlock.id);
            }
        }
        setIsHtmlModalOpen(false);
        setEditingBlockInfo(null);
        setHtmlToEdit('');
    };

    const handleOpenAiModal = () => {
        if (!activeSection) return;
        setIsAiModalOpen(true);
    };

    const handleGenerateWithAi = async (prompt: string) => {
        if (!activeSection) return;
        
        setIsGenerating(true);
        try {
            const input: GenerateContentInput = {
                topic: prompt,
                context: activeSection.title
            };
            const result = await generateContent(input);
            const newBlock = addBlock(activeSection.id, result.html);
            if (newBlock) {
                setSelectedBlockId(newBlock.id);
            }
            setIsAiModalOpen(false);
        } catch (error) {
            console.error("AI content generation failed:", error);
            toast({
                title: "Error de Generación",
                description: "No se pudo generar el contenido con IA. Inténtalo de nuevo.",
                variant: "destructive"
            });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const getBlockTitle = (html: string): string => {
        if (typeof window === 'undefined') return '';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const h2 = tempDiv.querySelector('h2');
        return h2?.textContent || 'Signals and Systems concept';
    };

    const handleGenerateImage = async (blockId: string) => {
        if (!activeSection) return;
        const block = activeSection.content.find(b => b.id === blockId);
        if (!block) return;
        
        setGeneratingImageForBlock(blockId);
        try {
            const topic = getBlockTitle(block.html);
            const result = await generateImage({ topic });
            const newHtml = `${block.html}<div class="my-4"><img src="${result.imageDataUri}" alt="AI generated image for ${topic}" class="w-full h-auto rounded-lg shadow-md" /></div>`;
            editBlock(activeSection.id, blockId, newHtml);
            toast({ title: "Imagen Generada", description: "La imagen generada por IA ha sido añadida a la diapositiva." });
        } catch (error) {
            console.error("AI image generation failed:", error);
            toast({
                title: "Error de Generación de Imagen",
                description: "No se pudo generar la imagen con IA. Inténtalo de nuevo.",
                variant: "destructive"
            });
        } finally {
            setGeneratingImageForBlock(null);
        }
    };

    const confirmDeleteBlock = (blockId: string) => {
        setBlockToDelete(blockId);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirmed = () => {
        if (!activeSection || !blockToDelete) return;
        deleteBlock(activeSection.id, blockToDelete);
        if (selectedBlockId === blockToDelete) {
            setSelectedBlockId(null);
        }
        setIsDeleteDialogOpen(false);
        setBlockToDelete(null);
    };

    const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
        if (!activeSection) return;
        moveBlock(activeSection.id, blockId, direction);
    };
    
    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

    const handleOpenInputDialog = (state: Omit<InputDialogState, 'isOpen'>) => {
        setInputDialogState({ ...state, isOpen: true });
    };

    const handleInputDialogSubmit = (newTitle: string) => {
        const { mode, parentId, sectionId, chapterNum } = inputDialogState;
        if (mode === 'addSection' && parentId) {
            addSection(parentId, newTitle);
        } else if (mode === 'addSubsection' && parentId) {
            addSection(parentId, newTitle);
        } else if (mode === 'renameChapter' && chapterNum) {
            renameChapter(chapterNum, newTitle);
        } else if (mode === 'renameSection' && sectionId) {
            renameSection(sectionId, newTitle);
        }
        setInputDialogState({ isOpen: false, mode: null });
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || isHtmlModalOpen || isAiModalOpen || isDeleteDialogOpen || inputDialogState.isOpen) return;
            if (e.key === 'ArrowLeft') handleNavigate('prev');
            if (e.key === 'ArrowRight') handleNavigate('next');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeSection, flatSections, isHtmlModalOpen, isAiModalOpen, isDeleteDialogOpen, inputDialogState.isOpen, handleNavigate]);

    const getTooltipContent = () => {
        switch (savingStatus) {
            case 'saving': return <p>Guardando cambios...</p>;
            case 'saved': return <p>¡Guardado!</p>;
            default: return <p>El contenido se guarda automáticamente.</p>;
        }
    };
    
    const getInputDialogTitle = () => {
        switch(inputDialogState.mode) {
            case 'addSection': return "Añadir Nueva Sección";
            case 'addSubsection': return "Añadir Nueva Subsección";
            case 'renameChapter': return "Renombrar Capítulo";
            case 'renameSection': return "Renombrar Sección";
            default: return "";
        }
    }

    return (
        <div className="bg-background text-foreground h-screen w-screen flex antialiased font-body overflow-hidden">
            <HtmlAddModal 
                isOpen={isHtmlModalOpen} 
                onClose={() => setIsHtmlModalOpen(false)} 
                onAdd={handleSaveFromModal}
                initialContent={htmlToEdit}
                modalTitle={modalMode === 'edit' ? "Editar Contenido HTML" : "Añadir Contenido HTML"}
                confirmButtonText={modalMode === 'edit' ? "Guardar Cambios" : "Añadir"}
            />

            {activeSection && (
                 <AiGenerateModal
                    isOpen={isAiModalOpen}
                    onClose={() => setIsAiModalOpen(false)}
                    onGenerate={handleGenerateWithAi}
                    isGenerating={isGenerating}
                    sectionTitle={activeSection.title}
                 />
            )}

            <InputDialog
                isOpen={inputDialogState.isOpen}
                onClose={() => setInputDialogState({ isOpen: false, mode: null })}
                onSubmit={handleInputDialogSubmit}
                title={getInputDialogTitle()}
                label="Título"
                initialValue={inputDialogState.currentTitle}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-card border-border text-card-foreground">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la diapositiva seleccionada.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="hover:bg-muted" onClick={() => setBlockToDelete(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirmed} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


            {isSidebarVisible && (
                <div
                    onClick={() => setIsSidebarVisible(false)}
                    className="fixed inset-0 bg-black/60 z-20 md:hidden"
                    aria-hidden="true"
                />
            )}
            
            <div
                className={`
                    fixed md:relative z-30 h-full transition-all duration-300 ease-in-out overflow-y-auto 
                    bg-sidebar text-sidebar-foreground shadow-lg
                    md:translate-x-0
                    ${isSidebarVisible ? 'translate-x-0 md:w-80 lg:w-96' : '-translate-x-full md:w-0'}
                `}
            >
                <Sidebar 
                    toc={toc} 
                    activeSection={activeSection} 
                    onSectionSelect={handleSectionSelect}
                    onAddSection={(chapterNum) => handleOpenInputDialog({ mode: 'addSection', parentId: chapterNum })}
                    onAddSubsection={(sectionId) => handleOpenInputDialog({ mode: 'addSubsection', parentId: sectionId })}
                    onRenameChapter={(chapterNum, currentTitle) => handleOpenInputDialog({ mode: 'renameChapter', chapterNum, currentTitle })}
                    onRenameSection={(sectionId, currentTitle) => handleOpenInputDialog({ mode: 'renameSection', sectionId, currentTitle })}
                />
            </div>
            
            <div className="flex-1 flex flex-col min-w-0 pt-20 md:pt-0"> 
                <div className="fixed top-4 right-4 z-50 flex items-center space-x-1">
                    <TooltipProvider delayDuration={100}>
                         <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground cursor-default hover:bg-transparent"
                                >
                                    {savingStatus === 'saving' && <Loader2 size={18} className="animate-spin" />}
                                    {savingStatus === 'saved' && <Check size={18} className="text-green-500" />}
                                    {savingStatus === 'idle' && <Save size={18} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {getTooltipContent()}
                            </TooltipContent>
                        </Tooltip>

                        <Separator orientation="vertical" className="h-6 bg-border mx-2" />

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={toggleSidebar}
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                    aria-label={isSidebarVisible ? "Ocultar menú lateral" : "Mostrar menú lateral"}
                                >
                                    {isSidebarVisible ? <X size={20} /> : <Menu size={20} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>{isSidebarVisible ? "Ocultar Menú" : "Mostrar Menú"}</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                
                <ContentView
                    section={activeSection}
                    onNavigate={handleNavigate}
                    flatSections={flatSections}
                    onOpenAddModal={handleOpenAddModal}
                    onOpenAiModal={handleOpenAiModal}
                    isSidebarVisible={isSidebarVisible}
                    toggleSidebar={toggleSidebar}
                    selectedBlockId={selectedBlockId}
                    onBlockSelect={handleBlockSelect}
                    onBlockEdit={handleOpenEditModal}
                    onBlockDelete={confirmDeleteBlock}
                    onBlockMove={handleMoveBlock}
                    onGenerateImage={handleGenerateImage}
                    generatingImageForBlock={generatingImageForBlock}
                />
            </div>
        </div>
    );
}
