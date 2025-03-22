import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Clipboard, MapPin, User, Plus, FileText, Save, Trash2, Pencil } from "lucide-react";
import { getAudit, getFullAuditData, deleteAudit } from "@/services/firebaseService";
import { AuditData, AuditBase, AirConditioningEquipment, LightingEquipment, OtherEquipment } from "@/types";
import AirConditioningForm from "@/components/AirConditioningForm";
import LightingForm from "@/components/LightingForm";
import OtherEquipmentForm from "@/components/OtherEquipmentForm";
import AirConditioningList from "@/components/AirConditioningList";
import LightingList from "@/components/LightingList";
import OtherEquipmentList from "@/components/OtherEquipmentList";
import AuditReport from "@/components/AuditReport";
import AuditEditForm from "@/components/AuditEditForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AuditDetail = () => {
  const { auditId } = useParams<{ auditId: string }>();
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<{
    type: 'airConditioning' | 'lighting' | 'otherEquipment';
    data: AirConditioningEquipment | LightingEquipment | OtherEquipment;
  } | null>(null);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAuditData = async () => {
      if (!auditId) return;
      
      try {
        setLoading(true);
        const fullData = await getFullAuditData(auditId);
        setAuditData(fullData);
      } catch (error) {
        console.error("Error fetching audit data:", error);
        toast({
          title: "Error",
          description: "Failed to load audit data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAuditData();
  }, [auditId, toast]);

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setShowForm(true);
  };

  const handleEditEquipment = (type: 'airConditioning' | 'lighting' | 'otherEquipment', data: any) => {
    setEditingEquipment({ type, data });
    setShowForm(true);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingEquipment(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingEquipment(null);
    refreshAuditData();
  };

  const handleEditAudit = () => {
    setShowEditForm(true);
  };

  const handleEditAuditCancel = () => {
    setShowEditForm(false);
  };

  const handleEditAuditSuccess = () => {
    setShowEditForm(false);
    refreshAuditData();
  };

  const handleDeleteAudit = async () => {
    if (!auditId) return;
    
    try {
      await deleteAudit(auditId);
      toast({
        title: "Success",
        description: "Audit deleted successfully!",
        variant: "default",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting audit:", error);
      toast({
        title: "Error",
        description: "Failed to delete audit. Please try again.",
        variant: "destructive",
      });
    }
  };

  const refreshAuditData = () => {
    if (auditId) {
      getFullAuditData(auditId).then(data => {
        setAuditData(data);
      }).catch(error => {
        console.error("Error refreshing audit data:", error);
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-center">
          <div className="text-lg font-medium">Loading audit data...</div>
        </div>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Audit Not Found</h2>
          <p className="mb-6">The audit you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate("/dashboard")}>Back to Dashboard</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Button 
            variant="ghost" 
            className="mb-2 p-0 hover:bg-transparent" 
            onClick={() => navigate("/dashboard")}
          >
            <ChevronLeft className="mr-1 h-4 w-4" /> Back to Dashboard
          </Button>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <h1 className="text-2xl font-bold">{auditData.audit.clientName}</h1>
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4" /> {auditData.audit.locationFloor}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <Clipboard className="mr-1 h-4 w-4" /> {auditData.audit.envelopeBranch}
                </span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  <User className="mr-1 h-4 w-4" /> {auditData.audit.auditorName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleEditAudit}>
                  <Pencil className="mr-1 h-4 w-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-4 w-4" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Audit</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this audit? This action cannot be undone and will delete all associated equipment data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAudit}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {showEditForm ? (
          <AuditEditForm
            auditId={auditId!}
            initialData={auditData.audit}
            onCancel={handleEditAuditCancel}
            onSuccess={handleEditAuditSuccess}
          />
        ) : (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="animate-fade-in">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="airConditioning">Air Conditioning</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
              <TabsTrigger value="otherEquipment">Other Equipment</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="animate-slide-in">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Audit Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Air Conditioning Equipment</h3>
                    <p className="text-2xl font-bold">{auditData.airConditioning.length}</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Lighting Equipment</h3>
                    <p className="text-2xl font-bold">{auditData.lighting.length}</p>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Other Equipment</h3>
                    <p className="text-2xl font-bold">{auditData.otherEquipment.length}</p>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab("airConditioning")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Air Conditioning
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab("lighting")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Lighting
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab("otherEquipment")}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Other Equipment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setActiveTab("report")}
                  >
                    <FileText className="mr-2 h-4 w-4" /> Generate Report
                  </Button>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="airConditioning" className="animate-slide-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Air Conditioning Equipment</h2>
                {!showForm && (
                  <Button onClick={handleAddEquipment}>
                    <Plus className="mr-2 h-4 w-4" /> Add Equipment
                  </Button>
                )}
              </div>
              
              {showForm ? (
                <AirConditioningForm 
                  auditId={auditId!} 
                  onCancel={handleFormCancel} 
                  onSuccess={handleFormSuccess}
                  editingData={editingEquipment?.type === 'airConditioning' ? editingEquipment.data as AirConditioningEquipment : undefined}
                />
              ) : (
                <AirConditioningList 
                  items={auditData.airConditioning} 
                  onRefresh={handleFormSuccess}
                  onEdit={(data) => handleEditEquipment('airConditioning', data)}
                />
              )}
            </TabsContent>
            
            <TabsContent value="lighting" className="animate-slide-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Lighting Equipment</h2>
                {!showForm && (
                  <Button onClick={handleAddEquipment}>
                    <Plus className="mr-2 h-4 w-4" /> Add Equipment
                  </Button>
                )}
              </div>
              
              {showForm ? (
                <LightingForm 
                  auditId={auditId!} 
                  onCancel={handleFormCancel} 
                  onSuccess={handleFormSuccess}
                  editingData={editingEquipment?.type === 'lighting' ? editingEquipment.data as LightingEquipment : undefined}
                />
              ) : (
                <LightingList 
                  items={auditData.lighting}
                  onRefresh={handleFormSuccess}
                  onEdit={(data) => handleEditEquipment('lighting', data)}
                />
              )}
            </TabsContent>
            
            <TabsContent value="otherEquipment" className="animate-slide-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Other Equipment</h2>
                {!showForm && (
                  <Button onClick={handleAddEquipment}>
                    <Plus className="mr-2 h-4 w-4" /> Add Equipment
                  </Button>
                )}
              </div>
              
              {showForm ? (
                <OtherEquipmentForm 
                  auditId={auditId!} 
                  onCancel={handleFormCancel} 
                  onSuccess={handleFormSuccess}
                  editingData={editingEquipment?.type === 'otherEquipment' ? editingEquipment.data as OtherEquipment : undefined}
                />
              ) : (
                <OtherEquipmentList 
                  items={auditData.otherEquipment}
                  onRefresh={handleFormSuccess}
                  onEdit={(data) => handleEditEquipment('otherEquipment', data)}
                />
              )}
            </TabsContent>
            
            <TabsContent value="report" className="animate-slide-in">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Audit Report</h2>
                <p className="text-muted-foreground mb-6">
                  View and generate a comprehensive report of all equipment data and energy usage analysis.
                </p>
                
                {auditData && <AuditReport data={auditData} />}
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AuditDetail;
