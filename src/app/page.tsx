
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, X, Save, UploadCloud, Menu, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Sidebar from '@/components/layout/sidebar';
import ContentView from '@/components/content/content-view';
import HtmlAddModal from '@/components/modals/html-add-modal';
import { initialTableOfContents } from '@/lib/data';
import type { TableOfContentsType, SectionType, ContentBlockType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";


export default function SignalVisorPage() {
    const [toc, setToc] = useState<TableOfContentsType>(initialTableOfContents);
    const [activeSection, setActiveSection] = useState<SectionType | undefined>(undefined);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingBlockInfo, setEditingBlockInfo] = useState<{ chapterIndex: number; sectionIndex: number; blockId: string } | null>(null);
    const [htmlToEdit, setHtmlToEdit] = useState<string>('');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


    const { toast } = useToast();

    const flattenSections = (sections: SectionType[]): SectionType[] => {
        let flatList: SectionType[] = [];
        sections.forEach(section => {
            // Create a copy of the section without its subsections to avoid circular references
            const { subsections, ...sectionWithoutSubs } = section;
            flatList.push(sectionWithoutSubs as SectionType);
            if (subsections) {
                flatList = flatList.concat(flattenSections(subsections));
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
    }, [flatSections, activeSection]);

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
    }, [activeSection, flatSections]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setHtmlToEdit('');
        setEditingBlockInfo(null); 
        setIsModalOpen(true);
    };
    
    const handleOpenEditModalForSelected = () => {
        if (!activeSection || !selectedBlockId) {
            toast({ title: "Error", description: "Ninguna diapositiva seleccionada para editar.", variant: "destructive" });
            return;
        }

        // Simplified logic: get the block to edit directly from the active section in the state.
        const blockToEdit = activeSection.content.find(b => b.id === selectedBlockId);

        if (!blockToEdit) {
            toast({ title: "Error", description: "Diapositiva seleccionada no encontrada.", variant: "destructive" });
            return;
        }
    
        setModalMode('edit');
        setHtmlToEdit(blockToEdit.html);
        // This info is not strictly needed for the simplified update logic, but we set it for consistency.
        setEditingBlockInfo({ chapterIndex: -1, sectionIndex: -1, blockId: selectedBlockId });
        setIsModalOpen(true);
    };
    
    const updateTocRecursively = (sections: SectionType[], targetSectionId: string, updateFn: (section: SectionType) => SectionType): SectionType[] => {
        return sections.map(section => {
            if (section.id === targetSectionId) {
                return updateFn(section);
            }
            if (section.subsections) {
                return { ...section, subsections: updateTocRecursively(section.subsections, targetSectionId, updateFn) };
            }
            return section;
        });
    };
    
    const handleSaveFromModal = (htmlContent: string) => {
        if (!activeSection || !htmlContent.trim()) {
            toast({ title: "Error", description: "El contenido HTML no puede estar vacío.", variant: "destructive" });
            return;
        }
    
        setToc(currentToc => {
            const newToc = [...currentToc];
            const updateFn = (section: SectionType) => {
                let updatedContent;
                let newSelectedBlockId = selectedBlockId;
                if (modalMode === 'edit' && selectedBlockId) {
                    updatedContent = section.content.map(block =>
                        block.id === selectedBlockId ? { ...block, html: htmlContent } : block
                    );
                    toast({ title: "Contenido Actualizado", description: "El bloque HTML ha sido actualizado." });
                } else { 
                    const newBlock: ContentBlockType = { id: crypto.randomUUID(), html: htmlContent };
                    updatedContent = [...section.content, newBlock];
                    toast({ title: "Contenido Añadido", description: "El bloque HTML ha sido añadido a la sección." });
                    newSelectedBlockId = newBlock.id; 
                }
                const updatedSection = { ...section, content: updatedContent };
                setActiveSection(updatedSection); // Update active section directly
                setSelectedBlockId(newSelectedBlockId);
                return updatedSection;
            };

            return newToc.map(chapter => ({
                ...chapter,
                sections: updateTocRecursively(chapter.sections, activeSection.id, updateFn)
            }));
        });
        setIsModalOpen(false);
        setEditingBlockInfo(null); 
        setHtmlToEdit(''); 
    };

    const handleDeleteBlockGlobal = () => {
        if (!activeSection || !selectedBlockId) {
            toast({ title: "Error", description: "Ninguna diapositiva seleccionada para eliminar.", variant: "destructive" });
            return;
        }
        
        setToc(currentToc => {
            const newToc = [...currentToc];
            const updateFn = (section: SectionType) => {
                const updatedContent = section.content.filter(block => block.id !== selectedBlockId);
                const updatedSection = { ...section, content: updatedContent };
                setActiveSection(updatedSection);
                toast({ title: "Contenido Eliminado", description: "El bloque HTML ha sido eliminado." });
                setSelectedBlockId(null);
                return updatedSection;
            };

            return newToc.map(chapter => ({
                ...chapter,
                sections: updateTocRecursively(chapter.sections, activeSection.id, updateFn)
            }));
        });
        setIsDeleteDialogOpen(false); 
    };

    const handleMoveBlockGlobal = (direction: 'up' | 'down') => {
        if (!activeSection || !selectedBlockId) {
            toast({ title: "Error", description: "Ninguna diapositiva seleccionada para mover.", variant: "destructive" });
            return;
        }

        setToc(currentToc => {
             const newToc = [...currentToc];
             const updateFn = (section: SectionType) => {
                const blockIndex = section.content.findIndex(b => b.id === selectedBlockId);
                if (blockIndex === -1) return section;

                const newContent = [...section.content];
                const [blockToMove] = newContent.splice(blockIndex, 1);

                if (direction === 'up' && blockIndex > 0) {
                    newContent.splice(blockIndex - 1, 0, blockToMove);
                } else if (direction === 'down' && blockIndex < newContent.length) { 
                    newContent.splice(blockIndex + 1, 0, blockToMove);
                } else {
                    return section; 
                }
                
                const updatedSection = { ...section, content: newContent };
                setActiveSection(updatedSection);
                toast({ title: "Contenido Reordenado", description: `El bloque HTML ha sido movido hacia ${direction === 'up' ? 'arriba' : 'abajo'}.` });
                return updatedSection;
             };

             return newToc.map(chapter => ({
                ...chapter,
                sections: updateTocRecursively(chapter.sections, activeSection.id, updateFn)
            }));
        });
    };
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || isModalOpen || isDeleteDialogOpen) return;
            if (e.key === 'ArrowLeft') handleNavigate('prev');
            if (e.key === 'ArrowRight') handleNavigate('next');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeSection, flatSections, isModalOpen, isDeleteDialogOpen, handleNavigate]);

    const handleDownloadBackup = () => {
        const jsonData = JSON.stringify(toc, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'signalVisorContent.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast({ title: "Descarga Iniciada", description: "El archivo de respaldo signalVisorContent.json se está descargando." });
    };

    const handleSaveToServer = async () => {
        const serverUrl = 'http://localhost:3001/api/save-slides'; 
        try {
            const response = await fetch(serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toc),
            });

            if (response.ok) {
                toast({ title: "Guardado en Servidor", description: "Los datos se enviaron correctamente al servidor." });
            } else {
                const errorData = await response.text();
                toast({ 
                    title: "Error al Guardar en Servidor", 
                    description: `El servidor respondió con error: ${response.status}. ${errorData}`, 
                    variant: "destructive" 
                });
            }
        } catch (error) {
            toast({ 
                title: "Error de Conexión", 
                description: `No se pudo conectar con el servidor en ${serverUrl}. Esta función requiere un servidor local separado que probablemente no está ejecutándose. Para guardar su contenido, use el botón "Descargar Respaldo JSON".`, 
                variant: "destructive",
                duration: 10000
            });
        }
    };

    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

    const selectedBlockIndex = useMemo(() => {
        if (!activeSection || !selectedBlockId) return -1;
        return activeSection.content.findIndex(b => b.id === selectedBlockId);
    }, [activeSection, selectedBlockId]);

    const canMoveUp = selectedBlockId !== null && activeSection !== undefined && selectedBlockIndex > 0;
    const canMoveDown = selectedBlockId !== null && activeSection !== undefined && selectedBlockIndex !== -1 && activeSection.content.length > 0 && selectedBlockIndex < activeSection.content.length - 1;


    return (
        <div className="bg-background text-foreground h-screen w-screen flex antialiased font-body overflow-hidden">
            <HtmlAddModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onAdd={handleSaveFromModal}
                initialContent={htmlToEdit}
                modalTitle={modalMode === 'edit' ? "Editar Contenido HTML" : "Añadir Contenido HTML"}
                confirmButtonText={modalMode === 'edit' ? "Guardar Cambios" : "Añadir"}
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
                        <AlertDialogCancel className="hover:bg-muted">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBlockGlobal} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
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
                <Sidebar toc={toc} activeSection={activeSection} onSectionSelect={handleSectionSelect} />
            </div>
            
            <div className="flex-1 flex flex-col min-w-0 pt-20 md:pt-0"> 
                <div className="fixed top-4 right-4 z-50 flex items-center space-x-1">
                    <TooltipProvider delayDuration={100}>
                        {selectedBlockId && activeSection && (
                            <>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={handleOpenEditModalForSelected}
                                            variant="ghost"
                                            size="icon"
                                            className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <Pencil size={18} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Editar Diapositiva</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => handleMoveBlockGlobal('up')}
                                            disabled={!canMoveUp}
                                            variant="ghost"
                                            size="icon"
                                            className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <ArrowUpCircle size={18} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Mover Arriba</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => handleMoveBlockGlobal('down')}
                                            disabled={!canMoveDown}
                                            variant="ghost"
                                            size="icon"
                                            className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                        >
                                            <ArrowDownCircle size={18} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Mover Abajo</p></TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => setIsDeleteDialogOpen(true)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-destructive hover:bg-destructive/90 hover:text-destructive-foreground"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Eliminar Diapositiva</p></TooltipContent>
                                </Tooltip>
                                 <Separator orientation="vertical" className="h-6 bg-border mx-2" />
                            </>
                        )}

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleDownloadBackup}
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Save size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Descargar Respaldo JSON</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleSaveToServer}
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                >
                                    <UploadCloud size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Guardar en Servidor Local</p></TooltipContent>
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
                    isSidebarVisible={isSidebarVisible}
                    toggleSidebar={toggleSidebar}
                    selectedBlockId={selectedBlockId}
                    onBlockSelect={handleBlockSelect}
                />
            </div>
        </div>
    );

    