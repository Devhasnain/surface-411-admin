import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useMineralDetails } from "../../hooks";
import { Label, Tile } from "../../components";


const MineralDetail = () => {
  const { id } = useParams();

  const { data, isPending: loading } = useMineralDetails(id || "");

  return (
    <>
      <PageBreadcrumb
        pageTitle="Mineral"
        previousTitle="Mineral list"
        previousLink="/mineral"
      />
      <Tile>
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
            <ArrowPathIcon className="animate-spin" height={22} width={22} />
            <span>loading</span>
          </div>
        ) : (
          data && (
            <div className="flex flex-col gap-3">
              <div className="">
                <Label className="mb-0">Name</Label>
                <div className="flex flex-row items-center justify-start flex-wrap gap-x-4 gap-y-1">
                  {data?.mineral?.names?.map((name: string, id: number) => (
                    <span
                      key={id}
                      className="text-[14px] text-gray-600 dark:text-gray-500"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="">
                <Label className="mb-0">Email</Label>
                <div className="flex flex-row items-center justify-start flex-wrap gap-x-4 gap-y-1">
                  {data?.mineral?.emails?.map((email: string, id: number) => (
                    <span
                      key={id}
                      className="text-[14px] text-gray-600 dark:text-gray-500"
                    >
                      {email}
                    </span>
                  ))}
                </div>
              </div>
              <div className="">
                <Label className="mb-0">Number</Label>
                <div className="flex flex-row items-center justify-start flex-wrap gap-x-4 gap-y-1">
                  {data?.mineral?.numbers?.map((num: string, id: number) => (
                    <span
                      key={id}
                      className="text-[14px] text-gray-600 dark:text-gray-500"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <Label className="mb-0">State</Label>
                <div className="flex flex-row items-center justify-start flex-wrap gap-x-4 gap-y-1">
                  <span className="text-[14px] text-gray-600 dark:text-gray-500">
                    {data?.mineral?.state?.name} ({data?.mineral?.state?.code})
                  </span>
                </div>
              </div>
              <div className="">
                <Label className="mb-0">Counties</Label>
                <div className="flex flex-col">
                  {data?.mineral?.counties?.map(
                    (county: string, id: number) => (
                      <span
                        key={id}
                        className="text-[14px] text-gray-600 dark:text-gray-500"
                      >
                        {county}
                      </span>
                    )
                  )}
                </div>
              </div>
              <div className="">
                <Label className="mb-0">Address</Label>
                <div className="flex flex-col">
                  {data?.mineral?.addresses?.map((adr: string, id: number) => (
                    <span
                      key={id}
                      className="text-[14px] text-gray-600 dark:text-gray-500"
                    >
                      {adr}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <Label className="mb-0">Description</Label>
                <div className="flex flex-row items-center justify-start flex-wrap gap-x-4 gap-y-1">
                  <span className="text-[14px] text-gray-600 dark:text-gray-500">
                    {data?.mineral?.description}
                  </span>
                </div>
              </div>

              <Link
                className="underline text-blue-600"
                to={`/edit-mineral/${id}`}
              >
                Edit
              </Link>
            </div>
          )
        )}
      </Tile>
    </>
  );
};

export default MineralDetail;
