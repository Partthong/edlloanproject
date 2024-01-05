import { Button } from 'primereact/button';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import axiosInterceptorInstance from '../../../demo/components/axios';
import moment from 'moment';


function Withdraw() {
    let emptyWithdraw  = {
        l_id: '',
        inw_id:'',
        amount_withdraw: '',
        invamount_withdraw: '',
        withdraw_date: '',
        creator: 'admin',
        total_withdraw:'',
        total_balance: '',
        date_inv: '',
       
    };
    const [withdrawvalue, setWithdrawvalue] = useState(0);
    const [withdrawList, setWithdrawList] = useState([]);
    const [withdraw, setWithdraw] = useState(emptyWithdraw );
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [editPaymentDialog, setEditPaymentDialog] = useState(false);
    const [checkcapital, setCheckcapital] = useState(0);
    const [checkinterest, setCheckinterest] = useState(0);
    const [checklibor, setChecklibor] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(0);
    const [result, setResult] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const router = useRouter();


    useEffect(() => {
        showInvoiceWithdraw();
    }, []);

    const showInvoiceWithdraw = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/invoicewithdraw/GetListInvoiceWithdraw');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setWithdrawList(response.data);
            }

        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'Authorization has been denied' });
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            router.push('/auth/login');

        }
    };

    const InsertData = async () => {

          try {
            var raw = {
                l_id: withdraw.l_id,
                inw_id: withdraw.inw_id,
                amount_withdraw: withdraw.invamount_withdraw,
                invamount_withdraw: (withdraw.invamount_withdraw - withdraw.invamount_withdraw),
                withdraw_date: moment(withdraw.date_inv).format("YYYY-MM-DD"),
                creator: 'admin',
                total_withdraw: (withdraw.total_withdraw + withdraw.invamount_withdraw),
                total_balance: (withdraw.total_withdraw + withdraw.invamount_withdraw)
    
            };
      
            const response1 = await axiosInterceptorInstance.post(
              "/api/withdraw/InsertWithdraw",
              raw
            );
            const response2 = await axiosInterceptorInstance.post(
              "/api/loan/UpdateAmountWithdraw",
              raw
            );
            const response3 = await axiosInterceptorInstance.post(
              "/api/invoicewithdraw/UpdateInvAmountWithdraw",
              raw
            );
      
            if (
              response1.status === 200 &&
              response2.status === 200 &&
              response3.status === 200
            ) {
            
            setWithdraw(emptyWithdraw);
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
      };

      const UpdateData = async () => {
        try {
        
            var raw = {
                inw_id: withdraw.inw_id,
                invoicew_no: withdraw.invoicew_no,
                invamount_withdraw: withdraw.invamount_withdraw,
                date_inv: moment(withdraw.date_inv).format("YYYY-MM-DD"),
            };
    
            const response = await axiosInterceptorInstance.post(
              "/api/invoicewithdraw/UpdateInvWithdrawbyId",
              raw
            );
    
            if (response.status === 200 || response.status === 201) {
              toast.current.show({
                severity: "success",
                summary: "Successful",
                detail: "ອັບເດດຂໍ້ມູນສຳເລັດ",
                life: 3000,
              });
                
              setWithdraw(emptyWithdraw);
              setEditPaymentDialog(false);
              showInvoiceWithdraw();
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

    const withdraws = (withdraw) => {
        setWithdraw({ ...withdraw });
        setPaymentDialog(true);
      
    };

    const editwithdraws = (withdraw) => {
        setWithdraw({ ...withdraw }); 
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

    const paymentDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hidePaymentDialog} />
            <Button label="ຢຶນຢັນ" icon="pi pi-check" className="p-button-success " onClick={InsertData} />
        </>
    );

    const editpaymentDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideEditPaymentDialog} />
            <Button label="ແກ້ໄຂ" icon="pi pi-pencil" className="p-button-danger " onClick={UpdateData} />
        </>
    );

    const deleteBankDialogFooter = (
        <>
            <Button label="ປະຕິເສດ" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBankDialog} />
            <Button label="ຢືນຢັນ" icon="pi pi-check" className="p-button-danger" onClick={''} />
        </>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button label="ຖອນ" icon="pi pi-fw pi-dollar" className="p-button-success hover:bg-green-400 hover:text-white mr-2 bg-white text-green-600 h-3" onClick={() => withdraws(rowData)} outlined />
                <Button label="ແກ້ໄຂ" icon="pi pi-user-edit" className="p-button-success hover:bg-red-400 hover:text-white mr-2 bg-white text-red-600 h-3" onClick={() => editwithdraws(rowData)} outlined />
               
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-end md:align-items-center ">
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _invoice = { ...withdraw };
        _invoice[`${name}`] = val;
    
        setWithdraw(_invoice);
      };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h3 className="mb-1 text-green-600  ">ລາຍການຖອນເງິນກູ້</h3>
                    <div className="flex flex-column md:flex-row md:justify-content-end md:align-items-center mb-3 ">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                        </span>
                    </div>
                    <div className="">
                        <DataTable
                            dataKey="inw_id"
                            value={withdrawList}
                            tableStyle={{ minWidth: '100%' }}
                            paginator
                            showGridlines
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                            emptyMessage="No products found." >
                            <Column field="inw_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="invoicew_no" header="ເລກທີ Invoice" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="date_inv" header="ວັນທີເພີ່ມ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column header="ຈັດການ" body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={paymentDialog} style={{ width: '650px' }} header="ການຖອນເງິນກູ້" modal className="p-fluid " footer={paymentDialogFooter} onHide={hidePaymentDialog}>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="name" className="">
                                        ລະຫັດ Invoice
                                    </label>


                                    <InputText id="name" value={withdraw.inw_id} disabled />
                                </div>

                                <div className="field col">
                                    <label htmlFor="name" className="">
                                        ເລກທີ Invoice
                                    </label>
                                    <InputText className="text-blue-500" id="name" value={withdraw.invoicew_no} disabled />
                                </div>

                                <div className="field col ">
                                    <label htmlFor="name" className="">
                                        ເລກທີສັນຍາ
                                    </label>
                                    <InputText className="text-blue-500" id="name" value={withdraw.loan_no} disabled />
                                </div>
                            </div>

                            <div className="field ">
                                <label htmlFor="name" className="">
                                    ຊື່ໂຄງການ
                                </label>
                                <InputText className="text-blue-500" id="name" value={withdraw.project} disabled />
                            </div>
                            <div className="formgrid grid ">
                                <div className="field col-6">
                                    <label htmlFor="name" className="font-bold">
                                        ຈຳນວນເງິນຖອນກູ້ຢືມແລ້ວທັງໝົດ
                                    </label>
                                    <InputNumber id="name" disabled value={withdraw.total_withdraw} />
                                </div>
                            <div className="field col-6 text-red-600" >
                                    <label htmlFor="name" className="font-bold">
                                        ຈຳນວນເງິນຖອນກູ້ຢືມໃນຄັ້ງນີ້
                                    </label>
                                    <InputNumber id="name" disabled value={withdraw.invamount_withdraw} />
                                </div>
                            </div>
                            <div className="formgrid grid ">

                            <div className="field col-6">
                                    <label htmlFor="name" className="">
                                        ສະກຸນເງິນ
                                    </label>
                                    <InputText id="name" className="text-blue-500" value={withdraw.currency} disabled />
                                </div>
                                <div className="field col-6">
                                <label htmlFor="quantity" className="font-bold">
                                ວັນ,ເດືອນ,ປີຖອນ
                                    </label>
                                    <Calendar dateFormat="yy-mm-dd" onChange={(e) => setWithdraw({ ...withdraw, date_inv: e.target.value })} showIcon />
                                </div>

                            </div>

                        </Dialog>

                        <Dialog visible={editPaymentDialog} style={{ width: '450px' }} header="ແກ້ໄຂຂໍ້ມູນ" modal className="p-fluid " footer={editpaymentDialogFooter} onHide={hideEditPaymentDialog}> 
                                <div className="field col">
                                    <label htmlFor="name" className="">
                                        ລະຫັດ Invoice
                                    </label>
                                <InputText id="name" value={withdraw.inw_id} disabled />               
                                </div>

                                <div className="field col">
                                    <label htmlFor="name" className="">
                                        ເລກທີ Invoice
                                    </label>
                                    <InputText className="text-blue-500" id="name" value={withdraw.invoicew_no} 
                                    onChange={(e) =>
                                        setWithdraw({ ...withdraw, invoicew_no: e.target.value })
                                    }  />
                                </div>
                           
                            <div className="field col text-red-600" >
                                    <label htmlFor="name" className="font-bold">
                                        ຈຳນວນເງິນຖອນກູ້ຢືມໃນຄັ້ງນີ້
                                    </label>
                                <InputNumber id="name" 
                                   mode="decimal"
                                   minFractionDigits={2}
                                value={withdraw.invamount_withdraw}
                                onValueChange={(e) =>
                                    onInputNumberChange(e, "invamount_withdraw")
                                  }
                                     />
                                </div>

                        
                           
                            <div className="field col">
                                    <label htmlFor="name" className="">
                                        ສະກຸນເງິນ
                                    </label>
                                    <InputText id="name" className="text-blue-500" value={withdraw.currency} disabled />
                                </div>
                                <div className="field col">
                                <label htmlFor="quantity" className="">
                                        ວັນ,ເດືອນ,ປີຖອນ
                                    </label>
                                    <Calendar dateFormat="yy-mm-dd" onChange={(e) => setWithdraw({ ...withdraw, date_inv: e.target.value })} showIcon />
                                </div>

                        </Dialog>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Withdraw;
