
import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DealForm } from "@/components/deals/DealForm";
import { DealList } from "@/components/deals/DealList";

const DealsPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDealCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Deals</h1>
          <DealForm onDealCreated={handleDealCreated} />
        </div>
        <DealList refreshTrigger={refreshTrigger} />
      </div>
    </DashboardLayout>
  );
};

export default DealsPage;
