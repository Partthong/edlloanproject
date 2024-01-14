
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toolbar } from "primereact/toolbar";
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import axiosInterceptorInstance from '../../../demo/components/axios';

function PaymentHistory() {

    const [paymentList, setPaymentList] = useState([]);
    const [bank, setBank] = useState();
    const [bankDialog, setBankDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [editBankDialog, setEditBankDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        showPaymentList();
    }, []);

    const showPaymentList = async () => {
        try {
            const response = await axiosInterceptorInstance.get('/api/payment/GetListpaymentHis');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setPaymentList(response.data);
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

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', {});
    };

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {});
    };


    const totalamountCapital = (rowData) => {
        return formatCurrency(rowData.capital_paid);
    };

    const totalamountInterest = (rowData) => {
        return formatCurrency(rowData.interest_paid);
    };

    const totalamountOther = (rowData) => {
        return formatCurrency(rowData.other_paid);
    };

    const totalamount_kip = (rowData) => {
        return formatCurrency(rowData.amount_kip);
    };

    const dateBodyTemplate = (rowData) => {
        return formatDate(rowData.date_in);
    };

    const editBankDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideEditBankDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info "  />
        </>
    );

    const deleteBankDialogFooter = (
        <>
            <Button label="ປະຕິເສດ" icon="pi pi-times" className="p-button-text" onClick={hideDeleteBankDialog} />
            <Button label="ຢືນຢັນ" icon="pi pi-check" className="p-button-danger"  />
        </>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"  />
                <Button icon="pi pi-user-edit" className="p-button-rounded p-button-warning mr-2" onClick={() => confirmDeleteBank(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteBank(rowData)} />
            </>
        );
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };
    
    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0 text-primary ">ປະຫວັດການຊຳລະໜີ້</h4>
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


    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <div className=''>
                        <DataTable
                          ref={dt}
                            dataKey="p_id"
                            value={paymentList}
                            tableStyle={{ minWidth: '78rem' }}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} data" globalFilter={globalFilter} header={header}
                            emptyMessage="No products found."

                        >
                            <Column field="inv_id" header="ລະຫັດ Invoice" sortable headerStyle={{ minWidth: '8rem' }} ></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="capital_paid" header="ຊຳລະຕົ້ນທຶນ" dataType="numeric" sortable headerStyle={{ minWidth: '10rem' }} body={totalamountCapital} ></Column>
                            <Column field="interest_paid" header="ຊຳລະດອກເບ້ຍ" dataType="numeric" sortable headerStyle={{ minWidth: '10rem' }} body={totalamountInterest} ></Column>
                            <Column field="other_paid" header="ຊຳລະເງິນອື່ນໆ" dataType="numeric" sortable headerStyle={{ minWidth: '10rem' }} body={totalamountOther} ></Column>          
                            <Column field="currency" header="ສະກຸນເງິນ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="amount_kip" header="ຈຳນວນຊຳລະເງິນກີບ" sortable headerStyle={{ minWidth: '10rem' }} body={totalamount_kip}></Column>
                            <Column field="currency_paid" header="ອັດຕາແລກປ່ຽນ" sortable headerStyle={{ minWidth: '10rem' }} ></Column>
                            <Column field="payment_date" header="ວັນທີຊຳລະ" sortable headerStyle={{ minWidth: '10rem' }} ></Column>
                           
                            {/* <Column body={actionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
                        </DataTable>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentHistory;
