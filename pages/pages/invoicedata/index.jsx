
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';

import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';

import React, { useEffect, useRef, useState } from 'react';

import { useRouter } from 'next/router';
import axiosInterceptorInstance from '../../../demo/components/axios';

function Invoicedata() {

    const [invoiceList, setInvoiceList] = useState([]);
    const [bank, setBank] = useState();
    const [bankDialog, setBankDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [editBankDialog, setEditBankDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        showInvoiceList();
    }, []);

    const showInvoiceList = async () => {
        try {
            const response = await axiosInterceptorInstance.get('/api/invoice/GetListAllInvoice');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setInvoiceList(response.data);
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
        return formatCurrency(rowData.amount_capital);
    };

    const totalamountInterest = (rowData) => {
        return formatCurrency(rowData.amount_interest);
    };

    const totalamountOther = (rowData) => {
        return formatCurrency(rowData.amount_other);
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

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0 text-primary ">ຂໍ້ມູນໃບ Invoice</h4>
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

                    <div className=''>
                        <DataTable
                            dataKey="inv_id"
                            value={invoiceList}
                            tableStyle={{ minWidth: '78rem' }}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                            emptyMessage="No products found."
                            
                            header={header}
                        >
                            <Column field="inv_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '8rem' }} ></Column>
                            <Column field="invoice_no" header="ລະຫັດ Invoice" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="amount_capital" header="ຈຳນວນເງິນຕົ້ນທຶນ" dataType="numeric" sortable headerStyle={{ minWidth: '10rem' }} body={totalamountCapital} ></Column>
                            <Column field="amount_interest" header="ຈຳນວນເງິນດອກເບ້ຍ" dataType="numeric" sortable headerStyle={{ minWidth: '10rem' }} body={totalamountInterest} ></Column>
                            <Column field="amount_other" header="ຈຳນວນເງິນອື່ນໆ" dataType="numeric" sortable headerStyle={{ minWidth: '10rem' }} body={totalamountOther} ></Column>
                            <Column field="atm_name" header="ຊື່ບັນຊີ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="atm_number" header="ເລກບັນຊີ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="date_in" header="ວັນທີເພີ່ມ" sortable headerStyle={{ minWidth: '10rem' }} ></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        </DataTable>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Invoicedata;
