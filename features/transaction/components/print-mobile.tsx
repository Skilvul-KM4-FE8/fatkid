import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

export default function PrintMobile() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleReactToPrint = useReactToPrint({ contentRef });

  interface PrintProps {
    authUser?: string; // Nama pengguna yang mencetak
    customerName: string; // Nama pelanggan
    menu: { name: string; price: number; quantity: number; id: string }[]; // Daftar menu
    total: number; // Total pembayaran
  }

  const RowPrint = ({ left, right }: { left: any; right: any }) => {
    return (
      <div className="flex justify-between">
        <p className="text-2xl font-light">{left}</p>
        <p className="text-2xl">{right}</p>
      </div>
    );
  };

  const LinePrint = () => {
    return <div className="border-b-2 overflow-hidden -ml-7">===================================================================================================</div>;
  };

  const LinePrintSingle = () => {
    return <div className="border-b-2 overflow-hidden -ml-7">-----------------------------------------------------------------------------------------------------------------------------------------------</div>;
  };

  const PrintContent = ({ authUser, customerName, menu, total }: PrintProps) => {
    return (
      <div className="px-4">
        <div className="mx-2 my-3 border-b-2 border-dashed border-gray-500 flex justify-center items-center">
          <img src="/Fatkid.png" width={100} height={100} />
          <p className="text-4xl font-bold">FATKID CATERING</p>
        </div>
        <LinePrint />
        <div className="border-b-4 mx-2 my-2">
          <RowPrint left="Pegawai" right={authUser} />
          <RowPrint left="Pelanggan" right={customerName} />
          <RowPrint left="Tanggal" right={(new Date(), "yyy-MM-dd")} />
        </div>
        <LinePrint />
        <div className="mx-2 my-1 border-b-4">
          <h2 className="text-2xl">PESANAN : </h2>
          <LinePrintSingle />
        </div>
        <div>
          {menu.map((item, index: number) => (
            <div className="border-b-2">
              <RowPrint key={index} left={`${item.name.substring(0, 20)} (${item.quantity}x Rp${item.price.toLocaleString()})`} right={`Rp${(item.price * item.quantity).toLocaleString()}`} />
              <LinePrintSingle />
            </div>
          ))}
          {/* <RowPrint left="Nama Menu" right="Harga" /> */}
        </div>
        <div>
          <RowPrint left="TOTAL BAYAR" right={`Rp${total.toLocaleString()}`} />
          <LinePrint />
        </div>
        <div className="mx-2 my-1 border-b-4">
          <p className="text-center text-2xl">UNTUK PEMESANAN HUBUNGI : </p>
        </div>
        <div>
          <p className="text-center text-2xl">0813-1805-3671 (FATKID)</p>
          <p className="text-center text-2xl">@Fatkid.Poffertjes(Instagram)</p>
          <p className="text-center text-2xl">UNTUK PEMESANAN HUBUNGI :</p>
        </div>
        <div className="mx-2 my-1 border-b-4">
          <LinePrint />
          <p className="text-center text-2xl">TERIMA KASIH TELAH BERBELANJA DI FATKID CATERING!</p>
        </div>
      </div>
    );
  };

  return (
    <Button className="" variant="outline" type="button" onClick={() => handleReactToPrint()}>
      Print Mobile 2
    </Button>
  );
}
