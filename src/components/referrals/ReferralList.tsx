
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
  FolderCheck, 
  User, 
  Building, 
  Calendar 
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
import { referralService } from "@/services/api";

export interface Referral {
  id: string;
  referring_company: string;
  client_name: string;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  service: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface ReferralListProps {
  refreshTrigger?: number;
}

export function ReferralList({ refreshTrigger }: ReferralListProps) {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        setIsLoading(true);
        const data = await referralService.getAllReferrals();
        setReferrals(data);
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReferrals();
  }, [refreshTrigger]);

  const handleViewDetails = (referral: Referral) => {
    setSelectedReferral(referral);
    setOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "contacted":
        return <Badge className="bg-yellow-500">Contacted</Badge>;
      case "meeting_scheduled":
        return <Badge className="bg-purple-500">Meeting Scheduled</Badge>;
      case "qualified":
        return <Badge className="bg-green-500">Qualified</Badge>;
      case "unqualified":
        return <Badge className="bg-red-500">Unqualified</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold flex items-center">
            <FolderCheck className="mr-2 h-5 w-5 text-dubai-gold" />
            Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <FolderCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <p className="mt-2 text-muted-foreground">No referrals yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first referral to get started
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Referring Company</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell className="font-medium">{referral.clientName}</TableCell>
                      <TableCell>{referral.referringCompany}</TableCell>
                      <TableCell>{referral.service}</TableCell>
                      <TableCell>{getStatusBadge(referral.status)}</TableCell>
                      <TableCell>
                        {formatDistance(new Date(referral.createdAt), new Date(), { 
                          addSuffix: true 
                        })}
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(referral)}
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
            <DialogTitle>Referral Details</DialogTitle>
            <DialogDescription>
              Complete information about this referral
            </DialogDescription>
          </DialogHeader>
          
          {selectedReferral && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Building className="mr-2 h-4 w-4 text-dubai-teal" />
                    <span className="text-sm font-medium">Referring Company</span>
                  </div>
                  <p className="text-base">{selectedReferral.referringCompany}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <User className="mr-2 h-4 w-4 text-dubai-teal" />
                    <span className="text-sm font-medium">Client</span>
                  </div>
                  <p className="text-base">{selectedReferral.clientName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <User className="mr-2 h-4 w-4 text-dubai-teal" />
                    <span className="text-sm font-medium">Contact Person</span>
                  </div>
                  <p className="text-base">{selectedReferral.contactPerson}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="mr-2 h-4 w-4 text-dubai-teal" />
                    <span className="text-sm font-medium">Created</span>
                  </div>
                  <p className="text-base">
                    {new Date(selectedReferral.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-base">{selectedReferral.contactEmail}</p>
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium">Phone</span>
                  </div>
                  <p className="text-base">{selectedReferral.contactPhone}</p>
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium">Status</span>
                </div>
                <div>{getStatusBadge(selectedReferral.status)}</div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-sm font-medium">Notes</span>
                </div>
                <p className="text-base whitespace-pre-wrap">
                  {selectedReferral.notes || "No notes provided"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
