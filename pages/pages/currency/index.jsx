import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRouter } from "next/router";

import React, { useEffect, useRef, useState } from "react";

import axiosInterceptorInstance from "../../../demo/components/axios";

function Currencies() {
  let emptyCurrency = {
    c_id: "",
    currency: "",
    rate: "",
  };
  const [currencyList, setCurrencyList] = useState([]);
  const [currency, setCurrency] = useState(emptyCurrency);
  const [currencyDialog, setCurrencyDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [deleteBankDialog, setDeleteBankDialog] = useState(false);
  const [editCurrencyDialog, setEditCurrencyDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tokenInfo, setTokenInfo] = useState();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(true);

  useEffect(() => {
    showCurrencyList();
  }, []);

  const showCurrencyList = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/currency/GetListCurrency"
      );
      console.log("token ==>", response);
      if (response.status === 200 || response.status === 201) {
        setCurrencyList(response.data);
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
    if (currency.currency == "") {
        toast.current.show({
          severity: "error",
          summary: "ຜິດພາດ",
          detail: "ກະລຸນາປ້ອນສະກຸນເງິນ",
        });
    } else if (currency.rate == "") {
        toast.current.show({
          severity: "error",
          summary: "ຜິດພາດ",
          detail: "ກະລຸນາປ້ອນອັດຕາແລກປ່ຽນ",
        });
      } else {
    try {
        var raw = {
          currency: currency.currency,
          rate: currency.rate
        };

        const response = await axiosInterceptorInstance.post(
          "/api/currency/InsertCurrency",
          raw
        );

        if (response.status === 200 || response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "ບັນທຶກຂໍ້ມູນສຳເລັດ",
            life: 3000,
          });

          setCurrencyDialog(false);
          setCurrency(emptyCurrency);
          showCurrencyList();
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

  const UpdateData = async () => {
    try {
    
        var raw = {
          c_id: currency.c_id,
          currency: currency.currency,
          rate: currency.rate
        };

        const response = await axiosInterceptorInstance.post(
          "/api/currency/UpdateCurrency",
          raw
        );

        if (response.status === 200 || response.status === 201) {
          toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "ອັບເດດຂໍ້ມູນສຳເລັດ",
            life: 3000,
          });

          setEditCurrencyDialog(false);
          setCurrency(emptyCurrency);
          showCurrencyList();
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

  const openNew = () => {
    setCurrency(emptyCurrency);
    setSubmitted(false);
    setCurrencyDialog(true);
  };

  const editCurrency = (currency) => {
    setCurrency({ ...currency });
    setEditCurrencyDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCurrencyDialog(false);
  };

  const hideEditCurrencyDialog = () => {
    setEditCurrencyDialog(false);
  };


  const currencyDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideDialog}
      />
      <Button
        label="ບັນທຶກ"
        icon="pi pi-check"
        className="p-button-info "
        onClick={InsertData}
      />
    </>
  );

  const editCurrencyDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideEditCurrencyDialog}
      />
      <Button label="ອັບເດດ" icon="pi pi-check" className="p-button-success "  onClick={UpdateData} />
    </>
  );



  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editCurrency(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h4 className="m-0">ຂໍ້ມູນອັດຕາແລກປ່ຽນ</h4>
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

  const exportCSV = () => {
    dt.current.exportCSV();
  };
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="ເພີ່ມໃໝ່"
            icon="pi pi-plus"
            className="p-button-info mr-2"
            onClick={openNew}
          />
        </div>
      </React.Fragment>
    );
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="ພິມ"
          className="mr-2 inline-block"
        />
        <Button
          label="ຟາຍ Excel"
          icon="pi pi-upload"
          className="p-button-help"
        />
      </React.Fragment>
    );
  };



  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />

          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>

          <div>
            <DataTable
              dataKey="c_id"
              value={currencyList}
              tableStyle={{ minWidth: "78rem" }}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
              emptyMessage="No products found."
              responsiveLayout="scroll"
              header={header}
            >
              <Column
                header="#"
                headerStyle={{ width: "3rem" }}
                body={(data, options) => options.rowIndex + 1}
              ></Column>
              {/* <Column field="c_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '5rem' }}></Column> */}
              <Column
                field="currency"
                header="ສະກຸນເງິນ"
                sortable
                headerStyle={{ minWidth: "15rem" }}
              ></Column>
              <Column
                field="rate"
                className="text-blue-500"
                header="ອັດຕາເລກປ່ຽນ"
                sortable
                headerStyle={{ minWidth: "15rem" }}
              ></Column>

              <Column
                body={actionBodyTemplate}
                headerStyle={{ minWidth: "10rem" }}
              ></Column>
            </DataTable>

            <Dialog
              visible={currencyDialog}
              style={{ width: "450px" }}
              header="ເພີ່ມຂໍ້ມູນອັດຕາແລກປ່ຽນ"
              modal
              className="p-fluid"
              footer={currencyDialogFooter}
              onHide={hideDialog}
            >
              <div className="field">
                <label htmlFor="name">ສະກຸນເງິນ</label>
                <InputText
                  id="name"
                  value={currency.currency}
                  onChange={(e) =>
                    setCurrency({ ...currency, currency: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="name">Rate</label>
                <InputText
                  id="name"
                  value={currency.rate}
                  onChange={(e) =>
                    setCurrency({ ...currency, rate: e.target.value })
                  }
                />
              </div>
            </Dialog>

            <Dialog
              visible={editCurrencyDialog}
              style={{ width: "450px" }}
              header="ອັບເດດຂໍ້ມູນອັດຕາແລກປ່ຽນ"
              modal
              className="p-fluid"
              footer={editCurrencyDialogFooter}
              onHide={hideEditCurrencyDialog} >
              <div className="field">
                <label htmlFor="name">ສະກຸນເງິນ</label>
                <InputText
                  id="name"
                  value={currency.currency}
                  onChange={(e) =>
                    setCurrency({ ...currency, currency: e.target.value })
                  }
                />
                <b className="hidden">{currency.c_id}</b>
              </div>
              <div className="field">
                <label htmlFor="name">Rate</label>
                <InputText
                  id="name"
                  value={currency.rate}
                  onChange={(e) =>
                    setCurrency({ ...currency, rate: e.target.value })
                  }
                />
              </div>
            </Dialog>

            {/* <Dialog
              visible={deleteBankDialog}
              style={{ width: "450px" }}
              header="Confirm"
              modal
              footer={deleteBankDialogFooter}
              onHide={hideDeleteBankDialog}
            >
              <div className="flex align-items-center justify-content-center">
                <i
                  className="pi pi-exclamation-triangle mr-3"
                  style={{ fontSize: "2rem" }}
                />
                {currency && (
                  <span>
                    ເຈົ້າຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່? <b>{currency.currency}</b>?
                    <b className="hidden">{currency.c_id}</b>
                  </span>
                )}
              </div>
            </Dialog> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Currencies;
