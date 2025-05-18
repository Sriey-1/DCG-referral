
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
import { dashboardService } from "@/services/api";

interface DashboardStatsData {
  referralCount: number;
  dealCount: number;
  totalDealValue: number;
  conversionRate: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStatsData>({
    referralCount: 0,
    dealCount: 0,
    totalDealValue: 0,
    conversionRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
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
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : stats.referralCount}
          </div>
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
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : stats.dealCount}
          </div>
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
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : formatCurrency(stats.totalDealValue)}
          </div>
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
          <div className="text-2xl font-bold">
            {isLoading ? "Loading..." : `${stats.conversionRate}%`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Referrals converted to deals
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
