import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import axiosIntance from '../../../api/helpers/axios';
import { useRouter } from 'next/router';

//Import
import { myFont } from '../../../public/Phetsarath_OT';
import { EDL_DEPARTMENT, EDL_DIVISION, EDL_FOOTER_CONTACT, EDL_FOOTER_TITLE, EDL_TITLE, LPDR_SUB_TITLE, LPDR_TITLE, NbFormat } from '../../../api/actions/constants';
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

function Branches() {
    let emptyData = {
        _id: '',
        name: '',
    };
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [unitList, setUnitList] = useState([]);
    const [unit, setUnit] = useState(emptyData);
    const [insertDialog, setInsertDialog] = useState(false);
    const [editDialog, setEditDialog] = useState(false);
    const [filters, setFilters] = useState({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState('');


    useEffect(() => {
        fetchData();
    }, []);

    // Gloabal filter
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['name'].value = value;
        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const toast = useRef(null);

    const openNew = () => {
        setUnit(emptyData);
        setInsertDialog(true);
    };

    const editData = (unit) => {
        setUnit({ ...unit });
        setEditDialog(true);
    };

    const nextPage = () => {
        router.push('/pages/unit/import');
    };

    const hideDialog = () => {
        setInsertDialog(false);
    };

    const hideEditDialog = () => {
        setEditDialog(false);
    };

    // Funtion data api
    // Gets
    const fetchData = async () => {
        try {
            const res = await axiosIntance.get(
                "units",
            );
            if (res.status === 201 || res.status === 200) {
                setUnitList(res.data?.results);
                setLoading(false);
            } else if (res.message = 'Network Error') {
                toast.current?.show({ severity: 'error', summary: 'ອິນເຕີເນັດ', detail: 'ກະລຸນາກວດອິນເຕີເນັດຂອງທ່ານ' });
            }
            else {
                toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ໂຫຼດຂໍ້ມູນບໍ່ສໍາເລັດ' });
            }
        } catch (e) {
            toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ມີບາງຢ່າງຜິດປົກກະຕິ' });
        }
    }

    // Insert
    const insertData = async () => {
        if (unit.name == '') {
            toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ກະລຸນາປ້ອນຊື່ຫົວໜ່ວຍ' });
        } else if (unit.name.length < 2) {
            toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ກະລຸນາປ້ອນຊື່ຫົວໜ່ວຍ ຫຼາຍກວ່າ 2 ຕົວອັກສອນຂື້ນໄປ' });
        } else {
            try {
                const res = await axiosIntance.post(
                    "units",
                    { name: unit.name },
                );
                if (res.status === 201 || res.status === 200) {
                    toast.current?.show({ severity: 'success', summary: 'ສໍາເລັດ', detail: 'ບັນທຶກຂໍ້ມູນສໍາເລັດແລ້ວ' });
                    setUnit(emptyData);
                    setInsertDialog(false);
                    fetchData();
                }
                else if (res.message = 'Network Error') {
                    toast.current?.show({ severity: 'error', summary: 'ອິນເຕີເນັດ', detail: 'ກະລຸນາກວດອິນເຕີເນັດຂອງທ່ານ' });
                }
                else {
                    toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ບັນທຶກຂໍ້ມູນບໍ່ສໍາເລັດ' });
                    setUnit(emptyData);
                    setInsertDialog(false);
                    fetchData();
                }
            } catch (e) {
                toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ມີບາງຢ່າງຜິດປົກກະຕິ' });
            };
        }
    };

    // Update
    const updateData = async () => {
        if (unit.name == '') {
            toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ກະລຸນາປ້ອນຊື່ຫົວໜ່ວຍ' });
        } else if (unit.name.length < 2) {
            toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ກະລຸນາປ້ອນຊື່ຫົວໜ່ວຍ ຫຼາຍກວ່າ 2 ຕົວອັກສອນຂື້ນໄປ' });
        } else {
            try {
                const res = await axiosIntance.put(
                    "units/" + unit._id,
                    { name: unit.name },
                )
                if (res.status === 201 || res.status === 200) {
                    setEditDialog(false);
                    toast.current?.show({ severity: 'success', summary: 'ສໍາເລັດ', detail: 'ທ່ານໄດ້ແກ້ຂໍ້ມູນສໍາເລັດແລ້ວ' });
                    setUnit(emptyData);
                    fetchData();
                }
                else if (res.message = 'Network Error') {
                    toast.current?.show({ severity: 'error', summary: 'ອິນເຕີເນັດ', detail: 'ກະລຸນາກວດອິນເຕີເນັດຂອງທ່ານ' });
                }
                else {
                    setEditDialog(false);
                    toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ທ່ານແກ້ໄຂຂໍ້ມູນບໍ່ສໍາເລັດ' });
                    setUnit(emptyData);
                    fetchData();
                }
            } catch (e) {
                toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ມີບາງຢ່າງຜິດປົກກະຕິ' });
            }
        }
    }

    // Alert Message
    const handleNameChange = e => {
        if (unit.name.length > 100) {
            toast.current?.show({ severity: 'error', summary: 'ຜິດພາດ', detail: 'ກະລຸນາປ້ອນຊື່ຫົວໜ່ວຍ ບໍ່ເກີນ 100 ຕົວອັກສອນ' });
        }
        else {
            setUnit({ ...unit, name: e.target.value });
        }

    };

     // print pdf with pdfmake
     const printDocument = () => {
       const docDefinition = {
                pageSize: 'A4',
                pageOrientation: 'landscape', // portrait, landscape
                pageMargins: [40, 60, 40, 60],
                content: [
                    {
                        text: LPDR_TITLE,
                        alignment: 'center'
                    },
                    {
                        text: LPDR_SUB_TITLE,
                        alignment: 'center'
                    },
                    {
                        image: imgData,
                        alignment: 'center',
                        width: 68,
                        height: 60
                    },
                    {
                        columns: [
                            {
                                text: EDL_TITLE,
                                alignment: 'left',
                                fontSize: 10
                            },
                            {
                                text: 'ເລກທີ່: 00000',
                                alignment: 'right'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: EDL_DEPARTMENT,
                                alignment: 'left',
                                fontSize: 10
                            },
                            {
                                text: 'ລາຍງານໂດຍ: EDL Admin' ,
                                alignment: 'right'
                            },
                        ]
                    },
                    {
                        columns: [
                            {
                                text: EDL_DIVISION,
                                alignment: 'left',
                                fontSize: 10
                            },
                            {
                                text: 'ບັນຊີເລກທີ່: 10.2023',
                                alignment: 'right'
                            },
                        ]
                    },
                    {
                        text: 'ລາຍງານຂໍ້ມູນ ຫົວໜ່ວຍ',
                        style: 'header',
                        alignment: 'center'
                    },
                    {
                        stack: [
                            
                            {
                                table: {
                                    widths: [26, 600],
                                    body: [
                                        [
                                            { text: 'ລຳດັບ', style: 'tableHeader', alignment: 'bottom', border: [true, true, true, true] },
                                            { text: 'ຫົວໜ່ວຍ', style: 'tableHeader', alignment: 'center', border: [true, true, true, true] },
                                        ],
                                        ...unitList.map((unit, index) => [
                                            { text: index + 1, style: 'tableHeader', alignment: 'center', border: [true, true, true, true] },
                                            { text: unit.name, style: 'tableHeader', alignment: 'right', border: [true, true, true, true] },
                                        ])
                                    ]
                                },
                                headerRows: 1,
                            },
                            {
                                table: {
                                    widths: [26, 600],
                                    body: [
                                        [
                                            { text: 'ຈໍານວນແຜນທັງໝົດ: ', style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                                            { text: NbFormat("999999.000"), style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                                        ],
                                    ]
                                },
                            },
                            {
                                table: {
                                    widths: [26, 600],
                                    body: [
                                        [
                                            { text: 'ລາຄາແຜນທັງໝົດ: ', style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                                            { text: NbFormat(900099000) + ' ກີບ', style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                                        ],
                                    ]
                                },
                            },
                            {
                                table: {
                                    widths: [26, 600],
                                    body: [
                                        [
                                            { text: 'ລວມທັງໝົດ: ', style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                                            { text: NbFormat(889900998888) + ' ກີບ', style: 'tableHeader', alignment: 'right', border: [true, false, true, true] },
                                        ],
                                    ]
                                },
                            },
                        ],
                    },
                    {
                        text: 'ທີ່: ' + EDL_TITLE + ' ວັນທີ່: ' + moment(new Date()).format("DD/MM/YYYY ເວລາ: hh:mm:ss"),
                        alignment: 'right',
                        margin: [0, 20, 0, 0]
                    },
                    {
                        columns: [
                            {
                                text: 'ຫົວໜ້າຝ່າຍ',
                                alignment: 'left'
                            },
                            {
                                text: 'ຫົວໜ້າພະແນກ',
                                alignment: 'center'
                            },
                            {
                                text: 'ຜູ້ສັງລວມ',
                                alignment: 'center',
                                style: 'bold',
                                margin: [0, 0, 0, 10]
                            },
                        ]
                    },

                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
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
                footer: function (currentPage, pageCount) {
                    return [
                        {
                            table: {
                                widths: [610, 100],
                                body: [
                                    [

                                        { text: EDL_FOOTER_TITLE, style: 'tableHeader', alignment: 'right', fontSize: 10 },
                                        { text: "ໜ້າ: " + currentPage.toString() + ' ໃນ ' + pageCount, alignment: 'right', style: 'normalText', fontSize: 10 },
                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        },
                        {
                            table: {
                                widths: '*',
                                body: [
                                    [
                                        { text: EDL_FOOTER_CONTACT, alignment: 'center', fontSize: 10 },
                                    ],
                                ]
                            },
                            layout: 'noBorders'
                        }
                    ]
                },
            };

            const pdfGenerator = pdfMake.createPdf(docDefinition);
            pdfGenerator.print();
            pdfGenerator.download(`ລາຍງານ ຫົວໜ່ວຍ.pdf`);
    }

    // Insert Buttong
    const insertDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info "
                onClick={insertData}
            />
        </>
    );

    // Update button
    const editDialogFooter = (
        <>
            <Button label="ປິດອອກ" icon="pi pi-times" className="p-button-text " onClick={hideEditDialog} />
            <Button label="ບັນທຶກ" icon="pi pi-check" className="p-button-info " onClick={updateData} />
        </>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => editData(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">ຂໍ້ມູນຫົວໜ່ວຍ</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" value={globalFilterValue} placeholder="ຄົ້ນຫາ..." onChange={onGlobalFilterChange} />
            </span>
        </div>
    );

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="ເພີ່ມໃໝ່" icon="pi pi-plus" className="p-button-info mr-2" onClick={openNew} />
                    <Button label="PDF" icon="pi pi-file" className="p-button-danger mr-2" onClick={printDocument} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                 <div className="my-2">
                    <Button label="Import file" icon="pi pi-save" className="p-button-success mr-2" onClick={nextPage} />
                </div>
            </React.Fragment>
        );
    };

    return (
        
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <Toolbar className="mb-4" left={rightToolbarTemplate} right={leftToolbarTemplate}></Toolbar>
                    <div>
                        <DataTable
                            dataKey="_id"
                            value={unitList.map((item, i) => ({ id: i + 1, ...item }))}
                            tableStyle={{ minWidth: '78rem' }}
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="ສະແດງ {first} ຫາ {last} ຂອງ {totalRecords} ຂໍ້ມູນທັງໝົດ"
                            emptyMessage="ບໍ່ມີຂໍ້ມູນ..."
                            loading={loading}
                            header={header}
                            filters={filters} globalFilterFields={['name']}
                        >
                            <Column field="id" header="ລ/ດ" sortable headerStyle={{ minWidth: '5rem' }}></Column>
                            <Column field="name" header="ຊື່ຫົວໜ່ວຍ" sortable headerStyle={{ minWidth: '15rem' }}></Column>

                            <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={insertDialog} style={{ width: '450px' }} header="ເພີ່ມຂໍ້ມູນຫົວໜ່ວຍ" modal className="p-fluid" footer={insertDialogFooter} onHide={hideDialog}>
                            <div className="field">
                                <label htmlFor="name">ຊື່ຫົວໜ່ວຍ</label>
                                <InputText id="name" value={unit.name} onChange={handleNameChange} />
                            </div>
                        </Dialog>

                        <Dialog visible={editDialog} style={{ width: '450px' }} header="ແກ້ໄຂຂໍ້ມູນຫົວໜ່ວຍ" modal className="p-fluid" footer={editDialogFooter} onHide={hideEditDialog}>
                            <div className="field">
                                <label htmlFor="name">ຊື່ຫົວໜ່ວຍ</label>
                                <InputText id="name" value={unit.name} onChange={(e) => setUnit({ ...unit, name: e.target.value })} required />
                                <b className="hidden">{unit._id}</b>
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Branches;
