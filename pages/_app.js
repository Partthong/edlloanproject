import React from "react";
import { LayoutProvider } from "../layout/context/layoutcontext";
import Layout from "../layout/layout";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "../styles/layout/layout.scss";
import "../styles/demo/Demos.scss";
import HttpsRedirect from "react-https-redirect";

export default function MyApp({ Component, pageProps }) {
  if (Component.getLayout) {
    return (
      <LayoutProvider>
        {Component.getLayout(<Component {...pageProps} />)}
      </LayoutProvider>
    );
  } else {
    return (
      <LayoutProvider>
        <HttpsRedirect>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </HttpsRedirect>
      </LayoutProvider>
    );
  }
}
