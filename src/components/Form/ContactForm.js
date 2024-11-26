import React, {useRef, useState } from "react"
import Title from "../Title/Title"
import Form from "./Form"

const ContactForm = () => {
  const formRef = useRef(null);

  const initialFormState = {
    name: '',
    email: '',
    message: '',
  }

  const [form, setForm] = useState(initialFormState);

  const allFields = [
    { name: 'name', label: 'Imię', type: 'text',typ: 'input', required: 'true' },
    { name: 'email', label: 'E-mail', type: 'email',typ: 'input', required: 'true' },
    { name: 'message', label: 'Wiadomość', type: 'textarea',typ: 'input', required: 'true' },
  ];

  const handleChange = (e) => {
    // const { name, type, value } = e.target;
    // setForm((prevForm) => ({ ...prevForm, [name]: value }));

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

    // Define configEmail outside of handleSubmit
    // const emailjsConfig = {
    //     serviceId: "service_r6jzpbd",
    //     templateId: "template_d0033vp",
    //     userId: "sUtJzifkBSdcRbC_M",
    // }
    
    const successMessage = "Wiadomość została pomyślnie wysłana!";
    const apiEndpoint = "https://us-central1-ceea-poznan-426120.cloudfunctions.net/sendgrid-contact";
  
    return (
      <div className="px-5 py-20 mx-auto flex flex-col xl:flex-row">
        <div className="w-full mx-auto">
          <Title tag="h2">Formularz kontaktowy</Title>
  
          <Form
            allFields={allFields}
            buttonText="Wyślij wiadomość"
            handleChange={handleChange}
            form={form}
            setForm={setForm}
            initialFormState={initialFormState}
            formRef={formRef}
            // emailjsConfig={emailjsConfig}
            maxLength={2000}
            successMessage={successMessage}
            apiEndpoint={apiEndpoint}
          />
        </div>
      </div>
    );
  };

export default ContactForm
