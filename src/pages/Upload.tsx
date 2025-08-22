import { Upload as UploadIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();

  const handleFileUpload = () => {
    // Simulate file upload process
    setTimeout(() => {
      navigate("/analysis");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-foreground mb-6">
            Ready to Optimize Your Taxes?
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12">
            Upload your portfolio now and get instant insights into your tax situation
          </p>

          <Card className="p-12 border-2 border-dashed border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-0" onClick={handleFileUpload}>
              <div className="mb-8 flex justify-center">
                <div className="p-6 bg-muted rounded-2xl">
                  <UploadIcon className="w-12 h-12 text-muted-foreground" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-card-foreground mb-4">
                Drag & drop your portfolio file, or click to select
              </h3>
              
              <p className="text-muted-foreground mb-8">
                Supports CSV and JSON formats
              </p>

              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleFileUpload}
              >
                Choose File
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Upload;