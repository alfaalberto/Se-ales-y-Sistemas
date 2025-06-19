"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';

interface HtmlAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (htmlContent: string) => void;
}

const HtmlAddModal: React.FC<HtmlAddModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [htmlContent, setHtmlContent] = useState('');

    const handleAdd = () => {
        if (htmlContent.trim()) {
            onAdd(htmlContent);
            setHtmlContent('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 border-gray-700 text-white sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">Añadir Contenido HTML</DialogTitle>
                </DialogHeader>
                <Textarea
                    value={htmlContent}
                    onChange={(e) => setHtmlContent(e.target.value)}
                    placeholder="<p>Pega tu código HTML aquí...</p>"
                    className="w-full h-64 bg-gray-900 text-gray-200 border border-gray-600 rounded-md p-3 font-mono text-sm focus-visible:ring-primary"
                    rows={10}
                />
                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button variant="outline" className="bg-gray-600 hover:bg-gray-700 text-white border-gray-600 hover:border-gray-500">
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button onClick={handleAdd} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Añadir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default HtmlAddModal;
