import React from 'react';
import loading from "../assets/loading.gif";

export default function Loader({ size = 100 }) {
    return (
        <div style={{ textAlign: "center" }}>
            <img src={loading} alt="loading" width={size} />
        </div>
    );
}
