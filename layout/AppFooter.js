import React, { useContext } from 'react';
import { LayoutContext } from './context/layoutcontext';

const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);

    return (
        <div className="layout-footer">
            <img src={`/layout/images/edl.png`} alt="Logo" height="25" className="" />    
            <span className="font-medium ml-2">by ພະແນກ Application, EDL-ICT 2023</span>
        </div>
    );
};

export default AppFooter;
