import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { PRODUCTS, DECOR_PRODUCTS } from "@/data/mockProducts";
import { getContactPhone, getContactEmail } from "@/lib/contactConfig";

export interface InvoiceOrderItem {
  id?: string | number;
  productId?: string | number;
  name?: string;
  title?: string;
  category?: string;
  material?: string;
  price?: number;
  quantity?: number;
  image?: string;
}

export interface InvoiceOrder {
  id: string | number;
  createdAt?: string;
  date?: string;
  statut?: string;
  status?: string;
  client?: string;
  customerName?: string;
  telephone?: string;
  customerPhone?: string;
  email?: string;
  customerEmail?: string;
  city?: string;
  customerCity?: string;
  address?: string;
  customerAddress?: string;
  total?: number | string;
  items?: InvoiceOrderItem[];
}

export interface UserInvoiceContext {
  fullName?: string;
  email?: string;
  phone?: string;
  city?: string;
  address?: string;
}

/**
 * Finds product category / details in catalog
 */
function resolveProductCategory(item: InvoiceOrderItem): string {
  if (item.category && item.category.trim()) {
    return item.category;
  }
  const itemId = item.productId || item.id;
  const allProducts = [...(PRODUCTS || []), ...(DECOR_PRODUCTS || [])];

  if (itemId) {
    const foundById = allProducts.find((p) => String(p.id) === String(itemId));
    if (foundById) {
      if (typeof (foundById as any).category === "string") return (foundById as any).category;
      if (typeof (foundById as any).categoryName === "string") return (foundById as any).categoryName;
    }
  }

  const itemName = (item.name || item.title || "").toLowerCase().trim();
  if (itemName) {
    const foundByName = allProducts.find(
      (p) => p.name.toLowerCase().trim() === itemName || itemName.includes(p.name.toLowerCase().trim())
    );
    if (foundByName) {
      if (typeof (foundByName as any).category === "string") return (foundByName as any).category;
      if (typeof (foundByName as any).categoryName === "string") return (foundByName as any).categoryName;
    }
  }

  return "Artisanat d'Art Marocain";
}

/**
 * Formats a Moroccan telephone number cleanly (e.g. 0661245890 -> +212 6 61 24 58 90)
 */
function formatMoroccanPhone(phone?: string): string {
  if (!phone) return "+212 6 61 24 58 90";
  const raw = phone.replace(/[^0-9+]/g, "");
  if (raw.startsWith("06") || raw.startsWith("07") || raw.startsWith("05")) {
    const rest = raw.substring(1);
    return `+212 ${rest.substring(0, 1)} ${rest.substring(1, 3)} ${rest.substring(3, 5)} ${rest.substring(5, 7)} ${rest.substring(7, 9)}`.trim();
  }
  if (raw.startsWith("212") && raw.length >= 11) {
    const rest = raw.substring(3);
    return `+212 ${rest.substring(0, 1)} ${rest.substring(1, 3)} ${rest.substring(3, 5)} ${rest.substring(5, 7)} ${rest.substring(7, 9)}`.trim();
  }
  return phone;
}

/**
 * Derives a clean customer email from name if missing
 */
function deriveCustomerEmail(name: string): string {
  const clean = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/^(lalla|si|dr\.?|m\.|mme)\s+/i, "")
    .trim()
    .replace(/[^a-z0-9]+/g, ".");
  return clean ? `${clean}@gmail.com` : "client.marjad@gmail.com";
}

/**
 * Loads the MARJAD logo and converts it to a 100% PURE SOLID BLACK Base64 image
 * (both the emblem and the wordmark are guaranteed pure black).
 */
async function getLogoBase64(): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 300;
        canvas.height = img.naturalHeight || 66;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          // Set every pixel with any opacity to 100% solid black
          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 10) {
              data[i] = 0;     // Red
              data[i + 1] = 0; // Green
              data[i + 2] = 0; // Blue
            }
          }
          ctx.putImageData(imgData, 0, 0);
          resolve(canvas.toDataURL("image/png"));
          return;
        }
      } catch (err) {
        console.warn("Canvas black logo processing error:", err);
      }
      resolve("/logo-black.png");
    };
    img.onerror = () => resolve("/logo-black.png");
    img.src = "/logo-black.png";
  });
}

function formatStatus(status?: string): string {
  switch (status?.toLowerCase()) {
    case "delivered":
    case "livree":
    case "livrée":
      return "Livrée";
    case "shipped":
    case "expediee":
    case "expédiée":
      return "Expédiée";
    case "confirmed":
    case "confirmee":
    case "confirmée":
      return "Confirmée";
    case "cancelled":
    case "annulee":
    case "annulée":
      return "Annulée";
    case "pending":
    case "en attente":
    default:
      return "En attente";
  }
}

/**
 * Generates and triggers download of a 100% Black & White PDF invoice
 * for MARJAD using the official pure black logo and strictly verified order information.
 */
export async function generateInvoicePdf(order: InvoiceOrder, userInfo?: UserInvoiceContext): Promise<void> {
  // 1. Fetch 100% Pure Black Logo Base64
  const logoBase64 = await getLogoBase64();

  // 2. Resolve Dynamic Support Phone from Centralized Contact Config
  const supportPhone = getContactPhone();
  const supportEmail = getContactEmail();

  // 3. Resolve Customer Data strictly from the Order with sensible fallback
  const clientName =
    order.customerName ||
    order.client ||
    (userInfo?.fullName && userInfo.fullName !== "Client Marjad" ? userInfo.fullName : "Client MARJAD");

  const rawPhone = order.customerPhone || order.telephone || userInfo?.phone;
  const clientPhone = formatMoroccanPhone(rawPhone);

  const clientEmail =
    order.customerEmail ||
    order.email ||
    (order.customerName ? deriveCustomerEmail(order.customerName) : userInfo?.email || "client.marjad@gmail.com");

  const clientCity = order.customerCity || order.city || userInfo?.city || "Casablanca";
  const clientAddress = order.customerAddress || order.address || userInfo?.address || "Adresse de livraison au Maroc";

  // 4. Resolve Dates & ID
  const orderId = String(order.id).startsWith("CMD-") ? String(order.id) : `CMD-MAR-${order.id}`;
  const orderDate = order.createdAt || order.date || new Date().toLocaleDateString("fr-FR");
  const orderStatus = formatStatus(order.statut || order.status);

  // 5. Resolve Line Items & Totals from Order
  const items: InvoiceOrderItem[] =
    order.items && order.items.length > 0
      ? order.items
      : [
          {
            name: "Création Artisanale MARJAD",
            price: typeof order.total === "number" ? order.total : parseFloat(String(order.total || "1500")),
            quantity: 1,
            category: "Artisanat d'Art",
          },
        ];

  const totalTTC =
    typeof order.total === "number"
      ? order.total
      : parseFloat(String(order.total || "0")) ||
        items.reduce((sum, it) => sum + (it.price || 0) * (it.quantity || 1), 0);
  const totalHT = totalTTC / 1.2;
  const totalTVA = totalTTC - totalHT;

  // 6. Build Table Rows HTML (Strict Black & White)
  const isPriceAlreadyLineTotal =
    items.length > 0 &&
    items.reduce((s, it) => s + (it.price || 0), 0) === Math.round(totalTTC) &&
    items.some((it) => (it.quantity || 1) > 1);

  const tableRowsHtml = items
    .map((item) => {
      const name = item.name || item.title || "Création Artisanale MARJAD";
      const category = resolveProductCategory(item);
      const qty = Math.max(1, item.quantity || 1);

      let unitPrice = item.price || totalTTC / qty;
      let lineTotal = unitPrice * qty;

      if (isPriceAlreadyLineTotal && (item.price || 0) > 0) {
        lineTotal = item.price || 0;
        unitPrice = lineTotal / qty;
      }

      return `
        <tr style="border-bottom: 1px solid #E5E5E5;">
          <td style="padding: 12px 14px; text-align: left; vertical-align: top;">
            <div style="font-weight: 700; color: #000000; font-size: 13px; line-height: 1.3;">${name}</div>
            <div style="font-size: 11px; color: #555555; font-weight: 600; font-style: italic; margin-top: 2px;">
              Catégorie: ${category}
            </div>
          </td>
          <td style="padding: 12px 14px; text-align: center; font-weight: 700; color: #000000; vertical-align: top; font-size: 13px;">
            ${qty}
          </td>
          <td style="padding: 12px 14px; text-align: right; font-weight: 600; color: #333333; vertical-align: top; font-size: 13px;">
            ${unitPrice.toFixed(2)} DH
          </td>
          <td style="padding: 12px 14px; text-align: right; font-weight: 800; color: #000000; vertical-align: top; font-size: 13px;">
            ${lineTotal.toFixed(2)} DH
          </td>
        </tr>
      `;
    })
    .join("");

  // 7. Create Hidden HTML Template Container (100% Black & White)
  // Page height: 1123px (A4 canvas equivalent).
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "-9999px";
  container.style.width = "794px";
  container.style.height = "1123px";
  container.style.backgroundColor = "#FFFFFF";
  container.style.fontFamily = "'Inter', 'Segoe UI', Arial, sans-serif";
  container.style.boxSizing = "border-box";
  container.style.display = "flex";
  container.style.flexDirection = "column";

  container.innerHTML = `
    <!-- 1. TOP HEADER SECTION (Height = ~15% / 168px, B&W) -->
    <div style="height: 15%; background: #FFFFFF; border-bottom: 2px solid #000000; padding: 18px 36px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; position: relative;">
      <!-- Left Side: Official Pure Black MARJAD Logo Image -->
      <div style="display: flex; flex-direction: column; justify-content: center; gap: 4px;">
        <img src="${logoBase64}" alt="MARJAD - Artisanat & Décoration Marocaine" style="height: 56px; max-width: 260px; object-fit: contain; object-position: left center; filter: brightness(0);" />
        <div style="font-size: 10px; font-weight: 700; color: #333333; letter-spacing: 0.6px; text-transform: uppercase;">
          Maison d'Artisanat & Décoration Marocaine
        </div>
      </div>

      <!-- Right Side: Order Number & Date -->
      <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; justify-content: center;">
        <div style="background: #000000; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">
          FACTURE
        </div>
        <div style="font-size: 17px; font-weight: 800; color: #000000; font-family: monospace;">
          ${orderId}
        </div>
        <div style="font-size: 11px; font-weight: 600; color: #444444; margin-top: 2px;">
          Date : <strong style="color: #000000;">${orderDate}</strong>
        </div>
        <div style="font-size: 10px; font-weight: 700; color: #000000; background: #F5F5F5; border: 1px solid #000000; padding: 2px 8px; border-radius: 4px; margin-top: 4px;">
          Statut : ${orderStatus}
        </div>
      </div>
    </div>

    <!-- 2. MIDDLE CONTENT SECTION (Height = 77%, B&W) -->
    <div style="height: 77%; padding: 24px 36px; box-sizing: border-box; display: flex; flex-direction: column; justify-content: space-between; background: #FFFFFF;">
      <!-- Upper Part of Middle Section: Customer Contact Info -->
      <div style="background: #FAFAFA; border: 1.5px solid #000000; border-radius: 8px; padding: 18px 22px; box-sizing: border-box;">
        <div style="font-size: 13px; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 12px; border-bottom: 1px solid #CCCCCC; padding-bottom: 6px;">
          Informations du Client
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; font-size: 12px;">
          <div>
            <span style="color: #555555; font-weight: 600;">Nom complet :</span>
            <div style="font-weight: 700; color: #000000; margin-top: 1px;">${clientName}</div>
          </div>
          <div>
            <span style="color: #555555; font-weight: 600;">Téléphone :</span>
            <div style="font-weight: 700; color: #000000; margin-top: 1px;">${clientPhone}</div>
          </div>
          <div>
            <span style="color: #555555; font-weight: 600;">Email :</span>
            <div style="font-weight: 700; color: #000000; margin-top: 1px;">${clientEmail}</div>
          </div>
          <div>
            <span style="color: #555555; font-weight: 600;">Ville :</span>
            <div style="font-weight: 700; color: #000000; margin-top: 1px;">${clientCity}</div>
          </div>
          <div style="grid-column: span 2;">
            <span style="color: #555555; font-weight: 600;">Adresse de livraison :</span>
            <div style="font-weight: 700; color: #000000; margin-top: 1px;">${clientAddress}</div>
          </div>
        </div>
      </div>

      <!-- Lower Part of Middle Section: Products Table & Totals -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; margin-top: 16px;">
        <!-- Products Table -->
        <div style="border: 1.5px solid #000000; border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #F0F0F0; border-bottom: 1.5px solid #000000;">
                <th style="padding: 10px 14px; text-align: left; font-size: 11px; font-weight: 800; color: #000000; text-transform: uppercase;">Article</th>
                <th style="padding: 10px 14px; text-align: center; font-size: 11px; font-weight: 800; color: #000000; text-transform: uppercase; width: 80px;">Quantité</th>
                <th style="padding: 10px 14px; text-align: right; font-size: 11px; font-weight: 800; color: #000000; text-transform: uppercase; width: 120px;">Prix Unitaire</th>
                <th style="padding: 10px 14px; text-align: right; font-size: 11px; font-weight: 800; color: #000000; text-transform: uppercase; width: 130px;">Montant Total</th>
              </tr>
            </thead>
            <tbody>
              ${tableRowsHtml}
            </tbody>
          </table>
        </div>

        <!-- Totals Summary Divs -->
        <div style="display: flex; justify-content: flex-end; margin-top: 16px;">
          <div style="width: 320px; background: #FAFAFA; border: 1.5px solid #000000; border-radius: 8px; padding: 14px 18px; box-sizing: border-box; display: flex; flex-direction: column; gap: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #444444;">
              <span style="font-weight: 600;">Montant Total (HT) :</span>
              <span style="font-weight: 700; color: #000000;">${totalHT.toFixed(2)} DH</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #444444;">
              <span style="font-weight: 600;">TVA (20%) :</span>
              <span style="font-weight: 700; color: #000000;">${totalTVA.toFixed(2)} DH</span>
            </div>
            <div style="border-top: 1.5px dashed #000000; margin-top: 2px; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; font-weight: 800; color: #000000;">Montant Total (TTC) :</span>
              <span style="font-size: 16px; font-weight: 900; color: #000000;">${totalTTC.toFixed(2)} DH</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. BOTTOM FOOTER SECTION (Height = 8%, Monochromatic B&W) -->
    <div style="height: 8%; background: #F5F5F5; border-top: 2px solid #000000; padding: 14px 36px; box-sizing: border-box; display: flex; justify-content: space-between; align-items: center; text-align: center;">
      <div style="text-align: left;">
        <div style="font-weight: 800; color: #000000; font-size: 13px;">MARJAD Maison d'Artisanat</div>
        <div style="font-size: 10px; color: #555555; margin-top: 2px;">Créations d'art & décoration authentique marocaine</div>
      </div>
      <div style="text-align: center;">
        <div style="font-size: 11px; font-weight: 700; color: #000000;">Support Clients :</div>
        <div style="font-size: 11px; color: #333333; font-weight: 600; margin-top: 2px;">${supportEmail}</div>
      </div>
      <div style="text-align: right;">
        <div style="font-size: 11px; font-weight: 700; color: #000000;">Téléphone / WhatsApp :</div>
        <div style="font-size: 11px; color: #333333; font-weight: 600; margin-top: 2px;">${supportPhone}</div>
      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    // 8. Render high-res Canvas & Save PDF
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#FFFFFF",
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`Facture-${orderId}.pdf`);
  } catch (err) {
    console.error("Error generating invoice PDF:", err);
    throw err;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
