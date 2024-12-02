import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Br, Cut, Line, Printer, Row, Text, render } from 'react-thermal-printer';
import { format } from "date-fns";
import { Receipt } from "lucide-react";

// Tipe Props
interface PrintProps {
  authUser?: string; // Nama pengguna yang mencetak
  customerName: string; // Nama pelanggan
  menu: { name: string; price: number; quantity: number; id: string }[]; // Daftar menu
  total: number; // Total pembayaran
}

const Print = ({ authUser = "Waiter Tidak Diketahui", customerName, menu, total }: PrintProps) => {

  const [isPrinting, setIsPrinting] = useState(false);
  const [port, setPort] = useState<SerialPort>();
  const receipt = (
    <Printer type="epson" width={42} characterSet="korea" debug={true}>
      <Text size={{ width: 2, height: 2 }}>9,500원</Text>
      <Text bold={true}>결제 완료</Text>
      <Br />
      <Line />
      <Row left="결제방법" right="체크카드" />
      <Row left="카드번호" right="123456**********" />
      <Row left="할부기간" right="일시불" />
      <Row left="결제금액" right="9,500" />
      <Row left="부가세액" right="863" />
      <Row left="공급가액" right="8,637" />
      <Line />
      <Row left={<Text bold={true}>맛있는 옥수수수염차 X 2</Text>} right="11,000" />
      <Text> 옵션1(500)/옵션2/"메모"</Text>
      <Row left=" (-) 할인" right="- 500" />
      <Br />
      <Line />
      <Row left={<Text bold={true}>합계</Text>} right={<Text underline="1dot-thick">9,500</Text>} />
      <Row left="(-) 할인 2%" right="- 1,000" />
      <Line />
      <Row left="대표" right="김대표" />
      <Row left="사업자등록번호" right="000-00-00000" />
      <Row left="대표번호" right="0000-0000" />
      <Row left="주소" right="어디시 어디구 어디동 몇동몇호" />
      <Row
        gap={1}
        left={<Text size={{ width: 2, height: 2 }}>포</Text>}
        center={<Text size={{ width: 2, height: 2 }}>알로하 포케 맛있는 거</Text>}
        right="X 15"
      />
      <Line />
      <Br />
      <Text align="center">Wifi: some-wifi / PW: 123123</Text>
      <Cut />
    </Printer>
  );

  // Format teks untuk resi
  // const formatReceiptText = () => {
  //   const separator = "-".repeat(32);

  //   // Format tanggal saat ini
  //   const now = new Date();
  //   const formattedDate = now.toLocaleString("id-ID", {
  //     dateStyle: "full",
  //     timeStyle: "short",
  //   });

  //   const menuText = menu
  //     .map(
  //       (item) =>
  //         `${item.name.substring(0, 20).padEnd(20)} ${item.quantity} x Rp${item.price.toLocaleString()} = Rp${(
  //           item.price * item.quantity
  //         ).toLocaleString()}`
  //     )
  //     .join("\n");

  //   const data = [
  //     "FATKID CATERING",
  //     separator,
  //     `PEGAWAI      : ${authUser}`,
  //     `PELANGGAN    : ${customerName || "Pelanggan Tidak Diketahui"}`,
  //     `TANGGAL      : ${formattedDate}`,
  //     separator,
  //     "PESANAN:",
  //     menuText,
  //     separator,
  //     `TOTAL BAYAR  : Rp ${total.toLocaleString()}`,
  //     separator,
  //     "UNTUK PEMESANAN HUBUNGI:",
  //     "0813-1805-3671 (FATKID)",
  //     "@fatkid.catering (Instagram)",
  //     "\nTERIMA KASIH TELAH BERBELANJA DI FATKID CATERING!",
  //   ]
  //     .map((line) => line.trim()) // Hilangkan spasi tambahan
  //     .join("\n"); // Gabungkan dengan satu newline

  //     return data
  // };

  
  

  // const receipt = (
  //   <Printer type="epson" width={42} characterSet="iso8859_15_latin9" debug={true}>
  //     <Text size={{width: 4, height: 4}}>FATKID CATERING</Text>
  //   </Printer>
  // )

  // Fungsi untuk mencetak
  const handlePrint = async () => {
    // try {
      setIsPrinting(true);
      console.log("Memulai proses pencetakan...");

      // const Receipt = (
      //   <Printer type="epson" width={42} characterSet="iso8859_15_latin9" debug={true}>
      //     <Text size={{ width: 4, height: 4 }}>FATKID CATERING</Text>
      //     <Br />
      //     <Line />
      //     <Row left="PEGAWAI" right={authUser} />
      //     <Row left="PELANGGAN" right={customerName || "Pelanggan Tidak Diketahui"} />
      //     <Row left="TANGGAL" right={format(new Date(), "yyy-MM-dd")} />
      //     <Line />
      //     <Text>PESANAN:</Text>
      //     {menu.map((item: any, index: any) => (
      //       <Row
      //         key={index}
      //         left={`${item.name.substring(0, 20)} (${item.quantity}x Rp${item.price.toLocaleString()})`}
      //         right={`Rp${(item.price * item.quantity).toLocaleString()}`}
      //       />
      //     ))}
      //     <Line />
      //     <Row left={<Text bold={true}>TOTAL BAYAR</Text>} right={`Rp ${total.toLocaleString()}`} />
      //     <Line />
      //     <Text align="center">UNTUK PEMESANAN HUBUNGI:</Text>
      //     <Text align="center">0813-1805-3671 (FATKID)</Text>
      //     <Text align="center">@fatkid.catering (Instagram)</Text>
      //     <Br />
      //     <Text align="center">TERIMA KASIH TELAH BERBELANJA DI FATKID CATERING!</Text>
      //     <Cut />
      //   </Printer>
      // );

      // async () => {
        let _port = port;
        if (_port == null) {
          _port = await navigator.serial.requestPort();
          await _port.open({ baudRate: 9600 });
          setPort(_port);
        }
  
        const writer = _port.writable?.getWriter();
        if (writer != null) {
          const data = await render(receipt);
  
          await writer.write(data);
          writer.releaseLock();
        }
      // }

      //////////////////////////////

      // Meminta akses ke port serial
      // const port = await navigator.serial.requestPort();

      // // Membuka koneksi ke printer
      // await port.open({
      //   baudRate: 9600, // Standar baud rate printer termal
      //   dataBits: 8,
      //   stopBits: 1,
      //   parity: "none",
      // });

      // if (!port.writable) {
      //   throw new Error("Port tidak dapat ditulisi.");
      // }
      // const writer = port.writable.getWriter();

      // // Reset printer
      // const resetPrinterCommand = new Uint8Array([0x1b, 0x40]); // ESC @
      // await writer.write(resetPrinterCommand);

      // // Encode teks resi dan tulis ke printer
      // const encoder = new TextEncoder();
      // const receiptData = encoder.encode(formatReceiptText());
      // await writer.write(receiptData);

      // // Perintah untuk memotong kertas
      // const cutPaperCommand = new Uint8Array([0x1d, 0x56, 0x01]);
      // await writer.write(cutPaperCommand);

      // // Melepaskan writer dan menutup port
      // writer.releaseLock();
      // await port.close();
      console.log("Pencetakan selesai.");
    // } catch (error) {
      // console.error("Terjadi kesalahan saat mencetak:", error);
      // alert("Gagal mencetak. Pastikan printer terhubung dengan benar.");
    // } finally {
      setIsPrinting(false);
    // }
  };

  // Komponen tombol untuk memulai pencetakan
  return (
    <Button type="button" variant="outline" onClick={() => handlePrint()} disabled={isPrinting}>
      {isPrinting ? "Sedang Mencetak..." : "Cetak Resi"}
    </Button>
  );
};

export default Print;
