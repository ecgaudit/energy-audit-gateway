import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { OtherEquipment } from "@/types";
import { deleteOtherEquipment } from "@/services/firebaseService";

interface OtherEquipmentListProps {
  items: OtherEquipment[];
  onRefresh: () => void;
  onEdit: (data: OtherEquipment) => void;
}

const OtherEquipmentList = ({ items, onRefresh, onEdit }: OtherEquipmentListProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (equipmentId: string) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteOtherEquipment(equipmentId);
      
      toast({
        title: "Success",
        description: "Equipment deleted successfully!",
        variant: "default",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast({
        title: "Error",
        description: "Failed to delete equipment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="text-center p-8 animate-fade-in">
        <CardContent>
          <p className="text-muted-foreground mb-4">No other equipment has been added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="rounded-md border animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Room Name</TableHead>
              <TableHead>Occupancy</TableHead>
              <TableHead>Equipment Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Power (W)</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.roomName}</TableCell>
                <TableCell>{item.occupancy}</TableCell>
                <TableCell>{item.equipmentName}</TableCell>
                <TableCell>{item.equipmentType}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.power} W</TableCell>
                <TableCell>
                  {item.durationPerDay} hrs/day, {item.daysPerWeek} days/week
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => onEdit(item)}
                      disabled={loading}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => item.id && handleDelete(item.id)}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OtherEquipmentList;
