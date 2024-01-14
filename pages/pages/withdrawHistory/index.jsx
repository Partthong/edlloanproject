
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useRef, useState } from 'react';
import axiosInterceptorInstance from '../../../demo/components/axios';

function WithdrawData() {
    let emptyWithdraw = {
        invoicew_no: "",
        l_id: "",
        invamount_withdraw: "",
        date_inv1: "",
        creator: "admin",
      };
    const [withdrawList, setWithdrawList] = useState([]);
    const [withdraw, setWithdraw] = useState(emptyWithdraw);
    const [bankDialog, setBankDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [editWithdrawDialog, setEditWithdrawDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        showWithdrawList();
    }, []);

    const showWithdrawList = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/withdraw/GetListWithdrawHis');
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


    const toast = useRef(null);
    const dt = useRef(null);

    const editWithdraw = (withdraw) => {
        setWithdraw({ ...withdraw });
        setEditWithdrawDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBankDialog(false);
    };

    const hideEditWithdrawDialog = () => {
        setEditWithdrawDialog(false);
    };

    const hideDeleteBankDialog = () => {
        setDeleteBankDialog(false);
    };

    const confirmDeleteBank = (bank) => {
        setBank(bank);
        setDeleteBankDialog(true);
    };



    const editWithdrawDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideEditWithdrawDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info " onClick={''} />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editWithdraw(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"  />
            </>
        );
    };


    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0 text-primary ">ປະຫວັດການຖອນເງິນກູ້</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>

            <Button
              label="ຟາຍ Excel"
              icon="pi pi-upload"
              className="p-button-success"
              onClick={exportCSV}
            />
        </div>
    );

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {});
    };

    const amountwithdraw = (rowData) => {
        return formatCurrency(rowData.amount_withdraw);
    };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                <Toast ref={toast} />
                    <div>
                        <DataTable
                          ref={dt}
                            dataKey="w_id"
                            value={withdrawList}
                            tableStyle={{ minWidth: '78rem' }}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} data" globalFilter={globalFilter} header={header}
                            emptyMessage="No products found."
                          
                        >
                            <Column field="w_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="invoicew_no" header="ເລກທີໃບ Invoice" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '25rem' }}></Column>
                            <Column field="amount_withdraw" header="ຈຳນວນຖອນເງິນ" sortable headerStyle={{ minWidth: '10rem' }} body={amountwithdraw}></Column>
                            <Column field="withdraw_date" header="ວັນທີຖອນ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            {/* <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        </DataTable>

                        <Dialog visible={editWithdrawDialog} style={{ width: '450px' }} header="ແກ້ໄຂຂໍ້ມູນການຖອນ" modal className="p-fluid" footer={editWithdrawDialog} onHide={hideEditWithdrawDialog}>
                            <div className="field">
                                <label htmlFor="name">ຈຳນວນເງິນຖອນ</label>
                                <InputText id="name" value={withdraw.loan_no} onChange={(e) => setWithdraw({ ...withdraw, loan_no: e.target.value })} required />
                                <b className="hidden">{withdraw.w_id}</b>
                            </div>
                            <div className="field">
                                <label htmlFor="name">ເລກບັນຊີ</label>
                                <InputText id="name" value={withdraw.invamount_withdraw} onChange={(e) => setWithdraw({ ...withdraw, invamount_withdraw: e.target.value })} />
                            </div>
                        </Dialog>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawData;
