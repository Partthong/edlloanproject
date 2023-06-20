
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';

import { useRouter } from 'next/router';

import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';

import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment';
import axiosInterceptorInstance from '../../../demo/components/axios';

function loan() {
    let emptyLoan = {
        loan_no: '',
        name: '',
        project: '',
        amount_loan: '',
        total_withdraw: 0,
        total_balance: 0,
        total_payment: 0,
        currency: '',
        c_id: '',
        b_id:'',
        interest: '',
        statuss: '',
        lt_id:'',
        loan_date:'',
        expired_date:'',
        statuss:'',
        create_date: '' ,
        creator: 'admin'
    };

    const [loanList, setLoanList] = useState([]);
    const [insertloan, setInsertLoan] = useState(emptyLoan);
    const [loanDialog, setLoanDialog] = useState(false);

    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [editBankDialog, setEditBankDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [dropdownBanks, setDropdownBanks] = useState(null);
    const [dropdownBank, setDropdownBank] = useState(null);
    // const [dropdownCurrency, setDropdownCurrency] = useState(null);
    const [dropdownLoanTypes, setDropdownLoanTypes] = useState(null);
    const [dropdownLoanType, setDropdownLoanType] = useState(null);

    const [dropdownCurrency, setDropdownCurrency] = useState(null);
    const [dropdownCurrencys, setDropdownCurrencys] = useState(null);
    const router = useRouter();


    useEffect(() => {
        showLoanList();
        showDropdownBanks();
        showDropdownLoanTypes();
        showDropdownCurrencys();
    }, []);

    const showLoanList = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/loan/GetListLoan');
            console.log("token ==>", response)

            if (response.status === 200 || response.status === 201) {
                setLoanList(response.data);
            }

        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'Authorization has been denied' });
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            router.push('/auth/login');
        }
    };

    const showDropdownBanks = async () => {
        try {
            const response = await axiosInterceptorInstance.get('/api/bank/GetListBank');
            console.log("token ==>", response)

            if (response.status === 200 || response.status === 201) {
                setDropdownBanks(response.data);
            }

        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'Authorization has been denied' });
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            router.push('/auth/login');

        }
    };

    const showDropdownLoanTypes = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/loantype/GetListLoanType');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setDropdownLoanTypes(response.data);
            }

        } catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'Authorization has been denied' });
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            router.push('/auth/login');

        }
    };

    const showDropdownCurrencys = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/currency/GetListCurrency');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setDropdownCurrencys(response.data);
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
            if (insertloan.loan_no.trim()) {

            var raw = {
                loan_no: insertloan.loan_no,
                project: insertloan.project,
                amount_loan: insertloan.amount_loan,

                total_withdraw: insertloan.total_withdraw,
                total_balance: insertloan.total_balance,
                total_payment: insertloan.total_payment,

                c_id: insertloan.c_id,
                interest: insertloan.interest,
                statuss: insertloan.statuss,
                b_id:insertloan.b_id,
                lt_id:insertloan.lt_id,
                loan_date: moment(insertloan.loan_date).format('YYYY-MM-DD'),
                expired_date: moment(insertloan.expired_date).format('YYYY-MM-DD'),
                statuss:insertloan.statuss,
                create_date: moment().format('YYYY-MM-DD'),

                creator:insertloan.creator
            };

            const response = await axiosInterceptorInstance.post('/api/loan/InsertLoan', raw);

            if (response.status === 200 || response.status === 201) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ບັນທຶກຂໍ້ມູນສຳເລັດ', life: 3000 });

                setLoanDialog(false);
                setInsertLoan(emptyLoan);

                showLoanList();
            }
        }else {
            toast.current.show({ severity: 'error', summary: 'Unsuccessful', detail: 'ທ່ານປ້ອນຂໍ້ມູນບໍ່ຖືກຕ້ອງ', life: 3000 });
        }
    }
         catch (error) {
            console.error(error);
            toast.current.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'Authorization has been denied' });
            router.push('/auth/login');
        }

      };

    const toast = useRef(null);
    const dt = useRef(null);

    const openNew = () => {
        setInsertLoan(emptyLoan);

        setLoanDialog(true);
    };

    const editBank = (bank) => {
        setBank({ ...bank });
        setEditBankDialog(true);
    };

    const hideDialog = () => {
        setLoanDialog(false);
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

    const onStatussChange = (e) => {
        let _loan = { ...insertloan };
        _loan['statuss'] = e.value;
        setInsertLoan(_loan);
    };



    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _loan = { ...insertloan };
        _loan[`${name}`] = val;

        setInsertLoan(_loan);
    };

    const bankDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-primary " onClick={InsertData} />
        </>
    );

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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBank(rowData)} />


            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">ຂໍ້ມູນໜີ້ກູ້ຢືມ</h4>
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
                <Button label="ຟາຍ Excel" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
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
                            dataKey="l_id"
                            value={loanList}
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
                            <Column field="l_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '5rem' }}></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="amount_loan" header="ມູນຄ່າກູ້ຢືມ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="currency" header="ສະກຸນເງິນ" sortable headerStyle={{ minWidth: '5rem' }}></Column>
                            <Column field="interest" header="ດອກເບ້ຍ" sortable headerStyle={{ minWidth: '5rem' }}></Column>

                            <Column field="bankName" header="ທະນາຄານ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="loan_type" header="ປະເພດກູ້ຢືມ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="loan_date" header="ວັນທີກູ້ຢືມ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="expired_date" header="ວັນທີສິ້ນສຸດ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="statuss" header="ສະຖານະ" sortable headerStyle={{ minWidth: '10rem' }}></Column>

                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={loanDialog} style={{ width: '550px' }} header="ເພີ່ມຂໍ້ມູນໜີ້ກູ້ຢືມ" modal className="p-fluid" footer={bankDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="name">ເລກທີສັນຍາ</label>
                                <InputText id="loanno" value={insertloan.loan_no} onChange={(e) => setInsertLoan({ ...insertloan, loan_no: e.target.value })} />
                            </div>
                            <div className="field">
                                <label htmlFor="name">ຊື່ໂຄງການ</label>
                                <InputText id="project" value={insertloan.project} onChange={(e) => setInsertLoan({ ...insertloan, project: e.target.value })} />
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="price">ມູນຄ່າກູ້ຢືມ</label>

                                    <InputNumber value={insertloan.amount_loan} onValueChange={(e) => onInputNumberChange(e, 'amount_loan')} />
                                </div>

                                <div className="field col">
                                    <label htmlFor="name">ສະກຸນເງິນ</label>

                                    <Dropdown  value={insertloan.c_id} onChange={(e) => setInsertLoan({ ...insertloan, c_id: e.target.value })}  options={dropdownCurrencys} optionValue="c_id" optionLabel="currency" placeholder="ເລືອກ" />

                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="name">ເລືອກທະນາຄານ</label>

                                <Dropdown  value={insertloan.b_id} onChange={(e) => setInsertLoan({ ...insertloan, b_id: e.target.value })}  options={dropdownBanks} optionValue="b_id" optionLabel="bankName" placeholder="ເລືອກ" />
                            </div>

                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="price">ດອກເບ້ຍ</label>

                                    <InputNumber value={insertloan.interest} onValueChange={(e) => onInputNumberChange(e, 'interest')} mode="decimal" minFractionDigits={2} prefix="%" />
                                </div>

                                <div className="field col">
                                    <label htmlFor="name">ເລືອກປະເພດກູ້ຢືມ</label>

                                    <Dropdown  value={insertloan.lt_id} onChange={(e) => setInsertLoan({ ...insertloan, lt_id: e.target.value })}  options={dropdownLoanTypes} optionValue="lt_id" optionLabel="loan_type" placeholder="ເລືອກ" />
                                </div>
                            </div>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="price">ວັນທີກູ້ຢືມ</label>
                                    <Calendar   value={insertloan.loan_date} dateFormat="yy-mm-dd" onChange={(e) => setInsertLoan({ ...insertloan, loan_date: e.target.value })} showIcon />

                                </div>
                                <div className="field col">
                                    <label htmlFor="quantity">ວັນກຳນົດກູ້ຢືມ</label>

                                    <Calendar   value={insertloan.expired_date} dateFormat="yy-mm-dd" onChange={(e) => setInsertLoan({ ...insertloan, expired_date: e.target.value })} showIcon />
                                </div>


                            </div>
                            <div className="field">
                                <label className="mb-3">ສະຖານະ</label>
                                <div className="formgrid grid">


                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="statuss1" name="statuss" value="ກຳລັງກໍ່ສ້າງ" onChange={onStatussChange} checked={insertloan.statuss === 'ກຳລັງກໍ່ສ້າງ'} />
                                        <label htmlFor="statuss1">ກຳລັງກໍ່ສ້າງ</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="statuss2" name="statuss" value="ກໍ່ສ້າງສຳເລັດ" onChange={onStatussChange} checked={insertloan.statuss === 'ກໍ່ສ້າງສຳເລັດ'} />
                                        <label htmlFor="statuss2">ກໍ່ສ້າງສຳເລັດ</label>
                                    </div>
                                </div>
                            </div>
                        </Dialog>

                        <Dialog visible={editBankDialog} style={{ width: '450px' }} header="ແກ້ໄຂຂໍ້ມູນທະນາຄານ" modal className="p-fluid" footer={editBankDialogFooter} onHide={hideEditBankDialog}></Dialog>

                        <Dialog visible={deleteBankDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBankDialogFooter} onHide={hideDeleteBankDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {insertloan && (
                                    <span>
                                        ເຈົ້າຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່? <b>{insertloan.loan_no}</b>?<b className="hidden">{insertloan.loan_no}</b>
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

export default loan;
