"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, Sparkles } from 'lucide-react';
import { Label } from '../ui/label';

interface AiGenerateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (prompt: string) => void;
    isGenerating: boolean;
    sectionTitle: string;
}

const AiGenerateModal: React.FC<AiGenerateModalProps> = ({ 
    isOpen, 
    onClose, 
    onGenerate,
    isGenerating,
    sectionTitle
}) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = () => {
        if (prompt.trim() && !isGenerating) {
            onGenerate(prompt);
        }
    };
    
    const handleClose = () => {
        if (!isGenerating) {
            setPrompt(''); 
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="bg-card border-border text-card-foreground sm:max-w-[600px] md:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <Sparkles className="text-primary" />
                        Generar Diapositiva con IA
                    </DialogTitle>
                     <p className="text-sm text-muted-foreground pt-2">
                        Estás añadiendo contenido a la sección: <strong className="text-primary">{sectionTitle}</strong>.
                     </p>
                </DialogHeader>

                <div className="py-4 space-y-2">
                    <Label htmlFor="ai-prompt" className="text-base">¿Sobre qué tema quieres crear contenido?</Label>
                    <Textarea
                        id="ai-prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Ej: 'Explica la convolución discreta con un ejemplo simple y su fórmula matemática'..."
                        className="w-full h-48 bg-input text-foreground border-border rounded-md p-3 font-mono text-sm focus-visible:ring-primary resize-y"
                        rows={5}
                        disabled={isGenerating}
                    />
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleClose} disabled={isGenerating}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button 
                        onClick={handleGenerate} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        disabled={!prompt.trim() || isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generando...
                            </>
                        ) : "Generar Contenido"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AiGenerateModal;
