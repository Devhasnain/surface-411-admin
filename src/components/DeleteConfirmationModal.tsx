import { memo } from "react";

import Button from "./ui/button/Button";
import { Modal } from "./ui/modal";


export const DeleteConfirmation = memo(
  ({ isOpen, onCancel, onConfirm, loading, title="Confirm Deletion", description=" Are you sure you want to delete?" }: any) => {
    return (
      <>
        <Modal onClose={onCancel} isOpen={isOpen} className="max-w-175">
          <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
            <div className="px-2 pr-14">
              <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              {title}
              </h4>
              <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                {description}
              </p>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onCancel}
              >
                Close
              </Button>
              <Button
                disabled={loading}
                loading={loading}
                type="submit"
                size="sm"
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  }
);
