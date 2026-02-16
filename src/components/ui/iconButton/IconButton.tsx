import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { memo, ReactNode } from "react";


type Props = {
  onClick: () => void;
  loading?: boolean;
  children?: ReactNode;
};
const IconButton = ({ onClick, loading, children }: Props) => {
  return (
    <button
      onClick={onClick}
      className="relative group flex items-center justify-center text-gray-500! transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
    >
      {loading && (
        <ArrowPathIcon
          height={18}
          width={18}
          className={`transition-colors ${
            loading && "animate-spin"
          } ease-in-out dark:group-hover:text-white`}
        />
      )}
      {!loading && children}
    </button>
  );
};

export default memo(IconButton);
