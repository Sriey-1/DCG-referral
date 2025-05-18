
import { useEffect, useState } from "react";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  FolderCheck, 
  BriefcaseBusiness, 
  TrendingUp,
  Users
} from "lucide-react";
import { Deal } from "../deals/DealList";
import { Referral } from "../referrals/ReferralList";

export function DashboardStats() {
  const [referralCount, setReferralCount] = useState(0);
  const [dealCount, setDealCount] = useState(0);
  const [totalDealValue, setTotalDealValue] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  useEffect(() => {
    // Fetch data from localStorage
    const referrals: Referral[] = JSON.parse(localStorage.getItem("referrals") || "[]");
    const deals: Deal[] = JSON.parse(localStorage.getItem("deals") || "[]");
    
    // Calculate stats
    const refCount = referrals.length;
    const dlCount = deals.length;
    
    // Calculate total deal value
    const totalValue = deals.reduce((sum, deal) => sum + parseFloat(deal.value || "0"), 0);
    
    // Calculate conversion rate (deals with referrals / total referrals)
    const dealsWithReferrals = deals.filter(deal => deal.referralId).length;
    const calcConversionRate = refCount > 0 
      ? Math.round((dealsWithReferrals / refCount) * 100) 
      : 0;
    
    setReferralCount(refCount);
    setDealCount(dlCount);
    setTotalDealValue(totalValue);
    setConversionRate(calcConversionRate);
  }, []);

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-AE', {
      style: 'currency',
      currency: 'AED',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
          <FolderCheck className="h-4 w-4 text-dubai-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{referralCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Current active referrals in the system
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
          <BriefcaseBusiness className="h-4 w-4 text-dubai-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{dealCount}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Active deals in the pipeline
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Deal Value</CardTitle>
          <TrendingUp className="h-4 w-4 text-dubai-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalDealValue)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Combined value of all deals
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          <Users className="h-4 w-4 text-dubai-gold" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Referrals converted to deals
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
