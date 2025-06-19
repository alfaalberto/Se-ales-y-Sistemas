
"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, X, Save, UploadCloud, Menu } from 'lucide-react'; // Added Menu icon
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
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [editingBlockInfo, setEditingBlockInfo] = useState<{ chapterIndex: number; sectionIndex: number; blockId: string } | null>(null);
    const [htmlToEdit, setHtmlToEdit] = useState<string>('');

    const { toast } = useToast();

    const flatSections = useMemo(() => toc.flatMap(c => c.sections), [toc]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const showSidebar = window.innerWidth >= 768;
            setIsSidebarVisible(showSidebar);
        }
    }, []);

    useEffect(() => {
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
        }
    }, [activeSection, flatSections]);

    const handleOpenAddModal = () => {
        setModalMode('add');
        setHtmlToEdit('');
        setEditingBlockInfo(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (blockId: string, currentHtml: string) => {
        if (!activeSection) return;

        const chapterIndex = toc.findIndex(c => c.sections.some(s => s.id === activeSection.id));
        if (chapterIndex === -1) return;
        const sectionIndex = toc[chapterIndex].sections.findIndex(s => s.id === activeSection.id);
        if (sectionIndex === -1) return;
        
        setModalMode('edit');
        setHtmlToEdit(currentHtml);
        setEditingBlockInfo({ chapterIndex, sectionIndex, blockId });
        setIsModalOpen(true);
    };
    
    const handleSaveFromModal = (htmlContent: string) => {
        if (!activeSection || !htmlContent.trim()) {
            toast({ title: "Error", description: "El contenido HTML no puede estar vacío.", variant: "destructive" });
            return;
        }

        setToc(currentToc => {
            const newToc = currentToc.map(chapter => ({
                ...chapter,
                sections: chapter.sections.map(section => {
                    if (section.id === activeSection.id) {
                        let updatedContent;
                        if (modalMode === 'edit' && editingBlockInfo && editingBlockInfo.blockId) {
                            updatedContent = section.content.map(block =>
                                block.id === editingBlockInfo.blockId ? { ...block, html: htmlContent } : block
                            );
                            toast({ title: "Contenido Actualizado", description: "El bloque HTML ha sido actualizado." });
                        } else {
                            const newBlock: ContentBlockType = { id: crypto.randomUUID(), html: htmlContent };
                            updatedContent = [...section.content, newBlock];
                            toast({ title: "Contenido Añadido", description: "El bloque HTML ha sido añadido a la sección." });
                        }
                        setActiveSection(prevActiveSection => prevActiveSection ? { ...prevActiveSection, content: updatedContent } : undefined);
                        return { ...section, content: updatedContent };
                    }
                    return section;
                })
            }));
            return newToc;
        });
        setIsModalOpen(false);
        setEditingBlockInfo(null);
        setHtmlToEdit('');
    };

    const handleDeleteBlock = (blockId: string) => {
        if (!activeSection) return;
        
        setToc(currentToc => {
            const newToc = currentToc.map(chapter => ({
                ...chapter,
                sections: chapter.sections.map(section => {
                    if (section.id === activeSection.id) {
                        const updatedContent = section.content.filter(block => block.id !== blockId);
                        setActiveSection(prevActiveSection => prevActiveSection ? { ...prevActiveSection, content: updatedContent } : undefined);
                        toast({ title: "Contenido Eliminado", description: "El bloque HTML ha sido eliminado." });
                        return { ...section, content: updatedContent };
                    }
                    return section;
                })
            }));
        });
    };

    const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
        if (!activeSection) return;

        setToc(currentToc => {
            const newToc = currentToc.map(chapter => ({
                ...chapter,
                sections: chapter.sections.map(section => {
                    if (section.id === activeSection.id) {
                        const blockIndex = section.content.findIndex(b => b.id === blockId);
                        if (blockIndex === -1) return section;

                        const newContent = [...section.content];
                        const [blockToMove] = newContent.splice(blockIndex, 1);

                        if (direction === 'up' && blockIndex > 0) {
                            newContent.splice(blockIndex - 1, 0, blockToMove);
                        } else if (direction === 'down' && blockIndex < newContent.length) {
                            newContent.splice(blockIndex + 1, 0, blockToMove);
                        } else {
                            newContent.splice(blockIndex, 0, blockToMove); 
                            return section; 
                        }
                        setActiveSection(prevActiveSection => prevActiveSection ? { ...prevActiveSection, content: newContent } : undefined);
                        toast({ title: "Contenido Reordenado", description: `El bloque HTML ha sido movido hacia ${direction === 'up' ? 'arriba' : 'abajo'}.` });
                        return { ...section, content: newContent };
                    }
                    return section;
                })
            }));
            return newToc; 
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
                description: `No se pudo conectar con el servidor en ${serverUrl}. Asegúrate de que está funcionando. Detalles: ${error instanceof Error ? error.message : String(error)}`, 
                variant: "destructive" 
            });
        }
    };

    const toggleSidebar = () => setIsSidebarVisible(!isSidebarVisible);

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

            <div className="flex-1 flex flex-col min-w-0">
                 {/* Contenedor de botones globales */}
                 <div className="fixed top-4 right-4 z-50 flex space-x-2">
                    <Button
                        onClick={toggleSidebar}
                        className="p-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md shadow-lg"
                        aria-label={isSidebarVisible ? "Ocultar menú lateral" : "Mostrar menú lateral"}
                        variant="ghost"
                        size="icon"
                    >
                        {isSidebarVisible ? <X size={20} /> : <Menu size={20} />}
                    </Button>
                    <Button
                        onClick={handleDownloadBackup}
                        className="p-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md shadow-lg"
                        aria-label="Descargar respaldo JSON"
                        variant="ghost"
                        size="icon"
                        title="Descargar Respaldo JSON"
                    >
                        <Save size={20} />
                    </Button>
                    <Button
                        onClick={handleSaveToServer}
                        className="p-2 bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md shadow-lg"
                        aria-label="Guardar en servidor local"
                        variant="ghost"
                        size="icon"
                        title="Guardar en Servidor Local (Experimental)"
                    >
                        <UploadCloud size={20} />
                    </Button>
                </div>
                <ContentView
                    section={activeSection}
                    onNavigate={handleNavigate}
                    flatSections={flatSections}
                    onOpenAddModal={handleOpenAddModal}
                    onEditBlock={handleOpenEditModal}
                    onDeleteBlock={handleDeleteBlock}
                    onMoveBlock={handleMoveBlock}
                    isSidebarVisible={isSidebarVisible}
                    toggleSidebar={toggleSidebar}
                />
            </div>
        </div>
    );
}
    
