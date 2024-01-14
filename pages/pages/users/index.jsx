import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Toolbar } from "primereact/toolbar";
import { useRouter } from "next/router";
import { Password } from 'primereact/password';
import React, { useEffect, useRef, useState } from "react";

import axiosInterceptorInstance from "../../../demo/components/axios";

function Users() {
  let emptyUsers = {
    id: "",
    username: "",
    newpassword: "",
    currentpassword: "",
    confirmpassword: "",
  };
  const [usersList, setUsersList] = useState([]);
  const [users, setUsers] = useState(emptyUsers);
  const [usersDialog, setUsersDialog] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [deleteBankDialog, setDeleteBankDialog] = useState(false);
  const [editUsersDialog, setEditUsersDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [tokenInfo, setTokenInfo] = useState();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(true);
  const [newpasswords, setNewPasswords] = useState('');
  const [currentpasswords, setCurrentPasswords] = useState('');
  const [confirmpasswords, setConfirmPasswords] = useState('');

  useEffect(() => {
    showUsersList();
  }, []);

  const showUsersList = async () => {
    try {
      const response = await axiosInterceptorInstance.get(
        "/api/users/GetListUsers"
      );
      console.log("token ==>", response);
      if (response.status === 200 || response.status === 201) {
        setUsersList(response.data);
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
    setUsers(emptyUsers);
    setSubmitted(false);
    setUsersDialog(true);
  };

  const editUsers = (users) => {
    setUsers({ ...users });
    setEditUsersDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setUsersDialog(false);
  };

  const hideEditUsersDialog = () => {
    setEditUsersDialog(false);
  };


  const usersDialogFooter = (
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
      
      />
    </>
  );

  const editUsersDialogFooter = (
    <>
      <Button
        label="ປິດອອກ"
        icon="pi pi-times"
        className="p-button-text "
        onClick={hideEditUsersDialog}
      />
      <Button label="ອັບເດດ" icon="pi pi-check" className="p-button-success "   />
    </>
  );



  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-sync"
          className="p-button-rounded p-button-success mr-2"
          tooltip="ປ່ຽນລະຫັດຜ່ານ"
          tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
          onClick={() => editUsers(rowData)}
        />

        <Button
          icon="pi pi-unlock"
          className="p-button-rounded p-button-danger mr-2"
          tooltip="Reset ລະຫັດຜ່ານ"
          tooltipOptions={{ position: 'bottom', mouseTrack: true, mouseTrackTop: 15 }}
        //   onClick={}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h4 className="m-0">ຂໍ້ມູນຜູ້ໃຊ້</h4>
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
            label="ເພີ່ມຜູ້ໃຊ້"
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
              dataKey="id"
              value={usersList}
              tableStyle={{ minWidth: "78rem" }}
              paginator
              rows={10}
              rowsPerPageOptions={[5, 10, 25]}
              className="datatable-responsive"
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
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
                field="id"
                header="ໄອດີຜູ້ໃຊ້"
                sortable
                headerStyle={{ minWidth: "15rem" }}
              ></Column>
              <Column
                field="username"
                header="ຊື່ຜູ້ໃຊ້"
                sortable
                headerStyle={{ minWidth: "15rem" }}
              ></Column>
              <Column
                field="password"
                className="text-blue-500"
                header="ລະຫັດຜ່ານ"
                sortable
                headerStyle={{ minWidth: "15rem" }}
                hidden
              ></Column>

              <Column
                body={actionBodyTemplate}
                headerStyle={{ minWidth: "10rem" }}
              ></Column>
            </DataTable>

            <Dialog
              visible={usersDialog}
              style={{ width: "450px" }}
              header="ເພີ່ມຜູ້ໃຊ້ໃໝ່"
              modal
              className="p-fluid"
              footer={usersDialogFooter}
              onHide={hideDialog}
            >
              <div className="field">
                <label htmlFor="name">ຊື່ຜູ້ໃຊ້</label>
                <InputText
                  id="name"
                  value={users.username}
                  onChange={(e) =>
                    setUsers({ ...users, username: e.target.value })
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="name">ລະຫັດຜ່ານ</label>
                  <Password value={users.newpassword} 
              onChange={(e) =>
                setUsers({ ...users, newpassword: e.target.value })
              }
              toggleMask />
              </div>

            
            </Dialog>

            <Dialog
              visible={editUsersDialog}
              style={{ width: "450px" }}
              header="ປ່ຽນລະຫັດຜ່ານ"
              modal
              className="p-fluid"
              footer={editUsersDialogFooter}
              onHide={hideEditUsersDialog} >
       
              <div className="field">
                <label htmlFor="name">ລະຫັດຜ່ານປະຈຸບັນ</label>
                  <Password value={currentpasswords} onChange={(e) => setCurrentPasswords(e.target.value)} toggleMask />
                    <b className="hidden">{users.id}</b>
              </div>

              <div className="field">
                <label htmlFor="name">ລະຫັດຜ່ານໃໝ່</label>
                <Password value={newpasswords} onChange={(e) => setNewPasswords(e.target.value)} toggleMask />
              
              </div>

              <div className="field">
                <label htmlFor="name">ຢັ້ງຢືນລະຫັດຜ່ານໃໝ່</label>
                <Password value={confirmpasswords} onChange={(e) => setConfirmPasswords(e.target.value)} toggleMask />
             
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

export default Users;
