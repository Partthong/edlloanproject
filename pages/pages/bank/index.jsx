
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
import { myFont } from '../../../public/Phetsarath_OT';
import { EDL_DEPARTMENT, EDL_DIVISION, EDL_FOOTER_CONTACT, EDL_FOOTER_TITLE, EDL_TITLE, LPDR_SUB_TITLE, LPDR_TITLE, NbFormat } from '../../api/actions/constants';
import { imgData } from '../../../public/image';
import pdfMake from 'pdfmake/build/pdfmake';
import moment from 'moment';

pdfMake.vfs = myFont;

pdfMake.fonts = {
    Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Regular.ttf',
        italics: 'Roboto-Regular.ttf',
        bolditalics: 'Roboto-Regular.ttf'
    },
    Phetsarath: {
        normal: 'phetsarath_ot.ttf',
        bold: 'phetsarath_ot.ttf',
        italics: 'phetsarath_ot.ttf',
        bolditalics: 'phetsarath_ot.ttf'
    }
}

function Bank() {
    let emptyBank = {
        b_id: '',
        bankName: '',
        atm: '',
    };
    const [bankList, setBankList] = useState([]);
    const [bank, setBank] = useState(emptyBank);
    const [bankDialog, setBankDialog] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [deleteBankDialog, setDeleteBankDialog] = useState(false);
    const [editBankDialog, setEditBankDialog] = useState(false);
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [tokenInfo, setTokenInfo] = useState();
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(true);


    useEffect(() => {
        showBankList();
    }, []);

    const showBankList = async () => {
        try {

            const response = await axiosInterceptorInstance.get('/api/bank/GetListBank');
            console.log("token ==>", response)
            if (response.status === 200 || response.status === 201) {
                setBankList(response.data);
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
            if (bank.bankName.trim() && bank.atm.trim()) {

            var raw = {
                bankName: bank.bankName,
                atm: bank.atm,
                images: "",
            };

            const response = await axiosInterceptorInstance.post('/api/bank/InsertBank', raw);

            if (response.status === 200 || response.status === 201) {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'ບັນທຶກຂໍ້ມູນສຳເລັດ', life: 3000 });

                setBankDialog(false);
                setBank(emptyBank);
                showBankList();
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

        // print pdf with pdfmake
     const printDocument = () => {
        const docDefinition = {
                 pageSize: 'A4',
                 pageOrientation: 'portrait', // portrait, landscape
                 pageMargins: [30, 45, 30, 50],
                 content: [
                     {
                         text: LPDR_TITLE,
                         alignment: 'center',
                        //  fontSize: 12,   
                     },
                     {
                         text: LPDR_SUB_TITLE,
                         alignment: 'center',
                        //  fontSize: 12,   
                     },
                     {
                         image: imgData,
                         alignment: 'center',
                         width: 70,
                        
                     },
                     {
                         columns: [
                             {
                                 text: EDL_TITLE,
                                 alignment: 'left',                          
                                //  fontSize: 11,   
                                margin: [0, -50, 0, 0]
                             },
                       
                         ]
                     },
                     {
                         columns: [
                             {
                                 text: EDL_DEPARTMENT,
                                 alignment: 'left',
                                 margin: [0, -30, 0, 0]
                                //  fontSize: 11
                             },     
                                                                             
                         ]
                         
                     },
        
                
                     {
                        columns: [
                           
                            {
                               text: EDL_DIVISION,
                               alignment: 'left',
                               margin: [0, -10, 0, 0]
                           },      
                            {
                                text: 'ເລກທີ: ........../ຟຟລ.ຝກໝ.ພສຍ',
                                alignment: 'right'
                            },              
                      
                        ]
                    },
                    {
                        columns: [       
                           {
                            text: 'ນະຄອນຫຼວງວຽງຈັນ, ວັນທີ..................' ,
                            alignment: 'right'
                        },
                
                        ]
                    },
                     {
                         text: 'ລາຍງານຂໍ້ມູນທະນາຄານ',
                         style: 'header',
                         alignment: 'center'
                     },
                     {
                         stack: [         
                             {
                                 table: {
                                     headerRows: 1,
                                     widths: [20, 260, 230],
                            
                                     body: [
                                         [
                                             { text: 'ລ/ດ', style: 'tableHeader', alignment: 'center', border: [true, true, true, true] },
                                             { text: 'ຊື່ທະນາຄານ', style: 'tableHeader', alignment: 'left', border: [true, true, true, true] },
                                             { text: 'ເລກບັນຊີ', style: 'tableHeader', alignment: 'left', border: [true, true, true, true] },
                                         ],
                                             ...bankList.map((bank, index) => [
                                             { text: index + 1, style: 'tableHeader', alignment: 'center', border: [true, true, true, true] },
                                             { text: bank.bankName, style: 'tableHeader', alignment: 'left', border: [true, true, true, true] },
                                             { text: bank.atm, style: 'tableHeader', alignment: 'left', border: [true, true, true, true] },
                                         ])
                                     ]
                                 },
                               
                             },
                            //  {
                            //      table: {
                            //         widths: [20, 260,230],
                            //          body: [
                            //              [
                            //                  { text: 'ຈໍານວນແຜນທັງໝົດ: ', style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                            //                  { text: NbFormat("999999.000"), style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                            //              ],
                            //          ]
                            //      },
                            //  },   
                            
                         ],
                     },
             
                     {
                         columns: [
                             {
                                 text: 'ຫົວໜ້າຝ່າຍກົດໝາຍ-ສັນຍາ',
                                 alignment: 'left',
                                 margin: [20, 20, 20, 10]
                             },
                             {
                                 text: 'ຫົວໜ້າພະແນກສັນຍາກູ້ຢືມ',
                                 alignment: 'center',
                                 margin: [20, 20, 20, 10]
                             },
                             {
                                 text: 'ຜູ້ສັງລວມ',
                                 alignment: 'right',
                                 style: 'bold',
                                 margin: [20, 20, 20, 10]
                             },
                         ]
                     },
                 ],
                 styles: {
                     header: {
                         fontSize: 18,
                         bold: true,
                         margin: [0, 0, 0, 5],
                    
                     },
                     tablefooter: {
                         margin: [0, 0, 10, 0]
                     },
                     tableHeader: {
                         bold: true,
                         fontSize: 12,
                         color: 'black'
                     }
                 },
                 defaultStyle: {
                     font: 'Phetsarath',
                     columnGap: 0,
                 },

                 footer: function(currentPage, pageCount) {         
                   return [
                    { text: currentPage.toString() + ' / ' + pageCount, alignment: 'center', style: 'normalText', fontSize: 9 },                               
                    { text: EDL_FOOTER_TITLE, alignment: 'center', fontSize: 9 },  
                    { text: EDL_FOOTER_CONTACT,  alignment: 'center', fontSize: 9 },  
                   ]         
                 },
                 
             };
 
             const pdfGenerator = pdfMake.createPdf(docDefinition);
             pdfGenerator.open();
            //  pdfGenerator.print();
            //  pdfGenerator.download(`ລາຍງານ ຫົວໜ່ວຍ.pdf`);
            
     }


    const toast = useRef(null);
    const dt = useRef(null);

    const openNew = () => {
        setBank(emptyBank);
        setSubmitted(false);
        setBankDialog(true);
    };

    const editBank = (bank) => {
        setBank({ ...bank });
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

    const confirmDeleteBank = (bank) => {
        setBank(bank);
        setDeleteBankDialog(true);
    };

    const onUpload = (bank) => {

        setBank({ ...bank });

    };

    const bankDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info " onClick={InsertData} />
        </>
    );

    const editBankDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideEditBankDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info " />
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
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editBank(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteBank(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">ຂໍ້ມູນທະນາຄານ</h4>
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
               
                <div className="my-2">
                {/* <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="ພິມ" className="mr-2 inline-block" /> */}
                <Button label="ພິມລາຍງານ" icon="pi pi-print" className="p-button-help mr-2" onClick={printDocument} />
                <Button label="Excel" icon="pi pi-upload" className="p-button-success"  />
                {/* <Button label="Import file" icon="pi pi-save" className="p-button-success mr-2" onClick={nextPage} /> */}
                </div>
            </React.Fragment>
        );
    };



    const imageBodyTemplate = (rowData) => {
        return (
          <img
            src={rowData.images}
            alt=""
            className="shadow-2 border-round"
            style={{ width: "35px" }}
          />
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
                            dataKey="b_id"
                            value={bankList}
                            tableStyle={{ minWidth: '78rem' }}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Banks" globalFilter={globalFilter} header={header}
                            emptyMessage="No products found."
                            responsiveLayout="scroll"
                           
                        >
                               <Column
                header="#"
                headerStyle={{ width: "3rem" }}
                body={(data, options) => options.rowIndex + 1}
              ></Column>
                            {/* <Column field="b_id" header="ລະຫັດ" sortable headerStyle={{ minWidth: '5rem' }}></Column> */}
                            <Column
                                field="images"
                                header="ຮູບ"
                                body={imageBodyTemplate}
                                // className="text-blue-600 "
                                sortable
                                headerStyle={{ minWidth: "5rem" }}
                            ></Column>
                            <Column field="bankName" header="ຊື່ທະນາຄານ" sortable headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="atm" header="ເລກບັນຊີ" sortable headerStyle={{ minWidth: '15rem' }}></Column>

                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={bankDialog} style={{ width: '450px' }} header="ເພີ່ມຂໍ້ມູນທະນາຄານ" modal className="p-fluid" footer={bankDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="name">ຊື່ທະນາຄານ</label>
                                <InputText id="name" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} />
                            </div>
                            <div className="field">
                                <label htmlFor="name">ເລກບັນຊີ</label>
                                <InputText id="name" value={bank.atm} onChange={(e) => setBank({ ...bank, atm: e.target.value })} />
                            </div>

                        </Dialog>

                        <Dialog visible={editBankDialog} style={{ width: '450px' }} header="ແກ້ໄຂຂໍ້ມູນທະນາຄານ" modal className="p-fluid" footer={editBankDialogFooter} onHide={hideEditBankDialog}>
                            <div className="field">
                                <label htmlFor="name">ຊື່ທະນາຄານ</label>
                                <InputText id="name" value={bank.bankName} onChange={(e) => setBank({ ...bank, bankName: e.target.value })} required />
                                <b className="hidden">{bank.b_id}</b>
                            </div>
                            <div className="field">
                                <label htmlFor="name">ເລກບັນຊີ</label>
                                <InputText id="name" value={bank.atm} onChange={(e) => setBank({ ...bank, atm: e.target.value })} />
                            </div>
                        </Dialog>

                        <Dialog visible={deleteBankDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteBankDialogFooter} onHide={hideDeleteBankDialog}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {bank && (
                                    <span>
                                        ເຈົ້າຕ້ອງການລົບຂໍ້ມູນນີ້ແທ້ບໍ່? <b>{bank.bankName}</b>?<b className="hidden">{bank.b_id}</b>
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

export default Bank;
