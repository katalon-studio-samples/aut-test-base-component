import { useRef } from "react";

const attachmentIframePath =
  "/CossEnterpriseSuite/S(base-aut-fixture)/webforms/ExistingCaseResp.aspx#";

export const SameDomainAttachmentFormIframePage = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const openAttachmentPopup = () => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        source: "same-domain-attachment-form-fixture",
        action: "openAttachmentPopup",
      },
      window.location.origin,
    );
  };

  return (
    <div className="mx-auto max-w-6xl text-gray-900 dark:text-gray-100">
      <section className="rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">Same-Domain Attachment Popup Iframe</h1>
            <p className="mt-1 max-w-3xl text-sm text-gray-600 dark:text-gray-300">
              Fixture mô phỏng app iPipeline trong iframe same-domain, nhưng URL dùng domain của
              Base AUT khi chạy trên môi trường Base AUT.
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Iframe path: <span className="font-mono">{attachmentIframePath}</span>
            </p>
          </div>

          <button
            id="open-same-domain-attachment-popup"
            name="openSameDomainAttachmentPopup"
            type="button"
            data-testid="open-same-domain-attachment-popup"
            className="rounded bg-blue-700 px-4 py-2 font-semibold text-white"
            onClick={openAttachmentPopup}
          >
            Open attachment popup
          </button>
        </div>

        <iframe
          ref={iframeRef}
          id="same-domain-attachment-form-frame"
          name="sameDomainAttachmentFormFrame"
          title="Same-domain attachment popup form iframe"
          data-testid="same-domain-attachment-form-frame"
          src={attachmentIframePath}
          className="h-[820px] w-full border border-gray-400 bg-white"
        />
      </section>
    </div>
  );
};
