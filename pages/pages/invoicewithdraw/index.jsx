import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";

import React, { useEffect, useRef, useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { useRouter } from "next/router";
import { Toast } from "primereact/toast";
import moment from "moment";
import { FileUpload } from "primereact/fileupload";
import axiosInterceptorInstance from "../../../demo/components/axios";

function InvoiceWithdraw() {
  let emptyInvoice = {
    invoicew_no: "",
    l_id: "",
    invamount_withdraw: "",
    date_inv1: "",
    creator: "admin",
  };

  const [insertInvoice, setInsertInvoice] = useState(emptyInvoice);
  const [loan, setLoan] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(0);
  const [filteredLoan, setFilteredLoan] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const router = useRouter();

  useEffect(() => {
    showLoanList();
  }, []);

  const showLoanList = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/loan/GetListLoan"
      );
      console.log("token ==>", response);
      if (response.status === 200 || response.status === 201) {
        setLoan(response.data);
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

  const InsertData = async () => {
    if (!selectedLoan.l_id) {
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "ກະລຸນາປ້ອນເລກທີສັນຍາ",
      });
    } else if(insertInvoice.invoicew_no === ''){
        toast.current.show({
            severity: "error",
            summary: "ຜິດພາດ",
            detail: "ກະລຸນາປ້ອນເລກທີໃບ Invoice",
          });
    } else if(insertInvoice.invamount_withdraw === 0){
        toast.current.show({
            severity: "error",
            summary: "ຜິດພາດ",
            detail: "ກະລຸນາປ້ອນຈຳນວນເງິນຖອນ",
          });
    }
    else {
      try {
        var raw = {
          invoicew_no: insertInvoice.invoicew_no,
          l_id: selectedLoan.l_id,
          invamount_withdraw: insertInvoice.invamount_withdraw,
          date_inv: moment(insertInvoice.date_inv1).format("YYYY-MM-DD"),
          creator: "admin",
        };

        const response = await axiosInterceptorInstance.post(
          "/api/invoicewithdraw/InsertInvoiceWithdraw",
          raw
        );

        if (response.status === 200 || response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
            life: 3000,
          });

          setInsertInvoice(emptyInvoice);
          setTimeout(() => {
            document.location.reload();
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        toast.current.show({
          severity: "error",
          summary: "ຜິດພາດ",
          detail: "Authorization has been denied",
        });
      }
    }
  };

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const routPagetoInvoiceWithdrawData = () => {
    router.push("/pages/withdrawdata");
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _invoice = { ...insertInvoice };
    _invoice[`${name}`] = val;

    setInsertInvoice(_invoice);
  };

  const leftToolbarTemplate = () => {
    return (
        <React.Fragment>
            <div className="">
          <h4 className=" font-semibold text-green-600 ">ເພີ່ມ Invoice ຖອນເງິນກູ້</h4>
            </div>
        </React.Fragment>
    );
};


  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="ບັນທຶກ"
          icon="pi pi-plus"
          className="p-button-info"
          onClick={InsertData}
        />
        {/* <Button
          label="ເບີ່ງຂໍ້ມູນ"
          icon="pi pi-eye"
          className="mr-2 p-button-secondary"
          onClick={routPagetoInvoiceWithdrawData}
        /> */}
      </React.Fragment>
    );
  };

  const search = (event) => {
    console.log("event.query==>", event.query);

    setTimeout(() => {
      let _filteredLoan;

      if (!event.query.trim().length) {
        _filteredLoan = [...loan];
      } else {
        _filteredLoan = loan.filter((item) => {
          return item.loan_no
            .toLowerCase()
            .startsWith(event.query.toLowerCase());
        });
      }

      console.log(_filteredLoan);

      setFilteredLoan(_filteredLoan);
    }, 250);
  };

  return (
    <div className="grid">
      <div className="col-12 md:col-12">
        <div className="card ">
          <Toast ref={toast} />
          <Toolbar className="" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
        
          <div className="p-fluid formgrid grid mt-5">
            <div className="field col-12 md:col-12">
              <label htmlFor="loan_no" className="text-blue-500">
                ປ້ອນເລກທີສັນຍາ
              </label>
              <AutoComplete
                field="loan_no"
                value={selectedLoan}
                suggestions={filteredLoan}
                completeMethod={search}
                onChange={(e) => setSelectedLoan(e.value)}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="lastname2" className="">
                ຊື່ໂຄງການ
              </label>
              <InputText
                readOnly
                id="firstname2"
                type="text"
                value={selectedLoan ? selectedLoan.project : ""}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="firstname2" className="">
                ຈຳນວນເງິນກູ້ຢືມທັງໝົດ
              </label>

              <InputNumber
                className=""
                readOnly
                id="firstname2"
                type="text"
                value={selectedLoan ? selectedLoan.amount_loan : ""}
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="firstname2" className="">
                ຈຳນວນຖອນເງິນກູ້ຢືມທັງໝົດ
              </label>

              <InputNumber
                className=""
                readOnly
                id="firstname2"
                type="text"
                value={selectedLoan ? selectedLoan.total_withdraw : ""}
              />
              <b className="hidden">{selectedLoan ? selectedLoan.l_id : ""}</b>
            </div>
          </div>
          <div className="field grid p-2">
            <label htmlFor="name3" className="mr-1">
              ສະກຸນເງິນ:
            </label>
            <b className="text-red-500">
              {selectedLoan ? selectedLoan.currency : ""}
            </b>
          </div>
        </div>
      </div>
      <div className="col-12 md:col-12">
        <div className="card ">
          <div className=" p-fluid formgrid grid">
            <div className="field col-12 md:col-4">
              <label htmlFor="name1">ເລກທີໃບ Invoice</label>
              <InputText
                id="invoicew_no"
                type="text"
                className="text-blue-500"
                onChange={(e) =>
                  setInsertInvoice({
                    ...insertInvoice,
                    invoicew_no: e.target.value,
                  })
                }
              />
            </div>
            <div className="field col-12 md:col-4">
              <label htmlFor="name1">ຈຳນວນເງິນຖອນ</label>
              <InputNumber
                value={insertInvoice.invamount_withdraw}
                mode="decimal"
                minFractionDigits={2}
                onValueChange={(e) =>
                  onInputNumberChange(e, "invamount_withdraw")
                }
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="age1">ວັນເດືອນປີ</label>
              <Calendar
                dateFormat="yy-mm-dd"
                onChange={(e) =>
                  setInsertInvoice({
                    ...insertInvoice,
                    date_inv1: e.target.value,
                  })
                }
                showIcon
              />
            </div>
          </div>
        </div>
      </div>
    
      <div className="field col-12">
        <div className="card flex justify-content-center">
          <Toast ref={toast}></Toast>
          <FileUpload
            mode="basic"
            name="demo[]"
            url="/api/upload"
            accept="pdf/*"
            maxFileSize={1000000}
            onUpload={onUpload}
          />
        </div>
      </div>

    </div>
    
  );
}

export default InvoiceWithdraw;
