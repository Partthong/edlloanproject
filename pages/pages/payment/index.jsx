import { Button } from "primereact/button";

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";

import { Calendar } from "primereact/calendar";
import React, { useEffect, useRef, useState } from "react";

import { Toast } from "primereact/toast";

import axiosInterceptorInstance from "../../../demo/components/axios";
import { useRouter } from "next/router";
import moment from "moment/moment";

function Payments() {
  let emptyPayment = {
    inv_id: "",
    capital_paid: "",
    interest_paid: "",
    other_paid: "",
    amount_kip: "",
    currency_paid: "",
    payment_date: "",
    create_date: "",

    l_id: "",
    total_balance: "",
    total_payment: "",
    amount_capital: "",
    amount_interest: "",
    amount_other: "",
    remarks: "",
    amount_capital2: "",
    credit: "",
    libor: "",
    days: "",
  };
  const [invoiceList, setInvoiceList] = useState([]);
  const [payment, setPayment] = useState(emptyPayment);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [editPaymentDialog, setEditPaymentDialog] = useState(false);
  const [checkcapital, setCheckcapital] = useState(false);
  const [checkinterest, setCheckinterest] = useState(false);
  const [checkother, setCheckOther] = useState(false);
  const [isCheckcapital, setIsCheckcapital] = useState(false);
  const [isCheckchange, setIsCheckchange] = useState(false);
  const [isCheckOther, setIsCheckOther] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(0);
  const [result, setResult] = useState(0);
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [dropdownCurrencys, setDropdownCurrencys] = useState(null);
  const [isSelectCurrency, setIsSelectCurrency] = useState(null);
  const [showCurrency, setShowCurrency] = useState(emptyPayment);
  const [rateCapital, setRateCapital] = useState(0);
  const [rateInterest, setRateInterest] = useState(0);
  const [rateOther, setRateOther] = useState(0);

  const [updateamountinterest, setUpdateamountinterest] = useState(0);
  const [updateamountcapital, setUpdateamountcapital] = useState(0);
  const [updateamountother, setUpdateamountother] = useState(0);
  const router = useRouter();

  useEffect(() => {
    showListInvoice();
  }, []);

  const showListInvoice = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/invoice/GetListInvoice"
      );

      if (response.status === 200 || response.status === 201) {
        setInvoiceList(response.data);
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

  const showDropdownCurrencys = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/currency/GetListCurrency"
      );
      console.log("token ==>", response);
      if (response.status === 200 || response.status === 201) {
        setDropdownCurrencys(response.data);
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
    // if (rateCapital === '' || rateInterest === '' || rateOther === ''){
    try {
      var raw = {
        inv_id: payment.inv_id,

        capital_paid: checkcapital ? payment.amount_capital : 0,
        interest_paid: checkinterest ? payment.amount_interest : 0,
        other_paid: checkother ? payment.amount_other : 0,

        amount_kip: rateCapital + rateInterest + rateOther,
        currency_paid: payment.rate,
        payment_date: moment(payment.payment_date).format("YYYY-MM-DD"),
        creator: "admin",
        create_date: moment().format("YYYY-MM-DD"),
        l_id: payment.l_id,

        total_balance:
          payment.total_balance - (checkcapital ? payment.amount_capital : 0),
        total_payment:
          payment.total_payment + (checkcapital ? payment.amount_capital : 0),

        amount_capital:
          updateamountcapital.amount_capital -
          (checkcapital ? payment.amount_capital : 0),
        amount_interest:
          updateamountinterest.amount_interest -
          (checkinterest ? payment.amount_interest : 0),
        amount_other:
          updateamountother.amount_other -
          (checkother ? payment.amount_other : 0),
      };

      // console.log(raw)

      const response1 = await axiosInterceptorInstance.post(
        "/api/payment/Insertpayment",
        raw
      );
      const response2 = await axiosInterceptorInstance.post(
        "/api/loan/UpdateTotalBalance",
        raw
      );
      const response3 = await axiosInterceptorInstance.post(
        "/api/invoice/UpdateInvoiceAmount",
        raw
      );

      if (
        response1.status === 200 &&
        response2.status === 200 &&
        response3.status === 200
      ) {
        setPayment(emptyPayment);
        setTimeout(() => {
          document.location.reload();
        }, 3000);

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
          life: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "Authorization has been denied",
      });
      router.push("/auth/login");
    }

    // }
    // else{
    //   toast.current.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ກະລຸນາເລືອກການຊຳລະ...!' });
    // }
  };

  const UpdateData = async () => {
    try {
    
        var raw = {
            // inw_id: withdraw.inw_id,
            // invoicew_no: withdraw.invoicew_no,
            // invamount_withdraw: withdraw.invamount_withdraw,
            // date_inv: moment(withdraw.date_inv).format("YYYY-MM-DD"),
            inv_id: payment.inv_id,
            invoice_no: payment.invoice_no,

            amount_capital: payment.amount_capital,
            amount_interest: payment.amount_interest,
            amount_other: payment.amount_other,

            days: payment.days,
            libor: payment.libor,
            credit: payment.credit,

            atm_name:payment.atm_name,
            atm_number: payment.atm_number,
            date_in: moment(payment.date_in).format("YYYY-MM-DD")
   
        };

        const response = await axiosInterceptorInstance.post(
          "/api/invoice/UpdateInvoicebyid", raw
        );

        if (response.status === 200 || response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "ອັບເດດຂໍ້ມູນສຳເລັດ",
            life: 3000,
          });
            
          setPayment(emptyPayment);
          setEditPaymentDialog(false);
          showListInvoice();
        }
     
    } catch (error) {
      console.error(error);
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "Authorization has been denied",
      });
    
    }
  };

  const toast = useRef(null);
  const dt = useRef(null);

  // const handlevalue1 = (e) => {
  //   setValue1(e.target.value);
  // };

  const handlevalue2 = (e) => {
    setValue2(e.target.value);
  };

  // const handleCalculation = () => {
  //   setResult(value1 * payment.rate);
  // };

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const payments = (payment) => {
    setPayment({ ...payment });
    setUpdateamountcapital({ ...payment });
    setUpdateamountinterest({ ...payment });
    setUpdateamountother({ ...payment });
    setPaymentDialog(true);
  };

  const editInvoice = (payment) => {
    setPayment({ ...payment });
    setEditPaymentDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setBankDialog(false);
  };

  const hidePaymentDialog = () => {
    setPaymentDialog(false);
  };

  const hideEditPaymentDialog = () => {
    setEditPaymentDialog(false);
  };

  const hideDeleteBankDialog = () => {
    setDeleteBankDialog(false);
  };

  const confirmDeleteBank = (bank) => {
    setBank(bank);
    setDeleteBankDialog(true);
  };

  const checkpaymentCapital = (e) => {
    setCheckcapital(e.target.checked);
    if (e.target.checked) {
      setPayment({ ...payment, amount_capital: payment.amount_capital });
      setRateCapital(payment.amount_capital * payment.rate);
    } else {
      setRateCapital(0);
    }
  };

  const checkpaymentInterest = (e) => {
    setCheckinterest(e.target.checked);
    if (e.target.checked) {
      setPayment({ ...payment, amount_interest: payment.amount_interest });
      setRateInterest(payment.amount_interest * payment.rate);
    } else {
      setRateInterest(0);
    }
  };

  const checkpaymentOther = (e) => {
    setCheckOther(e.target.checked);
    if (e.target.checked) {
      setPayment({ ...payment, amount_other: payment.amount_other });
      setRateOther(payment.amount_other * payment.rate);
    } else {
      setRateOther(0);
    }
  };

  const checkChangePaymentCapital = (e) => {
    setIsCheckchange((current) => !current);
  };

  const selectRateCurrency = (e) => {
    let _loan = { ...dropdownCurrencys };
    _loan["currency"] = e.value;
    setDropdownCurrencys(_loan);
  };

  const onStatussChange = (e) => {
    let _loan = { ...payment };
    _loan["statuss"] = e.value;
    setPayment(_loan);
  };

  const testresult = (e) => {
    let _loan = { ...dropdownCurrencys };
    _loan["result"] = e.value;
    setResult1(_loan);
  };

  const paymentDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hidePaymentDialog}
      />
      <Button
        label="ຢຶນຢັນ"
        icon="pi pi-check"
        className="p-button-danger "
        onClick={InsertData}
      />
    </>
  );

  const editpaymentDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideEditPaymentDialog}
      />
      <Button
        label="ແກ້ໄຂ"
        icon="pi pi-pencil"
        className="p-button-success "
        onClick={UpdateData}
        
      />
    </>
  );

  const deleteBankDialogFooter = (
    <>
      <Button
        label="ປະຕິເສດ"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteBankDialog}
      />
      <Button
        label="ຢືນຢັນ"
        icon="pi pi-check"
        className="p-button-danger"
        onClick={""}
      />
    </>
  );

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          label="ຊຳລະ"
          icon="pi pi-fw pi-dollar"
          className="p-button-danger hover:bg-red-400 hover:text-white mr-2 bg-white text-red-600 h-3"
          onClick={() => payments(rowData)}
          outlined
        />
        <Button
          label="ແກ້ໄຂ"
          icon="pi pi-user-edit"
          className="p-button-success hover:bg-green-400 hover:text-white mr-2 bg-white text-green-600 h-3"
          onClick={() => editInvoice(rowData)}
          outlined
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-end md:align-items-center ">
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _invoice = { ...payment };
    _invoice[`${name}`] = val;

    setPayment(_invoice);
  };

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <h3 className="mb-1 text-red-600  ">ລາຍການຊຳລະໜີ້</h3>
          <div className="flex flex-column md:flex-row md:justify-content-end md:align-items-center mb-3 ">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
              <i className="pi pi-search" />
              <InputText
                type="search"
                onInput={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
              />
            </span>
          </div>
          <div className="">
            <DataTable
              dataKey="inv_id"
              value={invoiceList}
              tableStyle={{ minWidth: "100%" }}
              paginator
              showGridlines
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              emptyMessage="No products found."
              responsiveLayout="scroll"
              // header={header}
            >
              <Column
                field="inv_id"
                header="ລະຫັດ"
                sortable
                headerStyle={{ minWidth: "8rem" }}
              ></Column>
              <Column
                field="invoice_no"
                header="ລະຫັດ Invoice"
                sortable
                headerStyle={{ minWidth: "8rem" }}
              ></Column>
              <Column
                field="loan_no"
                header="ເລກທີສັນຍາ"
                sortable
                headerStyle={{ minWidth: "10rem" }}
              ></Column>
              <Column
                field="project"
                header="ຊື່ໂຄງການ"
                sortable
                headerStyle={{ minWidth: "15rem" }}
              ></Column>
              <Column
                field="date_in"
                header="ວັນທີເພີ່ມ"
                sortable
                headerStyle={{ minWidth: "10rem" }}
              ></Column>
              <Column
                body={actionBodyTemplate}
                header="ຢັ້ງຢືນການຊຳລະ"
                sortable
                headerStyle={{ minWidth: "10rem" }}
              ></Column>
            </DataTable>

            <Dialog
              visible={paymentDialog}
              style={{ width: "750px" }}
              header="ການຊຳລະໜີ້"
              maximizable
              modal
              className="p-fluid "
              footer={paymentDialogFooter}
              onHide={hidePaymentDialog}
            >
              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="name" className="">
                    ລະຫັດ Invoice
                  </label>

                  <InputText id="name" value={payment.inv_id} disabled />
                </div>

                <div className="field col">
                  <label htmlFor="name" className="">
                    ເລກທີ Invoice
                  </label>
                  <InputText
                    className="text-blue-500"
                    id="name"
                    value={payment.invoice_no}
                    disabled
                  />
                </div>

                <div className="field col ">
                  <label htmlFor="name" className="">
                    ເລກທີເງິນກູ້ຢຶມ
                  </label>
                  <InputText
                    className="text-blue-500"
                    id="name"
                    value={payment.loan_no}
                    disabled
                  />
                </div>
              </div>

              <div className="field ">
                <label htmlFor="name" className="">
                  ຊື່ໂຄງການ
                </label>
                <InputText
                  className="text-blue-500"
                  id="name"
                  value={payment.project}
                  disabled
                />
              </div>

              <div className="formgrid grid ">
                <div className="field col-5">
                  <label htmlFor="name" className="font-bold">
                    ລວມເງິນເບີກຖອນກູ້ຢືມທັງໝົດ
                  </label>
                  <InputNumber
                    id="name"
                    disabled
                    value={payment.total_withdraw}
                  />
                </div>
                <div className="field col-5">
                  <label htmlFor="name" className="font-bold text-red-500">
                    ຍອດໜີ້ກູ້ຢືມຍັງເຫຼືອທັງໝົດ
                  </label>
                  <InputNumber
                    id="name"
                    value={payment.total_balance}
                    disabled
                  />
                </div>
                <div className="field col-2">
                  <label htmlFor="name" className="">
                    ສະກຸນເງິນ
                  </label>
                  <InputText
                    id="name"
                    className="text-blue-500"
                    value={payment.currency}
                    disabled
                  />
                </div>
              </div>

              <div className="card mb-3 p-2 bg-red-50 ">
                <h5 className="mb-1 ml-3 text-red-600 font-bold ">
                  ເລືອກການຊຳລະ
                </h5>
                <div className="flex justify-content-start ">
                  <div className="col-4 flex  align-items-center">
                    <div className="ml-2">
                      <input
                        className=""
                        type="checkbox"
                        value={checkcapital}
                        onChange={checkpaymentCapital}
                        id="amount_capital"
                        name="amount_capital"
                      />
                      <label htmlFor="capital" className="font-bold">
                        ຊຳລະຕົ້ນທຶນ
                      </label>
                    </div>
                  </div>

                  <div className="col-4 flex  align-items-center">
                    <div className="ml-2">
                      <input
                        className=""
                        type="checkbox"
                        value={checkcapital}
                        onChange={checkChangePaymentCapital}
                        id="amount_capital"
                        name="amount_capital"
                      />
                      <label htmlFor="capital" className=" text-red-500">
                        ແກ້ຕົວເລກ
                      </label>
                    </div>
                  </div>
                  <div className="col-4">
                    <InputNumber
                      id="name"
                      value={checkcapital ? payment.amount_capital : 0}
                      onValueChange={(e) =>
                        setPayment({ ...payment, amount_capital: e.value })
                      }
                      disabled={!isCheckchange}
                    />
                  </div>
                </div>

                {isCheckchange && (
                  <div className="p-2 text-center">
                    <InputText
                      className="text-red-500"
                      id="name"
                      placeholder="ກະລຸນາໃສ່ເຫດຜົນ"
                      onChange={(e) =>
                        setPayment({ ...payment, remarks: e.value })
                      }
                    />
                  </div>
                )}

                <div className="flex flex-wrap justify-content-start">
                  <div className=" col flex  align-items-center">
                    <div className="ml-2 ">
                      <input
                        type="checkbox"
                        value={checkinterest}
                        onChange={checkpaymentInterest}
                        id="amount_interest"
                        name="amount_interest"
                      />
                      <label htmlFor="interest" className="font-bold">
                        ຊຳລະດອກເບ້ຍ
                      </label>
                    </div>
                  </div>
                  <div className=" col-4">
                    <InputNumber
                      id="name"
                      value={checkinterest ? payment.amount_interest : 0}
                      onValueChange={(e) =>
                        setPayment({ ...payment, amount_interest: e.value })
                      }
                      disabled={!isCheckchange}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap justify-content-start">
                  <div className=" col flex  align-items-center">
                    <div className="ml-2">
                      <input
                        className=""
                        type="checkbox"
                        value={checkother}
                        onChange={checkpaymentOther}
                        id="amount_other"
                        name="amount_other"
                      />
                      <label htmlFor="libor" className="font-bold">
                        ຊຳລະອື່ນໆ
                      </label>
                    </div>
                  </div>

                  <div className=" col-4">
                    <InputNumber
                      id="name"
                      value={checkother ? payment.amount_other : 0}
                      onValueChange={(e) =>
                        setPayment({ ...payment, amount_other: e.value })
                      }
                      disabled={!isCheckchange}
                    />
                  </div>
                </div>
              </div>

              <div className="formgrid grid ">
                <div className="field col">
                  <label htmlFor="name" className="text-center">
                    ຈຳນວນເງິນຊຳລະເງິນກີບ
                  </label>
                  <InputNumber
                    className="text-red-500"
                    id="name"
                    value={rateCapital + rateInterest + rateOther}
                    // value={updateamountcapital.amount_capital}
                    // onValueChange={(e) =>
                    //   setPayment({ ...payment, amount_kip: e.target.value })
                    // }

                    disabled
                  />
                </div>

                <div className="field col">
                  <label htmlFor="name" className="">
                    ອັດຕາແລກປ່ຽນ
                  </label>
                  <InputNumber
                    id="name"
                    className="text-blue-500"
                    value={payment.rate}
                    disabled
                  />
                </div>

                <div className="field col">
                  <label htmlFor="quantity" className="">
                    ວັນທີຊຳລະ
                  </label>

                  <Calendar
                    dateFormat="yy-mm-dd"
                    onChange={(e) =>
                      setPayment({ ...payment, payment_date: e.target.value })
                    }
                    showIcon
                  />
                </div>
              </div>

              <div className=" field ">
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
            </Dialog>

            <Dialog
              visible={editPaymentDialog}
              style={{ width: "750px" }}
              header="ແກ້ໄຂໃບ Invoice"
              maximizable
              modal
              className="p-fluid"
              footer={editpaymentDialogFooter}
              onHide={hideEditPaymentDialog}
            >
              <div className="formgrid grid">
                <div className="field col">
                  <label htmlFor="name" className="">
                    ລະຫັດ Invoice
                  </label>

                  <InputText id="name" value={payment.inv_id} disabled />
                </div>

                <div className="field col">
                  <label htmlFor="name" className="">
                    ເລກທີໃບ Invoice
                  </label>
                  <InputText
                    className="text-blue-500"
                    id="name"
                    value={payment.invoice_no}
                    onChange={(e) =>
                      setPayment({ ...payment, invoice_no: e.target.value })
                    }
                  />
                </div>
                <div className="field col">
                  <label htmlFor="name" className="">
                    ສະກຸນເງິນ
                  </label>
                  <InputText
                    id="name"
                    className=""
                    value={payment.currency}
                    disabled
                  />
                </div>
              </div>

              <div className="formgrid grid ">
                <div className="field col text-red-600">
                  <label htmlFor="name" className="font-bold">
                    ຈຳນວນຊຳລະເງິນຕົ້ນທຶນ
                  </label>
                  <InputNumber
                    id="name"
                    mode="decimal"
                    minFractionDigits={2}
                    value={payment.amount_capital}
                    onValueChange={(e) =>
                      onInputNumberChange(e, "amount_capital")
                    }
                  />
                </div>

                <div className="field col text-red-600">
                  <label htmlFor="name" className="font-bold">
                    ຈຳນວນຊຳລະເງິນດອກເບ້ຍ
                  </label>
                  <InputNumber
                    id="name"
                    mode="decimal"
                    minFractionDigits={2}
                    value={payment.amount_interest}
                    onValueChange={(e) =>
                      onInputNumberChange(e, "amount_interest")
                    }
                  />
                </div>

                <div className="field col text-red-600">
                  <label htmlFor="name" className="font-bold">
                    ຈຳນວນຊຳລະອື່ນໆ
                  </label>
                  <InputNumber
                    id="name"
                    mode="decimal"
                    minFractionDigits={2}
                    value={payment.amount_other}
                    onValueChange={(e) =>
                      onInputNumberChange(e, "amount_other")
                    }
                  />
                </div>
              </div>
              <div className="formgrid grid ">
                <div className="field col">
                  <label htmlFor="age2" className="text-blue-600">ຈຳນວນມື້</label>
                  <InputNumber
                    value={payment.days}
                    onValueChange={(e) =>
                      setPayment({ ...payment, days: e.value })
                    }
                    //  value={paymentcapital.amount_capital} onValueChange={(e) => setPaymentcapital({...paymentcapital, amount_capital: e.value }) }
                  />
                </div>

                <div className="field col">
                  <label htmlFor="age2" className="text-blue-600">
                    ອັດຕາ SOFR
                  </label>
                  <InputNumber
                    value={payment.libor}
                    onValueChange={(e) => onInputNumberChange(e, "libor")}
                    mode="decimal"
                    minFractionDigits={3}
                    prefix="%"
                  />
                </div>

                <div className="field col">
                  <label htmlFor="age2" className="text-blue-600">
                    Credit ສ່ວນຕ່າງ
                  </label>
                  <InputNumber
                    value={payment.credit}
                    onValueChange={(e) => onInputNumberChange(e, "credit")}
                    mode="decimal"
                    minFractionDigits={3}
                    prefix="%"
                  />
                </div>
              </div>
              <div className="formgrid grid ">
                <div className="field col">
                  <label htmlFor="email1" className="text-blue-600">
                    ຊື່ບັນຊີປາຍທາງ
                  </label>
                  <InputText
                    id="atm_name"
                    type="text"
                    className=""
                    value={payment.atm_name}
                    onChange={(e) =>
                      setPayment({ ...payment, atm_name: e.target.value })
                    }
                  />
                </div>
                <div className="field col">
                  <label htmlFor="email1" className="text-blue-600">
                    ເລກບັນຊີປາຍທາງ
                  </label>
                  <InputText
                    id="atm_number"
                    type="text"
                    className=""
                    value={payment.atm_number}
                    onChange={(e) =>
                      setPayment({
                        ...payment,
                        atm_number: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="field col text-blue-600">
                  <label htmlFor="quantity" className="">
                    ວັນທີຊຳລະ
                  </label>

                  <Calendar
                    dateFormat="yy-mm-dd"
                    onChange={(e) =>
                      setPayment({ ...payment, payment_date: e.target.value })
                    }
                    showIcon
                  />
                </div>
              </div>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;
