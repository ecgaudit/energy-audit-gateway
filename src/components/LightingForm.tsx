import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LightingEquipment } from "@/types";
import { addLightingEquipment, updateLightingEquipment } from "@/services/firebaseService";

interface LightingFormProps {
  auditId: string;
  onCancel: () => void;
  onSuccess: () => void;
  editingData?: LightingEquipment;
}

const LightingForm = ({ auditId, onCancel, onSuccess, editingData }: LightingFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Omit<LightingEquipment, 'id' | 'auditId'>>({
    roomName: '',
    occupancy: 0,
    durationPerDay: 0,
    daysPerWeek: 0,
    remarks: '',
    quantity: 0,
    power: 0,
    roomLength: 0,
    roomWidth: 0,
    roomHeight: 0,
  });

  const { toast } = useToast();

  useEffect(() => {
    if (editingData) {
      setFormData({
        roomName: editingData.roomName,
        occupancy: editingData.occupancy,
        durationPerDay: editingData.durationPerDay,
        daysPerWeek: editingData.daysPerWeek,
        remarks: editingData.remarks,
        quantity: editingData.quantity,
        power: editingData.power,
        roomLength: editingData.roomLength,
        roomWidth: editingData.roomWidth,
        roomHeight: editingData.roomHeight,
      });
    }
  }, [editingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (editingData?.id) {
        await updateLightingEquipment(editingData.id, {
          ...formData,
          auditId,
        });
        
        toast({
          title: "Success",
          description: "Equipment updated successfully!",
          variant: "default",
        });
      } else {
        await addLightingEquipment({
          ...formData,
          auditId,
        });
        
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
        <CardTitle>{editingData ? 'Edit Lighting Equipment' : 'Add Lighting Equipment'}</CardTitle>
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
                onChange={(e) => setFormData({ ...formData, occupancy: Number(e.target.value) })}
                placeholder="e.g. 4"
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
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
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
                onChange={(e) => setFormData({ ...formData, power: Number(e.target.value) })}
                placeholder="e.g. 1500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomLength">Room Length (m)</Label>
              <Input
                id="roomLength"
                name="roomLength"
                type="number"
                step="0.01"
                value={formData.roomLength}
                onChange={(e) => setFormData({ ...formData, roomLength: Number(e.target.value) })}
                placeholder="e.g. 5.5"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomWidth">Room Width (m)</Label>
              <Input
                id="roomWidth"
                name="roomWidth"
                type="number"
                step="0.01"
                value={formData.roomWidth}
                onChange={(e) => setFormData({ ...formData, roomWidth: Number(e.target.value) })}
                placeholder="e.g. 4.2"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="roomHeight">Room Height (m)</Label>
              <Input
                id="roomHeight"
                name="roomHeight"
                type="number"
                step="0.01"
                value={formData.roomHeight}
                onChange={(e) => setFormData({ ...formData, roomHeight: Number(e.target.value) })}
                placeholder="e.g. 3.0"
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
                onChange={(e) => setFormData({ ...formData, durationPerDay: Number(e.target.value) })}
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
                onChange={(e) => setFormData({ ...formData, daysPerWeek: Number(e.target.value) })}
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

export default LightingForm;
