import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Tipe Props
interface PrintProps {
  authUser?: string; // Nama pengguna yang mencetak
  customerName: string; // Nama pelanggan
  menu: { name: string; price: number; quantity: number; id: string }[]; // Daftar menu
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
      dateStyle: "full",
      timeStyle: "short",
    });

    const menuText = menu
      .map(
        (item) =>
          `${item.name.substring(0, 20).padEnd(20)} ${item.quantity} x Rp${item.price.toLocaleString()} = Rp${(
            item.price * item.quantity
          ).toLocaleString()}`
      )
      .join("\n");

    return [
      "FATKID CATERING",
      separator,
      `PEGAWAI      : ${authUser}`,
      `PELANGGAN    : ${customerName || "Pelanggan Tidak Diketahui"}`,
      `TANGGAL      : ${formattedDate}`,
      separator,
      "PESANAN:",
      menuText,
      separator,
      `TOTAL BAYAR  : Rp ${total.toLocaleString()}`,
      separator,
      "UNTUK PEMESANAN HUBUNGI:",
      "0813-1805-3671 (FATKID)",
      "@fatkid.catering (Instagram)",
      "\nTERIMA KASIH TELAH BERBELANJA DI FATKID CATERING!",
    ]
      .map((line) => line.trim()) // Hilangkan spasi tambahan
      .join("\n"); // Gabungkan dengan satu newline
  };

  // Fungsi untuk mencetak
  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      console.log("Memulai proses pencetakan...");

      // Meminta akses ke port serial
      const port = await navigator.serial.requestPort();

      // Membuka koneksi ke printer
      await port.open({
        baudRate: 9600, // Standar baud rate printer termal
        dataBits: 8,
        stopBits: 1,
        parity: "none",
      });

      if (!port.writable) {
        throw new Error("Port tidak dapat ditulisi.");
      }
      const writer = port.writable.getWriter();

      // Reset printer
      const resetPrinterCommand = new Uint8Array([0x1b, 0x40]); // ESC @
      await writer.write(resetPrinterCommand);

      // Encode teks resi dan tulis ke printer
      const encoder = new TextEncoder();
      const receiptData = encoder.encode(formatReceiptText());
      await writer.write(receiptData);

      // Perintah untuk memotong kertas
      const cutPaperCommand = new Uint8Array([0x1d, 0x56, 0x01]);
      await writer.write(cutPaperCommand);

      // Melepaskan writer dan menutup port
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
      {isPrinting ? "Sedang Mencetak..." : "Cetak Resi"}
    </Button>
  );
};

export default Print;
