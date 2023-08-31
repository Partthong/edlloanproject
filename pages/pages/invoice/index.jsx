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
import { differenceInDays } from "date-fns";

function Invoice() {
  let emptyInvoice = {
    invoice_no: "",
    l_id: "",
    amount_capital: "",
    amount_interest: "",
    interest: "",
    libor: "",
    amount_other: "",
    remarks: "",
    atm_name: "",
    atm_number: "",
    date_in: "",
    create_date: "",
    creator: "admin",

    credit: "",
    period_days: "",
    days: "",
    start_date: "",
    end_date: "",
  };

  const [insertInvoice, setInsertInvoice] = useState(emptyInvoice);
  const [loan, setLoan] = useState([]);
  const [selectedLoan, setSelectedLoan] = useState(0);
  const [filteredLoan, setFilteredLoan] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const router = useRouter();
  const [startdate, setStartdate] = useState();
  const [enddate, setEnddate] = useState();
  const [sumday, setSumday] = useState(0);
  const [paymentcapital, setPaymentcapital] = useState(0);
  const [paymentinterest, setPaymentinterest] = useState(0);

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
    } else if (insertInvoice.invoice_no === "") {
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "ກະລຸນາປ້ອນເລກທີໃບ Invoice",
      });
    } else if (
      insertInvoice.atm_name === "" ||
      insertInvoice.atm_number === ""
    ) {
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "ກະລຸນາປ້ອນຊື່ບັນຊີ ຫຼື ເລກ ATM",
      });
    } else if (paymentcapital === 0) {
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "ກະລຸນາປ້ອນ ວັນທີເລີ່ມ ຫຼື ວັນທີສິ້ນສຸດ",
      });
    } else {
      try {
        var raw = {
          invoice_no: insertInvoice.invoice_no,
          l_id: selectedLoan.l_id,
          // amount_capital: paymentcapital,
          amount_capital: paymentcapital.amount_capital,
          amount_interest: paymentinterest.amount_interest,
          libor: insertInvoice.libor,
          amount_other: insertInvoice.amount_other,
          remarks: insertInvoice.remarks,
          atm_name: insertInvoice.atm_name,
          atm_number: insertInvoice.atm_number,
          date_in: moment(insertInvoice.date_in).format("YYYY-MM-DD"),
          create_date: moment().format("YYYY-MM-DD"),
          creator: "admin",
          credit: insertInvoice.credit,
          period_days: insertInvoice.period_days,
          days: sumday.days,
          // days:insertInvoice.days,

          start_date: moment(startdate).format("YYYY-MM-DD"),
          end_date: moment(enddate).format("YYYY-MM-DD"),
        };

        // console.log(raw);

        const response = await axiosInterceptorInstance.post(
          "/api/invoice/InsertInvoice",
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
        router.push("/auth/login");
      }
    }
  };

  const onCalculate = () => {
    if (!startdate || !enddate) {
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "ກະລຸນາປ້ອນວັນທີເລີ່ມ ຫຼື ວັນທີສິ້ນສຸດ",
      });
    } else if (
      insertInvoice.period_days === "" ||
      insertInvoice.period_days === 0
    ) {
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "ກະລຸນາປ້ອນຈຳນວນງວດທີ່ຊຳລະ",
      });
    } else if (!selectedLoan.l_id) {
      toast.current.show({
        severity: "error",
        summary: "ຜິດພາດ",
        detail: "ກະລຸນາປ້ອນເລກທີສັນຍາ",
      });
    } else {
      const todate = new Date(enddate); // the later date
      const fromdate = new Date(startdate); // the earlier date
      const amountday = differenceInDays(todate, fromdate);

      var sumdays = amountday;
      var sumcapital = selectedLoan.total_withdraw / insertInvoice.period_days;
      var suminsterest = (selectedLoan.total_balance * sumdays) / 360 + (selectedLoan.interest * insertInvoice.libor + insertInvoice.credit);
      var suminsterestFix = suminsterest.toFixed(0);
   

      // setSumday(amountday);
      setSumday({ ...sumday, days: sumdays });
      setPaymentcapital({ ...paymentcapital, amount_capital: sumcapital });
      setPaymentinterest({...paymentinterest, amount_interest: suminsterestFix });

      // setInsertInvoice({...insertInvoice, amount_capital: sumcapital})
      // setInsertInvoice({...insertInvoice, amount_interest: suminsterestFix})

      // console.log(insertInvoice)
    }
  };

  const onUpload = () => {
    toast.current.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const routPagetoInvoiceData = () => {
    router.push("/pages/invoicedata");
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _invoice = { ...insertInvoice };
    _invoice[`${name}`] = val;
    setInsertInvoice(_invoice);
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="ບັນທຶກ"
          icon="pi pi-plus"
          className="mr-2 p-button-info"
          onClick={InsertData}
        />
        <Button
          label="ແກ້ໄຂຂໍ້ມູນ"
          icon="pi pi-pencil"
          className="mr-2 p-button-secondary"
          onClick={routPagetoInvoiceData}
        />
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
          <Toolbar className="mb-3  " left={rightToolbarTemplate}></Toolbar>

          <h3 className=" text-red-600 ">ຂໍຊຳລະໜີ້ກູ້ຢືມ</h3>
          <div className="p-fluid formgrid grid mb-0 ">
            <div className="field col-12 md:col-12">
              <label htmlFor="loan_no" className="text-blue-600">
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
                ຈຳນວນໜີ້ກູ້ຢືມທັງໝົດ
              </label>
              <InputNumber
                className=""
                readOnly
                id="firstname2"
                type="text"
                value={selectedLoan ? selectedLoan.total_withdraw : ""}
              />
            </div>

            <div className="field col-12 md:col-4">
              <label htmlFor="firstname2" className="text-red-600">
                ຈຳນວນໜີ້ກູ້ຢືມຍັງເຫຼືອທັງໝົດ
              </label>

              <InputNumber
                className=""
                readOnly
                id="firstname2"
                type="text"
                value={selectedLoan ? selectedLoan.total_balance : ""}
              />
              <b className="hidden">{selectedLoan ? selectedLoan.l_id : ""}</b>
            </div>
          </div>

          <div className="field grid p-2 mb-0">
            <label htmlFor="name3" className="mr-1">
              ສະກຸນເງິນ:
            </label>
            <b className="text-red-500">
              {selectedLoan ? selectedLoan.currency : ""}
            </b>
          </div>
        </div>
      </div>

      <div className="col-12 md:col-6 ">
        <div className="card p-fluid p-3">
          <div className="field col">
            <label htmlFor="name1" className="text-blue-600">
              ເລກທີໃບ Invoice
            </label>
            <InputText
              id="invoice_no"
              type="text"
              className="text-blue-600"
              onChange={(e) =>
                setInsertInvoice({
                  ...insertInvoice,
                  invoice_no: e.target.value,
                })
              }
            />
          </div>
          <div className="field col">
            <label htmlFor="email1" className="text-blue-600">
              ຊື່ບັນຊີປາຍທາງ
            </label>
            <InputText
              id="atm_name"
              type="text"
              className="text-blue-500"
              onChange={(e) =>
                setInsertInvoice({ ...insertInvoice, atm_name: e.target.value })
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
              className="text-blue-500"
              onChange={(e) =>
                setInsertInvoice({
                  ...insertInvoice,
                  atm_number: e.target.value,
                })
              }
            />
          </div>
          <div className="field col">
            <label htmlFor="age1" className="text-blue-600">
              ວັນທີຕ້ອງຊຳລະກ່ອນ
            </label>

            <Calendar
              dateFormat="yy-mm-dd"
              onChange={(e) =>
                setInsertInvoice({ ...insertInvoice, date_in: e.target.value })
              }
              showIcon
            />
          </div>

          <div className="field col">
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
      </div>

      <div className="col-12 md:col-6">
        <div className="card p-fluid p-3 ">
          <div className="p-fluid formgrid grid p-2 ">
            <div className="field col">
              <label htmlFor="price" className="text-blue-600">
                ວັນທີເລີ່ມ
              </label>
              <Calendar
                dateFormat="yy-mm-dd"
                onChange={(e) => setStartdate(e.target.value)}
                showIcon
              />
            </div>
            <div className="field col">
              <label htmlFor="quantity" className="text-blue-600">
                ວັນທີສຸດທ້າຍ
              </label>
              <Calendar
                dateFormat="yy-mm-dd"
                onChange={(e) => setEnddate(e.target.value)}
                showIcon
              />
            </div>
          </div>
          <div className="p-fluid formgrid grid p-2 ">
            <div className="field col">
              <label htmlFor="age2">ຈຳນວນມື້</label>
              <InputNumber
               value={sumday.days} onValueChange={(e) => setSumday({ ...sumday, days: e.value }) }
              //  value={paymentcapital.amount_capital} onValueChange={(e) => setPaymentcapital({...paymentcapital, amount_capital: e.value }) }

               
              />
            </div>

            <div className="field col">
              <label htmlFor="email2" className="text-blue-600">
                ຈຳນວນງວດທີ່ຊຳລະ
              </label>
              <InputNumber
                value={insertInvoice.period_days}
                onValueChange={(e) => onInputNumberChange(e, "period_days")}
              />
            </div>
          </div>

          <div className="p-fluid formgrid grid p-2 ">
            <div className="field col">
              <label htmlFor="age2">ອັດຕາດອກເບ້ຍ (ຕາມສັນຍາ)</label>
              <InputNumber
                value={selectedLoan ? selectedLoan.interest : ""}
                readOnly
                onValueChange={(e) => onInputNumberChange(e, "interest")}
                mode="decimal"
                minFractionDigits={3}
                prefix="%"
              />
            </div>

            <div className="field col">
              <label htmlFor="age2" className="text-blue-600">
                ອັດຕາ SOFR
              </label>
              <InputNumber
                value={insertInvoice.libor}
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
                value={insertInvoice.credit}
                onValueChange={(e) => onInputNumberChange(e, "credit")}
                mode="decimal"
                minFractionDigits={3}
                prefix="%"
              />
            </div>
          </div>

          <div className="p-fluid formgrid grid p-2 ">
            <div className="field col">
              <label htmlFor="name1">ຈຳນວນຊຳລະເງິນຕົ້ນທຶນ</label>
              <InputNumber
                className="bg-red-500"
                value={paymentcapital.amount_capital} onValueChange={(e) => setPaymentcapital({...paymentcapital, amount_capital: e.value }) }
                mode="decimal"
                minFractionDigits={2}
              />
            </div>

            <div className="field col">
              <label htmlFor="email2">ຈຳນວນຊຳລະເງິນດອກເບ້ຍ</label>
              <InputNumber
                className="bg-red-500"
                value={paymentinterest.amount_interest} onValueChange={(e) =>  setPaymentinterest({...paymentinterest, amount_interest: e.value })  }
                mode="decimal"
                minFractionDigits={0}
              />
            </div>
          </div>
          <div className="p-fluid formgrid  ">
            <div className="field col-12">
              <label htmlFor="age2" className="text-blue-600">
                ຈຳນວນເງິນອື່ນໆ
              </label>
              <InputNumber
                value={insertInvoice.amount_other}
                onValueChange={(e) => onInputNumberChange(e, "amount_other")}
              />
            </div>
            <div className="field col-12">
              <label htmlFor="age2" className="text-red-500">
                ໝາຍເຫດ
              </label>

              <InputText
                id="remarks"
                type="text"
                className="text-blue-500"
                onChange={(e) =>
                  setInsertInvoice({
                    ...insertInvoice,
                    remarks: e.target.value,
                  })
                }
                placeholder="ເຫດຜົນ"
              />
            </div>
          </div>

          <div className="field mt-3">
            <Button
              label="ຄິດໄລ່"
              icon="pi pi-pencil"
              className="p-button-danger"
              onClick={onCalculate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
