
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { useRouter } from 'next/router';

import React, { useEffect, useRef, useState } from 'react';

import axiosInterceptorInstance from '../../../demo/components/axios';


import { Calendar } from 'primereact/calendar';


function LoanType() {
    let emptyLoantype = {
        lt_id: '',
        loan_type: ''
    };
    const [loantypeList, setLoantypeList] = useState([]);
    const [loantype, setLoantype] = useState(emptyLoantype);
    const [bankDialog, setBankDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [editBankDialog, setEditBankDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();



    useEffect(() => {
        showLoantypeList();
    }, []);

    const showLoantypeList = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/loantype/GetListLoanType');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setLoantypeList(response.data);
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



    const openNew = () => {
        setLoantype(emptyLoantype);
        setSubmitted(false);
        setBankDialog(true);
    };

    const editBank = (loantype) => {
        setLoantype({ ...loantype });
        setEditBankDialog(true);
    };

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

    const confirmDeleteBank = (loantype) => {
        setLoantype(loantype);
        setDeleteBankDialog(true);
    };

    const bankDialogFooter = (
        <>

            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideDialog}  />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info "  />
        </>
    );

    const editBankDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideEditBankDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info" />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBank()} />
                {/* <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteBank()} /> */}
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">ຂໍ້ມູນປະເພດກູ້ຢືມ</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
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
                    <Button label="ເພີ່ມໃໝ່" icon="pi pi-plus" className="p-button-info mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="ພິມ" className="mr-2 inline-block" />
                <Button label="ຟາຍ Excel" icon="pi pi-upload" className="p-button-help" />
            </React.Fragment>
        );
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <div>
                 

                        <DataTable
                            dataKey="lt_id"
                            value={loantypeList}
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
                            <Column field="lt_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="loan_type" header="ຊື່ປະເພດກູ້ຢືມ" sortable headerStyle={{ minWidth: '15rem' }}></Column>


                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={bankDialog} style={{ width: '450px' }} header="ເພີ່ມຂໍ້ມູນປະເພດກູ້ຢືມ" modal className="p-fluid" footer={bankDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="name">ຊື່ປະເພດກູ້ຢືມ</label>
                                <InputText id="name" value={loantype.loan_type} onChange={(e) => setLoantype({ ...loantype, loan_type: e.target.value })} />
                            </div>

                        </Dialog>

                        <Dialog visible={editBankDialog} style={{ width: '450px' }} header="ແກ້ໄຂຂໍ້ມູນທະນາຄານ" modal className="p-fluid" footer={editBankDialogFooter} onHide={hideEditBankDialog}>
                            <div className="field">
                                <label htmlFor="name">ຊື່ປະເພດກູ້ຢືມ</label>
                                <InputText id="name" value={loantype.loan_type} onChange={(e) => setLoantype({ ...loantype, loan_type: e.target.value })} required />
                                <b className='hidden'>{loantype.lt_id}</b>
                            </div>


                        </Dialog>

                        <Dialog visible={deleteBankDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBankDialogFooter} onHide={hideDeleteBankDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {loantype && (
                                    <span>
                                        ເຈົ້າຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່? <b>{loantype.loan_type}</b>?
                                        <b className='hidden'>{loantype.lt_id}</b>
                                    </span>

                                )}
                            </div>
                        </Dialog>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoanType;
