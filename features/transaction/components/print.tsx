import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Tipe Props
interface PrintProps {
  authUser?: string; // Nama pengguna yang mencetak
  customerName: string; // Nama pelanggan
  menu: { name: string; price: number; quantity: number; id: string; originalPrice: number }[]; // Daftar menu
  total: number; // Total pembayaran
}

const Print = ({ authUser = "Waiter Tidak Diketahui", customerName, menu, total }: PrintProps) => {
  const [isPrinting, setIsPrinting] = useState(false);

  // Format teks untuk resi
  const formatReceiptText = () => {
    const separator = "-".repeat(32);

    // Format tanggal saat ini
    const now = new Date();
    const formattedDate = now.toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
FATKID CATERING
${separator}
PEGAWAI   : ${authUser}
PELANGGAN : ${customerName || "Pelanggan Tidak Diketahui"}
TANGGAL   : ${formattedDate}
${separator}
PESANAN:

${menu
  .map(
    (item) => `${item.name.substring(0, 20).padEnd(20)}  
${item.quantity} x Rp ${item.originalPrice.toLocaleString()} = Rp ${item.price.toLocaleString()}`
  )
  .join("\n")}
  
${separator}
TOTAL BAYAR  : Rp ${total.toLocaleString()}
${separator}
UNTUK PEMESANAN HUBUNGI:
0813-1805-3671 (WhatsApp)
@Fatkid_Poffertjes (Instagram)
${"\n".repeat(1)}
TERIMA KASIH TELAH BERBELANJA DI 
FATKID CATERING!
${"\n".repeat(3)}


`.trim();
  };

  // Fungsi untuk mencetak
  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      console.log("Memulai proses pencetakan...");

      // Meminta akses port serial
      const port = await navigator.serial.requestPort();

      // Membuka koneksi ke printer
      await port.open({
        baudRate: 9600, // Standar baud rate printer termal
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      });

      // Mendapatkan writer
      if (!port.writable) {
        throw new Error("Port tidak dapat ditulisi.");
      }
      const writer = port.writable.getWriter();

      // Mengonversi teks resi menjadi byte array
      const encoder = new TextEncoder();
      const receiptData = encoder.encode(formatReceiptText());

      // Menulis data ke printer
      await writer.write(receiptData);

      // Perintah untuk memotong kertas (jika didukung printer)
      const cutPaperCommand = new Uint8Array([0x1d, 0x56, 0x01]);
      await writer.write(cutPaperCommand);

      // Melepaskan writer dan menutup koneksi
      writer.releaseLock();
      await port.close();
      console.log("Pencetakan selesai.");
    } catch (error) {
      console.error("Terjadi kesalahan saat mencetak:", error);
      alert("Gagal mencetak. Pastikan printer terhubung dengan benar.");
    } finally {
      setIsPrinting(false);
    }
  };

  // Komponen tombol untuk memulai pencetakan
  return (
    <Button type="button" variant="outline" onClick={handlePrint} disabled={isPrinting}>
      {isPrinting ? "Printing.." : "Print Comp"}
    </Button>
  );
};

export default Print;
