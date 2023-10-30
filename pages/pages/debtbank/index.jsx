import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useRouter } from "next/router";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { Tag } from "primereact/tag";
import axiosInterceptorInstance from "../../../demo/components/axios";

function DebtBank() {
  let emptyBank = {
    b_id: "",
    bankName: "",
  };
  const [bankList, setBankList] = useState([]);
  const [loanList, setLoanList] = useState([]);
  const [bank, setBank] = useState(emptyBank);
  const [editBankDialog, setEditBankDialog] = useState(false);
  const [viewPaymentDialog, setViewPaymentDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    showListLoanbyloantype();
  }, []);

  const showListLoanbyloantype = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/loan/GetListLoanbyloantype?lt_id=" + 2
      );

      if (response.status === 200 || response.status === 201) {
        setBankList(response.data);
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

  // const SelectByIDHandler = () => {

  //     var requestOptions = {
  //         method: 'GET',
  //         redirect: 'follow'
  //     };

  //     fetch("https://localhost:44363/api/loan/GetListLoanbybankid?b_id=" + bank.b_id + "&lt_id=" + 2 , requestOptions)

  //         .then((response) => response.json())
  //         .then((result) => setLoanList(result))
  //         .catch((error) => console.log('error', error));
  // };

  const SelectByIDHandler = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/loan/GetListLoanbybankid?b_id=" + bank.b_id + "&lt_id=" + 2
      );
      if (response.status === 200 || response.status === 201) {
        setLoanList(response.data);
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

  const routPagetoInvoiceData = (rowData) => {
    router.push("/pages/loanstatement/" + rowData.loan_no);
  };

  const toast = useRef(null);
  const dt = useRef(null);

  const editBank = (bank) => {
    setBank({ ...bank });
    setEditBankDialog(true);
  };

  const viewPayments = (bank) => {
    setBank(bank);

    setViewPaymentDialog(true);
  };

  const hideEditBankDialog = () => {
    setEditBankDialog(false);
  };

  const hideViewPaymentsDialog = () => {
    setViewPaymentDialog(false);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {});
  };

  const amountloanBodyTemplate = (rowData) => {
    return formatCurrency(rowData.amount_loan);
  };

  const totalwithdrawBodyTemplate = (rowData) => {
    return formatCurrency(rowData.total_withdraw);
  };

  const totalbalanceBodyTemplate = (rowData) => {
    return formatCurrency(rowData.total_balance);
  };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={rowData.images}
        alt=""
        className="shadow-2 border-round"
        style={{ width: "35px" }}
      />
    );
  };

  const editBankDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideEditBankDialog}
      />
    </>
  );

  const viewPaymentDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideViewPaymentsDialog}
      />
    </>
  );
  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-info-circle"
          label="ສະແດງລາຍການ"
          className="p-button-rounded p-button-primary mr-2"
          onClick={() => editBank(rowData)}
        />
      </>
    );
  };

  const actionBody = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-eye"
          label="ປະຫວັດການຖອນ"
          className="p-button-rounded p-button-success mb-1"
        />
        <Button
          icon="pi pi-eye"
          label="ປະຫວັດການຊຳລະ"
          className="p-button-rounded p-button-danger "
          onClick={() => routPagetoInvoiceData(rowData)}
        />
      </>
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
              <div className="text-xl font-bold text-900">
                ເລກທີ Invoice: {payment.invoice_no}
              </div>

              <div className="font-semibold ">
                {" "}
                ເລກທີສັນຍາ: {payment.loan_no}
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
              <span className="text-2xl  text-red-600">
                <i className="pi pi-money-bill"></i> {payment.totalpaid}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <h3 className=" text-red-600  ">ລາຍການໜີ້ກູ້ຍືມຕໍ່</h3>
          <div>
            <Toast ref={toast} />
            <DataTable
              dataKey="b_id"
              value={bankList}
              tableStyle={{ minWidth: "78rem" }}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              emptyMessage="No products found."
              responsiveLayout="scroll"
            >
              <Column
                header="#"
                headerStyle={{ width: "3rem" }}
                body={(data, options) => options.rowIndex + 1}
              ></Column>

              <Column
                field="b_id"
                header="ລະຫັດ"
                className="text-blue-600 "
                sortable
                headerStyle={{ minWidth: "5rem" }}
              ></Column>
              <Column
                field="images"
                header="ຮູບ"
                body={imageBodyTemplate}
                className="text-blue-600 "
                sortable
                headerStyle={{ minWidth: "5rem" }}
              ></Column>
              <Column
                field="bankName"
                header="ຊື່ທະນາຄານ"
                className="text-blue-600"
                sortable
                headerStyle={{ minWidth: "15rem" }}
              ></Column>
              <Column
                body={actionBodyTemplate}
                headerStyle={{ minWidth: "10rem" }}
              ></Column>
            </DataTable>

            <Dialog
              onShow={SelectByIDHandler}
              visible={editBankDialog}
              style={{ width: "1200px" }}
              header="ຊື່ບັນດາໂຄງການໜີ້ກູ້ຢືມ"
              modal
              className="p-fluid "
              footer={editBankDialogFooter}
              onHide={hideEditBankDialog}
            >
              <DataTable
                dataKey="b_id"
                value={loanList}
                tableStyle={{ minWidth: "55rem" }}
                paginator
                rows={10}
                stripedRows
                showGridlines
                rowsPerPageOptions={[5, 10, 25]}
                className="datatable-responsive"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                emptyMessage="No products found."
              >
                <Column
                  header="#"
                  headerStyle={{ width: "3rem" }}
                  body={(data, options) => options.rowIndex + 1}
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
                  field="amount_loan"
                  header="ມູນຄ່າກູ້ຢືມ"
                  dataType="numeric"
                  sortable
                  headerStyle={{ minWidth: "10rem" }}
                  body={amountloanBodyTemplate}
                ></Column>
                <Column
                  field="total_withdraw"
                  header="ຖອນເງິນກູ້ທັງໝົດ"
                  sortable
                  headerStyle={{ minWidth: "12rem" }}
                  body={totalwithdrawBodyTemplate}
                ></Column>
                <Column
                  field="total_balance"
                  header="ໜີ້ເງິນກູ້ທັງໝົດ"
                  className="text-red-600"
                  sortable
                  headerStyle={{ minWidth: "12rem" }}
                  body={totalbalanceBodyTemplate}
                ></Column>
                <Column
                  field="currency"
                  header="ສະກຸນເງິນ"
                  sortable
                  headerStyle={{ minWidth: "9rem" }}
                ></Column>
                <Column
                  header="ການເຄື່ອນໄຫວ"
                  body={actionBody}
                  headerStyle={{ minWidth: "3rem" }}
                ></Column>
              </DataTable>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DebtBank;
