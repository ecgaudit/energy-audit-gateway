import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Zap, BarChart3, Clipboard, Database } from "lucide-react";

const Index = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/dashboard");
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Energy Audit</h1>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12 md:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-fade-in">
          <div className="space-y-6">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
              <span className="inline-flex items-center">
                <Zap className="mr-1 h-4 w-4 text-primary" />
                Energy Management Solutions
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Energy Audit App for <span className="text-primary">Professional Assessments</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Streamline your energy audits with our comprehensive tool. Document and analyze client electrical equipment for improved energy efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Log in to Your Account
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="glass-panel card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clipboard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Audit Equipment</h3>
                <p className="text-sm text-muted-foreground">
                  Record detailed information about air conditioning, lighting, and other electrical equipment.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel card-hover">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Generate Reports</h3>
                <p className="text-sm text-muted-foreground">
                  Create professional energy consumption reports with actionable recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel card-hover sm:col-span-2">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Secure Data Storage</h3>
                <p className="text-sm text-muted-foreground">
                  All your audit data is securely stored in the cloud, accessible anytime, anywhere.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-24 space-y-12 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Comprehensive Energy Audit Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our app provides everything you need to perform thorough energy audits and identify opportunities for energy savings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Air Conditioning</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span> Room dimensions and occupancy
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Equipment capacity in BTU and watts
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Energy Efficiency Ratio (EER)
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Usage patterns and duration
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Lighting</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span> Type of luminaires and fittings
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Lamp ratings and total wattage
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Average lux measurements
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Proposed energy-efficient alternatives
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Other Equipment</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span> Equipment descriptions and ratings
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Usage patterns and duration
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Energy consumption analysis
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span> Improvement recommendations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Energy Audit App. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Application developed by Fred Fiifi Arthur - Electricity Company of Ghana
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
