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
import { reportService } from "@/services/api";

export function ReportGenerator() {
  const [reportType, setReportType] = useState<string>("referrals");
  const [sortBy, setSortBy] = useState<string>("client_name");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const generateExcelReport = async () => {
    setIsLoading(true);
    
    try {
      let data;
      
      // Get data based on report type
      if (reportType === "referrals") {
        data = await reportService.getReferralsReport(sortBy);
      } else {
        data = await reportService.getDealsReport(sortBy);
      }
      
      // Generate and download CSV
      if (data && data.length > 0) {
        const csvContent = generateCSV(data);
        downloadCSV(csvContent, `${reportType}_report.csv`);
        
        toast({
          title: "Report Generated",
          description: `Your ${reportType} report has been generated successfully.`,
        });
      } else {
        toast({
          title: "Empty Report",
          description: `No ${reportType} data found to generate report.`,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
      
      toast({
        variant: "destructive",
        title: "Failed to generate report",
        description: "There was an error generating your report. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to generate CSV content
  const generateCSV = (data: any[]) => {
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
        { value: "client_name", label: "Client Name" },
        { value: "referring_company", label: "Referring Company" },
        { value: "status", label: "Status" },
        { value: "created_at", label: "Date Created" }
      ];
    } else {
      return [
        { value: "title", label: "Deal Title" },
        { value: "client_name", label: "Client Name" },
        { value: "value", label: "Deal Value" },
        { value: "stage", label: "Deal Stage" },
        { value: "expected_close_date", label: "Expected Close Date" },
        { value: "created_at", label: "Date Created" }
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
                  setSortBy("client_name");
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
