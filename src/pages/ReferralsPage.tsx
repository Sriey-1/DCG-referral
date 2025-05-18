
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReferralForm } from "@/components/referrals/ReferralForm";
import { ReferralList } from "@/components/referrals/ReferralList";

const ReferralsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReferralCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Referrals</h1>
          <ReferralForm onReferralCreated={handleReferralCreated} />
        </div>
        <ReferralList refreshTrigger={refreshTrigger} />
      </div>
    </DashboardLayout>
  );
};

export default ReferralsPage;
