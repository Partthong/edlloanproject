import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppTopbar = forwardRef((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const router = useRouter();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const logOut = () =>{
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        router.push('/auth/login');
    }

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/edl.png`} width="40px" height={'35px'} widt={'true'} alt="logo" />
                <span>EDL-LOAN</span>

              
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
            <button type="button" className="p-link layout-topbar-button" onClick={logOut} >
                    <i className="pi pi-fw pi-sign-out"></i>
                    <span>ອອກຈາກລະບົບ</span>
                </button>
            
            </div>
        </div>
    );
});

export default AppTopbar;
