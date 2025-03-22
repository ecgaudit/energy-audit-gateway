import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuditBase } from "@/types";
import { updateAudit } from "@/services/firebaseService";

interface AuditEditFormProps {
  auditId: string;
  initialData: AuditBase;
  onCancel: () => void;
  onSuccess: () => void;
}

const AuditEditForm = ({ auditId, initialData, onCancel, onSuccess }: AuditEditFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<AuditBase, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>({
    clientName: initialData.clientName,
    envelopeBranch: initialData.envelopeBranch,
    locationFloor: initialData.locationFloor,
    auditorName: initialData.auditorName,
  });

  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await updateAudit(auditId, formData);
      
      toast({
        title: "Success",
        description: "Audit information updated successfully!",
        variant: "default",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error updating audit:", error);
      toast({
        title: "Error",
        description: "Failed to update audit information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>Edit Audit Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="ABC Corporation"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="envelopeBranch">Envelope/Branch</Label>
            <Input
              id="envelopeBranch"
              value={formData.envelopeBranch}
              onChange={(e) => setFormData({ ...formData, envelopeBranch: e.target.value })}
              placeholder="Main Branch"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="locationFloor">Location/Floor</Label>
            <Input
              id="locationFloor"
              value={formData.locationFloor}
              onChange={(e) => setFormData({ ...formData, locationFloor: e.target.value })}
              placeholder="Floor 3, Main Building"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="auditorName">Auditor Name</Label>
            <Input
              id="auditorName"
              value={formData.auditorName}
              onChange={(e) => setFormData({ ...formData, auditorName: e.target.value })}
              placeholder="John Smith"
              required
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AuditEditForm; 