import { ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
export function Modal({
  title,
  children,
  onClose,
  wide = false,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    ref.current?.showModal();
    const prior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prior;
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`lib-dialog ${wide ? "lib-dialog-wide" : ""}`}
      aria-labelledby="lib-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <header>
        <h2 id="lib-dialog-title">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>
      </header>
      {children}
    </dialog>
  );
}
