import { useMutation } from "@tanstack/react-query";
import { Br, Cut, Line, Printer, Row, Text, render } from "react-thermal-printer";
import nextvulWhite from "@/public/nextvulWhite.svg";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Props type
interface PrintProps {
  authUser?: string; // Nama resepsionis
  customerName: string; // Nama pelanggan
  menu: { name: string; price: number, quantity: number, id: string }[]; // Daftar menu
  // quantities: number[]; // Kuantitas masing-masing item
  total: number; // Total harga
}

const Print = ({ authUser = "Waiter Tidak Diketahui", customerName, menu, total }: PrintProps) => {
  const [port, setPort] = useState<SerialPort | null>(null);

  // const isPrinting = false;

  // Mutasi untuk mencetak
  const { mutateAsync: print, isPending: isPrinting } = useMutation({
    mutationFn: async () => {
      let _port = port;
      if (!_port) {
        _port = await navigator.serial.requestPort();
        await _port.open({ baudRate: 9600 });
        setPort(_port);
      }

      const writer = _port?.writable?.getWriter();
      if (writer) {
        const data = await render(receipt);
        await writer.write(data);
        writer.releaseLock();
      }
    },
  });

  // Komponen struk yang dirender
  const receipt = (
    <Printer type="epson" width={58} characterSet="korea" debug={true}>
      <img style={{ display: "block", margin: "0 auto" }} src={nextvulWhite} alt="Logo" />
      <Row left="Resepsionis" right={authUser} />
      <Row left="Pelanggan" right={customerName || "Pelanggan Tidak Diketahui"} />
      <Line />
      {menu.map((item, index) => (
        <Row
          key={index}
          left={
            <Text bold={true}>
              {item.name} X {item.quantity}
              {/* {item.name} X {quantities[index]} */}
            </Text>
          }
          right={`Rp. ${item.price * item.quantity}`}
          // right={`Rp. ${item.price * quantities[index]}`}
        />
      ))}
      <Br />
      <Line />
      <Row left={<Text bold={true}>Total Harga</Text>} right={<Text underline="1dot-thick">Rp. {total}</Text>} />
      <Line />
      <Text align="center">Terima kasih telah memesan!</Text>
      <Cut />
    </Printer>
  );

  // const print = async () => {
  //   console.log({
  //     authUser,
  //     customerName,
  //     menu,
  //     total,
  //   })
  // }

  return (
    <Button
      type="button"
      variant={"outline"}
      onClick={() => print()}
      disabled={isPrinting}
      // className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {isPrinting ? "Mencetak..." : "Cetak"}
    </Button>
  );
};

export default Print;
