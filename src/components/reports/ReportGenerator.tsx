
import { useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, FileSpreadsheet } from "lucide-react";
import { Referral } from "../referrals/ReferralList";
import { Deal } from "../deals/DealList";

export function ReportGenerator() {
  const [reportType, setReportType] = useState<string>("referrals");
  const [sortBy, setSortBy] = useState<string>("clientName");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const generateExcelReport = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      try {
        // Get data based on report type
        const data = reportType === "referrals" 
          ? JSON.parse(localStorage.getItem("referrals") || "[]")
          : JSON.parse(localStorage.getItem("deals") || "[]");
        
        // Sort data based on sortBy field
        const sortedData = [...data].sort((a, b) => {
          // Check if sorting by a numeric field
          if (sortBy === "value" && reportType === "deals") {
            return parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
          }
          
          // Default string comparison (case insensitive)
          return a[sortBy]?.localeCompare(b[sortBy], undefined, {sensitivity: 'base'}) || 0;
        });
        
        // In a real application, this would generate an actual Excel file
        // For now, we'll just convert to CSV format
        const csvContent = generateCSV(sortedData);
        downloadCSV(csvContent, `${reportType}_report.csv`);
        
        toast({
          title: "Report Generated",
          description: `Your ${reportType} report has been generated successfully.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Failed to generate report",
          description: "There was an error generating your report. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  // Helper function to generate CSV content
  const generateCSV = (data: Referral[] | Deal[]) => {
    if (data.length === 0) return '';
    
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV rows
    const rows = data.map(item => headers.map(header => {
      // Wrap fields with commas in quotes
      const value = (item as any)[header]?.toString() || '';
      return value.includes(',') ? `"${value}"` : value;
    }).join(','));
    
    // Combine headers and rows
    return [headers.join(','), ...rows].join('\n');
  };

  // Helper function to download CSV file
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get sort options based on report type
  const getSortOptions = () => {
    if (reportType === "referrals") {
      return [
        { value: "clientName", label: "Client Name" },
        { value: "referringCompany", label: "Referring Company" },
        { value: "status", label: "Status" },
        { value: "createdAt", label: "Date Created" }
      ];
    } else {
      return [
        { value: "title", label: "Deal Title" },
        { value: "clientName", label: "Client Name" },
        { value: "value", label: "Deal Value" },
        { value: "stage", label: "Deal Stage" },
        { value: "expectedCloseDate", label: "Expected Close Date" },
        { value: "createdAt", label: "Date Created" }
      ];
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileSpreadsheet className="mr-2 h-5 w-5 text-dubai-gold" />
          Generate Reports
        </CardTitle>
        <CardDescription>
          Export your data in Excel format for analysis and reporting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Report Type</label>
            <Select 
              value={reportType} 
              onValueChange={(value) => {
                setReportType(value);
                // Reset sort option to one that's available for the new report type
                if (value === "referrals") {
                  setSortBy("clientName");
                } else {
                  setSortBy("title");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="referrals">Referrals Report</SelectItem>
                <SelectItem value="deals">Deals Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select sort field" />
              </SelectTrigger>
              <SelectContent>
                {getSortOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-muted/50 p-4 rounded-md">
          <div className="flex items-start space-x-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div>
              <h4 className="text-sm font-medium">Report Preview</h4>
              <p className="text-sm text-muted-foreground">
                Your report will include all {reportType} data, sorted alphabetically by {" "}
                {getSortOptions().find(option => option.value === sortBy)?.label.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={generateExcelReport} 
          className="bg-dubai-navy hover:bg-dubai-navy/90 w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <span className="loader-sm mr-2"></span>
              Generating Report...
            </span>
          ) : (
            <span className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export as Excel
            </span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
