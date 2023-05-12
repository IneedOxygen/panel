import React from "react";
import tw from "twin.macro";
import "@/assets/tailwind.css";
import { store } from "@/state";
import { StoreProvider } from "easy-peasy";
import { hot } from "react-hot-loader/root";
import { history } from "@/components/history";
import { SiteSettings } from "@/state/settings";
import IndexRouter from "@/routers/IndexRouter";
import earnCredits from "@/api/account/earnCredits";
import { setupInterceptors } from "@/api/interceptors";
import { StorefrontSettings } from "@/state/storefront";
import GlobalStylesheet from "@/assets/css/GlobalStylesheet";

interface ExtendedWindow extends Window {
  SiteConfiguration?: SiteSettings;
  StoreConfiguration?: StorefrontSettings;
  JexactylUser?: {
    uuid: string;
    username: string;
    email: string;
    approved: boolean;
    verified: boolean;
    /* eslint-disable camelcase */
    discord_id: string;
    root_admin: boolean;
    use_totp: boolean;
    referral_code: string;
    language: string;
    updated_at: string;
    created_at: string;
    /* eslint-enable camelcase */
  };
}

setupInterceptors(history);

const App = () => {
  const { JexactylUser: O2User, SiteConfiguration, StoreConfiguration } = window as ExtendedWindow;

  if (O2User && !store.getState().user.data) {
    store.getActions().user.setUserData({
      uuid: O2User.uuid,
      username: O2User.username,
      email: O2User.email,
      approved: O2User.approved,
      verified: O2User.verified,
      discordId: O2User.discord_id,
      language: O2User.language,
      rootAdmin: O2User.root_admin,
      useTotp: O2User.use_totp,
      referralCode: O2User.referral_code,
      createdAt: new Date(O2User.created_at),
      updatedAt: new Date(O2User.updated_at),
    });
  }

  if (!store.getState().settings.data) {
    store.getActions().settings.setSettings(SiteConfiguration!);
  }

  if (!store.getState().storefront.data) {
    store.getActions().storefront.setStorefront(StoreConfiguration!);
  }

  function earn() {
    setTimeout(earn, 61000); // Allow 1 second for time inconsistencies.
    earnCredits().catch(() => console.error("Failed to add credits"));
  }

  earn();

  return (
    <>
      <GlobalStylesheet />
      <StoreProvider store={store}>
        <div css={tw`mx-auto w-auto`}>
          <IndexRouter />
        </div>
      </StoreProvider>
    </>
  );
};

export default hot(App);
