
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { BriefcaseBusiness } from "lucide-react";
import { dealService, referralService } from "@/services/api";
import { Referral } from "../referrals/ReferralList";

const formSchema = z.object({
  title: z.string().min(2, { message: "Deal title is required" }),
  referralId: z.string().optional(),
  value: z.string().min(1, { message: "Deal value is required" }),
  clientName: z.string().min(2, { message: "Client name is required" }),
  stage: z.string().min(1, { message: "Stage is required" }),
  expectedCloseDate: z.string().min(1, { message: "Expected close date is required" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DealFormProps {
  onDealCreated: () => void;
}

export function DealForm({ onDealCreated }: DealFormProps) {
  const [open, setOpen] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      referralId: "",
      value: "",
      clientName: "",
      stage: "prospecting",
      expectedCloseDate: "",
      description: "",
    },
  });

  // Load referrals when dialog opens
  const handleDialogChange = (isOpen: boolean) => {
    if (isOpen) {
      loadReferrals();
    }
    setOpen(isOpen);
  };

  const loadReferrals = async () => {
    try {
      const data = await referralService.getAllReferrals();
      setReferrals(data);
    } catch (error) {
      console.error("Error loading referrals:", error);
    }
  };

  // Auto-fill client name when a referral is selected
  const handleReferralChange = (value: string) => {
    const selectedReferral = referrals.find(ref => ref.id === value);
    if (selectedReferral) {
      form.setValue("clientName", selectedReferral.client_name);
    }
  };

  async function onSubmit(data: FormValues) {
    try {
      // Map form data to API fields
      const dealData = {
        title: data.title,
        referral_id: data.referralId || null,
        value: data.value,
        client_name: data.clientName,
        stage: data.stage,
        expected_close_date: data.expectedCloseDate,
        description: data.description,
      };
      
      await dealService.createDeal(dealData);
      
      toast({
        title: "Deal created",
        description: `New deal "${data.title}" has been created.`,
      });
      
      setOpen(false);
      form.reset();
      onDealCreated();
    } catch (error) {
      console.error("Error creating deal:", error);
      
      toast({
        variant: "destructive",
        title: "Failed to create deal",
        description: "There was an error creating the deal. Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button className="bg-dubai-navy hover:bg-dubai-navy/90">
          <BriefcaseBusiness className="mr-2 h-4 w-4" />
          New Deal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Deal</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Deal title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="referralId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Referral (Optional)</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleReferralChange(value);
                        }}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select referral" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None</SelectItem>
                          {referrals.map(referral => (
                            <SelectItem key={referral.id} value={referral.id}>
                              {referral.clientName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Value (AED)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deal Stage</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospecting">Prospecting</SelectItem>
                          <SelectItem value="qualification">Qualification</SelectItem>
                          <SelectItem value="proposal">Proposal</SelectItem>
                          <SelectItem value="negotiation">Negotiation</SelectItem>
                          <SelectItem value="closed_won">Closed Won</SelectItem>
                          <SelectItem value="closed_lost">Closed Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expectedCloseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Close Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Deal description" 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-dubai-navy hover:bg-dubai-navy/90">
                Create Deal
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
