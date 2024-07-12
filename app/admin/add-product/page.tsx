import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Form } from "../_components/form";

const AddProduct = () => {

    const { sessionClaims } = auth();

    if (sessionClaims?.metadata.role !== "admin") {
        redirect("/");
    }

    return (
        <>
            <Form />
        </>
    );

}

export default AddProduct;