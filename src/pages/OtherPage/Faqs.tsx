import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import { useAddFaq, useDeleteFaq, useFetchFaqs, useUpdateFaq, } from "../../hooks";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import Accordion from "../../components/ui/accordion/Accordion";
import TextArea from "../../components/form/input/TextArea";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import NoResults from "../../components/NoResults";
import { Modal } from "../../components/ui/modal";
import Tile from "../../components/common/Tile";
import Label from "../../components/form/Label";
import { useModal } from "../../hooks/useModal";
import { PencilIcon } from "../../icons";


const Faqs = () => {
  const { isOpen, closeModal, openModal } = useModal();
  const [selectedFaq, setSelecedFaq] = useState<any | null>(null);

  const { data, isPending: loading, refetch } = useFetchFaqs();
  const delFaqApi = useDeleteFaq();

  const handleSelectFaq = useCallback(
    (item: any) => {
      setSelecedFaq(item);
      openModal();
    },
    [selectedFaq, data?.faqs]
  );

  const handleDeleteFaq = (id: string) => {
    delFaqApi.mutate(id, {
      onSuccess: () => toast.success("Faq has been deleted."),
      onError: (error) => toast.error(GetApiErrorMessage(error)),
    });
  };

  return (
    <>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2
          className="text-xl font-semibold text-gray-800 dark:text-white/90"
          x-text="pageName"
        >
          Faqs
        </h2>
        <ol className="flex items-center gap-4">
          <li>
            <button
              onClick={() => refetch()}
              className="relative flex items-center justify-center text-gray-500! transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
            >
              <ArrowPathIcon
                height={20}
                width={20}
                className={`text-gray-500! transition-colors ${
                  loading && "animate-spin"
                } ease-in-out`}
              />
            </button>
          </li>
          <li>
            <Button onClick={openModal} size="sm">
              Add new
            </Button>
          </li>
        </ol>
      </div>

      {data?.faqs?.length ? (
        <Tile>
          {data?.faqs?.map((item: any, i: number) => (
            <Accordion
              key={i}
              title={item?.title}
              description={item?.description}
              btns={
                <>
                  <button onClick={() => handleDeleteFaq(item?._id)}>
                    <TrashIcon
                      className="dark:text-gray-200"
                      height={18}
                      width={18}
                    />
                  </button>
                  <button onClick={() => handleSelectFaq(item)}>
                    <PencilIcon
                      className="dark:text-gray-200"
                      height={20}
                      width={20}
                    />
                  </button>
                </>
              }
            />
          ))}
        </Tile>
      ) : (
        <NoResults title="No faq's has been added yet!" />
      )}

      <AddFaq
        isOpen={isOpen}
        closeModel={closeModal}
        selectedFaq={selectedFaq}
        setSelectedFaq={setSelecedFaq}
      />
    </>
  );
};

type AddFaqProps = {
  selectedFaq: any | null;
  setSelectedFaq: (val: any) => void;
  isOpen: boolean;
  closeModel: () => void;
};

const AddFaq = ({
  isOpen,
  closeModel,
  selectedFaq,
  setSelectedFaq,
}: AddFaqProps) => {
  const [form, setForm] = useState({ title: "", description: "" });
  const { mutate: addFaq, isPending: isAdding } = useAddFaq();
  const { mutate: updateFaq, isPending: isUpdating } = useUpdateFaq();

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const { value, name } = e.target;
      setForm((pre) => ({ ...pre, [name]: value }));
    },
    [form]
  );

  const handleOnSubmit = (e: any) => {
    e.preventDefault();
    if (selectedFaq?._id) {
      updateFaq(
        { ...form, id: selectedFaq?._id },
        {
          onSuccess: () => toast.success("Faq has been updated."),
          onError: (error) => toast.error(GetApiErrorMessage(error)),
        }
      );
    } else {
      addFaq(form, {
        onSuccess: () => toast.success("Faq has been added."),
        onError: (error) => toast.error(GetApiErrorMessage(error)),
      });
    }
    handleOnClose();
  };

  const handleOnClose = () => {
    setForm({ title: "", description: "" });
    setSelectedFaq(null);
    closeModel();
  };

  useEffect(() => {
    if (selectedFaq) {
      setForm({
        title: selectedFaq?.title ?? "",
        description: selectedFaq?.description ?? "",
      });
    }
  }, [selectedFaq]);

  return (
    <Modal className="max-w-175" isOpen={isOpen} onClose={handleOnClose}>
      <div className="no-scrollbar relative w-full max-w-175 overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Add Faq
          </h4>
        </div>
        <form className="flex flex-col gap-4 mt-5" onSubmit={handleOnSubmit}>
          <div className="">
            <Label htmlFor="title">Title</Label>
            <Input
              type="text"
              value={form?.title}
              required={true}
              placeholder="Title"
              id="title"
              name="title"
              min={3}
              onChange={handleOnChange}
            />
          </div>

          <div className="">
            <Label htmlFor="description">Description</Label>
            <TextArea
              value={form?.description}
              required={true}
              placeholder="Description"
              name="description"
              onChange={handleOnChange}
              rows={5}
            />
          </div>

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleOnClose}
            >
              Close
            </Button>
            <Button
              disabled={isAdding || isUpdating}
              loading={isAdding || isUpdating}
              type="submit"
              size="sm"
            >
              {selectedFaq ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default Faqs;
