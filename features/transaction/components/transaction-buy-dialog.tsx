"use client";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const formSchema = z.object({
  customer: z.string().min(2).max(50),
});
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import useBuyDialog from "../hooks/use-buy-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { config } from "@/middleware";
import { Minus, Plus } from "lucide-react";
import { useCreateTransaction } from "../api/use-create-transaction";

import { useMutation } from "@tanstack/react-query";
import { Br, Cut, Line, Printer, Row, Text, render } from "react-thermal-printer";

const TransactionBuyDialog = () => {
  const { isOpen, onOpen, onClose, menu } = useBuyDialog();
  const createMutation = useCreateTransaction();
  const auth = useUser();

  // State for quantity per item, initialized to 1 for all menu items
  const [quantities, setQuantities] = useState<number[]>([]);

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
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);

    const orderData = {
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
    console.log(orderData);
    createMutation.mutate(orderData, {
      onSuccess: () => {
        onClose();
      },
    });
  }

  // Printer Config

  const [port, setPort] = useState<SerialPort>();
  const { mutateAsync: print, isPending: isPrinting } = useMutation({
    mutationFn: async () => {
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
    },
  });

  const receipt = (
    <Printer type="epson" width={58} characterSet="korea" debug={true}>
      {/* <Row left="Resepsionis" right={auth.user?.fullName || "Waiter Tidak Diketahui"} />
      <Row left="Pelanggan" right={values.customer || "Pelanggan Tidak Diketahui"} />
      <Line />
      {menu.map((item, index) => (
        <Row
          key={index}
          left={
            <Text bold={true}>
              {item.name} X {quantities[index]}
            </Text>
          }
          right={`Rp. ${item.price * quantities[index]}`}
        />
      ))}
      <Br />
      <Line />
      <Row left={<Text bold={true}>Total Harga</Text>} right={<Text underline="1dot-thick">Rp. {total}</Text>} />
      <Line />
      <Text align="center">Terima kasih telah memesan!</Text>

      <Cut /> */}

      <Text size={{ width: 2, height: 2 }}>9,500 IDR</Text>
      <Text bold={true}>Pembayaran Selesai</Text>
      <Br />
      <Line />
      <Row left="Metode Pembayaran" right="Kartu Debit" />
      <Row left="Nomor Kartu" right="123456**********" />
      <Row left="Durasi Cicilan" right="Pembayaran Sekaligus" />
      <Row left="Jumlah Pembayaran" right="9,500" />
      <Row left="Pajak" right="863" />
      <Row left="Harga Pokok" right="8,637" />
      <Line />
      <Row left={<Text bold={true}>Teh Jagung Manis X 2</Text>} right="11,000" />
      <Text> Opsi1(500)/Opsi2/"Catatan"</Text>
      <Row left=" (-) Diskon" right="- 500" />
      <Br />
      <Line />
      <Row left={<Text bold={true}>Total</Text>} right={<Text underline="1dot-thick">9,500</Text>} />
      <Row left="(-) Diskon 2%" right="- 1,000" />
      <Line />
      <Row left="Nama Pemilik" right="Kim Pemilik" />
      <Row left="Nomor Registrasi Bisnis" right="000-00-00000" />
      <Row left="Nomor Perwakilan" right="0000-0000" />
      <Row left="Alamat" right="Kota Apa, Distrik Apa, Desa Apa, Blok Berapa" />
      <Row gap={1} left={<Text size={{ width: 2, height: 2 }}>PO</Text>} center={<Text size={{ width: 2, height: 2 }}>Aloha Poké Makanan Enak</Text>} right="X 15" />
      <Line />
      <Br />
      <Text align="center">Wifi: some-wifi / PW: 123123</Text>
      <Cut />
    </Printer>
  );

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
                          <Input placeholder="Customer Name" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                                        This is your public display name.
                                    </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <Button type="submit">Submit</Button> */}

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
                  <p className="text-right mr-4 text-2xl border  font-bold text-slate-900">Total: Rp.{total}</p>

                  <Button type="submit" className="mx-auto mr-2  inline-block" disabled={createMutation.isPending}>
                    Submit
                  </Button>

                  <Button variant="outline" type="button" disabled={isPrinting} onClick={() => print()}>
                    {isPrinting ? "Select Printer" : "Print"}
                  </Button>
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
