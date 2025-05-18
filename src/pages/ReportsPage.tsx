
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportGenerator } from "@/components/reports/ReportGenerator";

const ReportsPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="max-w-xl">
          <ReportGenerator />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;
