
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from 'primereact/autocomplete';

import React, { useEffect, useRef, useState } from 'react';
import { Toolbar } from 'primereact/toolbar';
import { useRouter } from 'next/router';
import { Toast } from 'primereact/toast';
import moment from 'moment';
import { FileUpload } from 'primereact/fileupload';
import axiosInterceptorInstance from '../../../demo/components/axios';


function Invoice() {
    let emptyInvoice = {
        invoice_no: '',
        l_id: '',
        amount_capital: '',
        amount_interest: '',
        libor: '',
        amount_other: '',
        remarks: '',
        atm_name: '',
        atm_number: '',
        date_in: '',
        create_date: '' ,
        creator: 'admin'
    };

    const [insertInvoice, setInsertInvoice] = useState(emptyInvoice);
    const [loan, setLoan] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(0);
    const [filteredLoan, setFilteredLoan] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const router = useRouter();


    useEffect(() => {
        showLoanList();
    }, []);

    const showLoanList = async () => {
        try {
            const response = await axiosInterceptorInstance.get('/api/loan/GetListLoan');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setLoan(response.data);
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
            if (insertInvoice.invoice_no.trim()) {

            var raw = {
                invoice_no: insertInvoice.invoice_no,
                l_id: selectedLoan.l_id,
                amount_capital: insertInvoice.amount_capital,
                amount_interest: insertInvoice.amount_interest,
                libor: insertInvoice.libor,
                amount_other: insertInvoice.amount_other,
                remarks: insertInvoice.remarks,
                atm_name: insertInvoice.atm_name,
                atm_number: insertInvoice.atm_number,
                date_in: moment(insertInvoice.date_in).format('YYYY-MM-DD'),
                create_date: moment().format('YYYY-MM-DD'),
                creator: 'admin'
            };

            const response = await axiosInterceptorInstance.post('/api/invoice/InsertInvoice', raw);

            if (response.status === 200 || response.status === 201) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ບັນທຶກຂໍ້ມູນສຳເລັດ', life: 3000 });
                setInsertInvoice(emptyInvoice);

                setTimeout(() => {
                    document.location.reload();
                }, 2000);


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


    const onUpload = () => {
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const routPagetoInvoiceData = () => {
        router.push('/pages/invoicedata');
    };



    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _invoice = { ...insertInvoice };
        _invoice[`${name}`] = val;

        setInsertInvoice(_invoice);
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="ບັນທຶກ" icon="pi pi-plus" className="mr-2 p-button-info" onClick={InsertData} />
                <Button label="ແກ້ໄຂຂໍ້ມູນ" icon="pi pi-pencil" className="mr-2 p-button-secondary" onClick={routPagetoInvoiceData} />

            </React.Fragment>
        );
    };

    const search = (event) => {
        console.log('event.query==>', event.query);

        setTimeout(() => {
            let _filteredLoan;

            if (!event.query.trim().length) {
                _filteredLoan = [...loan];
            } else {
                _filteredLoan = loan.filter((item) => {
                    return item.loan_no.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            console.log(_filteredLoan);

            setFilteredLoan(_filteredLoan);
        }, 250);
    };



    return (
        <div className="grid">
            <div className="col-12 md:col-12">
                <div className="card ">
                    <Toast ref={toast} />
                    <Toolbar className="mb-3  " left={rightToolbarTemplate}></Toolbar>

                    <h3 className=" text-red-600 ">ຂໍຊຳລະໜີ້ກູ້ຢືມ</h3>
                    <div className="p-fluid formgrid grid mb-0 ">
                        <div className="field col-12 md:col-12">
                            <label htmlFor="loan_no" className="text-blue-600">
                                ປ້ອນເລກທີສັນຍາ
                            </label>
                            <AutoComplete field="loan_no" value={selectedLoan} suggestions={filteredLoan} completeMethod={search} onChange={(e) => setSelectedLoan(e.value)} />

                        </div>
                        <div className="field col-12 md:col-6">
                            <label htmlFor="lastname2" className="">
                                ຊື່ໂຄງການ
                            </label>
                            <InputText readOnly id="firstname2" type="text" value={selectedLoan ? selectedLoan.project : ''} />
                        </div>

                        <div className="field col-12 md:col-6">
                            <label htmlFor="firstname2" className="text-red-600">
                                ຈຳນວນໜີ້ກູ້ຢືມຍັງເຫຼືອທັງໝົດ
                            </label>

                            <InputNumber className="" readOnly id="firstname2" type="text" value={selectedLoan ? selectedLoan.total_balance : ''} />
                            <b className="hidden">{selectedLoan ? selectedLoan.l_id : ''}</b>
                        </div>


                    </div>

                    <div className="field grid p-2 mb-0">
                        <label htmlFor="name3" className="mr-1">
                            ສະກຸນເງິນ:
                        </label>
                        <b className="text-red-500">{selectedLoan ? selectedLoan.currency : ''}</b>
                    </div>
                </div>
            </div>

            <div className="col-12 md:col-6 " >
                <div className="card p-fluid p-3">
                    <div className="field col">
                        <label htmlFor="name1">ເລກທີໃບ Invoice</label>
                        <InputText id="invoice_no" type="text" className="text-blue-500" onChange={(e) => setInsertInvoice({ ...insertInvoice, invoice_no: e.target.value })} />
                    </div>
                    <div className="field col">
                        <label htmlFor="email1">ຊື່ບັນຊີ</label>
                        <InputText id="atm_name" type="text" className="text-blue-500" onChange={(e) => setInsertInvoice({ ...insertInvoice, atm_name: e.target.value })} />
                    </div>
                    <div className="field col">
                        <label htmlFor="email1">ເລກບັນຊີ</label>
                        <InputText id="atm_number" type="text" className="text-blue-500" onChange={(e) => setInsertInvoice({ ...insertInvoice, atm_number: e.target.value })} />
                    </div>
                    <div className="field col">
                        <label htmlFor="age1">ວັນທີຕ້ອງຊຳລະກ່ອນ</label>

                        <Calendar dateFormat="yy-mm-dd" onChange={(e) => setInsertInvoice({ ...insertInvoice, date_in: e.target.value })} showIcon />
                    </div>

                    <div className="field col">
                <div className="card flex justify-content-center">
                    <Toast ref={toast}></Toast>
                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="pdf/*" maxFileSize={1000000} onUpload={onUpload} />
                </div>
            </div>
                </div>
            </div>

            <div className="col-12 md:col-6">
                <div className="card p-fluid p-3 ">
                    <div className="field col">
                        <label htmlFor="name1">ຈຳນວນເງິນຕົ້ນທຶນ</label>
                        <InputNumber value={insertInvoice.amount_capital} onValueChange={(e) => onInputNumberChange(e, 'amount_capital')} />
                    </div>



                        <div className="field col">
                            <label htmlFor="email2">ຈຳນວນເງິນດອກເບ້ຍ</label>
                            <InputNumber value={insertInvoice.amount_interest} onValueChange={(e) => onInputNumberChange(e, 'amount_interest')} />
                        </div>


                        <div className="field col">
                            <label htmlFor="age2">ອັດຕາ Libor</label>
                            <InputNumber value={insertInvoice.libor} onValueChange={(e) => onInputNumberChange(e, 'libor')} mode="decimal" minFractionDigits={2} prefix="%" />
                        </div>




                        <div className="field col">
                            <label htmlFor="age2">ຈຳນວນເງິນອື່ນໆ</label>
                            <InputNumber value={insertInvoice.amount_other} onValueChange={(e) => onInputNumberChange(e, 'amount_other')} />

                        </div>

                        <div className="field col">
                            <label htmlFor="age2" className='text-red-500'>ໝາຍເຫດ</label>

                            <InputText id="remarks" type="text" className="text-blue-500" onChange={(e) => setInsertInvoice({ ...insertInvoice, remarks: e.target.value })} placeholder='ເຫດຜົນ'/>
                        </div>




                </div>
            </div>



        </div>
    );
}

export default Invoice;
