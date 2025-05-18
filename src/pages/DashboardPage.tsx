
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ReferralList } from "@/components/referrals/ReferralList";
import { DealList } from "@/components/deals/DealList";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ReferralList />
          </div>
          <div>
            <DealList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
