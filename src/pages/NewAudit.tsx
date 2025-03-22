
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { createAudit } from "@/services/firebaseService";

const NewAudit = () => {
  const [clientName, setClientName] = useState("");
  const [envelopeBranch, setEnvelopeBranch] = useState("");
  const [locationFloor, setLocationFloor] = useState("");
  const [auditorName, setAuditorName] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to create an audit.",
        variant: "destructive",
      });
      return;
    }
    
    if (!clientName || !envelopeBranch || !locationFloor || !auditorName) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      console.log("Creating audit with user ID:", currentUser.uid);
      
      const auditData = {
        clientName,
        envelopeBranch,
        locationFloor,
        auditorName,
        userId: currentUser.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      console.log("Audit data:", auditData);
      const auditId = await createAudit(auditData);
      console.log("Audit created with ID:", auditId);
      
      toast({
        title: "Success",
        description: "Audit created successfully!",
        variant: "default",
      });
      
      navigate(`/audit/${auditId}`);
    } catch (error) {
      console.error("Error creating audit:", error);
      toast({
        title: "Error",
        description: "Failed to create audit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-bold">Create New Audit</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto animate-scale-in">
          <CardHeader>
            <CardTitle>New Energy Audit</CardTitle>
            <CardDescription>
              Fill out the basic information to start your energy audit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="ABC Corporation"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="envelopeBranch">Envelope/Branch</Label>
                <Input
                  id="envelopeBranch"
                  value={envelopeBranch}
                  onChange={(e) => setEnvelopeBranch(e.target.value)}
                  placeholder="Main Branch"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationFloor">Location/Floor</Label>
                <Input
                  id="locationFloor"
                  value={locationFloor}
                  onChange={(e) => setLocationFloor(e.target.value)}
                  placeholder="Floor 3, Main Building"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="auditorName">Auditor Name</Label>
                <Input
                  id="auditorName"
                  value={auditorName}
                  onChange={(e) => setAuditorName(e.target.value)}
                  placeholder="John Smith"
                  required
                />
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleSubmit} 
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Audit"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default NewAudit;
