
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface HtmlAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (htmlContent: string) => void;
    initialContent?: string;
    modalTitle?: string;
    confirmButtonText?: string;
}

const HtmlAddModal: React.FC<HtmlAddModalProps> = ({ 
    isOpen, 
    onClose, 
    onAdd, 
    initialContent = '', 
    modalTitle = "Añadir Contenido HTML", 
    confirmButtonText = "Añadir" 
}) => {
    const [htmlContent, setHtmlContent] = useState(initialContent);

    useEffect(() => {
        if (isOpen) {
            setHtmlContent(initialContent);
        }
    }, [initialContent, isOpen]);

    const handleAdd = () => {
        if (htmlContent.trim()) {
            onAdd(htmlContent);
            onClose(); 
        }
    };
    
    const handleClose = () => {
        setHtmlContent(''); 
        onClose();
    };


    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="bg-card border-border text-card-foreground sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">{modalTitle}</DialogTitle>
                </DialogHeader>
                <Textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="<p>Pega tu código HTML aquí...</p>"
                    className="w-full h-96 bg-input text-foreground border-border rounded-md p-3 font-mono text-sm focus-visible:ring-primary resize-y"
                    rows={15}
                />
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button onClick={handleAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {confirmButtonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default HtmlAddModal;

    