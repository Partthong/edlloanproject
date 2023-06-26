import { Button } from 'primereact/button';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';

import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';

import { RadioButton } from 'primereact/radiobutton';
import axiosInterceptorInstance from '../../../demo/components/axios';
import { useRouter } from 'next/router';

function Payments() {
    let emptyPayment = {
        inv_id: '',
        capital_paid: '',
        interest_paid: '',
        other_paid: '',
        payment_date: '',
        l_id: '',
        total_balance: '',
        total_payment: '',
        amount_capital: '',
        amount_interest: '',
        amount_other: ''
    };
    const [invoiceList, setInvoiceList] = useState([]);
    const [payment, setPayment] = useState(emptyPayment);
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [checkcapital, setCheckcapital] = useState(0);
    const [checkinterest, setCheckinterest] = useState(0);
    const [checkother, setCheckOther] = useState(0);
    const [isCheckcapital, setIsCheckcapital] = useState(false);
    const [isCheckchange, setIsCheckchange] = useState(false);
    const [isCheckOther, setIsCheckOther] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(0);
    const [result, setResult] = useState(0);
    const [value1, setValue1] = useState(0);
    const [value2, setValue2] = useState(0);
    const [dropdownCurrencys, setDropdownCurrencys] = useState(null);
    const [isSelectCurrency, setIsSelectCurrency] = useState(null);
    const [showCurrency, setShowCurrency] = useState(emptyPayment);
    const [rateCapital, setRateCapital] = useState(0);
    const [rateInterest, setRateInterest] = useState(0);
    const [rateOther, setRateOther] = useState(0);
    const router = useRouter();

    useEffect(() => {
        showListInvoice();

    }, []);

    const showListInvoice = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/invoice/GetListInvoice');

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

    const InsertData = () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
            inv_id: payment.inv_id,
            capital_paid: checkcapital,
            interest_paid: checkinterest,
            other_paid: checkother,
            payment_date: payment.payment_date,
            creator: 'admin',
            l_id: payment.l_id,
            total_balance: payment.total_balance - checkcapital,
            total_payment: payment.total_payment + checkcapital,

            amount_capital: payment.amount_capital - checkcapital,
            amount_interest: payment.amount_interest - checkinterest,
            amount_other: payment.amount_other - checkother
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
        fetch('https://localhost:44363/api/payment/Insertpayment', requestOptions)
            .then((response) => response.json())
            .then((result) => setPayment(result))
            .catch((error) => console.log('error', error));

        fetch('https://localhost:44363/api/loan/UpdateTotalBalance', requestOptions)
            .then((response) => response.json())
            .then((result) => setPayment(result))
            .catch((error) => console.log('error', error));

        fetch('https://localhost:44363/api/invoice/UpdateInvoiceAmount', requestOptions)
            .then((response) => response.json())
            .then((result) => setPayment(result))
            .catch((error) => console.log('error', error));

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ບັນທຶກຂໍ້ມູນສຳເລັດ', life: 3000 });

        setPayment(emptyPayment);
        setTimeout(() => {
            document.location.reload();
        }, 2000);
    };


    const toast = useRef(null);
    const dt = useRef(null);


    const handlevalue1 = (e) => {
        setValue1(e.target.value);
      };


    const handlevalue2 = (e) => {
        setValue2(e.target.value);
      };

    const handleCalculation = () => {

        setResult(value1 * payment.rate);


    };



    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const payments = (payment) => {
        setPayment({ ...payment });
        setPaymentDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setBankDialog(false);
    };

    const hidePaymentDialog = () => {
        setPaymentDialog(false);
    };

    const hideDeleteBankDialog = () => {
        setDeleteBankDialog(false);
    };

    const confirmDeleteBank = (bank) => {
        setBank(bank);
        setDeleteBankDialog(true);
    };

    const checkpaymentCapital = (e) => {
        if (e.target.checked) {
            setCheckcapital(payment.amount_capital);
            setRateCapital(payment.amount_capital * payment.rate);

        } else {
            setCheckcapital(0);
            setRateCapital(0);
        }

    };

    const checkChangePaymentCapital = (e) => {
        if (e.target.checked) {

            setCheckcapital(value1);
            setRateCapital(value1 * payment.rate);
        } else {
            setCheckcapital(0);
        }
        setIsCheckchange((current) => !current);
    };

    const checkpaymentInterest = (e) => {
        if (e.target.checked) {
            setCheckinterest(payment.amount_interest);
            setRateInterest(payment.amount_interest * payment.rate);
        } else {
            setCheckinterest(0);
            setRateInterest(0);
        }
    };

    const checkpaymentOther = (e) => {
        if (e.target.checked) {
            setCheckOther(payment.amount_other);
            setRateOther(payment.amount_other * payment.rate);
        } else {
            setCheckOther(0);
            setRateOther(0);
        }

    };

    const selectRateCurrency = (e) => {


            let _loan = { ...dropdownCurrencys };
            _loan['currency'] = e.value;
            setDropdownCurrencys(_loan);


    };

    const onStatussChange = (e) => {
            let _loan = { ...payment };
            _loan['statuss'] = e.value;
            setPayment(_loan);

    };

    const testresult = (e) => {


        let _loan = { ...dropdownCurrencys };
        _loan['result'] = e.value;
        setResult1(_loan);


};

    const paymentDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hidePaymentDialog} />
            <Button label="ຢຶນຢັນ" icon="pi pi-check" className="p-button-danger " onClick={InsertData} />
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
                 <Button label="ຊຳລະ" icon="pi pi-fw pi-dollar" className="p-button-danger hover:bg-red-400 hover:text-white mr-2 bg-white text-red-600 h-3" onClick={() => payments(rowData)} outlined />
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <h3 className="mb-1 text-red-600  ">ລາຍການຊຳລະໜີ້</h3>
                    <div className="flex flex-column md:flex-row md:justify-content-end md:align-items-center mb-3 ">
                        <span className="block mt-2 md:mt-0 p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
                        </span>
                    </div>
                    <div className="">
                        <DataTable
                            dataKey="inv_id"
                            value={invoiceList}
                            tableStyle={{ minWidth: '100%' }}
                            paginator
                            showGridlines
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                            emptyMessage="No products found."
                            responsiveLayout="scroll"
                            // header={header}
                        >
                            <Column field="inv_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="invoice_no" header="ລະຫັດ Invoice" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="date_in" header="ວັນທີເພີ່ມ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={paymentDialog} style={{ width: '750px' }} header="ການຊຳລະໜີ້" maximizable modal className="p-fluid " footer={paymentDialogFooter} onHide={hidePaymentDialog}>
                            <div className="formgrid grid">
                                <div className="field col">
                                    <label htmlFor="name" className="">
                                        ລະຫັດ Invoice
                                    </label>

                                    <InputText id="name" value={payment.inv_id} disabled />
                                </div>

                                <div className="field col">
                                    <label htmlFor="name" className="">
                                        ເລກທີ Invoice
                                    </label>
                                    <InputText className="text-blue-500" id="name" value={payment.invoice_no} disabled />
                                </div>

                                <div className="field col ">
                                    <label htmlFor="name" className="">
                                        ເລກທີເງິນກູ້ຢຶມ
                                    </label>
                                    <InputText className="text-blue-500" id="name" value={payment.loan_no} disabled />
                                </div>
                            </div>

                            <div className="field ">
                                <label htmlFor="name" className="">
                                    ຊື່ໂຄງການ
                                </label>
                                <InputText className="text-blue-500" id="name" value={payment.project} disabled />
                            </div>
                            <div className="formgrid grid ">
                                <div className="field col-5">
                                    <label htmlFor="name" className="font-bold">
                                        ລວມເງິນເບີກຖອນກູ້ຢືມທັງໝົດ
                                    </label>
                                    <InputNumber id="name" disabled value={payment.total_withdraw} />
                                </div>
                                <div className="field col-5">
                                    <label htmlFor="name" className="font-bold text-red-500">
                                        ຍອດໜີ້ກູ້ຢືມຍັງເຫຼືອທັງໝົດ
                                    </label>
                                    <InputNumber id="name" value={payment.total_balance} disabled />

                                </div>
                                <div className="field col-2">
                                    <label htmlFor="name" className="">
                                        ສະກຸນເງິນ
                                    </label>
                                    <InputText id="name" className="text-blue-500" value={payment.currency} disabled />
                                </div>
                            </div>

                            <div className="card mb-0 p-2 bg-red-50 ">
                                <h5 className="mb-1 ml-3 text-red-600 font-bold ">ເລືອກການຊຳລະ</h5>
                                <div className="flex justify-content-start ">
                                    <div className="col-4 flex  align-items-center">
                                        <div className="ml-2">
                                            <input className="" type="checkbox" value={checkcapital} onChange={checkpaymentCapital} id="amount_capital" name="amount_capital" />
                                            <label htmlFor="capital" className="font-bold">
                                                ຊຳລະຕົ້ນທຶນ
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-4 flex  align-items-center">
                                        <div className="ml-2">
                                            <input className="" type="checkbox" value={checkcapital} onChange={checkChangePaymentCapital} id="amount_capital" name="amount_capital" />
                                            <label htmlFor="capital" className=" text-red-500">
                                                ແກ້ຕົວເລກ
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <InputNumber id="name" value={payment.amount_capital} disabled={!isCheckchange}  />
                                    </div>

                                </div>

                                {isCheckchange && (
                                    <div className="p-2 text-center">
                                        <InputText className="text-red-500" id="name" placeholder="ກະລຸນາໃສ່ເຫດຜົນ" />
                                    </div>
                                )}

                                <div className="flex flex-wrap justify-content-start">
                                    <div className=" col flex  align-items-center">
                                        <div className="ml-2 ">

                                            <input type="checkbox" value={checkinterest} onChange={checkpaymentInterest} id="amount_interest" name="amount_interest" />
                                            <label htmlFor="interest" className="font-bold">
                                                ຊຳລະດອກເບ້ຍ
                                            </label>
                                        </div>
                                    </div>
                                    <div className=" col-4">
                                        <InputNumber id="name" value={payment.amount_interest} disabled />
                                    </div>

                                </div>

                                <div className="flex flex-wrap justify-content-start">
                                    <div className=" col flex  align-items-center">
                                        <div className="ml-2">
                                            <input className="" type="checkbox" value={checkother} onChange={checkpaymentOther} id="amount_other" name="amount_other" />
                                            <label htmlFor="libor" className="font-bold">
                                                ຊຳລະອື່ນໆ
                                            </label>
                                        </div>
                                    </div>

                                    <div className=" col-4">
                                        <InputNumber id="name" value={payment.amount_other} disabled />
                                    </div>

                                </div>
                            </div>

                            <div className="formgrid grid mt-3">
                                <div className="field col-7">
                                    <label className="mb-3">ເລືອກປະເພດການຊຳລະ</label>
                                    <div className="formgrid grid">
                                        <div className="field-radiobutton col-6">
                                            <RadioButton inputId="statuss1" name="statuss" value="ຊຳລະຕາມສະກຸນເງິນໂຄງການເງິນກູ້" onChange={onStatussChange} checked={payment.statuss === 'ຊຳລະຕາມສະກຸນເງິນໂຄງການເງິນກູ້'} />
                                            <label htmlFor="statuss1">ຊຳລະຕາມສະກຸນເງິນໂຄງການເງິນກູ້</label>
                                        </div>
                                        <div className="field-radiobutton col-6">
                                            <RadioButton inputId="statuss2" name="statuss" value="ຊຳລະສະກຸນເງິນກີບ" onChange={onStatussChange} checked={payment.statuss === 'ຊຳລະສະກຸນເງິນກີບ'} />
                                            <label htmlFor="statuss2">ຊຳລະສະກຸນເງິນກີບ</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="field col-5">
                                    <label htmlFor="name" className="">
                                        ຈຳນວນເງິນຊຳລະຕົວຈິງ
                                    </label>
                                    <InputNumber className="text-red-500" id="name" value={rateCapital + rateInterest + rateOther} />


                                </div>
                            </div>
                            <div className="formgrid grid ">
                                <div className="field col-6">
                                    <label htmlFor="name" className="">
                                        ອັດຕາແລກປ່ຽນ
                                    </label>
                                    <InputNumber id="name" className="text-blue-500" value={payment.rate}  disabled />
                                </div>

                                <div className="field col-6">
                                    <label htmlFor="quantity" className="">
                                        ວັນທີຊຳລະ
                                    </label>

                                    <Calendar dateFormat="yy-mm-dd" onChange={(e) => setPayment({ ...payment, payment_date: e.target.value })} showIcon />
                                </div>
                            </div>

                            <div className=" field col">
                                <div className="card flex justify-content-center">
                                    <Toast ref={toast}></Toast>
                                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="pdf/*" maxFileSize={1000000} onUpload={onUpload} />
                                </div>
                            </div>


                        </Dialog>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payments;
