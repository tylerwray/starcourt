import { Container, AppProps } from "next/app";
import Layout from "../components/Layout";

const App: React.FC<AppProps> = ({ Component, pageProps }) => (
  <Container className="w-full h-full">
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </Container>
);

export default App;
