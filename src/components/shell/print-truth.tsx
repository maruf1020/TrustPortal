/**
 * Ctrl+P. Everything else on the page is hidden by the print stylesheet;
 * this is the only thing that prints.
 */
export function PrintTruth() {
  return (
    <div id="print-truth">
      <p style={{ fontFamily: "Georgia, serif", fontSize: "18pt", lineHeight: 1.6 }}>
        Some things aren&rsquo;t meant to be taken with you.
      </p>
    </div>
  );
}
