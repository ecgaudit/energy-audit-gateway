import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { OtherEquipment, OtherEquipmentFormState } from "@/types";
import { addOtherEquipment, updateOtherEquipment } from "@/services/firebaseService";

interface OtherEquipmentFormProps {
  auditId: string;
  onCancel: () => void;
  onSuccess: () => void;
  editingData?: OtherEquipment;
}

const OtherEquipmentForm = ({ auditId, onCancel, onSuccess, editingData }: OtherEquipmentFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OtherEquipmentFormState>({
    roomName: '',
    occupancy: '',
    equipmentName: '',
    equipmentType: '',
    durationPerDay: '',
    daysPerWeek: '',
    remarks: '',
    quantity: '',
    power: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    if (editingData) {
      setFormData({
        roomName: editingData.roomName,
        occupancy: editingData.occupancy.toString(),
        equipmentName: editingData.equipmentName,
        equipmentType: editingData.equipmentType,
        durationPerDay: editingData.durationPerDay.toString(),
        daysPerWeek: editingData.daysPerWeek.toString(),
        remarks: editingData.remarks,
        quantity: editingData.quantity.toString(),
        power: editingData.power.toString(),
      });
    }
  }, [editingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert string values to numbers before saving
      const equipmentData: Omit<OtherEquipment, 'id' | 'auditId'> = {
        ...formData,
        occupancy: Number(formData.occupancy),
        durationPerDay: Number(formData.durationPerDay),
        daysPerWeek: Number(formData.daysPerWeek),
        quantity: Number(formData.quantity),
        power: Number(formData.power),
        auditId,
      };
      
      if (editingData?.id) {
        await updateOtherEquipment(editingData.id, equipmentData);
        
        toast({
          title: "Success",
          description: "Equipment updated successfully!",
          variant: "default",
        });
      } else {
        await addOtherEquipment(equipmentData);
        
        toast({
          title: "Success",
          description: "Equipment added successfully!",
          variant: "default",
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving equipment:", error);
      toast({
        title: "Error",
        description: "Failed to save equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>{editingData ? 'Edit Other Equipment' : 'Add Other Equipment'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roomName">Room Name/Number</Label>
              <Input
                id="roomName"
                name="roomName"
                value={formData.roomName}
                onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                placeholder="e.g. Room 101, Office A"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="occupancy">Occupancy (people)</Label>
              <Input
                id="occupancy"
                name="occupancy"
                type="number"
                value={formData.occupancy}
                onChange={(e) => setFormData({ ...formData, occupancy: e.target.value })}
                placeholder="e.g. 4"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipmentName">Equipment Name</Label>
              <Input
                id="equipmentName"
                name="equipmentName"
                value={formData.equipmentName}
                onChange={(e) => setFormData({ ...formData, equipmentName: e.target.value })}
                placeholder="e.g. Computer, Printer, Refrigerator"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="equipmentType">Equipment Type</Label>
              <Input
                id="equipmentType"
                name="equipmentType"
                value={formData.equipmentType}
                onChange={(e) => setFormData({ ...formData, equipmentType: e.target.value })}
                placeholder="e.g. Office Equipment, Kitchen Equipment"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="e.g. 2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="power">Power (W)</Label>
              <Input
                id="power"
                name="power"
                type="number"
                value={formData.power}
                onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                placeholder="e.g. 1500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="durationPerDay">Duration (hours/day)</Label>
              <Input
                id="durationPerDay"
                name="durationPerDay"
                type="number"
                step="0.5"
                value={formData.durationPerDay}
                onChange={(e) => setFormData({ ...formData, durationPerDay: e.target.value })}
                placeholder="e.g. 8.5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="daysPerWeek">Days per Week</Label>
              <Input
                id="daysPerWeek"
                name="daysPerWeek"
                type="number"
                min="1"
                max="7"
                value={formData.daysPerWeek}
                onChange={(e) => setFormData({ ...formData, daysPerWeek: e.target.value })}
                placeholder="e.g. 5"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea
              id="remarks"
              name="remarks"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              placeholder="Additional notes about this equipment..."
              rows={3}
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : editingData ? "Update" : "Add"} Equipment
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OtherEquipmentForm;
