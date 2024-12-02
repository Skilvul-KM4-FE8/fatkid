"use client";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useBuyDialog from "../hooks/use-buy-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { config } from "@/middleware";
import { Minus, Plus } from "lucide-react";
import { useCreateTransaction } from "../api/use-create-transaction";
import Print from "./print";
import { format, set } from "date-fns";

import { useReactToPrint } from "react-to-print";

const formSchema = z.object({
  customer: z.string().min(2).max(50),
});

type OrderDataType = {
  receptionist: string;
  customer: string;
  items: { id: string; name: string; price: number; quantity: number; originalPrice?: number }[];
  totalPrice: number;
};

interface PrintProps {
  authUser?: string; // Nama pengguna yang mencetak
  customerName: string; // Nama pelanggan
  menu: { name: string; price: number; quantity: number; id: string }[]; // Daftar menu
  total: number; // Total pembayaran
}

const RowPrint = ({left, right}: {left: any, right: any}) => {
  return (
    <div className="flex justify-between">
      <p>{left}</p>
      <p>{right}</p>
    </div>
  );
}

const PrintContent = ({ authUser, customerName, menu, total }:PrintProps) => {
  return (
    <div>
      <div className="mx-2 my-3 border-b-4">
        <img src="/Fatkid.png" width={100} height={100} />
        <h1 className="text-2xl font-bold">FATKID CATERING</h1>
      </div> 
      <div className="border-b-4 mx-2 my-2">
        <RowPrint left="PEGAWAI" right={authUser} />
        <RowPrint left="PELANGGAN" right={customerName} />
        <RowPrint left="Tanggal" right={format(new Date(), "yyy-MM-dd")} />
      </div>
      <div className="mx-2 my-1 border-b-4">
        <h2 >PESANAN : </h2>
      </div>
      <div>
        {menu.map((item, index: number) => (
          <div className="border-b-2">
            <RowPrint 
              key={index}
              left={`${item.name.substring(0, 20)} (${item.quantity}x Rp${item.price.toLocaleString()})`}
              right={`Rp${(item.price * item.quantity).toLocaleString()}`}
            />
          </div>
        ))}
        {/* <RowPrint left="Nama Menu" right="Harga" /> */}
      </div>
      <div>
        <RowPrint left="TOTAL BAYAR" right={`Rp${total.toLocaleString()}`} />
      </div>
      <div className="mx-2 my-1 border-b-4">
        <h2>UNTUK PEMESANAN HUBUNGI : </h2>
      </div>
      <div>
        <RowPrint left="0813-1805-3671 (FATKID)" right="" />
        <RowPrint left="@fatkid.catering (Instagram)" right="" />
      </div>
      <div className="mx-2 my-1 border-b-4">
        <h2>TERIMA KASIH TELAH BERBELANJA DI FATKID CATERING!</h2>
      </div>
    </div>
  );
};

const TransactionBuyDialog = () => {
  const { isOpen, onOpen, onClose, menu } = useBuyDialog();
  const createMutation = useCreateTransaction();
  const auth = useUser();
  const [customerName, setCustomerName] = useState<string>("");
  const [orderData, setOrderData] = useState<any>(null);
  const [submited, setSubmited] = useState<boolean>(false);

  // State for quantity per item, initialized to 1 for all menu items
  const [quantities, setQuantities] = useState<number[]>([]);
  
  const contentRef = useRef<HTMLDivElement>(null);

  const handleReactToPrint = useReactToPrint({contentRef})

  // When menu changes, set default quantity to 1 for each item
  useEffect(() => {
    if (menu) {
      setQuantities(menu.map(() => 1));
    }
  }, [menu]);

  // Function to update quantity
  const handleQuantityChange = (index: number, newQuantity: number) => {
    const newQuantities = [...quantities];
    newQuantities[index] = newQuantity;
    setQuantities(newQuantities);
  };

  const menuFix = menu.map((item, index) => ({
    ...item,
    name: item.name,
    quantity: quantities[index],
    price: item.price * quantities[index],
    originalPrice: item.price,
  }));

  // calculate total price based on quantities
  const total = menu.reduce((acc, item, index) => acc + item.price * quantities[index], 0);
  // const total = menu.reduce((acc, item) => acc + item.price, 0)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setCustomerName(values.customer);

    const orderData: OrderDataType = {
      receptionist: auth.user?.fullName || "Unknown Waiter",
      customer: values.customer,
      items: menu.map((item, index) => ({ 
        ...item,
        name: item.name,
        quantity: quantities[index],
        price: item.price * quantities[index],
      })),
      totalPrice: total,
    };

    setOrderData(orderData);

    setSubmited(true);

    console.log(orderData);
    createMutation.mutate(orderData, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  // Printer Config

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy This Menu?</DialogTitle>
            <DialogDescription>
              {/* Display waiter name */}
              <p className="font-semibold text-slate-900">Waiters : {auth.user?.fullName}</p>
              {/* <p>Total : {total}</p> */}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="customer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-slate-900">Customer Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Customer Name" 
                            {...field} 
                            onChange={(e) => {
                              field.onChange(e); // Perbarui React Hook Form
                              setCustomerName(e.target.value); // Perbarui state customerName
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Display table of menu items */}
                  <Table>
                    {/* <TableCaption>Your order summary.</TableCaption> */}
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        {/* <TableHead>Method</TableHead> */}
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {menu.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="flex items-center">
                            <Button
                              variant={"ghost"}
                              size={"sm"}
                              type="button"
                              onClick={() => {
                                handleQuantityChange(index, quantities[index] - 1);
                              }}
                              disabled={quantities[index] <= 0}
                            >
                              <Minus className="size-4" />
                            </Button>
                            <Input
                              type="number"
                              // aren menu[1]
                              // exporeso menu[2]
                              // quantity[1] : 1
                              value={quantities[index]}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                              min={1}
                              // className="w-12"
                            />
                            <Button
                              variant={"ghost"}
                              size={"sm"}
                              type="button"
                              onClick={() => {
                                handleQuantityChange(index, quantities[index] + 1);
                              }}
                              // disabled={quantities[index] > 10}
                            >
                              <Plus className="size-4" />
                            </Button>
                          </TableCell>
                          <TableCell className="text-right">Rp.{quantities[index] == 0 ? item.price : item.price * quantities[index]}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {/* Display total price */}
                  <p className="text-right mr-4 text-2xl font-bold text-slate-900">
                    Total: Rp
                    {total.toLocaleString("id-ID", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </p>

                  <Button type="submit" className="mx-auto mr-2  inline-block" disabled={createMutation.isPending}>
                    Submit
                  </Button>

                  {/* <Button variant="outline" type="button" disabled={isPrinting} onClick={() => print()}>
                    {isPrinting ? "Select Printer" : "Print"}
                  </Button> */}
                  {/* {submited && ( */}
                  <Print
                    authUser={auth.user?.fullName || "unknown"} 
                    customerName={customerName} 
                    menu={menuFix} 
                    total={total} 
                  />
                  <Button className="sm:hidden" variant="outline" type="button" onClick={() => handleReactToPrint()}>
                    Print
                  </Button>
                  <div style={{display: "none"}}>
                    <div ref={contentRef}>
                      <PrintContent 
                        authUser={auth.user?.fullName || "unknown"}
                        customerName={customerName}
                        menu={menuFix}
                        total={total}
                      />
                    </div>
                  </div>
                  {/* )} */}
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TransactionBuyDialog;
