import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Search, Filter, Download, Eye, LogOut, Clipboard, Settings, Users } from "lucide-react";
import { getAllAudits } from "@/services/firebaseService";
import { AuditBase } from "@/types";
import { formatDistanceToNow } from "date-fns";
import UserManagement from "@/components/UserManagement";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ManagerDashboard = () => {
  const [audits, setAudits] = useState<(AuditBase & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "client">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllAudits = async () => {
      try {
        setLoading(true);
        console.log("Fetching all audits...");
        const auditData = await getAllAudits();
        console.log("Fetched audits:", auditData);
        setAudits(auditData as (AuditBase & { id: string })[]);
      } catch (error) {
        console.error("Error fetching audits:", error);
        toast({
          title: "Error",
          description: "Failed to load audits. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllAudits();
  }, [toast]);

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

  // Add loading state display
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="text-lg font-medium">Loading audits...</div>
        </div>
      </div>
    );
  }

  // Add empty state display
  if (audits.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">No audits found</div>
          <p className="text-muted-foreground">There are no audit reports available at the moment.</p>
        </div>
      </div>
    );
  }

  const filteredAudits = audits
    .filter(audit => {
      const matchesSearch = 
        audit.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.auditorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audit.locationFloor.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesBranch = filterBranch === "all" || audit.envelopeBranch === filterBranch;
      
      return matchesSearch && matchesBranch;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "asc" 
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else {
        return sortOrder === "asc"
          ? a.clientName.localeCompare(b.clientName)
          : b.clientName.localeCompare(a.clientName);
      }
    });

  const uniqueBranches = Array.from(new Set(audits.map(audit => audit.envelopeBranch)));

  const handleViewAudit = (auditId: string) => {
    navigate(`/audit/${auditId}`);
  };

  const handleDownloadReport = (auditId: string) => {
    // Implement report download functionality
    toast({
      title: "Coming Soon",
      description: "Report download functionality will be available soon.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
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
            <Button variant="ghost" className="h-8 px-2" onClick={() => navigate("/new-audit")}>
              <FileText className="mr-2 h-4 w-4" />
              New Audit
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="audits" className="space-y-6">
          <TabsList>
            <TabsTrigger value="audits" className="flex items-center gap-2">
              <Clipboard className="h-4 w-4" />
              Audits
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="audits">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>All Audit Reports</CardTitle>
                <CardDescription>View and manage energy audit reports from all auditors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by client, auditor, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <Select value={filterBranch} onValueChange={setFilterBranch}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by branch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Branches</SelectItem>
                      {uniqueBranches.map(branch => (
                        <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value: "date" | "client") => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="client">Client Name</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    {sortOrder === "asc" ? "Ascending" : "Descending"}
                  </Button>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead>Auditor</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAudits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            No audits found matching your criteria
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredAudits.map((audit) => (
                          <TableRow key={audit.id}>
                            <TableCell className="font-medium">{audit.clientName}</TableCell>
                            <TableCell>{audit.locationFloor}</TableCell>
                            <TableCell>{audit.envelopeBranch}</TableCell>
                            <TableCell>{audit.auditorName}</TableCell>
                            <TableCell>
                              {formatDistanceToNow(new Date(audit.updatedAt))} ago
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewAudit(audit.id!)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadReport(audit.id!)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <UserManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManagerDashboard; 