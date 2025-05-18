import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BriefcaseBusiness, 
  Calendar,
  DollarSign,
  ClipboardList
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistance } from "date-fns";
import { dealService } from "@/services/api";

export interface Deal {
  id: string;
  title: string;
  referral_id?: string;
  value: string;
  client_name: string;
  stage: string;
  expected_close_date: string;
  description?: string;
  created_at: string;
}

interface DealListProps {
  refreshTrigger?: number;
}

export function DealList({ refreshTrigger }: DealListProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const data = await dealService.getAllDeals();
        setDeals(data);
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [refreshTrigger]);

  const handleViewDetails = (deal: Deal) => {
    setSelectedDeal(deal);
    setOpen(true);
  };

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case "prospecting":
        return <Badge className="bg-blue-500">Prospecting</Badge>;
      case "qualification":
        return <Badge className="bg-purple-500">Qualification</Badge>;
      case "proposal":
        return <Badge className="bg-yellow-500">Proposal</Badge>;
      case "negotiation":
        return <Badge className="bg-orange-500">Negotiation</Badge>;
      case "closed_won":
        return <Badge className="bg-green-500">Closed Won</Badge>;
      case "closed_lost":
        return <Badge className="bg-red-500">Closed Lost</Badge>;
      default:
        return <Badge>{stage}</Badge>;
    }
  };

  // Format currency values
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
    }).format(Number(value));
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <BriefcaseBusiness className="mr-2 h-5 w-5 text-dubai-gold" />
            Deals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-center py-8">
              <BriefcaseBusiness className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">No deals yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first deal to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Deal</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Expected Close Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">{deal.title}</TableCell>
                      <TableCell>{deal.client_name}</TableCell>
                      <TableCell>{formatCurrency(deal.value)}</TableCell>
                      <TableCell>{getStageBadge(deal.stage)}</TableCell>
                      <TableCell>
                        {new Date(deal.expected_close_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(deal)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Deal Details</DialogTitle>
            <DialogDescription>
              Complete information about this deal
            </DialogDescription>
          </DialogHeader>
          
          {selectedDeal && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-2">
                  <ClipboardList className="mr-2 h-4 w-4 text-dubai-teal" />
                  <span className="text-sm font-medium">Deal Title</span>
                </div>
                <p className="text-base font-semibold">{selectedDeal.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <DollarSign className="mr-2 h-4 w-4 text-dubai-teal" />
                    <span className="text-sm font-medium">Deal Value</span>
                  </div>
                  <p className="text-base font-bold">{formatCurrency(selectedDeal.value)}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium">Client</span>
                  </div>
                  <p className="text-base">{selectedDeal.client_name}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium">Stage</span>
                  </div>
                  <div>{getStageBadge(selectedDeal.stage)}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2 h-4 w-4 text-dubai-teal" />
                    <span className="text-sm font-medium">Expected Close Date</span>
                  </div>
                  <p className="text-base">
                    {new Date(selectedDeal.expected_close_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <Calendar className="mr-2 h-4 w-4 text-dubai-teal" />
                  <span className="text-sm font-medium">Created</span>
                </div>
                <p className="text-base">
                  {formatDistance(new Date(selectedDeal.created_at), new Date(), {
                    addSuffix: true
                  })}
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium">Description</span>
                </div>
                <p className="text-base whitespace-pre-wrap">
                  {selectedDeal.description || "No description provided"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
