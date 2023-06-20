import { Button } from 'primereact/button';

import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';

import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';

import { Calendar } from 'primereact/calendar';
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';


function Withdraw() {
    let emptyWithdraw  = {
        l_id: '',
        inw_id:'',
        amount_withdraw: '',
        invamount_withdraw: '',
        withdraw_date: '',
        creator: 'admin',
        total_withdraw:'',
        total_balance:''
    };
    const [withdrawvalue, setWithdrawvalue] = useState(0);
    const [withdrawList, setWithdrawList] = useState([]);
    const [withdraw, setWithdraw] = useState(emptyWithdraw );
    const [paymentDialog, setPaymentDialog] = useState(false);
    const [checkcapital, setCheckcapital] = useState(0);
    const [checkinterest, setCheckinterest] = useState(0);
    const [checklibor, setChecklibor] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState(0);
    const [result, setResult] = useState(0);
    const [startDate, setStartDate] = useState(new Date());

    const InsertData = () => {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');

        var raw = JSON.stringify({
            l_id: withdraw.l_id,
            inw_id: withdraw.inw_id,
            amount_withdraw: withdraw.invamount_withdraw,
            invamount_withdraw: (withdraw.invamount_withdraw - withdraw.invamount_withdraw),
            // withdraw_date: insertwistthdraw.withdraw_date,
            withdraw_date: withdraw.date_inv,
            creator: 'admin',
            total_withdraw: (withdraw.total_withdraw + withdraw.invamount_withdraw),
            total_balance: (withdraw.total_withdraw + withdraw.invamount_withdraw)

        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
        };
        fetch('https://localhost:44363/api/withdraw/InsertWithdraw', requestOptions)
        .then((response) => response.json())
        .then((result) => setInsertwithdraw(result))
        .catch((error) => console.log('error', error));

        fetch('https://localhost:44363/api/loan/UpdateAmountWithdraw', requestOptions)
        .then((response) => response.json())
        .then((result) => setInsertwithdraw(result))
        .catch((error) => console.log('error', error));

        fetch('https://localhost:44363/api/invoicewithdraw/UpdateInvAmountWithdraw', requestOptions)
        .then((response) => response.json())
        .then((result) => setInsertwithdraw(result))
        .catch((error) => console.log('error', error));

        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ບັນທຶກຂໍ້ມູນສຳເລັດ', life: 3000 });

        setWithdraw(emptyWithdraw );
        setTimeout(() => {
            document.location.reload();
        }, 2000);
    };

    useEffect(() => {
        var requestOptions = {
            method: 'GET'
        };
        fetch('https://localhost:44363/api/invoicewithdraw/GetListInvoiceWithdraw', requestOptions)
            .then((response) => response.json())
            .then((result) => setWithdrawList(result))
            .catch((error) => console.log('error', error));
    }, []);

    const toast = useRef(null);
    const dt = useRef(null);



        const handleCalculation = () => {

        setResult(payment.amount_interest - checkinterest);


    };

    const withdraws = (withdraw) => {
        setWithdraw({ ...withdraw });
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
            setCheckcapital(withdraw.amount_capital);
        }
        else {
            setCheckcapital(0);
        }

    };

    const checkpaymentInterest = (e) => {
        if (e.target.checked) {
            setCheckinterest(withdraw.amount_interest);
        }
        else {
            setCheckinterest(0);
        }

    };

    const checkpaymentLibor = (e) => {
        if (e.target.checked) {
            setChecklibor(withdraw.amount_libor);
        }
        else {
            setChecklibor(0);
        }

    };

    const handle = (dates) => {
        console.log("data===>", dates)
            setStartDate(dates);

        };


    const paymentDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hidePaymentDialog} />
            <Button label="ຢຶນຢັນ" icon="pi pi-check" className="p-button-success " onClick={InsertData} />
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
                            emptyMessage="No products found."
                           
                        >
                            <Column field="inw_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="invoicew_no" header="ລະຫັດ Invoice" sortable headerStyle={{ minWidth: '8rem' }}></Column>
                            <Column field="loan_no" header="ເລກທີສັນຍາ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="project" header="ຊື່ໂຄງການ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="date_inv" header="ວັນທີເພີ່ມ" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
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
                                        ເລກທີເງິນກູ້ຢຶມ
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
                                        ວັນທີຖອນ
                                    </label>
                                    <Calendar dateFormat="yy-mm-dd" onChange={(e) => setWithdraw({ ...withdraw, date_inv: e.target.value })} showIcon />
                                </div>

                            </div>

                        </Dialog>


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Withdraw;
