import { Upload as UploadIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

const Upload = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Process the selected file here
      console.log("Selected file:", file.name);
      // Simulate file processing and navigate to analysis
      setTimeout(() => {
        navigate("/analysis");
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 px-4">
            Ready to Optimize Your Taxes?
          </h1>
          
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground mb-8 sm:mb-12 px-4">
            Upload your portfolio now and get instant insights into your tax situation
          </p>

          <Card className="p-6 sm:p-8 lg:p-12 border-2 border-dashed border-border bg-card hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-0" onClick={handleFileSelect}>
              <div className="mb-6 sm:mb-8 flex justify-center">
                <div className="p-4 sm:p-6 bg-muted rounded-2xl">
                  <UploadIcon className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground" />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-card-foreground mb-3 sm:mb-4 px-4">
                Drag & drop your portfolio file, or click to select
              </h3>
              
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 px-4">
                Supports CSV and JSON formats
              </p>

              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleFileSelect}
              >
                Choose File
              </Button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.json"
                onChange={handleFileChange}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Upload;