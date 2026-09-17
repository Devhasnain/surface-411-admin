import { FormEvent, memo, useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import toast from "react-hot-toast";

import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import GetApiErrorMessage from "../../utils/GetApiErrorMessage";
import { useGetPage, useUpdatePage } from "../../hooks";
import Button from "../../components/ui/button/Button";
import Tile from "../../components/common/Tile";


const TermsAndConditions = () => {
  const { data } = useGetPage("terms");

  return (
    <>
      <PageBreadcrumb pageTitle="Terms & Conditions" />
      <Tile>
        {data?.page ? (
          <PageEditor currentPage={data?.page} />
        ) : (
          <p className="p-4 text-sm">Loading...</p>
        )}
      </Tile>
    </>
  );
};

type PageEditorProps = {
  currentPage: {
    _id: string;
    content: string;
    [key: string]: any;
  };
};

const PageEditor = memo(({ currentPage }: PageEditorProps) => {
  const [text, setText] = useState(currentPage.content || "");
  const { mutate, isPending } = useUpdatePage();
  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate(
      {
        title: "Terms & Conditions",
        slug: "terms",
        content: text,
        id: currentPage._id,
      },
      {
        onSuccess: () => toast.success("Page updated successfully."),
        onError: (error) => toast.error(GetApiErrorMessage(error)),
      }
    );
  };

  // Passive event for smoother scroll behavior (this part is okay)
  useEffect(() => {
    const handler = (e: TouchEvent) => {};
    window.addEventListener("touchstart", handler, { passive: true });
    return () => window.removeEventListener("touchstart", handler);
  }, []);

  return (
    <form onSubmit={handleOnSubmit} className="relative">
      {/* Hidden input for HTML5 form validation (not really needed if not using native validation) */}
      <input
        type="text"
        className="absolute opacity-0 pointer-events-none"
        required
        value={text}
        readOnly
      />
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue ?? "")}
        className="h-[70vh]"
      />
      <Button
        type="submit"
        disabled={isPending}
        loading={isPending}
        size="sm"
        className="mt-20"
      >
        Save
      </Button>
    </form>
  );
});

export default TermsAndConditions;
