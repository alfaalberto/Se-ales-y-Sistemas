"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Pencil, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import type { ContentBlockType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HtmlBlockProps {
    block: ContentBlockType;
    onSelect: (blockId: string) => void;
    isActive: boolean;
    onEdit: (blockId: string) => void;
    onDelete: (blockId: string) => void;
    onMove: (blockId: string, direction: 'up' | 'down') => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

declare global {
    interface Window {
        MathJax?: any; 
        Chart?: any; 
    }
}

const HtmlBlock: React.FC<HtmlBlockProps> = React.memo(({ block, onSelect, isActive, onEdit, onDelete, onMove, canMoveUp, canMoveDown }) => {
    const { id: blockId, html: htmlString } = block;
    const blockRef = useRef<HTMLDivElement>(null);
    const instanceId = useRef(`block-${crypto.randomUUID()}`).current;
    
    const [codeBlockData, setCodeBlockData] = useState<{ preId: string, placeholderId: string }[]>([]);
    const [codeBlocksVisibility, setCodeBlocksVisibility] = useState<Record<string, boolean>>({});

    useEffect(() => {
        let isMounted = true;
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
        } else {
            return;
        }
        
        if (isMounted) {
            setCodeBlockData(newCodeBlockDataCollector);
            setCodeBlocksVisibility(initialVisibilityStateCollector);
        }

        const runScripts = () => {
            if (!isMounted || !blockRef.current) return;
            const scriptsToRun = Array.from(blockRef.current.getElementsByTagName('script'));
            scriptsToRun.forEach(originalScript => {
                if (!originalScript.closest('.content-block-inner')) return;
                const newScript = document.createElement('script');
                newScript.textContent = `(function() { try { ${originalScript.innerHTML} } catch (e) { console.error('Error executing script for ${instanceId}:', e); } })();`;
                document.body.appendChild(newScript);
                document.body.removeChild(newScript); 
                originalScript.remove(); 
            });
        };

        const processContent = async () => {
            try {
                if (window.MathJax && window.MathJax.startup) {
                    await window.MathJax.startup.promise;
                }
                if (!isMounted) return;

                if (window.MathJax && typeof window.MathJax.typesetPromise === 'function' && blockRef.current) {
                    await window.MathJax.typesetPromise([blockRef.current]);
                }
                if (!isMounted) return;

            } catch (err) {
                if(isMounted) {
                    console.error("MathJax typesetting failed:", err);
                }
            } finally {
                if (isMounted) {
                    runScripts();
                }
            }
        };

        processContent();

        return () => {
            isMounted = false;
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
                while (placeholderElement.firstChild) {
                    placeholderElement.removeChild(placeholderElement.firstChild);
                }

                const button = document.createElement('button');
                button.className = "my-2 flex items-center gap-2 px-3 py-1.5 border border-input bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                
                const isVisible = codeBlocksVisibility[preId] !== false; 

                const eyeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
                const eyeOffIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
                const codeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;
                
                button.innerHTML = `${codeIconSvg} ${isVisible ? eyeOffIconSvg : eyeIconSvg} <span class="ml-1">${isVisible ? 'Ocultar' : 'Mostrar'} Código</span>`;
                
                button.onclick = () => {
                    setCodeBlocksVisibility(prevVisibilityState => ({
                        ...prevVisibilityState,
                        [preId]: !(prevVisibilityState[preId] !== false) 
                    }));
                };
                placeholderElement.appendChild(button);
            }
        });

    }, [codeBlockData, codeBlocksVisibility, instanceId]);

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    }

    return (
        <div 
            ref={blockRef} 
            className={cn(
                "content-block group relative p-4 border-t-2 border-border/30 first:pt-0 first:border-none cursor-pointer transition-all duration-150 ease-in-out prose dark:prose-invert max-w-none prose-headings:text-primary prose-p:text-foreground prose-strong:text-foreground prose-pre:bg-muted prose-pre:text-foreground",
                isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg bg-card' : 'hover:bg-card/50',
                'my-2 rounded-md' 
            )}
            onClick={() => onSelect(blockId)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(blockId); }}
            aria-pressed={isActive}
            aria-label={`Diapositiva ${blockId}${isActive ? ', seleccionada' : ''}`}
        >
            <div className="content-block-inner relative">
                {/* El HTML del usuario se inyectará aquí por el primer useEffect */}
            </div>
            {isActive && (
                <div className="absolute top-2 right-2 flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded-md p-1">
                     <TooltipProvider delayDuration={100}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={(e) => handleActionClick(e, () => onEdit(blockId))} variant="ghost" size="icon-sm" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                                    <Pencil size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Editar</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={(e) => handleActionClick(e, () => onMove(blockId, 'up'))} disabled={!canMoveUp} variant="ghost" size="icon-sm" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                                    <ArrowUpCircle size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Mover Arriba</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={(e) => handleActionClick(e, () => onMove(blockId, 'down'))} disabled={!canMoveDown} variant="ghost" size="icon-sm" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                                    <ArrowDownCircle size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Mover Abajo</p></TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button onClick={(e) => handleActionClick(e, () => onDelete(blockId))} variant="ghost" size="icon-sm" className="text-destructive hover:bg-destructive/90 hover:text-destructive-foreground">
                                    <Trash2 size={16} />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent><p>Eliminar</p></TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            )}
        </div>
    );
});

HtmlBlock.displayName = 'HtmlBlock';
export default HtmlBlock;
