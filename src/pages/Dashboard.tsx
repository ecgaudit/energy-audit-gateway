import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Clipboard, Zap, Settings, LogOut, FileText, BarChart3 } from "lucide-react";
import { getAudits } from "@/services/firebaseService";
import { AuditBase } from "@/types";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const [audits, setAudits] = useState<(AuditBase & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, logout, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAudits = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const auditData = await getAudits(currentUser.uid);
        setAudits(auditData as (AuditBase & { id: string })[]);
      } catch (error) {
        console.error("Error fetching audits:", error);
        toast({
          title: "Error",
          description: "Failed to load your audits. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAudits();
  }, [currentUser, toast]);

  const handleNewAudit = () => {
    navigate("/new-audit");
  };

  const handleOpenAudit = (auditId: string) => {
    navigate(`/audit/${auditId}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Energy Audit Portal</h1>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Button variant="ghost" className="h-8 px-2" onClick={() => navigate("/dashboard")}>
              <Clipboard className="mr-2 h-4 w-4" />
              My Audits
            </Button>
            {userRole === "manager" && (
              <Button variant="ghost" className="h-8 px-2" onClick={() => navigate("/manager")}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Manager Dashboard
              </Button>
            )}
            <Button variant="ghost" className="h-8 px-2" onClick={handleNewAudit}>
              <FileText className="mr-2 h-4 w-4" />
              New Audit
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Audits</h2>
          <Button onClick={handleNewAudit} className="animate-fade-in">
            <PlusCircle className="mr-2 h-4 w-4" /> New Audit
          </Button>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="opacity-70">
                <CardHeader className="animate-pulse bg-muted h-24" />
                <CardContent>
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : audits.length === 0 ? (
          <Card className="text-center p-8 animate-fade-in">
            <CardHeader>
              <CardTitle>No Audits Found</CardTitle>
              <CardDescription>Get started by creating your first energy audit</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleNewAudit} className="mt-4">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Audit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {audits.map((audit) => (
              <Card 
                key={audit.id} 
                className="overflow-hidden card-hover animate-slide-in"
                onClick={() => handleOpenAudit(audit.id!)}
              >
                <CardHeader className="pb-2">
                  <CardTitle>{audit.clientName}</CardTitle>
                  <CardDescription>
                    {audit.locationFloor} • {audit.envelopeBranch}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Clipboard className="mr-2 h-4 w-4" />
                    <span>Auditor: {audit.auditorName}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Zap className="mr-2 h-4 w-4" />
                    <span>Updated {formatDistanceToNow(audit.updatedAt)} ago</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
