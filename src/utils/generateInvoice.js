import jsPDF from 'jspdf';

const generateInvoice = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // ─── Header ───
    doc.setFillColor(34, 55, 31);
    doc.rect(0, 0, pageWidth, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('VEDAYURA', margin, 22);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Natural. Powerful. Timeless.', margin, 30);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - margin, 22, { align: 'right' });

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const invoiceNo = `VDY-${String(order.id).substring(0, 8).toUpperCase()}`;
    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
    doc.text(`#${invoiceNo}`, pageWidth - margin, 29, { align: 'right' });
    doc.text(`Date: ${date}`, pageWidth - margin, 35, { align: 'right' });

    // ─── Accent line ───
    doc.setDrawColor(58, 90, 53);
    doc.setLineWidth(1);
    doc.line(margin, 45, pageWidth - margin, 45);

    let y = 55;

    // ─── Order Info Bar ───
    doc.setFillColor(232, 240, 230);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 16, 2, 2, 'F');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 55, 31);
    const colW = (pageWidth - margin * 2) / 3;
    doc.text('ORDER ID', margin + 5, y + 6);
    doc.text('PAYMENT STATUS', margin + colW, y + 6);
    doc.text('ORDER STATUS', margin + colW * 2, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(26, 26, 26);
    doc.text(String(order.id).substring(0, 24) + '...', margin + 5, y + 12);
    doc.text(order.paymentStatus || order.status || 'PAID', margin + colW, y + 12);
    doc.text(order.status || 'CONFIRMED', margin + colW * 2, y + 12);

    y += 28;

    // ─── Items Table (manual) ───
    const items = (order.orderItems || order.items || []).map((item, i) => {
        const product = item.product || item;
        const price = Number(item.priceAtPurchase || product.discountedPrice || product.price || item.price || 0);
        const qty = item.quantity || 1;
        const variant = product.variant
            ? product.variant.charAt(0) + product.variant.slice(1).toLowerCase()
            : (product.category || '-');
        return {
            num: String(i + 1),
            name: product.name || item.name || 'Product',
            variant,
            qty: String(qty),
            price: `Rs.${price.toFixed(2)}`,
            total: `Rs.${(price * qty).toFixed(2)}`
        };
    });

    const colWidths = [12, 65, 30, 15, 25, 25];
    const tableWidth = pageWidth - margin * 2;
    const rowHeight = 10;

    // Scale columns to fit
    const totalColW = colWidths.reduce((a, b) => a + b, 0);
    const scale = tableWidth / totalColW;
    const cols = colWidths.map(w => w * scale);

    // Header row
    doc.setFillColor(34, 55, 31);
    doc.rect(margin, y, tableWidth, rowHeight + 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');

    const headers = ['#', 'Product', 'Variant', 'Qty', 'Price', 'Total'];
    let xPos = margin;
    headers.forEach((h, i) => {
        const align = i >= 3 ? 'right' : 'left';
        const offset = align === 'right' ? cols[i] - 4 : 4;
        doc.text(h, xPos + offset, y + 7, { align });
        xPos += cols[i];
    });

    y += rowHeight + 2;

    // Body rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);

    items.forEach((item, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(margin, y, tableWidth, rowHeight, 'F');
        }

        doc.setTextColor(26, 26, 26);
        xPos = margin;
        const values = [item.num, item.name, item.variant, item.qty, item.price, item.total];
        values.forEach((val, i) => {
            const align = i >= 3 ? 'right' : 'left';
            const offset = align === 'right' ? cols[i] - 4 : 4;
            doc.text(val, xPos + offset, y + 7, { align });
            xPos += cols[i];
        });

        // Row line
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.2);
        doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);

        y += rowHeight;
    });

    y += 15;

    // ─── Totals ───
    const totalsX = pageWidth - margin - 80;
    const totalsW = 80;

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(totalsX - 15, y - 5, totalsW + 20, 50, 2, 2, 'F');

    const subtotal = Number(order.subtotalAmount || order.totalAmount || order.total || 0);
    const shipping = Number(order.shippingCost || 0);
    const total = Number(order.totalAmount || order.total || subtotal + shipping);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(102, 102, 102);
    doc.text('Subtotal', totalsX - 10, y + 5);
    doc.text(`Rs.${subtotal.toFixed(2)}`, pageWidth - margin, y + 5, { align: 'right' });

    doc.text('Shipping', totalsX - 10, y + 15);
    doc.text(shipping === 0 ? 'FREE' : `Rs.${shipping.toFixed(2)}`, pageWidth - margin, y + 15, { align: 'right' });

    doc.setDrawColor(58, 90, 53);
    doc.setLineWidth(0.5);
    doc.line(totalsX - 10, y + 20, pageWidth - margin, y + 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 55, 31);
    doc.text('TOTAL', totalsX - 10, y + 30);
    doc.text(`Rs.${total.toFixed(2)}`, pageWidth - margin, y + 30, { align: 'right' });

    // ─── Footer ───
    const footerY = doc.internal.pageSize.getHeight() - 35;

    doc.setDrawColor(232, 240, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 55, 31);
    doc.text('Thank you for choosing Vedayura!', margin, footerY + 10);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(102, 102, 102);
    doc.text('For queries, contact us at support@vedayura.com', margin, footerY + 18);

    doc.setFontSize(7);
    doc.setTextColor(170, 170, 170);
    doc.text('This is a computer-generated invoice and does not require a signature.',
        pageWidth / 2, footerY + 28, { align: 'center' });

    // ─── Download ───
    doc.save(`vedayura-invoice-${String(order.id).substring(0, 8)}.pdf`);
};

export default generateInvoice;