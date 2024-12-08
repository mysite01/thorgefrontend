import React, { useState } from "react";
import { Button, Container, Row, Col, Spinner } from "react-bootstrap";

const ForgotPassword: React.FC = () => {
    const [state, setState] = useState({
        email: "",
        pending: false,
        isError: false,
        errorMessage: "",
    });

    const [errors, setErrors] = useState<{ email?: string }>({});
    const [focused, setFocused] = useState(false);  // Zustand für den Fokus

    // Input-Handler
    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors({}); // Clear previous errors
    };

    // Form Validation
    const validateForm = (): boolean => {
        const newErrors: { email?: string } = {};
        if (!state.email) {
            newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(state.email)) {
            newErrors.email = "Invalid email format.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form Submit
    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateForm()) return;

        setState((prevState) => ({
            ...prevState,
            pending: true,
            isError: false,
            errorMessage: "",
        }));

        try {
            // Simulate API call for password reset
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Replace with actual API call
            alert("Password reset link sent to your email!");
            setState((prevState) => ({
                ...prevState,
                email: "",
                pending: false,
            }));
        } catch (error) {
            setState((prevState) => ({
                ...prevState,
                pending: false,
                isError: true,
                errorMessage: "Failed to send password reset email. Please try again.",
            }));
        }
    };

    return (

        <>
            <section className="wrapper">
                <div className="container">
                    <div className="col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4 text-center" style={{ marginTop: "1.5rem" }}>

                        <form className="rounded bg-white shadow p-5">
                            <h3 className="text-dark fw-bolder fs-4 mb-2">Forget Password ?</h3>

                            <div className="fw-normal text-muted mb-4">
                                Enter your email to reset your password.
                            </div>

                            <div className="form-floating mb-3">
                                <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Email address</label>
                            </div>

                            <button type="submit" className="btn btn-primary submit_btn my-4">Submit</button>
                            <button type="submit" className="btn btn-secondary submit_btn my-4 ms-3">Cancel</button>
                        </form>
                    </div>
                </div>
            </section>


        </>

    );
};

export default ForgotPassword;
