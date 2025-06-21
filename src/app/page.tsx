"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
    const [editingBlockInfo, setEditingBlockInfo] = useState<{ blockId: string } | null>(null);
    const [htmlToEdit, setHtmlToEdit] = useState<string>('');
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);


    const { toast } = useToast();

    const findSectionById = (sections: SectionType[], id: string): SectionType | undefined => {
        for (const section of sections) {
            if (section.id === id) {
                return section;
            }
            if (section.subsections) {
                const found = findSectionById(section.subsections, id);
                if (found) {
                    return found;
                }
            }
        }
        return undefined;
    };

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
        
        const blockToEdit = activeSection.content.find(b => b.id === selectedBlockId);

        if (!blockToEdit) {
             toast({ title: "Error", description: "Diapositiva seleccionada no encontrada.", variant: "destructive" });
            return;
        }
    
        setModalMode('edit');
        setHtmlToEdit(blockToEdit.html);
        setEditingBlockInfo({ blockId: selectedBlockId });
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
                if (modalMode === 'edit' && editingBlockInfo) {
                    updatedContent = section.content.map(block =>
                        block.id === editingBlockInfo.blockId ? { ...block, html: htmlContent } : block
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

    const handleSaveContentToFile = async () => {
        try {
            const response = await fetch('/api/save-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(toc, null, 2),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save file on server.');
            }

            toast({
                title: "Respaldo Guardado",
                description: "El archivo 'content-backup.json' se ha guardado en la raíz del proyecto.",
            });
        } catch (error) {
            console.error("Error saving content to file:", error);
            toast({
                title: "Error al Guardar",
                description: error instanceof Error ? error.message : "No se pudo guardar el archivo en el servidor.",
                variant: "destructive",
            });
        }
    };


    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable as text.");
                }
                const newToc = JSON.parse(text);
                // TODO: Add validation to ensure it's a valid TOC structure
                setToc(newToc);
                toast({
                    title: "Contenido Cargado",
                    description: "El contenido del archivo JSON se ha cargado correctamente.",
                });
                setActiveSection(undefined);
                setSelectedBlockId(null);
            } catch (error) {
                console.error("Error parsing JSON file:", error);
                toast({
                    title: "Error al Cargar",
                    description: "El archivo no es un JSON válido o tiene un formato incorrecto.",
                    variant: "destructive",
                });
            }
        };
        reader.onerror = () => {
            toast({
                title: "Error de Lectura",
                description: "No se pudo leer el archivo seleccionado.",
                variant: "destructive",
            });
        };
        reader.readAsText(file);

        if (event.target) {
            event.target.value = '';
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
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="application/json"
                className="hidden"
            />
            
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
                                    onClick={handleSaveContentToFile}
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                >
                                    <Save size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Guardar Respaldo en Archivo</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={handleTriggerUpload}
                                    variant="ghost"
                                    size="icon"
                                    className="text-foreground hover:bg-accent hover:text-accent-foreground"
                                >
                                    <UploadCloud size={18} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Cargar Respaldo desde JSON</p></TooltipContent>
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
}