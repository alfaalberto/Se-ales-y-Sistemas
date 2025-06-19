
"use client";

import React, { useEffect, useRef, useState } from 'react';

interface HtmlBlockProps {
    htmlString: string;
}

declare global {
    interface Window {
        MathJax?: any; 
        Chart?: any; 
    }
}

const HtmlBlock: React.FC<HtmlBlockProps> = React.memo(({ htmlString }) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const instanceId = useRef(`block-${crypto.randomUUID()}`).current;
    
    // Stores { preId: string, placeholderId: string } for each code block
    const [codeBlockData, setCodeBlockData] = useState<{ preId: string, placeholderId: string }[]>([]);
    // Stores visibility state for each code block: Record<preId, boolean>
    const [codeBlocksVisibility, setCodeBlocksVisibility] = useState<Record<string, boolean>>({});

    // Effect 1: Parse HTML, inject placeholders for buttons, set up initial state for visibility and refs
    useEffect(() => {
        const container = blockRef.current;
        if (!container) return;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString; // Initial parse of the HTML string

        // --- Start: ID rewriting for MathJax and scripts (existing logic) ---
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
        for (const script of scripts) {
            let scriptContent = script.innerHTML;
            idMap.forEach((newId, oldId) => {
                const regex = new RegExp(`getElementById\\((['"])${oldId}\\1\\)`, 'g');
                scriptContent = scriptContent.replace(regex, `getElementById('${newId}')`);
            });
            script.innerHTML = scriptContent;
        }
        // --- End: ID rewriting ---
        
        // Identify <pre> tags and prepare for button injection
        const pres = Array.from(tempDiv.querySelectorAll('pre'));
        const newCodeBlockDataCollector: { preId: string, placeholderId: string }[] = [];
        const initialVisibilityStateCollector: Record<string, boolean> = {};

        pres.forEach((pre, index) => {
            let preId = pre.id; // Use existing ID if available (it would have been prefixed by ID rewriting)
            if (!preId) { // Or generate a new unique ID for the <pre> tag
                preId = `${instanceId}__pre-${index}`;
                pre.id = preId;
            }
            
            // Create a unique ID for the button's placeholder div
            const placeholderId = `${instanceId}__btn-placeholder-for-${preId.replace(/__/g, '-')}`;
            const placeholderDiv = document.createElement('div');
            placeholderDiv.id = placeholderId;
            
            // Insert the placeholder div into the DOM right before the <pre> tag
            pre.parentNode?.insertBefore(placeholderDiv, pre);

            newCodeBlockDataCollector.push({ preId, placeholderId });
            initialVisibilityStateCollector[preId] = true; // Default: code blocks are visible
        });
        
        // Set the processed HTML (now including placeholders and rewritten IDs) to the container
        container.innerHTML = tempDiv.innerHTML;
        
        // Update React state. This will trigger the second useEffect to render the actual buttons.
        setCodeBlockData(newCodeBlockDataCollector);
        setCodeBlocksVisibility(initialVisibilityStateCollector);

        // --- Start: Script execution and MathJax (existing logic) ---
        const runScripts = () => {
            const scriptsToRun = Array.from(container.getElementsByTagName('script'));
            scriptsToRun.forEach(originalScript => {
                // Ensure the script is part of this HtmlBlock instance before executing
                if (originalScript.closest('.content-block') !== container) return; 
                
                const newScript = document.createElement('script');
                // Wrap script content in an IIFE with try-catch for safety
                newScript.textContent = `(function() { try { ${originalScript.innerHTML} } catch (e) { console.error('Error executing script for ${instanceId}:', e); } })();`;
                document.body.appendChild(newScript);
                // Clean up by removing the script tag from the body after execution
                document.body.removeChild(newScript);
                // Remove the original script tag from the content to prevent re-execution
                originalScript.remove(); 
            });
        };

        const timerId = setTimeout(() => {
            if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                window.MathJax.typesetPromise([container])
                    .catch((err: any) => console.error('MathJax typesetting failed:', err))
                    .finally(runScripts);
            } else {
                runScripts();
            }
        }, 100); // Delay for DOM readiness

        return () => {
            clearTimeout(timerId);
            // Potential cleanup for dynamically added elements or listeners if htmlString changes
        };
    }, [htmlString, instanceId]);


    // Effect 2: Render/update toggle buttons and manage <pre> element visibility
    useEffect(() => {
        const container = blockRef.current;
        // Only proceed if the container exists and there's data for code blocks
        if (!container || codeBlockData.length === 0) return;

        codeBlockData.forEach(({ preId, placeholderId }) => {
            const preElement = container.querySelector(`#${CSS.escape(preId)}`) as HTMLElement | null;
            const placeholderElement = container.querySelector(`#${CSS.escape(placeholderId)}`) as HTMLElement | null;
            
            // Toggle the display style of the <pre> element based on its visibility state
            if (preElement) {
                preElement.style.display = codeBlocksVisibility[preId] === false ? 'none' : '';
            }

            if (placeholderElement) {
                // Clear any previous button from the placeholder
                while (placeholderElement.firstChild) {
                    placeholderElement.removeChild(placeholderElement.firstChild);
                }

                const button = document.createElement('button');
                // Apply Tailwind classes for styling. These rely on global CSS and theme variables.
                button.className = "my-2 flex items-center gap-2 px-3 py-1.5 border border-input bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground rounded-md text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
                
                // Determine visibility (true if not explicitly false, handles undefined initial state)
                const isVisible = codeBlocksVisibility[preId] !== false;

                // SVG icons (inlined)
                const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
                const eyeOffIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`;
                const codeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-code-2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`;

                // Set button content with icons and text based on visibility
                button.innerHTML = `${codeIcon} ${isVisible ? eyeOffIcon : eyeIcon} <span class="ml-1">${isVisible ? 'Ocultar' : 'Mostrar'} Código</span>`;
                
                // Attach click event listener to toggle visibility state in React
                button.onclick = () => {
                    setCodeBlocksVisibility(prevVisibilityState => ({
                        ...prevVisibilityState,
                        [preId]: !(prevVisibilityState[preId] !== false) // Toggle state correctly
                    }));
                };
                placeholderElement.appendChild(button); // Add the button to its placeholder
            }
        });
    }, [codeBlockData, codeBlocksVisibility, instanceId]); // Rerun if data or visibility changes

    // The main div that gets its innerHTML set by the first useEffect
    return <div ref={blockRef} className="content-block py-4 border-t-2 border-gray-700 first:pt-0 first:border-none"></div>;
});

HtmlBlock.displayName = 'HtmlBlock';
export default HtmlBlock;

    
