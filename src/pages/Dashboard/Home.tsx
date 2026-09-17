import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import { useDashboardAnalytics } from "../../hooks";
import { RefreshIcon } from "../../icons";


export default function Home() {
  const { data: analytics, isPending } = useDashboardAnalytics();
  return (
    <>
      <div className="grid grid-cols-12 gap-4 md:gap-6 relative">
        {isPending && (
          <div className="w-full h-full backdrop-blur-sm z-10 absolute top-0 left-0 flex flex-col items-center justify-center gap-2">
            <RefreshIcon className="animate-spin" />
            <span>loading...</span>
          </div>
        )}
        {analytics && (
          <div className="col-span-12 space-y-6">
            <EcommerceMetrics analytics={analytics} />

            <MonthlySalesChart totalSubscriptions={analytics.totalSubscriptions}  />
          </div>
        )}
      </div>
    </>
  );
}
