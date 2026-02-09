import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateDashboard } from "../api/client";

export default function UpdateDashboardDialog({ open, onClose, dashboard, onUpdated,options }) {
    const [form, setForm] = useState({
      description: "",
      last_updated_date: "",
      updated_by: "",
      data_from: "",
      data_to: "",
      published_account: "",
    });

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (dashboard) {
        setForm({
          description: dashboard.description,
          last_updated_date: dashboard.last_updated_date,
          updated_by: dashboard.updated_by,
          data_from: dashboard.data_from,
          data_to: dashboard.data_to,
          published_account: dashboard.published_account,
        });
      setErr("");
    }
  }, [dashboard]);

  if (!open || !dashboard) return null;

  const submit = async () => {
    setErr("");

    // Validation
    if (!form.description.trim()) {
      setErr("Description is required");
      return;
    }
    if (!form.last_updated_date) {
      setErr("Last updated date is required");
      return;
    }
    if (!form.updated_by.trim()) {
      setErr("Updated by field is required");
      return;
    }
    if (!form.data_from || !form.data_to) {
      setErr("Data date range is required");
      return;
    }

    if (!form.published_account.trim()) {
      setErr("Published account is required");
      return;
    }

    setSaving(true);
    try {
      const res = await updateDashboard(dashboard.id, form);
      if (!res.ok) {
        setErr(res.error || "Failed to update dashboard");
        toast.error("Failed to update dashboard", { position: "top-right", autoClose: 3000 });
        setSaving(false);
        return;
      }

      toast.success("Dashboard updated successfully!", { position: "top-right", autoClose: 3000 });
      onUpdated();
      onClose();
    } catch (e) {
      setErr("Network error. Please try again.");
      toast.error("Failed to update dashboard", { position: "top-right", autoClose: 3000 });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.backdrop} onMouseDown={onClose}>
      <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>
            <svg width="24" height="24" fill="currentColor" style={{ marginRight: "12px" }}>
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
            Update Dashboard
          </div>
          <button style={styles.closeBtn} onClick={onClose}>
            <svg width="20" height="20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
            </svg>
          </button>
        </div>

        <div style={styles.dashboardInfo}>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Dashboard:</div>
            <div style={styles.infoValue}>{dashboard.topic}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Category:</div>
            <div style={styles.categoryBadge}>{dashboard.category}</div>
          </div>
          <div style={styles.infoRow}>
            <div style={styles.infoLabel}>Client:</div>
            <div style={styles.clientBadge}>{dashboard.client}</div>
          </div>
        </div>

        {err && (
          <div style={styles.errorBox}>
            <svg width="20" height="20" fill="currentColor" style={{ marginRight: "10px", color: "#e53e3e" }}>
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
            </svg>
            {err}
          </div>
        )}

        <div style={styles.formContent}>
          <div style={styles.formGroup}>
            <div style={styles.fieldLabel}>
              Description <span style={{ color: "#e53e3e" }}>*</span>
            </div>
            <textarea
              style={styles.textarea}
              rows={4}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Update the dashboard description..."
              disabled={saving}
            />
          </div>

          <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <div style={styles.fieldLabel}>Data From *</div>
                <input
                  type="date"
                  style={styles.input}
                  value={form.data_from}
                  onChange={(e) => setForm({ ...form, data_from: e.target.value })}
                />
              </div>

              <div style={styles.formGroup}>
                <div style={styles.fieldLabel}>Data To *</div>
                <input
                  type="date"
                  style={styles.input}
                  value={form.data_to}
                  onChange={(e) => setForm({ ...form, data_to: e.target.value })}
                />
              </div>
            </div>


          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <div style={styles.fieldLabel}>
                Last Updated Date <span style={{ color: "#e53e3e" }}>*</span>
              </div>
              <input
                type="date"
                style={styles.input}
                value={form.last_updated_date}
                onChange={(e) => setForm({ ...form, last_updated_date: e.target.value })}
                disabled={saving}
              />
            </div>

            <div style={styles.formGroup}>
              <div style={styles.fieldLabel}>
                Updated By <span style={{ color: "#e53e3e" }}>*</span>
              </div>
              <input
                list="updated_bys"                 // 🔥 ADD
                style={styles.input}
                placeholder="Enter your name"
                value={form.updated_by}
                onChange={(e) => setForm({ ...form, updated_by: e.target.value })}
                disabled={saving}
              />
              <datalist id="updated_bys">
                {(options?.updated_bys || []).map((x) => (
                  <option key={x} value={x} />
                ))}
              </datalist>
            </div>


        <div style={styles.formGroup}>
          <div style={styles.fieldLabel}>Published Account *</div>
          <input
            type="email"
            list="published_accounts"          // 🔥 ADD
            style={styles.input}
            value={form.published_account}
            onChange={(e) => setForm({ ...form, published_account: e.target.value })}
          />
          <datalist id="published_accounts">
            {(options?.published_accounts || []).map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </div>


          </div>
        </div>

        <div style={styles.modalFooter}>
          <button
            style={styles.cancelBtn}
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            style={{
              ...styles.submitBtn,
              opacity: saving ? 0.6 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
            onClick={submit}
            disabled={saving}
          >
            {saving ? (
              <>
                <div style={styles.spinnerSmall}></div>
                Updating...
              </>
            ) : (
              "Update Dashboard"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ========== STYLES ========== */
const colors = {
  primary: "#3182ce",
  primaryLight: "#ebf8ff",
  primaryDark: "#2c5282",
  secondary: "#e2e8f0",
  textDark: "#1a202c",
  textLight: "#4a5568",
  background: "#ffffff",
  error: "#e53e3e",
};

const styles = {
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
    animation: "fadeIn 0.2s ease-out",
  },
    modal: {
      width: "100%",
      maxWidth: "600px",

      /* 🔥 SAME FIX AS ADD DIALOG */
      maxHeight: "90vh",
      display: "flex",
      flexDirection: "column",

      background: colors.background,
      borderRadius: "20px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      animation: "slideUp 0.3s ease-out",
      overflow: "hidden",
    },

  modalHeader: {
    padding: "24px 32px",
    background: "linear-gradient(135deg, #3182ce 0%, #2c5282 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    fontSize: "22px",
    fontWeight: "800",
    display: "flex",
    alignItems: "center",
  },
  closeBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "white",
    transition: "all 0.2s",
  },
  dashboardInfo: {
    padding: "24px 32px",
    background: colors.primaryLight,
    borderBottom: `1px solid ${colors.secondary}`,
  },
  infoRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    gap: "12px",
  },
  infoLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: colors.primaryDark,
    minWidth: "100px",
  },
  infoValue: {
    fontSize: "16px",
    fontWeight: "600",
    color: colors.textDark,
  },
  categoryBadge: {
    background: colors.primary,
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },
  clientBadge: {
    background: "white",
    color: colors.primaryDark,
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    border: `1px solid ${colors.primary}`,
  },
  errorBox: {
    margin: "20px 32px 0",
    background: "#fff5f5",
    border: "2px solid #fed7d7",
    color: colors.error,
    padding: "16px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
    formContent: {
      padding: "32px",
      overflowY: "auto",   // 🔥 enable scrolling
      flex: 1,             // 🔥 take remaining height
    },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginTop: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  fieldLabel: {
    fontSize: "14px",
    fontWeight: "700",
    color: colors.textDark,
    display: "flex",
    alignItems: "center",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: `2px solid ${colors.secondary}`,
    outline: "none",
    fontSize: "14px",
    background: colors.background,
    transition: "all 0.2s",
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: `2px solid ${colors.secondary}`,
    outline: "none",
    fontSize: "14px",
    background: colors.background,
    resize: "vertical",
    minHeight: "120px",
    transition: "all 0.2s",
  },
  modalFooter: {
    padding: "24px 32px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "16px",
    borderTop: `1px solid ${colors.secondary}`,
  },
  cancelBtn: {
    padding: "14px 24px",
    background: "white",
    color: colors.textDark,
    border: `2px solid ${colors.secondary}`,
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  submitBtn: {
    padding: "14px 28px",
    background: colors.primary,
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(49,130,206,0.3)",
  },
  spinnerSmall: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};