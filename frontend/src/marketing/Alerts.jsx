import React, { useEffect, useState,useCallback } from 'react';
import { useNavigate} from "react-router-dom";
import api from '../services/api';
import FocusTrap from '@mui/material/Unstable_TrapFocus';
import Box from "@mui/material/Box";
import { LoadingState, ErrorState, EmptyState } from '../components/StatusComponents';
import "./Alerts.css";
import Snackbar from "@mui/material/Snackbar";
import { useAuth } from "../context/AuthContext";
import Alert from "@mui/material/Alert";

const Alerts = () => {
    const [showAlert, setShowAlert] = useState(false);
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState(null);
    const {accessToken} = useAuth() ;

    const navigate = useNavigate();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);
    const [updatedPrice, setUpdatedPrice] = useState(null);

    const fetchAlerts = useCallback(async () => {
                                            setLoading(true);
                                            setError(null);
                                            try {
                                                const alertData = await api.getAlerts(accessToken);
                                                setAlerts(alertData);
                                            } catch (err) {
                                                setError(err.message || 'Unable to load alerts');
                                            } finally {
                                                setLoading(false);
                                            }
                                        },[accessToken]);

    useEffect(() => {
        fetchAlerts();
    }, [fetchAlerts]);


    const handleUpdate = async () => {

        try {

            const updated = await api.updateAlert(
                selectedAlert.id,
                {
                    targetPrice: Number(updatedPrice)
                },accessToken
            );

            setAlerts((prev) =>
                prev.map(item =>
                    item.id === selectedAlert.id ? updated : item
                )
            );

            setOpen(false);

        } catch (err) {
            setError(err.message || 'Unable to update alert');
        }
    };

    const handleDelete = async (alertId) => {
        try {
            await api.deleteAlert(alertId,accessToken);
            setAlerts((prev) => prev.filter(alert => alert.id !== alertId));
        } catch (err) {
            setError(err.message || 'Unable to delete alert');
        }
    };


    return (
        <div className="alerts-container">
            <Snackbar
                         open={showAlert}
                         autoHideDuration={3000}
                         onClose={() => setShowAlert(false)}
                         anchorOrigin={{
                           vertical: "top",
                           horizontal: "center",
                         }}
                       >
                         <Alert
                           onClose={() => setShowAlert(false)}
                           severity={severity}
                           variant="filled"
                         >
                           {message}
                         </Alert>
                 </Snackbar>
            <div className="alerts-header">
                <h1>Price Alerts</h1>
                <p>Never miss a deal. Set alerts and get notified when your target price hits.</p>
            </div>



            {loading && <LoadingState message="Checking your alerts..." />}

            {error && <ErrorState message={error} onRetry={fetchAlerts} />}

            {!loading && !error && alerts.length === 0 && (
                <EmptyState message="No alerts yet.">
                    <p>Create your first price alert to start tracking.</p>
                </EmptyState>
            )}

            {!loading && !error && alerts.length > 0 && (
                <section className="alerts-list">
                    <div className="alerts-toolbar">
                        <h2>Your Alerts</h2>

                    </div>
                    <div className="alerts-grid">
                        {alerts.map(alert => (
                            <div className="alert-card"
                            key={alert.id}
                            role="button"
                            tabIndex={0}
                            style={{ cursor: 'pointer' }} // Quick CSS hint to show it's clickable
                            onClick={() => {alert.pid && navigate(`/products/${alert.pid}`)}}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && alert.pid) {
                                    navigate(`/products/${alert.pid}`);
                                }
                            }}
                            >
                                <div>
                                    <div className="alert-head">
                                        {alert.productImage && (
                                            <img
                                              src={alert.productImage}
                                              alt={alert.productTitle}
                                              className="alert-image"
                                            />
                                        )}
                                        <h3>{alert.productTitle}</h3>
                                    </div>

                                    <p className="alert-meta">
                                        Target Price: ₹ {Number(alert.targetPrice).toLocaleString()}
                                    </p>

                                </div>
                                <div className="alert-actions">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedAlert(alert);
                                            setUpdatedPrice(alert.targetPrice);
                                            setOpen(true);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        className="alert-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(alert.id);
                                            setMessage("Alert Deleted");
                                            setSeverity("warning");
                                            setShowAlert(true)}
                                            }
                                    >
                                        Delete
                                    </button>
                                </div>
                                <span className={`alert-status ${alert.type === 'ACTIVE' ? 'status-active' : 'status-paused'}`}>
                                    {alert.type === 'ACTIVE' ? 'Active' : 'Paused'}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        {open && (
                                                     <FocusTrap open>

                                                         <Box
                                                             tabIndex={-1}
                                                             sx={{
                                                                 position: "fixed",
                                                                 top: "50%",
                                                                 left: "50%",
                                                                 transform: "translate(-50%, -50%)",
                                                                 width: 350,
                                                                 p: 3,
                                                                 backgroundColor: "var(--surface-color)",
                                                                 borderRadius: 2,
                                                                 boxShadow: 24,
                                                                 zIndex: 999,
                                                             }}
                                                         >

                                                             <h2>Update Alert</h2>
                                                               <p>Target Price </p>
                                                            <input
                                                                type="number"
                                                                value={updatedPrice}
                                                                onChange={(e) => setUpdatedPrice(e.target.value)}
                                                                style={{
                                                                    border: "1px solid #d3d3d3",
                                                                    outline: "none",
                                                                    padding: "8px 12px",
                                                                    borderRadius: "6px",
                                                                    fontSize: "14px",
                                                                    textDecoration: "none"
                                                                }}
                                                            />

                                                             <br /><br />

                                                             <button
                                                                 type="button"
                                                                 onClick={() => {handleUpdate();
                                                                    setMessage("Alert Updated");
                                                                    setSeverity("success")
                                                                     setShowAlert(true);}
                                                                 }
                                                                 className="btn-secondary"

                                                             >
                                                                 Save
                                                             </button>
                                                             <button
                                                                 onClick={() => setOpen(false)}
                                                                 style={{ marginLeft: "10px" }}
                                                                  type="button"
                                                                  className="alert-delete"
                                                             >
                                                                 Close
                                                             </button>

                                                         </Box>

                                                     </FocusTrap>
                                                 )}

            {/* Footer */}
            <footer>
                <p>&copy; 2026 Price Tracker Project</p>
            </footer>
        </div>
    );
};

export default Alerts;
