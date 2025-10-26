import { RouterProvider } from "react-router-dom";
import Providers from "@/components/providers";
import router from "@/routes";
import { Toaster } from "sonner";
import i18n from "./localization/i18n";

function App() {
  return (
    <>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
      <Toaster richColors position="top-center" dir={i18n.dir()} />
    </>
  );
}

export default App;
