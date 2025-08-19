
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TableInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (rows: number, cols: number) => void;
}

const TableInsertDialog: React.FC<TableInsertDialogProps> = ({
  open,
  onOpenChange,
  onInsert,
}) => {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);

  const handleInsert = () => {
    if (rows > 0 && cols > 0) {
      onInsert(rows, cols);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insertar Tabla</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">Filas</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              />
            </div>
            <div>
              <Label htmlFor="cols">Columnas</Label>
              <Input
                id="cols"
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleInsert}>
              Insertar Tabla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableInsertDialog;
