'use client';
import RootLayout from "@/layout";
import './../css/index.css'
import { AuthProvider } from "@/context/AuthContext";
import { UserProvider } from "@/context/UserContext";
import { ToastContainer } from "react-toastify";
import { LoadingProvider } from "@/context/LoadingContext";
import LoadingModal from "@/components/modal/LoadingModal";
import { CampaignProvider } from "@/context/CampaignContext";
import { DefineValueOfDonationProvider } from "@/context/DefineValueOfDonationContext";
import { DefineValueOfDonationModal } from "@/components/modal/DefineValueOfDonationModal";
import { LeverageRequestProvider } from "@/context/LeverageRequestContext";
import LeverageRequestModal from "@/components/modal/LeverageRequestModal";
import 'react-phone-number-input/style.css'
import { StoreProvider } from "@/context/StoreContext";
import { LoginWarningProvider } from "@/context/LoginWarningContext";
import LoginWarningModal from "@/components/modal/LoginWarningModal";
import { BankProvider } from "@/context/BankContext";
import ErrorBoundary from "@/treatment/errorBoundary";
import FreeLayout from "@/layouts/FreeLayout";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {

  const router = useRouter();
  const isLoginPage = router.pathname === "/login";
  const isInternalErrorPage = router.pathname === "/erro-interno";
  const isNotFoundPage = router.pathname === "/404";

  return (
    <ErrorBoundary>
      <LoadingProvider>
        <LoadingModal />
        <DefineValueOfDonationProvider>
          <AuthProvider>
            <StoreProvider>
              <UserProvider>
                <CampaignProvider>
                  <LeverageRequestProvider>
                    <BankProvider>
                      {(isLoginPage || isInternalErrorPage || isNotFoundPage) ? (
                        <FreeLayout>
                          <Component {...pageProps} />
                        </FreeLayout>
                      ) : (
                        < RootLayout >
                          <LoginWarningProvider>
                            <LeverageRequestModal />
                            <DefineValueOfDonationModal />
                            <ToastContainer />
                            <LoginWarningModal />
                            <Component {...pageProps} />
                          </LoginWarningProvider>
                        </RootLayout>
                      )}
                    </BankProvider>
                  </LeverageRequestProvider>
                </CampaignProvider>
              </UserProvider>
            </StoreProvider>
          </AuthProvider>
        </DefineValueOfDonationProvider>
      </LoadingProvider>
    </ErrorBoundary >
  );
}
