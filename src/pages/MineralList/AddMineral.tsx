import { memo, useState } from "react";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import BulkUpdateMinerals from "./BulkUpdateMinerals";
import Tile from "../../components/common/Tile";
import AddMineralForm from "./AddMineralForm";
import FileDropZone from "./FileDropZone";


const AddMineral = () => {
    const [activeTab,setActiveTab] = useState("manual")
  return (
    <>
      <PageBreadcrumb pageTitle="Add Mineral" />
      <Tile>
        <div className="flex flex-row items-center">
            <button onClick={()=>setActiveTab("manual")} className={`px-10 pb-2 border-b-2 ${activeTab === "manual" ? 'border-blue-400 dark:text-white' : 'border-gray-200 dark:border-gray-800 dark:text-gray-400'}`}>Manual</button>
            <button onClick={()=>setActiveTab("upload")} className={`px-10 pb-2 border-b-2 ${activeTab === "upload" ? 'border-blue-400 dark:text-white' : 'border-gray-200 dark:border-gray-800 dark:text-gray-400'}`}>Upload file</button>
            <button onClick={()=>setActiveTab("bulk-update")} className={`px-10 pb-2 border-b-2 ${activeTab === "bulk-update" ? 'border-blue-400 dark:text-white' : 'border-gray-200 dark:border-gray-800 dark:text-gray-400'}`}>Bulk Update Minerals</button>
        </div>
        <div className="py-10">

        {
            activeTab === "manual" && <AddMineralForm/>
        }
        {
            activeTab === "upload" && <FileDropZone/>
        }
        {
            activeTab === "bulk-update" && <BulkUpdateMinerals/>
        }
        </div>

      </Tile>
    </>
  );
};

export default memo(AddMineral);
