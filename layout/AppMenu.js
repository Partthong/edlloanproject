import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model = [
        {
            label: 'ໜ້າຫຼັກ',
            items: [{ label: 'ພາບລວມລະບົບ', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'ຂໍ້ມູນໜີ້ກູ້ຢືມ',
            items: [
                {label: 'ຈັດການໜີ້ກູ້ຢືມ', icon: 'pi pi-fw pi-database',to: '/pages/loan' },
                {
                    label: 'ສະແດງຍອດໜີ້',
                    icon: 'pi pi-fw pi-credit-card',
                    items: [
                        {
                            label: 'ໜີ້ກູ້ຢືມໂດຍກົງ',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/pages/debtdirect'
                        },
                        {
                            label: 'ໜີ້ກູ້ຢືມຕໍ່',
                            icon: 'pi pi-fw pi-dollar',
                            to: '/pages/debtbank'
                        },
                        {
                            label: 'ໜີ້ກູ້ຢືມແກ້ສະພາບຄ່ອງ',
                            icon: 'pi pi-fw pi-dollar',
                            to: ''
                        }
                    ]
                }
            ]
        },
        {
            label: 'ຖອນເງິນກູ້',
            items: [

                { label: 'ເພີ່ມ Invoice ຖອນເງິນກູ້', icon: 'pi pi-fw pi-file', to: '/pages/invoicewithdraw' },
                { label: 'ຖອນເງິນກູ້', icon: 'pi pi-fw pi-dollar', to: '/pages/withdraw' },
                { label: 'ການເຄື່ອນໄຫວຖອນເງິນກູ້', icon: 'pi pi-fw pi-history', to: '' },


            ]
        },
        {
            label: 'ຊຳລະໜີ້',
            items: [
                { label: 'ເພີ່ມ Invoice ຊຳລະໜີ້', icon: 'pi pi-fw pi-file', to: '/pages/invoice' },
                { label: 'ຊຳລະໜີ້', icon: 'pi pi-fw pi-dollar', to: '/pages/payment' },
                { label: 'ການເຄື່ອນໄຫວຊຳລະໜີ້', icon: 'pi pi-fw pi-history', to: '/pages/statement' },
                // { label: 'ຮ່າງເອກະສານຂໍຈ່າຍ', icon: 'pi pi-fw pi-pencil', to: '' },
                // { label: 'ອະນຸມັດ', icon: 'pi pi-fw pi-check-circle', to: '/uikit/list' },
                // { label: 'ຕິດຕາມເອກະສານ', icon: 'pi pi-fw pi-sliders-h', to: '/uikit/menu', preventExact: true }
            ]
        },

        {
            label: 'ຂໍ້ມູນ',
            items: [
                {
                    label: 'ຂໍ້ມູນຜູ້ໃຊ້',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'ຂໍ້ມູນຜູ້ໃຊ້',
                            icon: 'pi pi-fw pi-user-plus',
                            to: '/auth/login'
                        },
                        {
                            label: 'ລົງທະບຽນ',
                            icon: 'pi pi-fw pi-id-card',
                            to: '/auth/login'
                        }

                    ]
                },

                {
                    label: 'ຂໍ້ມູນທະນາຄານ',

                    icon: 'pi pi-fw pi-building',
                    to: '/pages/bank'
                },
                {
                    label: 'ຂໍ້ມູນປະເພດກູ້ຢືມ',
                    icon: 'pi pi-fw pi-list',
                    to: '/pages/loantype'
                },

                {
                    label: 'ອັດຕາແລກປ່ຽນ',
                    icon: 'pi pi-fw pi-circle-off',
                    to: '/pages/currency'
                }
            ]
        },
        {
            label: 'ລາຍງານ',
            items: [
                {
                    label: 'ລາຍງານຕ່າງໆ',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'ລາຍງານເງິນກູ້',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'ລາຍງານການຊຳລະໜີ້',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                }
            ]
        },
        {}
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}

            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
