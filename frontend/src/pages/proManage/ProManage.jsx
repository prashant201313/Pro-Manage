import React, { useState } from 'react';
import "./proManage.css";
import { NavLink, Outlet } from 'react-router-dom';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { GoDatabase } from "react-icons/go";
import { FiSettings } from "react-icons/fi";
import { IoLogOutOutline } from "react-icons/io5";
import ConfirmToLogout from '../../components/confirmToLogout/ConfirmToLogout';

export default function ProManage() {
    const [openLogout, setOpenLogout] = useState(false);

    return (
        <>
            <div className='pro-manage'>
                <aside>
                    <div className='brand'>
                        <img width={18} src="/proIcon.png" alt="proIcon" />
                        <h5>Pro Manage</h5>
                    </div>

                    <NavLink to={"board"} className="btn" activeClassName="active"><MdOutlineSpaceDashboard style={{ fontSize: "1.1rem" }} /> Board</NavLink>
                    <NavLink to={"analytics"} className="btn" activeClassName="active"><GoDatabase style={{ fontSize: "1.1rem" }} /> Analytics</NavLink>
                    <NavLink to={"settings"} className="btn" activeClassName="active"><FiSettings style={{ fontSize: "1.1rem" }} /> Settings</NavLink>

                    <button className='btn logout' onClick={() => setOpenLogout(true)}><IoLogOutOutline style={{ fontSize: "1.1rem" }} /> Log out</button>
                </aside>

                <main>
                    <Outlet />
                </main>
            </div>

            {openLogout && <ConfirmToLogout onClose={() => setOpenLogout(false)} />}
        </>
    );
}
