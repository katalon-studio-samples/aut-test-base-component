// Raster page images stay in the DOM as data URLs, matching the replay's iframe structure.
// Deterministic scan noise prevents an otherwise blank synthetic page compressing to a few KB.
const pageCount =
  new URLSearchParams(location.search).get("pages") === "2" ? 2 : 38;
const viewer = document.getElementById("viewer");
const status = document.getElementById("status");
const pageInput = document.getElementById("page-number");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const zoom = document.getElementById("zoom");
let currentPage = 1;
let ready = false;
let inlineBytes = 0;
document.getElementById("page-total").textContent = `/ ${pageCount}`;
pageInput.max = String(pageCount);

function pageImage(page) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 800;
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error("This browser does not support page image generation.");
  const pixels = context.createImageData(600, 800);
  let seed = 0x9e3779b9 ^ page;
  for (let offset = 0; offset < pixels.data.length; offset += 4) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    const shade = 248 + (seed >>> 30);
    pixels.data[offset] = shade;
    pixels.data[offset + 1] = shade;
    pixels.data[offset + 2] = shade;
    pixels.data[offset + 3] = 255;
  }
  context.putImageData(pixels, 0, 0);
  context.fillStyle = "#17324d";
  context.font = "bold 26px sans-serif";
  context.fillText("SAMPLE DOCUMENT", 44, 64);
  context.font = "16px sans-serif";
  context.fillText(`Synthetic page ${page} of ${pageCount}`, 44, 96);
  context.fillStyle = "#111827";
  context.font = "14px sans-serif";
  for (let row = 0; row < 18; row++) {
    const y = 150 + row * 30;
    context.fillText(
      `Section ${page}.${row + 1} — Document review sample`,
      44,
      y,
    );
    context.fillStyle = "#64748b";
    context.fillRect(44, y + 8, 490 - (row % 4) * 30, 1);
    context.fillStyle = "#111827";
  }
  context.fillText("Synthetic test content — no customer data", 44, 750);
  return canvas.toDataURL("image/png");
}

function applyZoom() {
  const width =
    zoom.value === "fit"
      ? Math.min(600, Math.max(240, viewer.clientWidth - 32))
      : 600 * Number(zoom.value);
  for (const figure of viewer.querySelectorAll("figure"))
    figure.style.width = `${width}px`;
}

function updateControls() {
  pageInput.value = String(currentPage);
  previous.disabled = !ready || currentPage === 1;
  next.disabled = !ready || currentPage === pageCount;
}

function goToPage(page) {
  currentPage = Math.max(1, Math.min(pageCount, page));
  const figure = document.getElementById(`page-${currentPage}`);
  if (figure) viewer.scrollTop = figure.offsetTop - viewer.offsetTop;
  updateControls();
}
previous.addEventListener("click", () => goToPage(currentPage - 1));
next.addEventListener("click", () => goToPage(currentPage + 1));
pageInput.addEventListener("change", () =>
  goToPage(Number.parseInt(pageInput.value, 10) || 1),
);
document.getElementById("top").addEventListener("click", () => goToPage(1));
zoom.addEventListener("change", applyZoom);
new ResizeObserver(applyZoom).observe(viewer);
viewer.addEventListener(
  "scroll",
  () => {
    const figures = [...viewer.querySelectorAll("figure")];
    const viewerTop = viewer.getBoundingClientRect().top;
    const closest = figures.find(
      (figure) => figure.getBoundingClientRect().bottom > viewerTop + 30,
    );
    if (closest) {
      currentPage = Number(closest.dataset.page);
      updateControls();
    }
  },
  { passive: true },
);

function loadDocument() {
  try {
    for (let page = 1; page <= pageCount; page++) {
      const src = pageImage(page);
      inlineBytes += src.length;
      const figure = document.createElement("figure");
      figure.id = `page-${page}`;
      figure.dataset.page = String(page);
      const image = document.createElement("img");
      image.alt = `Sample document page ${page}`;
      image.className = "img-responsive";
      image.width = 600;
      image.height = 800;
      image.src = src;
      const caption = document.createElement("figcaption");
      caption.textContent = `Page ${page} of ${pageCount}`;
      figure.append(image, caption);
      viewer.append(figure);
      applyZoom();
      status.textContent = `Preparing page ${page} of ${pageCount}…`;
    }
    ready = true;
    viewer.setAttribute("aria-busy", "false");
    viewer.dataset.inlineBytes = String(inlineBytes);
    pageInput.disabled = false;
    updateControls();
    status.textContent = `${pageCount} pages ready · ${(inlineBytes / 1024 / 1024).toFixed(2)} MiB inline PNG data`;
  } catch (error) {
    const message = document.getElementById("error");
    message.textContent =
      error instanceof Error
        ? error.message
        : "Unable to prepare document pages.";
    message.hidden = false;
    viewer.setAttribute("aria-busy", "false");
    status.textContent =
      "Document could not be loaded. Close and reopen it to retry.";
  }
}
// Complete the image stack during the deferred script, before iframe load fires.
// rrweb can then attach the whole document as one large isAttachIframe snapshot.
loadDocument();
