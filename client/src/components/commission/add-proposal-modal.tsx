import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { InsertProposal } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface AddProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProposalModal({ isOpen, onClose }: AddProposalModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertProposal>({
    proposta: "",
    valorTotal: 0,
    valorPago: 0,
    percentComissao: 0,
    valorComissaoPaga: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Convert string values to numbers for numeric fields
    const numericFields = ['valorTotal', 'valorPago', 'percentComissao', 'valorComissaoPaga'];
    const parsedValue = numericFields.includes(name) ? parseFloat(value) : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const addProposalMutation = useMutation({
    mutationFn: async (data: InsertProposal) => {
      const response = await apiRequest("POST", "/api/proposals", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Proposta adicionada",
        description: "A proposta foi adicionada com sucesso.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      resetForm();
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Não foi possível adicionar a proposta: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      proposta: "",
      valorTotal: 0,
      valorPago: 0,
      percentComissao: 0,
      valorComissaoPaga: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addProposalMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Proposta</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proposta">Proposta</Label>
                <Input
                  id="proposta"
                  name="proposta"
                  placeholder="Ex: 123.45 - Cliente"
                  value={formData.proposta}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorTotal">Valor Total (R$)</Label>
                <Input
                  id="valorTotal"
                  name="valorTotal"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.valorTotal || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorPago">Valor Pago (R$)</Label>
                <Input
                  id="valorPago"
                  name="valorPago"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.valorPago || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="percentComissao">% Comissão</Label>
                <Input
                  id="percentComissao"
                  name="percentComissao"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={formData.percentComissao || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="valorComissaoPaga">Valor Comissão Paga (R$)</Label>
                <Input
                  id="valorComissaoPaga"
                  name="valorComissaoPaga"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={formData.valorComissaoPaga || ""}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={addProposalMutation.isPending}>
              {addProposalMutation.isPending ? "Salvando..." : "Salvar Proposta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
