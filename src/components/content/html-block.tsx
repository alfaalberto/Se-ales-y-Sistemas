"use client";

import React, { useEffect, useRef } from 'react';

interface HtmlBlockProps {
    htmlString: string;
}

declare global {
    interface Window {
        MathJax?: any; // Define MathJax on window
        Chart?: any; // Define Chart on window
    }
}

const HtmlBlock: React.FC<HtmlBlockProps> = React.memo(({ htmlString }) => {
    const blockRef = useRef<HTMLDivElement>(null);
    const instanceId = useRef(`block-${crypto.randomUUID()}`).current;

    useEffect(() => {
        const container = blockRef.current;
        if (!container) return;

        // Create a temporary div to parse the HTML string
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;

        // Create a map for ID rewriting
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

        // Rewrite getElementById calls in scripts
        const scripts = tempDiv.getElementsByTagName('script');
        for (const script of scripts) {
            let scriptContent = script.innerHTML;
            idMap.forEach((newId, oldId) => {
                // Regex to match getElementById('oldId') or getElementById("oldId")
                const regex = new RegExp(`getElementById\\((['"])${oldId}\\1\\)`, 'g');
                scriptContent = scriptContent.replace(regex, `getElementById('${newId}')`);
            });
            script.innerHTML = scriptContent;
        }
        
        // Set the processed HTML to the container
        container.innerHTML = tempDiv.innerHTML;

        // Function to execute scripts
        const runScripts = () => {
            const scriptsToRun = Array.from(container.getElementsByTagName('script'));
            scriptsToRun.forEach(originalScript => {
                const newScript = document.createElement('script');
                // Wrap script content in an IIFE with try-catch for safety
                newScript.textContent = `(function() { try { ${originalScript.innerHTML} } catch (e) { console.error('Error executing script for ${instanceId}:', e); } })();`;
                document.body.appendChild(newScript);
                // Clean up by removing the script tag from the body after execution
                document.body.removeChild(newScript);
                // Remove the original script tag from the content to prevent re-execution by other means
                originalScript.remove(); 
            });
        };

        // Delay execution slightly to ensure DOM is ready and other libraries might be loaded
        const timerId = setTimeout(() => {
            if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
                window.MathJax.typesetPromise([container])
                    .catch((err: any) => console.error('MathJax typesetting failed:', err))
                    .finally(runScripts);
            } else {
                runScripts();
            }
        }, 100); // 100ms delay

        // Cleanup function
        return () => {
            clearTimeout(timerId);
            // Optional: any other cleanup like removing Chart instances if they were tracked
        };
    }, [htmlString, instanceId]); // Rerun if htmlString or instanceId changes

    return <div ref={blockRef} className="content-block mt-8 pt-8 border-t-2 border-gray-700 first:mt-0 first:pt-0 first:border-none"></div>;
});

HtmlBlock.displayName = 'HtmlBlock';
export default HtmlBlock;
