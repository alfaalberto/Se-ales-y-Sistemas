
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface InputDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (value: string) => void;
    title: string;
    label: string;
    initialValue?: string;
    submitText?: string;
}

const InputDialog: React.FC<InputDialogProps> = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    title,
    label,
    initialValue = '', 
    submitText = "Confirmar" 
}) => {
    const [value, setValue] = useState(initialValue);

    useEffect(() => {
        if (isOpen) {
            setValue(initialValue);
        }
    }, [initialValue, isOpen]);

    const handleSubmit = () => {
        if (value.trim()) {
            onSubmit(value);
            onClose(); 
        }
    };
    
    const handleClose = () => {
        setValue(''); 
        onClose();
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleClose(); }}>
            <DialogContent className="bg-card border-border text-card-foreground sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="input-name" className="text-right">
                            {label}
                        </Label>
                        <Input
                            id="input-name"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            className="col-span-3"
                            autoFocus
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {submitText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InputDialog;
