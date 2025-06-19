
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
        // Actualiza el contenido del textarea si initialContent cambia mientras el modal está abierto
        // Esto es útil si el usuario abre el modal para editar, cierra, y luego lo abre para editar otro bloque.
        if (isOpen) {
            setHtmlContent(initialContent);
        }
    }, [initialContent, isOpen]);

    const handleAdd = () => {
        if (htmlContent.trim()) {
            onAdd(htmlContent);
            // No limpiar htmlContent aquí, onClose o el cambio de initialContent lo manejan.
            onClose(); // Cierra el modal después de añadir/editar.
        }
    };
    
    const handleClose = () => {
        setHtmlContent(''); // Limpia al cerrar manualmente o al cambiar isOpen a false
        onClose();
    };


    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">{modalTitle}</DialogTitle>
                </DialogHeader>
                <Textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="<p>Pega tu código HTML aquí...</p>"
                    className="w-full h-96 bg-gray-900 text-gray-200 border border-gray-600 rounded-md p-3 font-mono text-sm focus-visible:ring-primary resize-y"
                    rows={15}
                />
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleClose} className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button onClick={handleAdd} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        {confirmButtonText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default HtmlAddModal;
