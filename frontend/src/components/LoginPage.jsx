import { Formik } from 'formik';
export const LoginPage = () => (
    <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={({ setSubmitting }) => {
            console.log("Form is validated! Submitting the form...");
            setSubmitting(false);
        }}>
        <form>
            <input
                type="email"
                name="email"
            />
            <input
                type="password"
                name="password"
            />
            <button type="submit">
                Submit
            </button>
        </form>
    </Formik>
);
