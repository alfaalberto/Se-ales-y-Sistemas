
"use client";

import React, { useEffect, useRef, useState } from 'react';
import type { ContentBlockType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface HtmlBlockProps {
    block: ContentBlockType;
    onEdit: () => void;
    onDelete: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
}

declare global {
    interface Window {
        MathJax?: any; 
        Chart?: any; 
    }
}

const HtmlBlock: React.FC<HtmlBlockProps> = React.memo(({ block: { id: blockId, html: htmlString }, onEdit, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const instanceId = useRef(`block-${crypto.randomUUID()}`).current;
    
    const [codeBlockData, setCodeBlockData] = useState<{ preId: string, placeholderId: string }[]>([]);
    const [codeBlocksVisibility, setCodeBlocksVisibility] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const container = blockRef.current;
        if (!container) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString; 

        const idMap = new Map<string, string>();
        const elementsWithId = tempDiv.querySelectorAll('[id]');
        elementsWithId.forEach(el => {
            const oldId = el.id;
            if (oldId) {
                const newId = `${instanceId}__${oldId}`;
                idMap.set(oldId, newId);
                el.id = newId;
            }
        });

        const scripts = tempDiv.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            let scriptContent = script.innerHTML;
            idMap.forEach((newId, oldId) => {
                const regex = new RegExp(`getElementById\\((['"])${oldId}\\1\\)`, 'g');
                scriptContent = scriptContent.replace(regex, `getElementById('${newId}')`);

                const querySelectorRegex = new RegExp(`querySelector\\((['"])#${oldId}\\1\\)`, 'g');
                scriptContent = scriptContent.replace(querySelectorRegex, `querySelector('#${newId.replace(/[:.]/g, '\\$&')}')`);
            });
            script.innerHTML = scriptContent;
        }
        
        const pres = Array.from(tempDiv.querySelectorAll('pre'));
        const newCodeBlockDataCollector: { preId: string, placeholderId: string }[] = [];
        const initialVisibilityStateCollector: Record<string, boolean> = {};

        pres.forEach((pre, index) => {
            let preId = pre.id; 
            if (!preId) { 
                preId = `${instanceId}__pre-${index}`;
                pre.id = preId;
            }
            
            const placeholderId = `${instanceId}__btn-placeholder-for-${preId.replace(/__/g, '-')}`;
            const placeholderDiv = document.createElement('div');
            placeholderDiv.id = placeholderId;
            
            pre.parentNode?.insertBefore(placeholderDiv, pre);

            newCodeBlockDataCollector.push({ preId, placeholderId });
            initialVisibilityStateCollector[preId] = true; 
        });
        
        const innerDiv = container.querySelector('.content-block-inner');
        if (innerDiv) {
            innerDiv.innerHTML = tempDiv.innerHTML;
        }
        
        setCodeBlockData(newCodeBlockDataCollector);
        setCodeBlocksVisibility(initialVisibilityStateCollector);

        const runScripts = () => {
            const scriptsToRun = Array.from(container.getElementsByTagName('script'));
            scriptsToRun.forEach(originalScript => {
                 if (!originalScript.closest('.content-block-inner')) return;
                
                const newScript = document.createElement('script');
                // Wrap in a try-catch and IIFE for safety and scoping
                newScript.textContent = `(function() { try { ${originalScript.innerHTML} } catch (e) { console.error('Error executing script for ${instanceId}:', e); } })();`;
                document.body.appendChild(newScript);
                // It's good practice to remove the script after execution if it's not needed long-term
                // However, for scripts that set up intervals or event listeners, this might not be desired.
                // For now, we'll remove it as it's common for one-off setup scripts.
                document.body.removeChild(newScript); 
                // Optionally, remove the original script from the static HTML to prevent re-execution on future innerHTML changes if not careful
                 originalScript.remove(); 
            });
        };

        const timerId = setTimeout(() => {
            if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                // Typeset only the specific blockRef to avoid re-typesetting the whole page
                window.MathJax.typesetPromise([container])
                    .catch((err: any) => console.error('MathJax typesetting failed:', err))
                    .finally(runScripts); // Run scripts after MathJax is done
            } else {
                runScripts(); // Run scripts if MathJax is not available or not configured for promises
            }
        }, 100); // Small delay to ensure DOM is fully updated

        return () => {
            clearTimeout(timerId);
            // Potentially clean up charts or other persistent elements if IDs were globally unique
            // and not scoped to instanceId. For instanceId-scoped elements, React's unmounting handles it.
        };
    }, [htmlString, instanceId]);


    useEffect(() => {
        const container = blockRef.current;
        if (!container || codeBlockData.length === 0) return;

        codeBlockData.forEach(({ preId, placeholderId }) => {
            const preElement = container.querySelector(`#${CSS.escape(preId)}`) as HTMLElement | null;
            const placeholderElement = container.querySelector(`#${CSS.escape(placeholderId)}`) as HTMLElement | null;
            
            if (preElement) {
                preElement.style.display = codeBlocksVisibility[preId] === false ? 'none' : '';
            }

            if (placeholderElement) {
                // Clear previous button if any
                while (placeholderElement.firstChild) {
                    placeholderElement.removeChild(placeholderElement.firstChild);
                }

                const button = document.createElement('button');
                // Using Tailwind classes directly for consistency with the app's styling
                button.className = "my-2 flex items-center gap-2 px-3 py-1.5 border border-input bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                
                const isVisible = codeBlocksVisibility[preId] !== false; // Default to true if undefined

                // Using SVG strings for icons
                const eyeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
                const eyeOffIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
                const codeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
                
                button.innerHTML = `${codeIconSvg} ${isVisible ? eyeOffIconSvg : eyeIconSvg} <span class="ml-1">${isVisible ? 'Ocultar' : 'Mostrar'} Código</span>`;
                
                button.onclick = () => {
                    setCodeBlocksVisibility(prevVisibilityState => ({
                        ...prevVisibilityState,
                        [preId]: !(prevVisibilityState[preId] !== false) // Toggle, defaulting to true if undefined
                    }));
                };
                placeholderElement.appendChild(button);
            }
        });

    }, [codeBlockData, codeBlocksVisibility, instanceId]);

    return (
        <div ref={blockRef} className="content-block group relative py-4 border-t-2 border-gray-700 first:pt-0 first:border-none">
            <div className="absolute top-2 right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button variant="ghost" size="icon" onClick={onEdit} title="Editar diapositiva" className="h-7 w-7 p-1 text-blue-400 hover:text-blue-300 hover:bg-gray-700">
                    <Pencil size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={onMoveUp} disabled={isFirst} title="Mover arriba" className="h-7 w-7 p-1 text-green-400 hover:text-green-300 hover:bg-gray-700 disabled:opacity-50">
                    <ArrowUpCircle size={16} />
                </Button>
                <Button variant="ghost" size="icon" onClick={onMoveDown} disabled={isLast} title="Mover abajo" className="h-7 w-7 p-1 text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 disabled:opacity-50">
                    <ArrowDownCircle size={16} />
                </Button>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" title="Eliminar diapositiva" className="h-7 w-7 p-1 text-red-400 hover:text-red-300 hover:bg-gray-700">
                            <Trash2 size={16} />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-card border-border text-card-foreground">
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto eliminará permanentemente la diapositiva.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="hover:bg-muted">Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
            <div className="content-block-inner relative">
                {/* El HTML del usuario se inyectará aquí por el primer useEffect */}
            </div>
        </div>
    );
});

HtmlBlock.displayName = 'HtmlBlock';
export default HtmlBlock;

    