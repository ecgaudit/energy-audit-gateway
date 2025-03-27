import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AirConditioningEquipment, AirConditioningFormState } from "@/types";
import { addAirConditioningEquipment, updateAirConditioningEquipment } from "@/services/firebaseService";

interface AirConditioningFormProps {
  auditId: string;
  onCancel: () => void;
  onSuccess: () => void;
  editingData?: AirConditioningEquipment;
}

const AirConditioningForm = ({ auditId, onCancel, onSuccess, editingData }: AirConditioningFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AirConditioningFormState>({
    roomName: '',
    occupancy: '',
    durationPerDay: '',
    daysPerWeek: '',
    remarks: '',
    quantity: '',
    inputPower: '',
    capacityBTU: '',
    capacityWatt: '',
    eer: '',
    roomLength: '',
    roomWidth: '',
    roomHeight: '',
    acType: 'Central',
    otherAcType: '',
  });

  const { toast } = useToast();

  useEffect(() => {
    if (editingData) {
      setFormData({
        roomName: editingData.roomName,
        occupancy: editingData.occupancy.toString(),
        durationPerDay: editingData.durationPerDay.toString(),
        daysPerWeek: editingData.daysPerWeek.toString(),
        remarks: editingData.remarks,
        quantity: editingData.quantity.toString(),
        inputPower: editingData.inputPower.toString(),
        capacityBTU: editingData.capacityBTU.toString(),
        capacityWatt: editingData.capacityWatt.toString(),
        eer: editingData.eer.toString(),
        roomLength: editingData.roomLength.toString(),
        roomWidth: editingData.roomWidth.toString(),
        roomHeight: editingData.roomHeight.toString(),
        acType: editingData.acType,
        otherAcType: editingData.otherAcType,
      });
    }
  }, [editingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert string values to numbers before saving
      const equipmentData: Omit<AirConditioningEquipment, 'id' | 'auditId'> = {
        ...formData,
        occupancy: Number(formData.occupancy),
        durationPerDay: Number(formData.durationPerDay),
        daysPerWeek: Number(formData.daysPerWeek),
        quantity: Number(formData.quantity),
        inputPower: Number(formData.inputPower),
        capacityBTU: Number(formData.capacityBTU),
        capacityWatt: Number(formData.capacityWatt),
        eer: Number(formData.eer),
        roomLength: Number(formData.roomLength),
        roomWidth: Number(formData.roomWidth),
        roomHeight: Number(formData.roomHeight),
        auditId,
      };
      
      if (editingData?.id) {
        await updateAirConditioningEquipment(editingData.id, equipmentData);
        
        toast({
          title: "Success",
          description: "Equipment updated successfully!",
          variant: "default",
        });
      } else {
        await addAirConditioningEquipment(equipmentData);
        
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
        <CardTitle>{editingData ? 'Edit Air Conditioning Equipment' : 'Add Air Conditioning Equipment'}</CardTitle>
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
              <Label htmlFor="acType">AC Type</Label>
              <Select
                value={formData.acType}
                onValueChange={(value) => setFormData({ ...formData, acType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select AC Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Central">Central</SelectItem>
                  <SelectItem value="Standing">Standing</SelectItem>
                  <SelectItem value="Split">Split</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.acType === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="otherAcType">Specify AC Type</Label>
                <Input
                  id="otherAcType"
                  name="otherAcType"
                  value={formData.otherAcType}
                  onChange={(e) => setFormData({ ...formData, otherAcType: e.target.value })}
                  placeholder="Enter AC type"
                  required
                />
              </div>
            )}
            
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
              <Label htmlFor="inputPower">Input Power (W)</Label>
              <Input
                id="inputPower"
                name="inputPower"
                type="number"
                value={formData.inputPower}
                onChange={(e) => setFormData({ ...formData, inputPower: e.target.value })}
                placeholder="e.g. 1500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacityBTU">Capacity (BTU)</Label>
              <Input
                id="capacityBTU"
                name="capacityBTU"
                type="number"
                value={formData.capacityBTU}
                onChange={(e) => setFormData({ ...formData, capacityBTU: e.target.value })}
                placeholder="e.g. 12000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="capacityWatt">Capacity (W)</Label>
              <Input
                id="capacityWatt"
                name="capacityWatt"
                type="number"
                value={formData.capacityWatt}
                onChange={(e) => setFormData({ ...formData, capacityWatt: e.target.value })}
                placeholder="e.g. 3500"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="eer">EER (Energy Efficiency Ratio)</Label>
              <Input
                id="eer"
                name="eer"
                type="number"
                step="0.1"
                value={formData.eer}
                onChange={(e) => setFormData({ ...formData, eer: e.target.value })}
                placeholder="e.g. 10.5"
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
                onChange={(e) => setFormData({ ...formData, roomLength: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, roomWidth: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, roomHeight: e.target.value })}
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

export default AirConditioningForm;
