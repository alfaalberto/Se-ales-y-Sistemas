
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TableOfContentsType, SectionType, ContentBlockType, ChapterType } from '@/lib/types';
import { initialTableOfContents, placeholderContent } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from './use-debounce';


const findSection = (sections: SectionType[], sectionId: string): SectionType | null => {
    for (const section of sections) {
        if (section.id === sectionId) {
            return section;
        }
        if (section.subsections) {
            const found = findSection(section.subsections, sectionId);
            if (found) return found;
        }
    }
    return null;
};

const updateSectionRecursively = (sections: SectionType[], targetSectionId: string, updateFn: (section: SectionType) => SectionType): SectionType[] => {
    return sections.map(section => {
        if (section.id === targetSectionId) {
            return updateFn(section);
        }
        if (section.subsections) {
            return { ...section, subsections: updateSectionRecursively(section.subsections, targetSectionId, updateFn) };
        }
        return section;
    });
};

export function useTocManager() {
    const [toc, setToc] = useState<TableOfContentsType>([]);
    const [activeSection, setActiveSection] = useState<SectionType | undefined>(undefined);
    const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
    const { toast } = useToast();
    const isInitialMount = useRef(true);

    const debouncedToc = useDebounce(toc, 2000);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const response = await fetch('/api/load-content');
                if (response.ok) {
                    const data = await response.json();
                    setToc(data);
                    toast({
                        title: "Contenido recuperado",
                        description: "Se ha cargado tu progreso guardado anteriormente.",
                    });
                } else if (response.status === 404) {
                    setToc(initialTableOfContents);
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to load backup file from server.');
                }
            } catch (error) {
                console.error("Could not load backup content, loading default:", error);
                setToc(initialTableOfContents);
            } finally {
                 setTimeout(() => isInitialMount.current = false, 500);
            }
        };

        loadInitialData();
    }, [toast]);
    
    useEffect(() => {
        if (isInitialMount.current || !debouncedToc || debouncedToc.length === 0) {
            return;
        }

        const autoSave = async () => {
            setSavingStatus('saving');
            try {
                const response = await fetch('/api/save-content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(debouncedToc),
                });
                if (!response.ok) throw new Error('Server responded with an error during auto-save.');
                setSavingStatus('saved');
            } catch (error) {
                console.error("Auto-save failed:", error);
                setSavingStatus('idle');
                toast({
                    title: "Error de Auto-Guardado",
                    description: "No se pudieron guardar los últimos cambios en el servidor.",
                    variant: "destructive",
                });
            }
        };

        autoSave();
    }, [debouncedToc, toast]);

    useEffect(() => {
        if (savingStatus === 'saved') {
            const timer = setTimeout(() => setSavingStatus('idle'), 2000);
            return () => clearTimeout(timer);
        }
    }, [savingStatus]);

    const addBlock = useCallback((sectionId: string, htmlContent: string): ContentBlockType | undefined => {
        let newBlock: ContentBlockType | undefined;
        setToc(currentToc => {
            const newToc = [...currentToc];
            const updateFn = (section: SectionType) => {
                newBlock = { id: crypto.randomUUID(), html: htmlContent };
                const updatedContent = [...section.content, newBlock];
                const updatedSection = { ...section, content: updatedContent };
                
                setActiveSection(updatedSection);
                toast({ title: "Contenido Añadido", description: "El bloque HTML ha sido añadido a la sección." });
                return updatedSection;
            };

            const updatedToc = newToc.map(chapter => ({
                ...chapter,
                sections: updateSectionRecursively(chapter.sections, sectionId, updateFn)
            }));
            return updatedToc;
        });
        return newBlock;
    }, [toast]);

    const editBlock = useCallback((sectionId: string, blockId: string, htmlContent: string) => {
         setToc(currentToc => {
            const newToc = [...currentToc];
            const updateFn = (section: SectionType) => {
                const updatedContent = section.content.map(block =>
                    block.id === blockId ? { ...block, html: htmlContent } : block
                );
                const updatedSection = { ...section, content: updatedContent };
                
                setActiveSection(updatedSection);
                toast({ title: "Contenido Actualizado", description: "El bloque HTML ha sido actualizado." });
                return updatedSection;
            };

            return newToc.map(chapter => ({
                ...chapter,
                sections: updateSectionRecursively(chapter.sections, sectionId, updateFn)
            }));
        });
    }, [toast]);

    const deleteBlock = useCallback((sectionId: string, blockId: string) => {
        setToc(currentToc => {
            const newToc = [...currentToc];
            const updateFn = (section: SectionType) => {
                const updatedContent = section.content.filter(block => block.id !== blockId);
                const updatedSection = { ...section, content: updatedContent };
                
                setActiveSection(updatedSection);
                toast({ title: "Contenido Eliminado", description: "El bloque HTML ha sido eliminado." });
                return updatedSection;
            };

            return newToc.map(chapter => ({
                ...chapter,
                sections: updateSectionRecursively(chapter.sections, sectionId, updateFn)
            }));
        });
    }, [toast]);

    const moveBlock = useCallback((sectionId: string, blockId: string, direction: 'up' | 'down') => {
        setToc(currentToc => {
             const newToc = [...currentToc];
             const updateFn = (section: SectionType) => {
                const blockIndex = section.content.findIndex(b => b.id === blockId);
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
                sections: updateSectionRecursively(chapter.sections, sectionId, updateFn)
            }));
        });
    }, [toast]);

    const addSection = useCallback((parentId: string, title: string) => {
        setToc(currentToc => {
            const newToc = JSON.parse(JSON.stringify(currentToc));
            
            const parentChapter = newToc.find((c: ChapterType) => c.chapter === parentId);
            if (parentChapter) {
                const lastSectionNum = parentChapter.sections.reduce((max: number, s: SectionType) => {
                    const num = parseInt(s.id.split('.').pop() || '0');
                    return Math.max(max, num);
                }, 0);
                const newId = `${parentChapter.chapter}.${lastSectionNum + 1}`;
                const newSection: SectionType = {
                    id: newId,
                    title: title,
                    content: [placeholderContent(title, newId)],
                    subsections: []
                };
                parentChapter.sections.push(newSection);
                toast({ title: "Sección Añadida", description: `Se añadió la sección "${title}".` });
                setActiveSection(newSection);
                return newToc;
            }
            
            for (const chapter of newToc) {
                const parentSection = findSection(chapter.sections, parentId);
                if (parentSection) {
                    parentSection.subsections = parentSection.subsections || [];
                     const lastSubSectionNum = parentSection.subsections.reduce((max: number, s: SectionType) => {
                        const num = parseInt(s.id.split('.').pop() || '0');
                        return Math.max(max, num);
                    }, 0);
                    const newId = `${parentSection.id}.${lastSubSectionNum + 1}`;
                    const newSubSection: SectionType = {
                        id: newId,
                        title: title,
                        content: [placeholderContent(title, newId)],
                        subsections: []
                    };
                    parentSection.subsections.push(newSubSection);
                    toast({ title: "Subsección Añadida", description: `Se añadió la subsección "${title}".` });
                    setActiveSection(newSubSection);
                    return newToc;
                }
            }
            return newToc;
        });
    }, [toast]);

    const renameChapter = useCallback((chapterNum: string, newTitle: string) => {
        setToc(currentToc => {
            return currentToc.map(chapter => 
                chapter.chapter === chapterNum ? { ...chapter, title: newTitle } : chapter
            );
        });
        toast({ title: "Capítulo Renombrado", description: `El capítulo ${chapterNum} ahora se llama "${newTitle}".` });
    }, [toast]);

    const renameSection = useCallback((sectionId: string, newTitle: string) => {
        setToc(currentToc => {
            const newToc = [...currentToc];
            const updateFn = (section: SectionType) => {
                const updatedSection = { ...section, title: newTitle };
                if(activeSection?.id === sectionId) {
                    setActiveSection(updatedSection);
                }
                return updatedSection;
            };

            return newToc.map(chapter => ({
                ...chapter,
                sections: updateSectionRecursively(chapter.sections, sectionId, updateFn)
            }));
        });
        toast({ title: "Sección Renombrada", description: `La sección ${sectionId} ahora se llama "${newTitle}".` });
    }, [toast, activeSection]);

    return {
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
        renameSection
    };
}
