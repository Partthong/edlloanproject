import React, { useEffect, useRef, useState } from "react";

import { Button } from "primereact/button";
import { DataView } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

import { Dialog } from "primereact/dialog";
import { useRouter } from "next/router";
import { Toolbar } from "primereact/toolbar";
import axiosInterceptorInstance from "../../../demo/components/axios";

const Statement = () => {
  const [payments, setPayments] = useState([]);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [payment, setPayment] = useState();
  const router = useRouter();

  useEffect(() => {
    showPaymentList();
  }, []);

  const showPaymentList = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/payment/GetListpayment"
      );
      console.log("token ==>", response);
      if (response.status === 200 || response.status === 201) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "Authorization has been denied",
      });
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      router.push("/auth/login");
    }
  };

  const getSeverity = (payment) => {
    switch (payment.loan_type) {
      case "ກູ້ຢືມໂດຍກົງ":
        return "success";

      case "ກູ້ຢືມຕໍ່":
        return "warning";

      default:
        return null;
    }
  };

  const toast = useRef(null);
  const dt = useRef(null);

  const openNew = (data) => {
    setPaymentDialog(true);
    setPayment(data);
  };

  const hideDialog = () => {
    setPayment(null);
    setPaymentDialog(false);
  };

  const paymentsDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideDialog}
      />
    </>
    );
    
    const routPagetoInvoiceData = () => {
        router.push("/pages/paymentHistory");
      };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <h4 className=" font-semibold ">ການເຄື່ອນໄຫວຊຳລະໜີ້</h4>
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="ເບິ່ງຂໍ້ມູນການຊຳລະ"
          icon="pi pi-eye"
          className="mr-2 p-button-secondary"
          onClick={routPagetoInvoiceData}
        />
        <Button label="ພິມລາຍງານ" icon="pi pi-print" className="p-button-help" />
      </React.Fragment>
    );
  };

  const itemTemplate = (payment) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img
            className="w-6 sm:w-12rem xl:w-4rem  block xl:block mx-auto border-round"
            src={payment.images}
            alt="ບໍ່ມີຮູບ"
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">
                {payment.project}
              </div>

              <div className="font-semibold ">
                {" "}
                ເລກທີ Invoice: {payment.invoice_no}
              </div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                  <span className="font-semibold">{payment.bankName}</span>
                </span>
                <Tag
                  value={payment.loan_type}
                  severity={getSeverity(payment)}
                ></Tag>
              </div>
              <div className="font-semibold ">
                <i className="pi pi-clock"></i> {payment.payment_date}
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl flex align-items-center gap-2 text-red-600">
                {payment.totalpaid.toLocaleString("en-US")}{" "}
                <Tag className="bg-red-300" value={payment.currency}></Tag>
              </span>

              <Button
                icon="pi pi-info"
                className="p-button-rounded p-button-primary"
                onClick={() => openNew(payment)}
              ></Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <div className="card">
            <DataView
              value={payments}
              itemTemplate={itemTemplate}
              paginator
              rows={5}
            />
          </div>

          <Dialog
            visible={paymentDialog}
            style={{ width: "450px" }}
            header="ລາຍລະອຽດການຊຳລະ"
            modal
            className="p-fluid"
            footer={paymentsDialogFooter}
            onHide={hideDialog}
          >
            <div className="mb-3">
              <div className="text-right">{payment?.payment_date}</div>
              <img
                className="w-6 sm:w-12rem xl:w-6rem  block xl:block mx-auto border-round"
                src="/layout/images/check.png"
                alt=""
              />
            </div>

            <div className="field flex justify-content-between ">
              <label htmlFor="name">ຊື່ໂຄງການ</label>
              <div className="font-bold ">{payment?.project}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ເລກທີ Invoice</label>
              <div className="font-bold ">{payment?.invoice_no}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ຊຳລະໃຫ້ທະນາຄານ</label>
              <div className="font-bold ">{payment?.bankName}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ປະເພດກູ້ຢືມ</label>
              <div className="font-bold ">{payment?.loan_type}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ຊຳລະຕົ້ນທຶນ</label>
              <div className="  text-xl text-red-600  ">
                {payment?.capital_paid.toLocaleString("en-US")}
              </div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ຊຳລະດອກເບ້ຍ</label>
              <div className=" text-xl text-red-600  ">
                {payment?.interest_paid.toLocaleString("en-US")}
              </div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ຊຳລະ Libor</label>
              <div className="text-xl text-red-600  ">
                {payment?.libor_paid}
              </div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ຊຳລະກີບ</label>
              <div className="text-xl text-blue-600  ">
                {payment?.amount_kip.toLocaleString("en-US")}
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Statement;
