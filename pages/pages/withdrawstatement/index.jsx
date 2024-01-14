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

const WithdrawStatement = () => {
  const [withdraws, setWithdraws] = useState([]);
  const [withdrawDialog, setWithdrawDialog] = useState(false);
  const [withdraw, setWithdraw] = useState();
  const router = useRouter();

  useEffect(() => {
    showWithdrawList();
  }, []);

  const showWithdrawList = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/withdraw/GetListWithdraw"
      );
      console.log("token ==>", response);
      if (response.status === 200 || response.status === 201) {
        setWithdraws(response.data);
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

  const getSeverity = (withdraw) => {
    switch (withdraw.loan_type) {
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
    setWithdrawDialog(true);
    setWithdraw(data);
  };

  const hideDialog = () => {
    setWithdraw(null);
    setWithdrawDialog(false);
  };

  const withdrawsDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideDialog}
      />
    </>
    );
    
    const routPagetowithdrawHistory = () => {
        router.push("/pages/withdrawHistory");
      };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2 ">
          <h4 className=" font-semibold ">ການເຄື່ອນໄຫວຖອນເງິນກູ້</h4>
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="ປະຫວັດການຖອນ"
          icon="pi pi-eye"
          className="mr-2 p-button-secondary"
          onClick={routPagetowithdrawHistory}
        />
        <Button label="ພິມລາຍງານ" icon="pi pi-print" className="p-button-help" />
      </React.Fragment>
    );
  };

  const itemTemplate = (withdraw) => {
    return (
      <div className="col-12">
        <div className="flex flex-column xl:flex-row xl:align-items-start p-4 gap-4">
          <img
            className="w-6 sm:w-12rem xl:w-4rem  block xl:block mx-auto border-round"
            src={withdraw.images}
            alt="ບໍ່ມີຮູບ"
          />
          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
              <div className="text-2xl font-bold text-900">
                {withdraw.project}
              </div>

              <div className="font-semibold ">
                {" "}
                ເລກທີ Invoice: {withdraw.invoicew_no}
              </div>
              <div className="flex align-items-center gap-3">
                <span className="flex align-items-center gap-2">
                ເລກທີ ສັນຍາ: <span className="font-semibold">{withdraw.loan_no}</span>
                </span>
                <Tag
                  value={withdraw.loan_type}
                  severity={getSeverity(withdraw)}
                ></Tag>
              </div>
              <div className="font-semibold ">
                <i className="pi pi-clock"></i> {withdraw.withdraw_date}
              </div>
            </div>
            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
              <span className="text-2xl flex align-items-center gap-2 text-red-600">
                {withdraw.amount_withdraw.toLocaleString("en-US")}{" "}
                <Tag className="bg-red-300" value={withdraw.currency}></Tag>
              </span>
         

              {/* <Button
                icon="pi pi-info"
                className="p-button-rounded p-button-primary"
                onClick={() => openNew(withdraw)}
              ></Button> */}
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
            className="mb-4 bg-green-50"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <div className="card">
            <DataView
              value={withdraws}
              itemTemplate={itemTemplate}
              paginator
              rows={5}
            />
          </div>

          {/* <Dialog
            visible={withdrawDialog}
            style={{ width: "450px" }}
            header="ລາຍລະອຽດການຊຳລະ"
            modal
            className="p-fluid"
            footer={withdrawsDialogFooter}
            onHide={hideDialog}
          >
            <div className="mb-3">
              <div className="text-right">{withdraw?.withdraw_date}</div>
              <img
                className="w-6 sm:w-12rem xl:w-6rem  block xl:block mx-auto border-round"
                src="/layout/images/check.png"
                alt=""
              />
            </div>

            <div className="field flex justify-content-between ">
              <label htmlFor="name">ຊື່ໂຄງການ</label>
              <div className="font-bold ">{withdraw?.project}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ເລກທີ Invoice</label>
              <div className="font-bold ">{withdraw?.invoicew_no}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ຊຳລະໃຫ້ທະນາຄານ</label>
              <div className="font-bold ">{withdraw?.bankName}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ປະເພດກູ້ຢືມ</label>
              <div className="font-bold ">{withdraw?.loan_type}</div>
            </div>
            <div className="field flex justify-content-between">
              <label htmlFor="name">ຈຳນວນຖອນເງິນກູ້</label>
              <div className="  text-xl text-red-600  ">
                {withdraw?.amount_withdraw.toLocaleString("en-US")}
              </div>
            </div>
       
          
          
          </Dialog> */}
        </div>
      </div>
    </div>
  );
};

export default WithdrawStatement;
