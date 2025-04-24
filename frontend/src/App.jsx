import { useState } from "react";
import axios from "axios";
import { Toast, ToastContainer, Card, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastBg, setToastBg] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async (e) => {
    e.preventDefault();

    if (step === 1) {
      try {
        const response = await axios.post("http://localhost:5000/check-email", {
          email: form.email,
        });

        if (response.data.exists) {
          setToastMessage("Email already exists. Please use another.");
          setToastBg("danger");
          setShowToast(true);
          return;
        }
      } catch (error) {
        setToastMessage("Error checking email.");
        setToastBg("danger");
        setShowToast(true);
        return;
      }
    }

    setStep(step + 1);
  };

  const handleReset = () => {
    setForm({
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
    });
    setStep(1);
  };

  const handleBack = () => setStep(step - 1);

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post("http://localhost:5000/register", form);
      setToastMessage("Form submitted successfully!");
      setToastBg("success");
      handleReset();
    } catch (error) {
      setToastMessage("Form submission failed!");
      setToastBg("danger");
    } finally {
      setShowToast(true);
      setIsSubmitting(false);
    }
  };

  const stepHeaderClass = {
    1: "text-primary",
    2: "text-success",
    3: "text-warning",
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light app-background ">
      <Card className="p-4 shadow-lg bg-white w-100" style={{ maxWidth: "650px" }}>
        <h3 className="text-center text-dark mb-4"> 3-Step Registration</h3>

        <form onSubmit={step === 3 ? submitForm : handleNext}>
          {step === 1 && (
            <>
              <h5 className={`mb-3 ${stepHeaderClass[step]}`}>Step 1: Personal Details</h5>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  className="form-control"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  className="form-control"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h5 className={`mb-3 ${stepHeaderClass[step]}`}>Step 2: Address Details</h5>
              <div className="mb-3">
                <label className="form-label">Street Address</label>
                <input
                  className="form-control"
                  placeholder="123 Main St"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  className="form-control"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">State</label>
                <input
                  className="form-control"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">ZIP Code</label>
                <input
                  className="form-control"
                  maxLength={6}
                  value={form.zip}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value)) {
                      setForm({ ...form, zip: value });
                    }
                  }}
                  required
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h5 className={`mb-3 ${stepHeaderClass[step]}`}>Step 3: Review & Submit</h5>
              <table className="table table-striped table-hover table-bordered bg-white">
                <tbody>
                  {Object.entries(form).map(([key, value]) => (
                    <tr key={key}>
                      <th className="text-capitalize">{key}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          <div className="mt-4 text-center">
            {step > 1 && (
              <button
                type="button"
                className="btn btn-outline-secondary me-2"
                onClick={handleBack}
              >
                 Back
              </button>
            )}
            <button
              type="submit"
              className={`btn ${step === 3 ? "btn-success" : "btn-primary"}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" /> Submitting...
                </>
              ) : (
                step === 3 ? "Submit " : "Next "
              )}
            </button>
          </div>
        </form>
      </Card>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toastBg}
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default App;
