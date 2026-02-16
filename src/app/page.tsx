"use client";

import { useState } from "react";
import { jsPDF } from "jspdf";

interface Item {
  qty: number;
  nama: string;
  harga: number;
  total: number;
}

export default function InvoicePage() {
  // State untuk Metadata (Sekarang tanpa useEffect)
  const [kepada, setKepada] = useState("");
  const [pemberi, setPemberi] = useState("Kaming");
  const [tanggal, setTanggal] = useState("");
  const [penjelasan, setPenjelasan] = useState("");

  // State untuk Input Item Baru
  const [inputQty, setInputQty] = useState<number | "">("");
  const [inputNama, setInputNama] = useState("");
  const [inputHarga, setInputHarga] = useState<number | "">("");

  // State untuk Daftar Item
  const [items, setItems] = useState<Item[]>([]);

  const formatRupiah = (number: number) => {
    return "Rp " + number.toLocaleString("id-ID");
  };

  const addItem = () => {
    if (!inputQty || !inputNama || !inputHarga) return;
    const total = Number(inputQty) * Number(inputHarga);
    setItems([...items, { qty: Number(inputQty), nama: inputNama, harga: Number(inputHarga), total }]);
    setInputQty("");
    setInputNama("");
    setInputHarga("");
  };

  const removeItem = (index: number) => {
    if (confirm("Yakin mau hapus item ini?")) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const grandTotal = items.reduce((acc, item) => acc + item.total, 0);

  // FUNGSI UTAMA DOWNLOAD
  const downloadPDF = () => {
    // 1. Fungsi Helper Internal untuk Generate No Invoice (Impure Logic)
    const generateInvoiceID = () => {
      const d = new Date();
      const datePart = `${d.getFullYear()}${(d.getMonth() + 1).toString().padStart(2, "0")}${d.getDate().toString().padStart(2, "0")}`;
      const randomPart = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
      return `INV-${datePart}-${randomPart}`;
    };

    const doc = new jsPDF();
    const invoiceNumber = generateInvoiceID(); // Dipanggil hanya saat klik
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // --- LOGIKA DRAW PDF ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(pemberi.toUpperCase(), 20, y);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`No Invoice: ${invoiceNumber}`, pageWidth - 20, y, { align: "right" });

    y += 10;
    doc.setDrawColor(180);
    doc.line(20, y, pageWidth - 20, y);

    y += 12;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Kepada:", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Yth. ${kepada || "-"}`, 20, y);
    y += 6;
    doc.text(`Tanggal: ${tanggal || "-"}`, 20, y);

    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Jumlah", 20, y);
    doc.text("Deskripsi", 40, y);
    doc.text("Harga", 140, y, { align: "right" });
    doc.text("Total", 190, y, { align: "right" });
    y += 4;
    doc.line(20, y, pageWidth - 20, y);

    doc.setFont("helvetica", "normal");
    y += 8;
    items.forEach((item) => {
      doc.text(String(item.qty), 20, y);
      doc.text(item.nama, 40, y);
      doc.text(formatRupiah(item.harga), 140, y, { align: "right" });
      doc.text(formatRupiah(item.total), 190, y, { align: "right" });
      y += 8;
    });

    y += 4;
    doc.line(120, y, pageWidth - 20, y);
    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Grand Total", 120, y);
    doc.text(formatRupiah(grandTotal), pageWidth - 20, y, { align: "right" });

    y += 20;
    doc.text("Penjelasan", 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    const splitText = doc.splitTextToSize(penjelasan || "-", pageWidth - 40);
    doc.text(splitText, 20, y);

    doc.save(`${invoiceNumber}.pdf`);
  };

  return (
    <main className="bg-[#0f172a] text-gray-100 min-h-screen p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">Kaming Invoice</h1>
          <p className="text-sm text-gray-400 mt-1">Simple & Fast Invoice Generator</p>
        </div>

        {/* Input Form */}
        <div className="bg-[#111827] border border-[#1e293b] p-6 space-y-6 rounded-xl shadow-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Kepada</label>
              <input 
                type="text" value={kepada} onChange={(e) => setKepada(e.target.value)} placeholder="Nama Klien"
                className="w-full bg-[#0f172a] border border-[#1e293b] px-4 py-3 focus:border-blue-500 outline-none rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Diberikan Oleh</label>
              <input 
                type="text" value={pemberi} onChange={(e) => setPemberi(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#1e293b] px-4 py-3 focus:border-blue-500 outline-none rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Tanggal</label>
              <input 
                type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#1e293b] px-4 py-3 focus:border-blue-500 outline-none rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Catatan</label>
              <textarea 
                value={penjelasan} onChange={(e) => setPenjelasan(e.target.value)}
                className="w-full bg-[#0f172a] border border-[#1e293b] px-4 py-3 focus:border-blue-500 outline-none rounded-lg" rows={2}
              ></textarea>
            </div>
          </div>

          {/* Add Item Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t border-[#1e293b]">
            <input 
              type="number" placeholder="Qty" value={inputQty} onChange={(e) => setInputQty(e.target.value === "" ? "" : Number(e.target.value))}
              className="bg-[#0f172a] border border-[#1e293b] px-4 py-2 rounded-lg outline-none"
            />
            <input 
              type="text" placeholder="Item" value={inputNama} onChange={(e) => setInputNama(e.target.value)}
              className="bg-[#0f172a] border border-[#1e293b] px-4 py-2 rounded-lg outline-none"
            />
            <input 
              type="number" placeholder="Harga" value={inputHarga} onChange={(e) => setInputHarga(e.target.value === "" ? "" : Number(e.target.value))}
              className="bg-[#0f172a] border border-[#1e293b] px-4 py-2 rounded-lg outline-none"
            />
            <button onClick={addItem} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-all">
              Tambah
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 border border-[#1e293b] rounded-xl overflow-hidden bg-[#111827]">
          <table className="w-full text-sm">
            <thead className="bg-[#1e293b] text-gray-400 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-4 text-left">Qty</th>
                <th className="p-4 text-left">Deskripsi</th>
                <th className="p-4 text-right">Harga</th>
                <th className="p-4 text-right">Total</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {items.map((item, index) => (
                <tr key={index}>
                  <td className="p-4">{item.qty}</td>
                  <td className="p-4 font-medium">{item.nama}</td>
                  <td className="p-4 text-right">{formatRupiah(item.harga)}</td>
                  <td className="p-4 text-right">{formatRupiah(item.total)}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => removeItem(index)} className="text-red-500">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#1e293b]/50 font-bold">
              <tr>
                <td colSpan={3} className="p-4 text-right">TOTAL</td>
                <td className="p-4 text-right text-blue-500">{formatRupiah(grandTotal)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-8 text-right">
          <button 
            onClick={downloadPDF} 
            disabled={items.length === 0}
            className={`px-8 py-4 rounded-xl font-bold shadow-lg transition-all ${
              items.length === 0 ? 'bg-gray-700 text-gray-500' : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            Download PDF
          </button>
        </div>
      </div>
    </main>
  );
}