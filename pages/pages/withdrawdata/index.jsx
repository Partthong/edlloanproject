
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

import React, { useEffect, useRef, useState } from 'react';
import axiosInterceptorInstance from '../../../demo/components/axios';

function WithdrawData() {

    const [withdrawList, setWithdrawList] = useState([]);
    const [bank, setBank] = useState();
    const [bankDialog, setBankDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [editBankDialog, setEditBankDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);


    useEffect(() => {
        showWithdrawList();
    }, []);

    const showWithdrawList = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/withdraw/GetListWithdraw');
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


    const hideDialog = () => {
        setSubmitted(false);
        setBankDialog(false);
    };

    const hideEditBankDialog = () => {
        setEditBankDialog(false);
    };

    const hideDeleteBankDialog = () => {
        setDeleteBankDialog(false);
    };

    const confirmDeleteBank = (bank) => {
        setBank(bank);
        setDeleteBankDialog(true);
    };



    const editBankDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideEditBankDialog} />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"  />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger"  />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0 text-primary ">ຂໍ້ມູນການຖອນເງິນກູ້</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                <Toast ref={toast} />
                    <div>
                        <DataTable
                            dataKey="w_id"
                            value={withdrawList}
                            tableStyle={{ minWidth: '78rem' }}
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
                            <Column field="w_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '25rem' }}></Column>
                            <Column field="amount_withdraw" header="ຈຳນວນເງິນຖອນ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="withdraw_date" header="ວັນທີຖອນ" sortable headerStyle={{ minWidth: '10rem' }}></Column>


                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>



                    </div>
                </div>
            </div>
        </div>
    );
}

export default WithdrawData;
