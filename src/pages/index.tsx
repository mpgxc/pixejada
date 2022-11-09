import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useCallback } from "react";
import { NumericFormat } from "react-number-format";
import { Form, FormikProvider, useFormik } from "formik";
import { StorageFilesProvider } from "../lib/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type FormValues = {
  title: string;
  value: string;
  image: File;
};

export default function Home() {
  const storage = new StorageFilesProvider();

  const formik = useFormik({
    initialValues: {
      title: "",
      value: "",
      image: {},
    } as FormValues,
    onSubmit: async (values) => {
      const image = await storage.save(values.image);

      await fetch("/api/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          image,
        }),
      });

      toast.success("Ficha da vaquejada cadastrada!", {
        position: toast.POSITION.TOP_RIGHT,
      });

      formik.resetForm();
    },
  });

  const handleImageUpload = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      const [file] = target.files as FileList;

      formik.setFieldValue("image", file);
    },
    [formik]
  );

  const PREVIEW_CONTENT =
    process.env.NEXT_PUBLIC_FIREBASE_BUCKET_PREVIEW_CONTENT;

  const formatCurrency = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => {
      return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(Number(target.value));
    },
    []
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>Vaquejada Pajéu</title>
        <meta name="description" content="Generated by Vaquejada Pajéu" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.formContainer}>
        <h1 className={styles.title}>Vaquejada Pajéu - Fichas</h1>

        <p className={styles.description}>
          <code className={styles.code}>Cadastro das fichas da vaquejada</code>
        </p>

        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
              >
                Título
              </label>
              <input
                id="title"
                name="title"
                required
                type="text"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="large-input"
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
              >
                Valor
              </label>

              <div className="relative mt-1 rounded-lg shadow-lg">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-lg">R$</span>
                </div>

                <NumericFormat
                  id="value"
                  name="value"
                  value={formik.values.value}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="00,00"
                  decimalSeparator=","
                  thousandSeparator="."
                  className="block pl-10 pr-12  p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block mb-2 text-lg font-medium text-gray-900 dark:text-gray-300"
                htmlFor="user_avatar"
              >
                Imagem
              </label>
              <input
                name="image"
                required
                className="block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="user_avatar_help"
                accept="image/*"
                type="file"
                id="file"
                onChange={handleImageUpload}
                onBlur={formik.handleBlur}
                multiple={false}
              />
            </div>

            <div
              className="mb-6"
              style={{
                width: 375,
                height: 224,
                border: "1px solid #6d6b6b",
                borderStyle: "dashed",
                borderWidth: 2,
              }}
            >
              {!!formik.values.image.size && (
                <Image
                  src={URL.createObjectURL(formik.values.image)}
                  alt="Picture of the author"
                  width={375}
                  height={190}
                />
              )}
            </div>

            <div className="mb-6 flex items-center justify-between">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Cadastrar
              </button>
            </div>
          </Form>
        </FormikProvider>
      </main>

      <section>
        <Image
          src="https://firebasestorage.googleapis.com/v0/b/pixejada.appspot.com/o/images%2F3805fff8-bdb7-49fc-92fe-e3f55fed9c38.jpg?alt=media"
          width={300}
          height={200}
          alt="Picture of the author"
        />
      </section>
      <ToastContainer />
    </div>
  );
}
